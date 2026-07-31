import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/* ============================================================================
   Prisma da Triângulo — reconstrução procedural em Three.js
   Método: img2threejs (github.com/img2threejs/img2threejs) — reconstrução por
   código, sem malha baixada.

   Diferença importante em relação ao fluxo padrão do método: não precisamos
   *estimar* a silhueta a partir da foto. O símbolo isométrico da marca existe
   como vetor oficial (assets/SIMBOLO.svg do Manual da Marca), então a extração
   de forma é exata — o path do SVG vira THREE.Shape e é extrudado. A referência
   fotográfica (`prisma png.png` e `triangulo prisma.jpg`) é usada só para o
   contrato de material e luz: vidro vermelho, aresta chanfrada, brilho de
   quina, interior mais denso que a superfície.

   qualityContract
     silhueta   : exata (path oficial do símbolo)
     material   : vidro/rubi — transmissão alta, IOR ~1.7, chanfro que pega luz
     iluminação : key fria + rim vermelho + fill baixo, como nas referências
     custo      : geometria única compartilhada entre instâncias; alvo 60fps
   ========================================================================== */

/** Path oficial do símbolo (Manual da Marca — arquivo SIMBOLO.svg). */
const SIMBOLO_PATH =
  "M227.04,89.41l-104.87-41.33-.12-45.49c0-1.97-2.72-2.8-4.41-2.54L7.72,43.92C3.35,45.66.08,49.57.07,54.53l-.07,99.37c0,4.74,2.54,9.33,7.18,11.16l105.2,41.52.18,44.5c0,1.27.95,2.59,1.64,3.07.67.46,2.23.73,3.3.3l109.39-43.68c3.59-1.43,7.41-4.78,7.43-8.4l.23-47.15.04-54.9c0-4.91-2.99-9.11-7.55-10.91ZM220.2,152.81l-97.97,37.89-.14-39.37c-.01-1.94-1.73-3.33-3.38-4.19L15.49,107.41c-1.65-.63-2.64-1.29-3.27-2.93.52-1.15,1.28-2.2,2.73-2.76l97.43-37.7.17,39.26c0,2.27,2.14,3.83,4.13,4.58l103.85,39.96c1.12.43,1.47,2.24,1.73,2.94-.44,1.13-1.01,1.48-2.06,2.05Z";

const VIEWBOX = { w: 234.59, h: 254.66 };

export interface PrismOptions {
  /** Altura alvo do objeto em unidades de cena. */
  size?: number;
  /** Cor do vidro. Padrão: Vermelho Triângulo. */
  color?: THREE.ColorRepresentation;
  /** Opaco em vez de vidro — usado no fallback de baixa performance. */
  solid?: boolean;
}

let cachedGeometry: THREE.ExtrudeGeometry | null = null;

/**
 * Geometria do símbolo extrudado, sempre em tamanho canônico (altura 1).
 *
 * É cara de montar (parse do SVG + bevel) e idêntica em todas as instâncias,
 * então é construída uma vez e compartilhada — o tamanho de cada prisma vem da
 * escala do Group. Construir por tamanho quebraria: o cache devolveria a
 * geometria do primeiro que pediu, e todos os prismas sairiam iguais.
 */
function buildGeometry(): THREE.ExtrudeGeometry {
  if (cachedGeometry) return cachedGeometry;

  const size = 1;
  const depth = 0.26;

  const loader = new SVGLoader();
  // O SVGLoader espera um documento; montamos um mínimo em volta do path.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX.w} ${VIEWBOX.h}"><path d="${SIMBOLO_PATH}"/></svg>`;
  const parsed = loader.parse(svg);

  const shapes: THREE.Shape[] = [];
  for (const path of parsed.paths) {
    // `true` respeita a regra de preenchimento: o vazado interno do símbolo
    // vira furo de verdade, não uma segunda forma sólida.
    shapes.push(...SVGLoader.createShapes(path));
  }

  const escala = size / VIEWBOX.h;
  const bevel = size * 0.028;

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: depth / escala,
    bevelEnabled: true,
    bevelThickness: bevel / escala,
    bevelSize: bevel / escala,
    bevelSegments: 4,
    curveSegments: 12,
  });

  // O SVG tem Y para baixo; a cena tem Y para cima.
  geo.scale(escala, -escala, escala);
  geo.center();
  geo.computeVertexNormals();

  cachedGeometry = geo;
  return geo;
}

/**
 * Vidro vermelho das referências. `transmission` exige que o renderer tenha
 * um render target de transmissão — Three.js resolve isso sozinho no
 * WebGLRenderer moderno, mas custa caro, daí a variante `solid`.
 */
function buildMaterial(color: THREE.ColorRepresentation, solid: boolean) {
  if (solid) {
    return new THREE.MeshStandardMaterial({
      color,
      metalness: 0.35,
      roughness: 0.28,
      envMapIntensity: 1.1,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: 0.08,
    transmission: 0.92,
    thickness: 1.6,
    ior: 1.7,
    // Dispersão dá a franja de cor nas quinas, como no render de referência.
    dispersion: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    attenuationColor: new THREE.Color(color),
    attenuationDistance: 1.4,
    envMapIntensity: 1.4,
    side: THREE.DoubleSide,
  });
}

/**
 * Cria o prisma como um Group. O Group é o que a cena manipula; a malha fica
 * dentro dele, então rotação e escala externas não brigam com o `center()`.
 */
export function createPrismModel(options: PrismOptions = {}): THREE.Group {
  const { size = 1, color = "#CE2B34", solid = false } = options;

  const grupo = new THREE.Group();
  grupo.name = "prisma-triangulo";

  const malha = new THREE.Mesh(buildGeometry(), buildMaterial(color, solid));
  malha.name = "prisma-corpo";
  // O tamanho vem daqui, não da geometria — ver buildGeometry().
  malha.scale.setScalar(size);
  grupo.add(malha);

  return grupo;
}

/** Libera a geometria compartilhada. Chamar ao desmontar a última cena. */
export function disposePrismGeometry() {
  cachedGeometry?.dispose();
  cachedGeometry = null;
}
