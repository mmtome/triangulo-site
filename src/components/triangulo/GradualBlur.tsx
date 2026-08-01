import React, { useEffect, useRef, useState, useMemo } from "react";
import "./GradualBlur.css";

/* ============================================================================
   GradualBlur — componente do React Bits (desfoque em camadas com máscara).

   Duas notas de integração:

   1. A dependência `mathjs` listada na documentação não é usada em lugar
      nenhum do código — não foi instalada.
   2. O componente monta `divCount` camadas com `backdrop-filter`, que é caro.
      Aqui ele é usado no topo e na base da página, com 4 camadas, e não em
      cada seção: empilhar backdrop-filter derruba o scroll em máquina modesta.
   ========================================================================== */

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

export interface GradualBlurProps {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: Curve;
  target?: "parent" | "page";
  hoverIntensity?: number;
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const direcao = (p: Position) =>
  ({ top: "to top", bottom: "to bottom", left: "to left", right: "to right" })[p];

function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  zIndex = 1000,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  opacity = 1,
  curve = "linear",
  target = "parent",
  hoverIntensity,
  onAnimationComplete,
  className = "",
  style = {},
}: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [visivel, setVisivel] = useState(animated !== "scroll");

  useEffect(() => {
    if (animated !== "scroll" || !containerRef.current) return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [animated]);

  useEffect(() => {
    if (visivel && animated === "scroll" && onAnimationComplete) {
      const t = setTimeout(onAnimationComplete, parseFloat(duration) * 1000);
      return () => clearTimeout(t);
    }
  }, [visivel, animated, onAnimationComplete, duration]);

  const camadas = useMemo(() => {
    const out: React.ReactElement[] = [];
    const passo = 100 / divCount;
    const forca = hover && hoverIntensity ? strength * hoverIntensity : strength;
    const curva = CURVE_FUNCTIONS[curve] ?? CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= divCount; i++) {
      const p = curva(i / divCount);
      const blur = exponential
        ? Math.pow(2, p * 4) * 0.0625 * forca
        : 0.0625 * (p * divCount + 1) * forca;

      const p1 = Math.round((passo * i - passo) * 10) / 10;
      const p2 = Math.round(passo * i * 10) / 10;
      const p3 = Math.round((passo * i + passo) * 10) / 10;
      const p4 = Math.round((passo * i + passo * 2) * 10) / 10;

      let grad = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) grad += `, black ${p3}%`;
      if (p4 <= 100) grad += `, transparent ${p4}%`;

      const mask = `linear-gradient(${direcao(position)}, ${grad})`;
      out.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: mask,
            WebkitMaskImage: mask,
            backdropFilter: `blur(${blur.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
            opacity,
            transition:
              animated && animated !== "scroll"
                ? `backdrop-filter ${duration} ${easing}`
                : undefined,
          }}
        />,
      );
    }
    return out;
  }, [
    position, strength, divCount, exponential, opacity, curve,
    animated, duration, easing, hover, hoverIntensity,
  ]);

  const containerStyle = useMemo<React.CSSProperties>(() => {
    const vertical = position === "top" || position === "bottom";
    const naPagina = target === "page";
    const base: React.CSSProperties = {
      position: naPagina ? "fixed" : "absolute",
      pointerEvents: hoverIntensity ? "auto" : "none",
      opacity: visivel ? 1 : 0,
      transition: animated ? `opacity ${duration} ${easing}` : undefined,
      zIndex: naPagina ? zIndex + 100 : zIndex,
      ...style,
    };
    if (vertical) {
      base.height = height;
      base.width = width || "100%";
      base[position] = 0;
      base.left = 0;
      base.right = 0;
    } else {
      base.width = width || height;
      base.height = "100%";
      base[position] = 0;
      base.top = 0;
      base.bottom = 0;
    }
    return base;
  }, [
    position, target, hoverIntensity, visivel, animated, duration, easing,
    zIndex, style, height, width,
  ]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur ${target === "page" ? "gradual-blur-page" : "gradual-blur-parent"} ${className}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setHover(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setHover(false) : undefined}
    >
      <div className="gradual-blur-inner">{camadas}</div>
    </div>
  );
}

export default React.memo(GradualBlur);
