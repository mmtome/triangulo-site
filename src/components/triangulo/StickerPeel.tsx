import { useRef, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./StickerPeel.css";

gsap.registerPlugin(Draggable);

/* ============================================================================
   StickerPeel — componente do React Bits (adesivo que descola e é arrastável).

   Dois ajustes de integração:

   1. `inertia: true` no Draggable exige o InertiaPlugin, que é pago. Sem ele o
      GSAP emite aviso e ignora a opção — trocado por um retorno suave via
      `onDragEnd`, que dá a mesma sensação sem a dependência.
   2. Os filtros SVG do original usam ids globais (`pointLight`, `dropShadow`).
      Se outro componente da página declarar os mesmos ids, um sobrescreve o
      outro. Aqui vão prefixados com `sticker`.
   ========================================================================== */

export interface StickerPeelProps {
  imageSrc: string;
  rotate?: number;
  peelBackHoverPct?: number;
  peelBackActivePct?: number;
  peelDirection?: number;
  width?: number;
  shadowIntensity?: number;
  lightingIntensity?: number;
  initialPosition?: "center" | { x: number; y: number };
  className?: string;
}

export default function StickerPeel({
  imageSrc,
  rotate = 30,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelDirection = 0,
  width = 200,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  initialPosition = "center",
  className = "",
}: StickerPeelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const pointLightRef = useRef<SVGFEPointLightElement>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target || initialPosition === "center") return;
    gsap.set(target, { x: initialPosition.x, y: initialPosition.y });
  }, [initialPosition]);

  useEffect(() => {
    const target = dragTargetRef.current;
    if (!target?.parentNode) return;
    const bounds = target.parentNode as HTMLElement;

    draggableRef.current = Draggable.create(target, {
      type: "x,y",
      bounds,
      // inertia exigiria o InertiaPlugin (pago) — ver cabeçalho.
      onDrag(this: Draggable) {
        gsap.to(target, {
          rotation: gsap.utils.clamp(-24, 24, this.deltaX * 0.4),
          duration: 0.15,
          ease: "power1.out",
        });
      },
      onDragEnd() {
        gsap.to(target, { rotation: 0, duration: 0.8, ease: "power2.out" });
      },
    })[0];

    const onResize = () => draggableRef.current?.update();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      draggableRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mover = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.set(pointLightRef.current, { attr: { x, y } });
      if (Math.abs(peelDirection % 360) !== 180) {
        gsap.set(pointLightFlippedRef.current, { attr: { x, y: rect.height - y } });
      } else {
        gsap.set(pointLightFlippedRef.current, { attr: { x: -1000, y: -1000 } });
      }
    };

    const toqueOn = () => container.classList.add("touch-active");
    const toqueOff = () => container.classList.remove("touch-active");

    container.addEventListener("mousemove", mover);
    container.addEventListener("touchstart", toqueOn);
    container.addEventListener("touchend", toqueOff);
    container.addEventListener("touchcancel", toqueOff);
    return () => {
      container.removeEventListener("mousemove", mover);
      container.removeEventListener("touchstart", toqueOn);
      container.removeEventListener("touchend", toqueOff);
      container.removeEventListener("touchcancel", toqueOff);
    };
  }, [peelDirection]);

  const cssVars = useMemo(
    () =>
      ({
        "--sticker-rotate": `${rotate}deg`,
        "--sticker-p": "10px",
        "--sticker-peelback-hover": `${peelBackHoverPct}%`,
        "--sticker-peelback-active": `${peelBackActivePct}%`,
        "--sticker-width": `${width}px`,
        "--sticker-shadow-opacity": shadowIntensity,
        "--sticker-lighting-constant": lightingIntensity,
        "--peel-direction": `${peelDirection}deg`,
      }) as React.CSSProperties,
    [rotate, peelBackHoverPct, peelBackActivePct, width, shadowIntensity, lightingIntensity, peelDirection],
  );

  return (
    <div className={`sticker-peel-root ${className}`} ref={dragTargetRef} style={cssVars}>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="stickerPointLight">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="stickerPointLightFlipped">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity * 7}
              lightingColor="white"
            >
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="stickerDropShadow">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id="stickerExpandAndFill">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div className="sticker-container" ref={containerRef}>
        <div className="sticker-main">
          <div className="sticker-lighting">
            <img
              src={imageSrc}
              alt=""
              className="sticker-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
        <div className="flap">
          <div className="flap-lighting">
            <img
              src={imageSrc}
              alt=""
              className="flap-image"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
