import { useEffect, useRef, useState, useMemo, useCallback } from "react";

/* ============================================================================
   TextPressure — componente do React Bits (porte do CodePen de Juan Fuentes).

   Restrição que vale registrar: o efeito escreve em `font-variation-settings`,
   então só funciona com FONTE VARIÁVEL. A Poppins, tipografia do Manual da
   Marca, não tem versão variável no Google Fonts — aplicada aqui, o texto
   ficaria estático e ainda por cima em peso 100.

   Por isso o padrão aqui é a Outfit Variable: geométrica, desenho próximo da
   Poppins, com eixo `wght`. Ela não tem `wdth` nem `ital`, então essas props
   ficam desligadas por padrão — ligá-las não quebra nada, só não faz efeito.
   ========================================================================== */

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = <T extends (...args: never[]) => void>(fn: T, delay: number) => {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

export interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
}

export default function TextPressure({
  text = "Compressa",
  fontFamily = "Outfit",
  fontUrl = "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
  width = false,
  weight = true,
  italic = false,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#CE2B34",
  className = "",
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    if (containerRef.current) {
      const { left, top, width: w, height: h } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + w / 2;
      mouseRef.current.y = top + h / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect();

    setFontSize(Math.max(cw / (chars.length / 2), minFontSize));
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const rect = titleRef.current.getBoundingClientRect();
      if (scale && rect.height > 0) {
        const ratio = ch / rect.height;
        setScaleY(ratio);
        setLineHeight(ratio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const d = debounce(setSize, 100);
    d();
    window.addEventListener("resize", d);
    return () => window.removeEventListener("resize", d);
  }, [setSize]);

  useEffect(() => {
    let raf = 0;
    const animar = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const maxDist = titleRef.current.getBoundingClientRect().width / 2;

        for (const span of spansRef.current) {
          if (!span) continue;
          const r = span.getBoundingClientRect();
          const d = dist(mouseRef.current, { x: r.x + r.width / 2, y: r.y + r.height / 2 });

          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const ital = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : "0";
          const alfa = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : "1";

          const settings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
          if (span.style.fontVariationSettings !== settings) {
            span.style.fontVariationSettings = settings;
          }
          if (alpha && span.style.opacity !== alfa) span.style.opacity = alfa;
        }
      }
      raf = requestAnimationFrame(animar);
    };
    animar();
    return () => cancelAnimationFrame(raf);
  }, [width, weight, italic, alpha]);

  const estilo = useMemo(
    () => (
      <style>{`
        @import url('${fontUrl}');
        .tp-flex { display: flex; justify-content: space-between; }
        .tp-stroke span { position: relative; color: ${textColor}; }
        .tp-stroke span::after {
          content: attr(data-char);
          position: absolute; left: 0; top: 0;
          color: transparent; z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>
    ),
    [fontUrl, textColor, strokeColor],
  );

  const classes = [className, flex ? "tp-flex" : "", stroke ? "tp-stroke" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}
    >
      {estilo}
      <h1
        ref={titleRef}
        className={classes}
        style={{
          fontFamily,
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
          color: textColor,
          letterSpacing: "-0.02em",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{ display: "inline-block", color: stroke ? undefined : textColor }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </h1>
    </div>
  );
}
