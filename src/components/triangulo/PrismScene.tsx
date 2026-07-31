import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createPrismModel, disposePrismGeometry } from "@/three/createPrismModel";

/* ============================================================================
   Cena 3D do hero — prismas da marca reagindo ao scroll.

   Referência: "ref site 3" (objetos flutuando em profundidade sobre fundo
   escuro com brilho) reinterpretada com o símbolo da Triângulo no lugar dos
   cubos genéricos, e na paleta do Manual da Marca.

   O scroll dirige três coisas ao mesmo tempo:
     1. rotação do prisma principal (ele "abre" conforme a página desce)
     2. dolly da câmera (aproxima e desce, dando sensação de mergulho)
     3. deriva dos prismas satélites, cada um numa velocidade (parallax)
   ========================================================================== */

const VERMELHO = "#CE2B34";

/** Satélites: posição, escala e velocidade de parallax. Sementes fixas — nada
 *  de Math.random, para o layout ser idêntico em todo carregamento.
 *  As posições são relativas ao centro da composição, deslocada em X para o
 *  lado do prisma principal. */
const SATELITES = [
  { pos: [-1.55, 1.35, -1.9], escala: 0.3, giro: 0.55, parallax: 1.35 },
  { pos: [1.45, 1.05, -2.6], escala: 0.24, giro: -0.7, parallax: 1.7 },
  { pos: [-1.15, -1.5, -1.2], escala: 0.21, giro: 0.9, parallax: 0.9 },
  { pos: [1.6, -1.15, -1.6], escala: 0.34, giro: -0.45, parallax: 1.15 },
  { pos: [-2.1, 0.05, -3.2], escala: 0.18, giro: 1.1, parallax: 2.1 },
  { pos: [0.75, 2.05, -3.6], escala: 0.15, giro: -1.2, parallax: 2.4 },
] as const;

/** Composição: no desktop a cena vai para a direita e o texto ocupa a esquerda
 *  (leitura da "ref site 3"). Abaixo de 1024px não há espaço para as duas
 *  colunas, então a cena volta ao centro, atrás do texto e mais discreta. */
function lerComposicao() {
  const largura = window.innerWidth;
  if (largura >= 1024) return { deslocX: 2.75, escala: 1, opacidade: 1 };
  if (largura >= 640) return { deslocX: 1.1, escala: 0.78, opacidade: 0.5 };
  return { deslocX: 0, escala: 0.66, opacidade: 0.35 };
}

export function PrismScene({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Sem WebGL o componente simplesmente não monta — o hero tem fundo próprio.
    const canvas = document.createElement("canvas");
    const temWebGL = !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
    if (!temWebGL) return;

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
      38,
      host.clientWidth / host.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 6.2);

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

    /* ---- composição ----
       Tudo vive dentro de um palco. Deslocar e escalar o palco reposiciona a
       cena inteira quando a janela muda de faixa, sem tocar em cada objeto. */
    let comp = lerComposicao();
    const palco = new THREE.Group();
    palco.position.x = comp.deslocX;
    palco.scale.setScalar(comp.escala);
    cena.add(palco);

    const principal = createPrismModel({
      size: 1.45,
      color: VERMELHO,
      solid: modoLeve,
    });
    palco.add(principal);

    /* ---- satélites ---- */
    const satelites = SATELITES.map((s) => {
      const g = createPrismModel({
        size: 1.45 * s.escala,
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

    /* ---- estado de scroll e ponteiro ---- */
    let progresso = 0; // 0 no topo da página, 1 ao fim do hero
    let alvoProgresso = 0;
    let ponteiroX = 0;
    let ponteiroY = 0;
    let alvoPonteiroX = 0;
    let alvoPonteiroY = 0;

    const lerProgresso = () => {
      const rect = host.getBoundingClientRect();
      const alcance = rect.height + window.innerHeight;
      const percorrido = window.innerHeight - rect.top;
      alvoProgresso = Math.min(Math.max(percorrido / alcance, 0), 1);
    };
    lerProgresso();

    const onScroll = () => lerProgresso();
    const onPointer = (e: PointerEvent) => {
      alvoPonteiroX = (e.clientX / window.innerWidth) * 2 - 1;
      alvoPonteiroY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ---- só anima quando está na tela ---- */
    let visivel = true;
    const observador = new IntersectionObserver(
      ([entrada]) => (visivel = entrada.isIntersecting),
      { rootMargin: "120px" },
    );
    observador.observe(host);

    const onResize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      comp = lerComposicao();
      palco.position.x = comp.deslocX;
      palco.scale.setScalar(comp.escala);
      host.style.opacity = String(comp.opacidade);
      lerProgresso();
    };
    host.style.opacity = String(comp.opacidade);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    /* ---- laço ---- */
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

      const p = reduzirMovimento ? 0 : progresso;

      // 1. o prisma principal abre conforme desce
      principal.rotation.y = -0.34 + p * Math.PI * 1.15 + ponteiroX * 0.22;
      principal.rotation.x = 0.1 + p * 0.55 + ponteiroY * 0.12;
      principal.rotation.z = p * -0.28;
      principal.position.y = Math.sin(t * 0.5) * 0.07 - p * 0.7;
      principal.scale.setScalar(1 - p * 0.18);

      // 2. dolly: aproxima e desce
      camera.position.z = 6.8 - p * 1.5;
      camera.position.y = p * 0.85;
      camera.lookAt(comp.deslocX, -p * 0.35, 0);

      // 3. satélites derivam em velocidades diferentes
      for (const s of satelites) {
        const base = s.userData.base as THREE.Vector3;
        const par = s.userData.parallax as number;
        const giro = s.userData.giro as number;
        s.position.y = base.y - p * par * 1.6 + Math.sin(t * 0.4 + par) * 0.09;
        s.position.x = base.x + ponteiroX * par * 0.12;
        s.rotation.y = giro + t * 0.16 * Math.sign(giro) + p * giro;
        s.rotation.x = giro * 0.7 + t * 0.09;
      }

      renderer.render(cena, camera);
    };
    tick();

    /* ---- limpeza ---- */
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      observador.disconnect();
      ro.disconnect();

      cena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          (o.material as THREE.Material).dispose();
        }
      });
      disposePrismGeometry();
      ambiente.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
