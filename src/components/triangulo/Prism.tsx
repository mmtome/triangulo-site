import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";
import "./Prism.css";

/* ============================================================================
   Prism — componente do React Bits (raymarch de uma pirâmide em GLSL, via ogl).

   Uma alteração em relação ao original: o shader gera bandas arco-íris
   (`sin(... + vec4(0,1,2,3))`). Rodar `hueShift` sobre isso ainda deixa verde e
   azul na tela, o que quebra a seção 08 do Manual da Marca — a paleta tem cinco
   cores e o manual proíbe alterá-las.

   Então, depois da luminância, a cor passa por uma RAMPA da marca:
       preto → vermelho Triângulo → branco
   `hueShift` e `colorFrequency` continuam funcionando (mudam o desenho das
   bandas), mas o resultado nunca sai da paleta. `tintMix = 0` devolve o
   comportamento original, se um dia for preciso comparar.
   ========================================================================== */

export interface PrismProps {
  height?: number;
  baseWidth?: number;
  animationType?: "rotate" | "hover" | "3drotate";
  glow?: number;
  offset?: { x?: number; y?: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;
  /** Cor da rampa. Padrão: Vermelho Triângulo #CE2B34. */
  tint?: [number, number, number];
  /** 0 = cores originais do shader · 1 = totalmente na paleta da marca. */
  tintMix?: number;
  className?: string;
}

export default function Prism({
  height = 3.5,
  baseWidth = 5.5,
  animationType = "rotate",
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5,
  tint = [0.808, 0.169, 0.204], // #CE2B34
  tintMix = 1,
  className,
}: PrismProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0, glow);
    const NOISE = Math.max(0, noise);
    const offX = offset?.x ?? 0;
    const offY = offset?.y ?? 0;
    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0, colorFrequency || 1);
    const BLOOM = Math.max(0, bloom || 1);
    const TS = Math.max(0, timeScale || 1);
    const HOVSTR = Math.max(0, hoverStrength || 1);
    const INERT = Math.max(0, Math.min(1, inertia || 0.12));
    const TINTMIX = Math.max(0, Math.min(1, tintMix));

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const renderer = new Renderer({ dpr, alpha: transparent, antialias: false });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    Object.assign(gl.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    });
    container.appendChild(gl.canvas);

    const vertex = /* glsl */ `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

    const fragment = /* glsl */ `
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;
      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;
      uniform vec3  uTint;
      uniform float uTintMix;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        return max(sdOctaAnisoInv(p), -p.y);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(0.299,0.587,0.114, 0.299,0.587,0.114, 0.299,0.587,0.114);
        mat3 U = mat3(0.701,-0.587,-0.114, -0.299,0.413,-0.114, -0.300,-0.588,0.886);
        mat3 V = mat3(0.168,-0.331,0.500, 0.328,0.035,-0.500, -0.497,0.296,0.201);
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;
        vec3 p;
        vec4 o = vec4(0.0);

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += uCenterShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * uColorFreq + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));

        // --- caminho original (mantido para uTintMix = 0) ---
        vec3 original = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);
        if (abs(uHueShift) > 0.0001) {
          original = clamp(hueRotation(uHueShift) * original, 0.0, 1.0);
        }

        // --- rampa da marca: preto -> vermelho Triângulo -> branco ---
        vec3 marca = L < 0.5
          ? mix(vec3(0.0), uTint, L * 2.0)
          : mix(uTint, vec3(1.0), (L - 0.5) * 2.0);

        gl_FragColor = vec4(mix(original, marca, uTintMix), o.a);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: 1 },
        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
        uTimeScale: { value: TS },
        uTint: { value: new Float32Array(tint) },
        uTintMix: { value: TINTMIX },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      offsetPxBuf[0] = offX * dpr;
      offsetPxBuf[1] = offY * dpr;
      program.uniforms.uPxScale.value =
        1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const rotBuf = new Float32Array(9);
    const setMat3FromEuler = (
      yawY: number,
      pitchX: number,
      rollZ: number,
      out: Float32Array,
    ) => {
      const cy = Math.cos(yawY), sy = Math.sin(yawY);
      const cx = Math.cos(pitchX), sx = Math.sin(pitchX);
      const cz = Math.cos(rollZ), sz = Math.sin(rollZ);
      out[0] = cy * cz + sy * sx * sz;
      out[1] = cx * sz;
      out[2] = -sy * cz + cy * sx * sz;
      out[3] = -cy * sz + sy * sx * cz;
      out[4] = cx * cz;
      out[5] = sy * sz + cy * sx * cz;
      out[6] = sy * cx;
      out[7] = -sx;
      out[8] = cy * cx;
      return out;
    };

    const NOISE_IS_ZERO = NOISE < 1e-6;
    let raf = 0;
    const t0 = performance.now();
    const startRAF = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const stopRAF = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Semente fixa: com Math.random o fundo nasce diferente a cada carregamento
    // e o hero "pisca" entre visitas.
    const wX = 0.52, wY = 0.44, wZ = 0.28;
    const phX = 1.7, phZ = 4.1;

    let yaw = 0, pitch = 0, roll = 0;
    let targetYaw = 0, targetPitch = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const pointer = { x: 0, y: 0, inside: true };
    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      pointer.x = Math.max(-1, Math.min(1, (e.clientX - ww * 0.5) / (ww * 0.5)));
      pointer.y = Math.max(-1, Math.min(1, (e.clientY - wh * 0.5) / (wh * 0.5)));
      pointer.inside = true;
    };
    const onLeave = () => (pointer.inside = false);

    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    if (animationType === "hover") {
      onPointerMove = (e: PointerEvent) => {
        onMove(e);
        startRAF();
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
      program.uniforms.uUseBaseWobble.value = 0;
    } else if (animationType === "3drotate") {
      program.uniforms.uUseBaseWobble.value = 0;
    } else {
      program.uniforms.uUseBaseWobble.value = 1;
    }

    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;
      let continuar = true;

      if (animationType === "hover") {
        const maxPitch = 0.6 * HOVSTR;
        const maxYaw = 0.6 * HOVSTR;
        targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw;
        targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch;
        yaw = lerp(yaw, targetYaw, INERT);
        pitch = lerp(pitch, targetPitch, INERT);
        roll = lerp(roll, 0, 0.1);
        program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);
        if (NOISE_IS_ZERO) {
          const parado =
            Math.abs(yaw - targetYaw) < 1e-4 &&
            Math.abs(pitch - targetPitch) < 1e-4 &&
            Math.abs(roll) < 1e-4;
          if (parado) continuar = false;
        }
      } else if (animationType === "3drotate") {
        const ts = time * TS;
        yaw = ts * wY;
        pitch = Math.sin(ts * wX + phX) * 0.6;
        roll = Math.sin(ts * wZ + phZ) * 0.5;
        program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);
        if (TS < 1e-6) continuar = false;
      } else {
        rotBuf.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        program.uniforms.uRot.value = rotBuf;
        if (TS < 1e-6) continuar = false;
      }

      renderer.render({ scene: mesh });
      raf = continuar ? requestAnimationFrame(render) : 0;
    };

    let io: IntersectionObserver | null = null;
    if (suspendWhenOffscreen) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) startRAF();
        else stopRAF();
      });
      io.observe(container);
    }
    startRAF();

    return () => {
      stopRAF();
      ro.disconnect();
      io?.disconnect();
      if (animationType === "hover") {
        if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
      }
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
    };
  }, [
    height, baseWidth, animationType, glow, noise, offset?.x, offset?.y,
    scale, transparent, hueShift, colorFrequency, timeScale, hoverStrength,
    inertia, bloom, suspendWhenOffscreen, tint, tintMix,
  ]);

  return <div className={`prism-container ${className ?? ""}`} ref={containerRef} />;
}
