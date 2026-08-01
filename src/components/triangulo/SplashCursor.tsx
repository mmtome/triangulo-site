import { useEffect, useRef } from "react";

/**
 * Simulação de fluido do React Bits, adaptada para viver dentro de uma seção.
 *
 * Duas diferenças em relação ao original, e ambas são necessárias aqui:
 *
 * 1. O original é `position: fixed` cobrindo a viewport inteira e lê o ponteiro
 *    em coordenadas de janela. Como fundo de uma seção, o canvas é absolute e o
 *    ponteiro precisa ser convertido para coordenadas do próprio canvas — senão
 *    o rastro aparece deslocado assim que a página rola.
 * 2. O laço só roda quando a seção está na tela e a aba está visível. É uma
 *    simulação de fluido com 20 iterações de pressão por quadro: deixá-la
 *    girando fora de vista derruba o scroll do resto do site.
 */

export interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
  /** Multiplica o brilho do corante. O original fixa 0.15. */
  INTENSITY?: number;
  className?: string;
}

type Cor = { r: number; g: number; b: number };

function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  RAINBOW_MODE = false,
  COLOR = "#CE2B34",
  INTENSITY = 0.15,
  className,
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ativo = true;
    let raf = 0;

    const config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      RAINBOW_MODE,
      COLOR,
      INTENSITY,
    };

    const ponteiro = {
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      moved: false,
      color: { r: 0, g: 0, b: 0 } as Cor,
    };

    /* ---------------------------------------------------------------- WebGL */

    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const ehWebGL2 = !!gl;
    if (!gl) {
      gl = (canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params)) as unknown as WebGL2RenderingContext | null;
    }
    if (!gl) return;
    const ctx = gl;

    let halfFloat: OES_texture_half_float | null = null;
    let filtragemLinear: unknown = null;
    if (ehWebGL2) {
      ctx.getExtension("EXT_color_buffer_float");
      filtragemLinear = ctx.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = ctx.getExtension("OES_texture_half_float");
      filtragemLinear = ctx.getExtension("OES_texture_half_float_linear");
    }
    ctx.clearColor(0, 0, 0, 1);

    const tipoHalfFloat = ehWebGL2
      ? ctx.HALF_FLOAT
      : (halfFloat as unknown as { HALF_FLOAT_OES: number })?.HALF_FLOAT_OES;

    function suportaFormato(interno: number, formato: number, tipo: number): boolean {
      const tex = ctx.createTexture();
      ctx.bindTexture(ctx.TEXTURE_2D, tex);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, interno, 4, 4, 0, formato, tipo, null);
      const fbo = ctx.createFramebuffer();
      ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
      ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, tex, 0);
      return ctx.checkFramebufferStatus(ctx.FRAMEBUFFER) === ctx.FRAMEBUFFER_COMPLETE;
    }

    function formatoSuportado(
      interno: number,
      formato: number,
      tipo: number,
    ): { internalFormat: number; format: number } | null {
      if (!suportaFormato(interno, formato, tipo)) {
        switch (interno) {
          case ctx.R16F:
            return formatoSuportado(ctx.RG16F, ctx.RG, tipo);
          case ctx.RG16F:
            return formatoSuportado(ctx.RGBA16F, ctx.RGBA, tipo);
          default:
            return null;
        }
      }
      return { internalFormat: interno, format: formato };
    }

    const formatRGBA = ehWebGL2
      ? formatoSuportado(ctx.RGBA16F, ctx.RGBA, tipoHalfFloat)
      : formatoSuportado(ctx.RGBA, ctx.RGBA, tipoHalfFloat);
    const formatRG = ehWebGL2
      ? formatoSuportado(ctx.RG16F, ctx.RG, tipoHalfFloat)
      : formatoSuportado(ctx.RGBA, ctx.RGBA, tipoHalfFloat);
    const formatR = ehWebGL2
      ? formatoSuportado(ctx.R16F, ctx.RED, tipoHalfFloat)
      : formatoSuportado(ctx.RGBA, ctx.RGBA, tipoHalfFloat);

    if (!formatRGBA || !formatRG || !formatR) return;

    if (!filtragemLinear) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    /* -------------------------------------------------------------- Shaders */

    function compilar(tipo: number, fonte: string, palavras?: string[] | null): WebGLShader {
      const prefixo = palavras ? palavras.map((k) => `#define ${k}\n`).join("") : "";
      const shader = ctx.createShader(tipo)!;
      ctx.shaderSource(shader, prefixo + fonte);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error(ctx.getShaderInfoLog(shader));
      }
      return shader;
    }

    function criarPrograma(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
      const programa = ctx.createProgram()!;
      ctx.attachShader(programa, vs);
      ctx.attachShader(programa, fs);
      ctx.linkProgram(programa);
      if (!ctx.getProgramParameter(programa, ctx.LINK_STATUS)) {
        console.error(ctx.getProgramInfoLog(programa));
      }
      return programa;
    }

    function uniformes(programa: WebGLProgram): Record<string, WebGLUniformLocation> {
      const mapa: Record<string, WebGLUniformLocation> = {};
      const total = ctx.getProgramParameter(programa, ctx.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < total; i++) {
        const nome = ctx.getActiveUniform(programa, i)!.name;
        mapa[nome] = ctx.getUniformLocation(programa, nome)!;
      }
      return mapa;
    }

    class Programa {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation>;
      constructor(vs: WebGLShader, fs: WebGLShader) {
        this.program = criarPrograma(vs, fs);
        this.uniforms = uniformes(this.program);
      }
      bind() {
        ctx.useProgram(this.program);
      }
    }

    const baseVertexShader = compilar(
      ctx.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `,
    );

    const copyShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `,
    );

    const clearShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `,
    );

    const displayShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform vec2 texelSize;
      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;
              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);
              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);
              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,
      config.SHADING ? ["SHADING"] : null,
    );

    const splatShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
      uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `,
    );

    const advectionShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform vec2 dyeTexelSize;
      uniform float dt; uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st); vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
          #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,
      filtragemLinear ? null : ["MANUAL_FILTERING"],
    );

    const divergenceShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `,
    );

    const curlShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `,
    );

    const vorticityShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl;
      uniform float curl; uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `,
    );

    const pressureShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `,
    );

    const gradientSubtractShader = compilar(
      ctx.FRAGMENT_SHADER,
      `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR;
      varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `,
    );

    /* ------------------------------------------------------------ Alvos FBO */

    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };
    type DuploFBO = {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    };

    const blit = (() => {
      ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
      ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), ctx.STATIC_DRAW);
      ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ctx.createBuffer());
      ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), ctx.STATIC_DRAW);
      ctx.vertexAttribPointer(0, 2, ctx.FLOAT, false, 0, 0);
      ctx.enableVertexAttribArray(0);
      return (alvo: FBO | null, limpar = false) => {
        if (alvo == null) {
          ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
          ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        } else {
          ctx.viewport(0, 0, alvo.width, alvo.height);
          ctx.bindFramebuffer(ctx.FRAMEBUFFER, alvo.fbo);
        }
        if (limpar) {
          ctx.clearColor(0, 0, 0, 1);
          ctx.clear(ctx.COLOR_BUFFER_BIT);
        }
        ctx.drawElements(ctx.TRIANGLES, 6, ctx.UNSIGNED_SHORT, 0);
      };
    })();

    function criarFBO(w: number, h: number, interno: number, formato: number, tipo: number, filtro: number): FBO {
      ctx.activeTexture(ctx.TEXTURE0);
      const texture = ctx.createTexture()!;
      ctx.bindTexture(ctx.TEXTURE_2D, texture);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, filtro);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, filtro);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, interno, w, h, 0, formato, tipo, null);

      const fbo = ctx.createFramebuffer()!;
      ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
      ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, texture, 0);
      ctx.viewport(0, 0, w, h);
      ctx.clear(ctx.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          ctx.activeTexture(ctx.TEXTURE0 + id);
          ctx.bindTexture(ctx.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function criarDuploFBO(
      w: number,
      h: number,
      interno: number,
      formato: number,
      tipo: number,
      filtro: number,
    ): DuploFBO {
      let a = criarFBO(w, h, interno, formato, tipo, filtro);
      let b = criarFBO(w, h, interno, formato, tipo, filtro);
      return {
        width: w,
        height: h,
        texelSizeX: a.texelSizeX,
        texelSizeY: a.texelSizeY,
        get read() {
          return a;
        },
        set read(v: FBO) {
          a = v;
        },
        get write() {
          return b;
        },
        set write(v: FBO) {
          b = v;
        },
        swap() {
          const t = a;
          a = b;
          b = t;
        },
      };
    }

    function redimensionarFBO(
      alvo: FBO,
      w: number,
      h: number,
      interno: number,
      formato: number,
      tipo: number,
      filtro: number,
    ): FBO {
      const novo = criarFBO(w, h, interno, formato, tipo, filtro);
      copyProgram.bind();
      ctx.uniform1i(copyProgram.uniforms.uTexture, alvo.attach(0));
      blit(novo);
      return novo;
    }

    function redimensionarDuplo(
      alvo: DuploFBO,
      w: number,
      h: number,
      interno: number,
      formato: number,
      tipo: number,
      filtro: number,
    ): DuploFBO {
      if (alvo.width === w && alvo.height === h) return alvo;
      alvo.read = redimensionarFBO(alvo.read, w, h, interno, formato, tipo, filtro);
      alvo.write = criarFBO(w, h, interno, formato, tipo, filtro);
      alvo.width = w;
      alvo.height = h;
      alvo.texelSizeX = 1 / w;
      alvo.texelSizeY = 1 / h;
      return alvo;
    }

    const copyProgram = new Programa(baseVertexShader, copyShader);
    const clearProgram = new Programa(baseVertexShader, clearShader);
    const splatProgram = new Programa(baseVertexShader, splatShader);
    const advectionProgram = new Programa(baseVertexShader, advectionShader);
    const divergenceProgram = new Programa(baseVertexShader, divergenceShader);
    const curlProgram = new Programa(baseVertexShader, curlShader);
    const vorticityProgram = new Programa(baseVertexShader, vorticityShader);
    const gradienSubtractProgram = new Programa(baseVertexShader, gradientSubtractShader);
    const pressureProgram = new Programa(baseVertexShader, pressureShader);
    const displayProgram = new Programa(baseVertexShader, displayShader);

    let dye: DuploFBO;
    let velocity: DuploFBO;
    let divergence: FBO;
    let curlFBO: FBO;
    let pressure: DuploFBO;

    function resolucao(res: number) {
      let proporcao = ctx.drawingBufferWidth / ctx.drawingBufferHeight;
      if (proporcao < 1) proporcao = 1 / proporcao;
      const min = Math.round(res);
      const max = Math.round(res * proporcao);
      return ctx.drawingBufferWidth > ctx.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    }

    function iniciarFramebuffers() {
      const sim = resolucao(config.SIM_RESOLUTION);
      const corante = resolucao(config.DYE_RESOLUTION);
      const tipo = tipoHalfFloat;
      const filtro = filtragemLinear ? ctx.LINEAR : ctx.NEAREST;
      ctx.disable(ctx.BLEND);

      dye = !dye
        ? criarDuploFBO(corante.width, corante.height, formatRGBA!.internalFormat, formatRGBA!.format, tipo, filtro)
        : redimensionarDuplo(
            dye,
            corante.width,
            corante.height,
            formatRGBA!.internalFormat,
            formatRGBA!.format,
            tipo,
            filtro,
          );

      velocity = !velocity
        ? criarDuploFBO(sim.width, sim.height, formatRG!.internalFormat, formatRG!.format, tipo, filtro)
        : redimensionarDuplo(velocity, sim.width, sim.height, formatRG!.internalFormat, formatRG!.format, tipo, filtro);

      divergence = criarFBO(sim.width, sim.height, formatR!.internalFormat, formatR!.format, tipo, ctx.NEAREST);
      curlFBO = criarFBO(sim.width, sim.height, formatR!.internalFormat, formatR!.format, tipo, ctx.NEAREST);
      pressure = criarDuploFBO(sim.width, sim.height, formatR!.internalFormat, formatR!.format, tipo, ctx.NEAREST);
    }

    /* ------------------------------------------------------------- Simulação */

    function porPixelRatio(v: number) {
      return Math.floor(v * (window.devicePixelRatio || 1));
    }

    function redimensionarCanvas() {
      const w = porPixelRatio(canvas!.clientWidth);
      const h = porPixelRatio(canvas!.clientHeight);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        return true;
      }
      return false;
    }

    function hexParaRGB(hex: string): Cor {
      let v = hex.replace("#", "");
      if (v.length === 3) v = v[0] + v[0] + v[1] + v[1] + v[2] + v[2];
      const i = config.INTENSITY;
      return {
        r: (parseInt(v.slice(0, 2), 16) / 255) * i,
        g: (parseInt(v.slice(2, 4), 16) / 255) * i,
        b: (parseInt(v.slice(4, 6), 16) / 255) * i,
      };
    }

    function hsvParaRGB(h: number, s: number, v: number): Cor {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: return { r: v, g: t, b: p };
        case 1: return { r: q, g: v, b: p };
        case 2: return { r: p, g: v, b: t };
        case 3: return { r: p, g: q, b: v };
        case 4: return { r: t, g: p, b: v };
        default: return { r: v, g: p, b: q };
      }
    }

    function gerarCor(): Cor {
      if (!config.RAINBOW_MODE) return hexParaRGB(config.COLOR);
      const c = hsvParaRGB(Math.random(), 1, 1);
      const i = config.INTENSITY;
      return { r: c.r * i, g: c.g * i, b: c.b * i };
    }

    function raioCorrigido(raio: number) {
      const proporcao = canvas!.width / canvas!.height;
      return proporcao > 1 ? raio * proporcao : raio;
    }

    function splat(x: number, y: number, dx: number, dy: number, cor: Cor) {
      splatProgram.bind();
      ctx.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      ctx.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      ctx.uniform2f(splatProgram.uniforms.point, x, y);
      ctx.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      ctx.uniform1f(splatProgram.uniforms.radius, raioCorrigido(config.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      ctx.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      ctx.uniform3f(splatProgram.uniforms.color, cor.r, cor.g, cor.b);
      blit(dye.write);
      dye.swap();
    }

    function passo(dt: number) {
      ctx.disable(ctx.BLEND);

      curlProgram.bind();
      ctx.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      ctx.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      vorticityProgram.bind();
      ctx.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      ctx.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      ctx.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      ctx.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      ctx.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      ctx.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      ctx.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      ctx.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      ctx.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      ctx.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      ctx.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        ctx.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradienSubtractProgram.bind();
      ctx.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      ctx.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      ctx.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      ctx.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!filtragemLinear) {
        ctx.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      const idVelocidade = velocity.read.attach(0);
      ctx.uniform1i(advectionProgram.uniforms.uVelocity, idVelocidade);
      ctx.uniform1i(advectionProgram.uniforms.uSource, idVelocidade);
      ctx.uniform1f(advectionProgram.uniforms.dt, dt);
      ctx.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!filtragemLinear) {
        ctx.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      ctx.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      ctx.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      ctx.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function desenhar() {
      ctx.blendFunc(ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
      ctx.enable(ctx.BLEND);
      displayProgram.bind();
      if (config.SHADING) {
        ctx.uniform2f(
          displayProgram.uniforms.texelSize,
          1 / ctx.drawingBufferWidth,
          1 / ctx.drawingBufferHeight,
        );
      }
      ctx.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    iniciarFramebuffers();

    let ultimoTempo = performance.now();
    let relogioCor = 0;
    let naTela = true;
    let oculto = false;

    const quadro = () => {
      if (!ativo) return;
      raf = requestAnimationFrame(quadro);
      if (!naTela || oculto) {
        ultimoTempo = performance.now();
        return;
      }

      const agora = performance.now();
      const dt = Math.min((agora - ultimoTempo) / 1000, 0.016666);
      ultimoTempo = agora;

      if (redimensionarCanvas()) iniciarFramebuffers();

      relogioCor += dt * config.COLOR_UPDATE_SPEED;
      if (relogioCor >= 1) {
        relogioCor = relogioCor % 1;
        ponteiro.color = gerarCor();
      }

      if (ponteiro.moved) {
        ponteiro.moved = false;
        splat(
          ponteiro.texcoordX,
          ponteiro.texcoordY,
          ponteiro.deltaX * config.SPLAT_FORCE,
          ponteiro.deltaY * config.SPLAT_FORCE,
          ponteiro.color,
        );
      }

      passo(dt);
      desenhar();
    };

    /* --------------------------------------------------------------- Entrada */

    function deltaXCorrigido(d: number) {
      const p = canvas!.width / canvas!.height;
      return p < 1 ? d * p : d;
    }
    function deltaYCorrigido(d: number) {
      const p = canvas!.width / canvas!.height;
      return p > 1 ? d / p : d;
    }

    // Coordenadas relativas ao canvas, não à janela: o efeito vive dentro de
    // uma seção e a página rola.
    function moverPonteiro(clientX: number, clientY: number, novaCor: boolean) {
      const r = canvas!.getBoundingClientRect();
      const x = porPixelRatio(clientX - r.left);
      const y = porPixelRatio(clientY - r.top);
      ponteiro.prevTexcoordX = ponteiro.texcoordX;
      ponteiro.prevTexcoordY = ponteiro.texcoordY;
      ponteiro.texcoordX = x / canvas!.width;
      ponteiro.texcoordY = 1 - y / canvas!.height;
      ponteiro.deltaX = deltaXCorrigido(ponteiro.texcoordX - ponteiro.prevTexcoordX);
      ponteiro.deltaY = deltaYCorrigido(ponteiro.texcoordY - ponteiro.prevTexcoordY);
      ponteiro.moved = Math.abs(ponteiro.deltaX) > 0 || Math.abs(ponteiro.deltaY) > 0;
      if (novaCor) ponteiro.color = gerarCor();
    }

    let primeiroMovimento = false;
    const aoMover = (e: PointerEvent) => {
      if (!naTela) return;
      moverPonteiro(e.clientX, e.clientY, !primeiroMovimento);
      primeiroMovimento = true;
    };
    const aoTocar = (e: TouchEvent) => {
      if (!naTela) return;
      const t = e.targetTouches[0];
      if (t) moverPonteiro(t.clientX, t.clientY, false);
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    window.addEventListener("touchmove", aoTocar, { passive: true });

    const io = new IntersectionObserver(([e]) => (naTela = e?.isIntersecting ?? true), { threshold: 0 });
    io.observe(canvas);

    const aoTrocarAba = () => (oculto = document.hidden);
    document.addEventListener("visibilitychange", aoTrocarAba, { passive: true });

    quadro();

    return () => {
      ativo = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("touchmove", aoTocar);
      document.removeEventListener("visibilitychange", aoTrocarAba);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
    />
  );
}

export default SplashCursor;
