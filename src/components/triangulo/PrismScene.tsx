import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createPrismModel, disposePrismGeometry } from "@/three/createPrismModel";

/* ============================================================================
   Cena 3D do hero — prismas da marca, com scroll e mouse.

   Referência: "ref site 3" (objetos flutuando em profundidade sobre fundo
   escuro com brilho) reinterpretada com o símbolo da Triângulo no lugar dos
   cubos genéricos, e na paleta do Manual da Marca.

   Interação:
     scroll  — gira o prisma principal, faz dolly de câmera e afasta os
               satélites em velocidades diferentes (parallax)
     mouse   — passar o mouse inclina a cena; arrastar gira o prisma de
               verdade, com inércia ao soltar e volta suave para o lugar

   O canvas ocupa só a metade direita no desktop, e é ali que ele captura o
   mouse. Cobrir a tela inteira bloquearia a seleção do texto e o clique nos
   botões do hero, que ficam à esquerda.
   ========================================================================== */

const VERMELHO = "#CE2B34";

/** Satélites: posição, escala e velocidade de parallax. Sementes fixas — nada
 *  de Math.random, para o layout ser idêntico em todo carregamento. */
const SATELITES = [
  { pos: [-1.75, 1.45, -1.9], escala: 0.3, giro: 0.55, parallax: 1.35 },
  { pos: [1.6, 1.15, -2.6], escala: 0.24, giro: -0.7, parallax: 1.7 },
  { pos: [-1.3, -1.6, -1.2], escala: 0.21, giro: 0.9, parallax: 0.9 },
  { pos: [1.75, -1.25, -1.6], escala: 0.34, giro: -0.45, parallax: 1.15 },
  { pos: [-2.3, 0.05, -3.2], escala: 0.18, giro: 1.1, parallax: 2.1 },
  { pos: [0.85, 2.2, -3.6], escala: 0.15, giro: -1.2, parallax: 2.4 },
] as const;

const TAMANHO_BASE = 2.35;

/** Abaixo de 1024px o canvas volta a cobrir a tela, atrás do texto e discreto —
 *  não há espaço para as duas colunas, e arrastar brigaria com o scroll. */
function lerComposicao() {
  const largura = window.innerWidth;
  if (largura >= 1024) return { escala: 1, opacidade: 1, interativo: true };
  if (largura >= 640) return { escala: 0.72, opacidade: 0.45, interativo: false };
  return { escala: 0.6, opacidade: 0.3, interativo: false };
}

export function PrismScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Sem WebGL o componente simplesmente não monta — o hero tem fundo próprio.
    const teste = document.createElement("canvas");
    if (!(teste.getContext("webgl2") || teste.getContext("webgl"))) return;

    const reduzirMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Aparelho fraco: vidro com transmissão é caro. Cai para material sólido.
    const modoLeve =
      (navigator.hardwareConcurrency ?? 4) <= 4 || window.innerWidth < 640;

    const renderer = new THREE.WebGLRenderer({
      antialias: !modoLeve,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, modoLeve ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const cena = new THREE.Scene();

    // Ambiente: o vidro só existe visualmente se tiver o que refletir.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04);
    cena.environment = ambiente.texture;

    const camera = new THREE.PerspectiveCamera(
      40,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 6.6);

    /* ---- luz: key fria, rim vermelho, fill baixo (como nas referências) ---- */
    cena.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3.5, 4.5, 5);
    cena.add(key);

    const rim = new THREE.DirectionalLight(new THREE.Color(VERMELHO), 3.2);
    rim.position.set(-4, -1.5, -3);
    cena.add(rim);

    const fill = new THREE.PointLight(new THREE.Color(VERMELHO), 14, 12, 2);
    fill.position.set(0, -2.4, 1.5);
    cena.add(fill);

    /* ---- palco: reposiciona a cena inteira quando a janela muda de faixa ---- */
    let comp = lerComposicao();
    const palco = new THREE.Group();
    palco.scale.setScalar(comp.escala);
    cena.add(palco);

    const principal = createPrismModel({
      size: TAMANHO_BASE,
      color: VERMELHO,
      solid: modoLeve,
    });
    palco.add(principal);

    const satelites = SATELITES.map((s) => {
      const g = createPrismModel({
        size: TAMANHO_BASE * s.escala,
        color: VERMELHO,
        solid: true, // satélites sempre sólidos: transmissão x6 derruba o fps
      });
      g.position.set(s.pos[0], s.pos[1], s.pos[2]);
      g.rotation.set(s.giro, s.giro * 0.7, s.giro * 0.3);
      g.userData.base = g.position.clone();
      g.userData.parallax = s.parallax;
      g.userData.giro = s.giro;
      palco.add(g);
      return g;
    });

    /* ---------------------------------------------------------------- estado */
    let progresso = 0; // 0 no topo do hero, 1 ao fim
    let alvoProgresso = 0;
    let ponteiroX = 0;
    let ponteiroY = 0;
    let alvoPonteiroX = 0;
    let alvoPonteiroY = 0;

    // arrasto: o usuário empurra a rotação e ela continua girando ao soltar
    let arrastando = false;
    let ultimoX = 0;
    let ultimoY = 0;
    let velGiroY = 0;
    let velGiroX = 0;
    let giroLivreY = 0; // quanto o usuário girou além da rotação do scroll
    let giroLivreX = 0;
    // "mexer no lugar": o prisma acompanha o arrasto e volta sozinho
    let desvioX = 0;
    let desvioY = 0;
    let alvoDesvioX = 0;
    let alvoDesvioY = 0;

    const lerProgresso = () => {
      const rect = host.getBoundingClientRect();
      const alcance = rect.height + window.innerHeight;
      const percorrido = window.innerHeight - rect.top;
      alvoProgresso = Math.min(Math.max(percorrido / alcance, 0), 1);
    };
    lerProgresso();

    const onScroll = () => lerProgresso();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* -------------------------------------------------------------- ponteiro */
    const tela = renderer.domElement;

    const onPointerMoveGlobal = (e: PointerEvent) => {
      // inclinação sutil enquanto o mouse passeia pela página
      alvoPonteiroX = (e.clientX / window.innerWidth) * 2 - 1;
      alvoPonteiroY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMoveGlobal, { passive: true });

    const onPointerDown = (e: PointerEvent) => {
      if (!comp.interativo) return;
      // Sem isso, arrastar o prisma seleciona o texto do hero por baixo.
      e.preventDefault();
      arrastando = true;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      velGiroY = 0;
      velGiroX = 0;
      tela.setPointerCapture(e.pointerId);
      tela.style.cursor = "grabbing";
    };

    const onPointerDrag = (e: PointerEvent) => {
      if (!arrastando) return;
      const dx = e.clientX - ultimoX;
      const dy = e.clientY - ultimoY;
      ultimoX = e.clientX;
      ultimoY = e.clientY;

      // 0.008 rad/px acompanha a mão sem parecer solto
      velGiroY = dx * 0.008;
      velGiroX = dy * 0.006;
      giroLivreY += velGiroY;
      giroLivreX += velGiroX;

      // o prisma se desloca um pouco na direção do arrasto, com teto
      alvoDesvioX = Math.max(-0.8, Math.min(0.8, alvoDesvioX + dx * 0.0035));
      alvoDesvioY = Math.max(-0.6, Math.min(0.6, alvoDesvioY - dy * 0.0035));
    };

    const soltar = (e: PointerEvent) => {
      if (!arrastando) return;
      arrastando = false;
      if (tela.hasPointerCapture(e.pointerId)) tela.releasePointerCapture(e.pointerId);
      tela.style.cursor = "grab";
      // ao soltar, a posição volta ao lugar; a rotação segue por inércia
      alvoDesvioX = 0;
      alvoDesvioY = 0;
    };

    // preventDefault no pointerdown não impede a seleção: quem a inicia é o
    // mousedown de compatibilidade. Bloquear selectstart enquanto arrasta é o
    // que funciona, e só durante o arrasto — o texto continua selecionável.
    const bloquearSelecao = (e: Event) => {
      if (arrastando) e.preventDefault();
    };
    document.addEventListener("selectstart", bloquearSelecao);

    tela.addEventListener("pointerdown", onPointerDown);
    tela.addEventListener("pointermove", onPointerDrag);
    tela.addEventListener("pointerup", soltar);
    tela.addEventListener("pointercancel", soltar);
    tela.addEventListener("pointerleave", soltar);

    /* ---------------------------------------------------- visibilidade/resize */
    let visivel = true;
    const observador = new IntersectionObserver(
      ([entrada]) => (visivel = entrada.isIntersecting),
      { rootMargin: "120px" },
    );
    observador.observe(host);

    const aplicarComposicao = () => {
      comp = lerComposicao();
      palco.scale.setScalar(comp.escala);
      host.style.opacity = String(comp.opacidade);
      host.style.pointerEvents = comp.interativo ? "auto" : "none";
      tela.style.cursor = comp.interativo ? "grab" : "default";
      tela.style.touchAction = "pan-y"; // no toque, o scroll da página vence
      tela.style.userSelect = "none";
      tela.style.webkitUserSelect = "none";
    };
    aplicarComposicao();

    const onResize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      aplicarComposicao();
      lerProgresso();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    /* ------------------------------------------------------------------ laço */
    let raf = 0;
    const relogio = new THREE.Clock();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visivel) return;

      const t = relogio.getElapsedTime();
      // Suavização: o scroll cru é entrecortado; o lerp dá inércia de câmera.
      progresso += (alvoProgresso - progresso) * 0.07;
      ponteiroX += (alvoPonteiroX - ponteiroX) * 0.05;
      ponteiroY += (alvoPonteiroY - ponteiroY) * 0.05;
      desvioX += (alvoDesvioX - desvioX) * 0.09;
      desvioY += (alvoDesvioY - desvioY) * 0.09;

      // inércia depois de soltar: a rotação desacelera até parar
      if (!arrastando) {
        giroLivreY += velGiroY;
        giroLivreX += velGiroX;
        velGiroY *= 0.94;
        velGiroX *= 0.94;
        if (Math.abs(velGiroY) < 1e-4) velGiroY = 0;
        if (Math.abs(velGiroX) < 1e-4) velGiroX = 0;
        // a inclinação vertical volta devagar ao repouso; a horizontal fica
        giroLivreX *= 0.985;
      }

      const p = reduzirMovimento ? 0 : progresso;
      const giroOcioso = arrastando ? 0 : t * 0.12;

      principal.rotation.y =
        -0.34 + p * Math.PI * 1.15 + giroLivreY + giroOcioso + ponteiroX * 0.18;
      principal.rotation.x = 0.1 + p * 0.55 + giroLivreX + ponteiroY * 0.1;
      principal.rotation.z = p * -0.28;
      principal.position.x = desvioX;
      principal.position.y = desvioY + Math.sin(t * 0.5) * 0.07 - p * 0.7;
      principal.scale.setScalar(1 - p * 0.18);

      camera.position.z = 6.6 - p * 1.5;
      camera.position.y = p * 0.85;
      camera.lookAt(0, -p * 0.35, 0);

      for (const s of satelites) {
        const base = s.userData.base as THREE.Vector3;
        const par = s.userData.parallax as number;
        const giro = s.userData.giro as number;
        s.position.y = base.y - p * par * 1.6 + Math.sin(t * 0.4 + par) * 0.09;
        // os satélites acompanham o arrasto em frações — reforça a profundidade
        s.position.x = base.x + ponteiroX * par * 0.12 + desvioX * (0.35 / par);
        s.rotation.y = giro + t * 0.16 * Math.sign(giro) + p * giro + giroLivreY * 0.3;
        s.rotation.x = giro * 0.7 + t * 0.09;
      }

      renderer.render(cena, camera);
    };
    tick();

    /* -------------------------------------------------------------- limpeza */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMoveGlobal);
      document.removeEventListener("selectstart", bloquearSelecao);
      tela.removeEventListener("pointerdown", onPointerDown);
      tela.removeEventListener("pointermove", onPointerDrag);
      tela.removeEventListener("pointerup", soltar);
      tela.removeEventListener("pointercancel", soltar);
      tela.removeEventListener("pointerleave", soltar);
      observador.disconnect();
      ro.disconnect();

      cena.traverse((o) => {
        if (o instanceof THREE.Mesh) (o.material as THREE.Material).dispose();
      });
      disposePrismGeometry();
      ambiente.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}
