import {
  useEffect,
  useRef,
  useState,
  createElement,
  useMemo,
  useCallback,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import "./TextType.css";

/* ============================================================================
   TextType — componente do React Bits (efeito de digitação).

   Nos títulos do site ele é usado com `loop={false}` e `startOnVisible`, de
   propósito: um H2 que se apaga e reescreve em laço deixa a página ilegível
   para quem está lendo e entrega conteúdo instável para o rastreador. Assim
   ele digita uma vez, quando a seção entra na tela, e fica.

   Por acessibilidade e SEO, o texto final também vai num <span> visualmente
   oculto — o leitor de tela e o rastreador leem o título inteiro desde o
   primeiro instante, sem depender da animação.
   ========================================================================== */

export interface TextTypeProps {
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
  /** Texto acessível completo, lido por leitor de tela e rastreador. */
  a11yText?: string;
}

export default function TextType({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  a11yText,
  ...props
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [deletando, setDeletando] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [visivel, setVisivel] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const velocidade = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const corAtual = () =>
    textColors.length === 0 ? "inherit" : textColors[textIndex % textColors.length];

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisivel(true)),
      { threshold: 0.1 },
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!visivel) return;
    let timeout: ReturnType<typeof setTimeout>;

    const atual = textArray[textIndex];
    const processado = reverseMode ? atual.split("").reverse().join("") : atual;

    const rodar = () => {
      if (deletando) {
        if (displayedText === "") {
          setDeletando(false);
          if (textIndex === textArray.length - 1 && !loop) return;
          onSentenceComplete?.(textArray[textIndex], textIndex);
          setTextIndex((p) => (p + 1) % textArray.length);
          setCharIndex(0);
        } else {
          timeout = setTimeout(
            () => setDisplayedText((p) => p.slice(0, -1)),
            deletingSpeed,
          );
        }
      } else if (charIndex < processado.length) {
        timeout = setTimeout(
          () => {
            setDisplayedText((p) => p + processado[charIndex]);
            setCharIndex((p) => p + 1);
          },
          variableSpeed ? velocidade() : typingSpeed,
        );
      } else if (textArray.length >= 1) {
        if (!loop && textIndex === textArray.length - 1) return;
        timeout = setTimeout(() => setDeletando(true), pauseDuration);
      }
    };

    if (charIndex === 0 && !deletando && displayedText === "") {
      timeout = setTimeout(rodar, initialDelay);
    } else {
      rodar();
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    charIndex, displayedText, deletando, typingSpeed, deletingSpeed,
    pauseDuration, textArray, textIndex, loop, initialDelay, visivel,
    reverseMode, variableSpeed, onSentenceComplete,
  ]);

  const esconderCursor =
    hideCursorWhileTyping &&
    (charIndex < textArray[textIndex].length || deletando);

  const acessivel = a11yText ?? textArray.join(" ");

  return createElement(
    Component,
    { ref: containerRef, className: `text-type ${className}`, ...props },
    <span key="a11y" className="sr-only">
      {acessivel}
    </span>,
    <span
      key="conteudo"
      aria-hidden="true"
      className="text-type__content"
      style={{ color: corAtual() || "inherit" }}
    >
      {displayedText}
    </span>,
    showCursor && (
      <span
        key="cursor"
        ref={cursorRef}
        aria-hidden="true"
        className={`text-type__cursor ${cursorClassName} ${esconderCursor ? "text-type__cursor--hidden" : ""}`}
      >
        {cursorCharacter}
      </span>
    ),
  );
}
