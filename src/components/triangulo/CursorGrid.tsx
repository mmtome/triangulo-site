import { useRef, useEffect } from "react";
import "./CursorGrid.css";

/* ============================================================================
   CursorGrid — componente do React Bits (grade que acende ao redor do cursor).

   Uma adição em relação ao original: a prop `trackWindow`.

   O componente ouve `pointermove` no próprio container. Isso funciona quando
   ele é o conteúdo, mas aqui ele é FUNDO de seção: o texto e os cards ficam
   por cima, e o ponteiro sobre eles nunca chega ao container — a grade só
   acenderia nas frestas. Com `trackWindow`, os eventos vêm da janela e são
   convertidos para coordenadas locais, então a grade responde ao cursor em
   qualquer ponto da seção. `trackWindow={false}` mantém o comportamento
   original.
   ========================================================================== */

type Falloff = "linear" | "smooth" | "sharp";

const FALLOFF_CURVES: Record<Falloff, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  sharp: (t) => t * t * t,
};

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(v.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

export interface CursorGridProps {
  cellSize?: number;
  color?: string;
  radius?: number;
  falloff?: Falloff;
  holdTime?: number;
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  fillOpacity?: number;
  gridOpacity?: number;
  cellRadius?: number;
  clickPulse?: boolean;
  pulseSpeed?: number;
  /** Ouve o ponteiro na janela em vez do container — necessário quando o
   *  componente é fundo e há conteúdo por cima. */
  trackWindow?: boolean;
  className?: string;
}

export default function CursorGrid({
  cellSize = 70,
  color = "#CE2B34",
  radius = 140,
  falloff = "smooth",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1.2,
  maxOpacity = 1,
  fillOpacity = 0,
  gridOpacity = 0,
  cellRadius = 0,
  clickPulse = true,
  pulseSpeed = 600,
  trackWindow = false,
  className = "",
}: CursorGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<Required<Omit<CursorGridProps, "className">>>(
    {} as Required<Omit<CursorGridProps, "className">>,
  );
  const wakeRef = useRef<(() => void) | null>(null);

  propsRef.current = {
    cellSize, color, radius, falloff, holdTime, fadeDuration, lineWidth,
    maxOpacity, fillOpacity, gridOpacity, cellRadius, clickPulse, pulseSpeed,
    trackWindow,
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cols = 0, rows = 0, offX = 0, offY = 0, w = 0, h = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    const pulses: { x: number; y: number; t0: number }[] = [];
    let raf = 0;
    let running = false;
    let lastFrame = 0;

    const rebuild = () => {
      const p = propsRef.current;
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / p.cellSize) + 1;
      rows = Math.ceil(h / p.cellSize) + 1;
      offX = (w - cols * p.cellSize) / 2;
      offY = (h - rows * p.cellSize) / 2;
      alphas = new Float32Array(cols * rows);
      touched = new Float64Array(cols * rows);
    };

    const cellCenter = (i: number): [number, number] => {
      const p = propsRef.current;
      return [
        offX + (i % cols) * p.cellSize + p.cellSize / 2,
        offY + Math.floor(i / cols) * p.cellSize + p.cellSize / 2,
      ];
    };

    const energize = (x: number, y: number, boost?: number) => {
      const p = propsRef.current;
      const r = Math.max(p.radius, 1);
      const ease = FALLOFF_CURVES[p.falloff] ?? FALLOFF_CURVES.linear;
      const now = performance.now();
      const minCol = Math.max(0, Math.floor((x - r - offX) / p.cellSize));
      const maxCol = Math.min(cols - 1, Math.floor((x + r - offX) / p.cellSize));
      const minRow = Math.max(0, Math.floor((y - r - offY) / p.cellSize));
      const maxRow = Math.min(rows - 1, Math.floor((y + r - offY) / p.cellSize));
      for (let cRow = minRow; cRow <= maxRow; cRow++) {
        for (let cCol = minCol; cCol <= maxCol; cCol++) {
          const i = cRow * cols + cCol;
          const [cx, cy] = cellCenter(i);
          const dist = Math.hypot(cx - x, cy - y);
          if (dist > r) continue;
          const level = ease(1 - dist / r) * p.maxOpacity * (boost ?? 1);
          if (level > alphas[i]) {
            alphas[i] = level;
            touched[i] = now;
          } else if (level > 0) {
            touched[i] = now;
          }
        }
      }
    };

    const draw = (now: number) => {
      const p = propsRef.current;
      const dt = Math.min(now - lastFrame, 50);
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);
      const [cr, cg, cb] = hexToRgb(p.color);

      if (p.gridOpacity > 0) {
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.gridOpacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let cCol = 0; cCol <= cols; cCol++) {
          const x = Math.round(offX + cCol * p.cellSize) + 0.5;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let cRow = 0; cRow <= rows; cRow++) {
          const y = Math.round(offY + cRow * p.cellSize) + 0.5;
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();
      }

      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const pulse = pulses[pi];
        const ringR = ((now - pulse.t0) / 1000) * p.pulseSpeed;
        if (ringR > Math.hypot(w, h)) {
          pulses.splice(pi, 1);
          continue;
        }
        const band = p.cellSize;
        const minCol = Math.max(0, Math.floor((pulse.x - ringR - band - offX) / p.cellSize));
        const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - offX) / p.cellSize));
        const minRow = Math.max(0, Math.floor((pulse.y - ringR - band - offY) / p.cellSize));
        const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - offY) / p.cellSize));
        for (let cRow = minRow; cRow <= maxRow; cRow++) {
          for (let cCol = minCol; cCol <= maxCol; cCol++) {
            const i = cRow * cols + cCol;
            const [cx, cy] = cellCenter(i);
            const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
            if (Math.abs(dist - ringR) < band / 2 && p.maxOpacity > alphas[i]) {
              alphas[i] = p.maxOpacity;
              touched[i] = now;
            }
          }
        }
      }

      let algumVisivel = pulses.length > 0;
      const fadeStep = dt / Math.max(p.fadeDuration, 16);
      const half = p.cellSize / 2;

      for (let i = 0; i < alphas.length; i++) {
        let a = alphas[i];
        if (a <= 0) continue;
        if (now - touched[i] > p.holdTime) {
          a = Math.max(0, a - fadeStep);
          alphas[i] = a;
          if (a <= 0) continue;
        }
        algumVisivel = true;

        const [cx, cy] = cellCenter(i);
        const grad = ctx.createRadialGradient(cx, cy, half * 0.1, cx, cy, p.cellSize);
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a})`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.beginPath();
        const x = cx - half + 0.5;
        const y = cy - half + 0.5;
        const s = p.cellSize - 1;
        if (p.cellRadius > 0) ctx.roundRect(x, y, s, s, p.cellRadius);
        else ctx.rect(x, y, s, s);
        if (p.fillOpacity > 0) {
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * p.fillOpacity})`;
          ctx.fill();
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.lineWidth;
        ctx.stroke();
      }

      if (algumVisivel) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false;
        if (propsRef.current.gridOpacity <= 0) ctx.clearRect(0, 0, w, h);
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(draw);
    };
    wakeRef.current = wake;

    const toLocal = (e: PointerEvent): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const dentro = (x: number, y: number) => x >= 0 && y >= 0 && x <= w && y <= h;

    const onPointerMove = (e: PointerEvent) => {
      const [x, y] = toLocal(e);
      // Ouvindo a janela, o cursor pode estar longe da seção — só acende dentro.
      if (propsRef.current.trackWindow && !dentro(x, y)) return;
      energize(x, y);
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!propsRef.current.clickPulse) return;
      const [x, y] = toLocal(e);
      if (propsRef.current.trackWindow && !dentro(x, y)) return;
      pulses.push({ x, y, t0: performance.now() });
      wake();
    };

    const alvo: Window | HTMLDivElement = trackWindow ? window : container;
    alvo.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    alvo.addEventListener("pointerdown", onPointerDown as EventListener, { passive: true });

    const ro = new ResizeObserver(() => {
      rebuild();
      wake();
    });
    ro.observe(container);
    rebuild();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      alvo.removeEventListener("pointermove", onPointerMove as EventListener);
      alvo.removeEventListener("pointerdown", onPointerDown as EventListener);
    };
  }, [cellSize, trackWindow]);

  useEffect(() => {
    wakeRef.current?.();
  }, [gridOpacity, color, lineWidth, maxOpacity, fillOpacity, cellRadius]);

  return (
    <div ref={containerRef} className={`cursor-grid${className ? ` ${className}` : ""}`}>
      <canvas ref={canvasRef} className="cursor-grid__canvas" />
    </div>
  );
}
