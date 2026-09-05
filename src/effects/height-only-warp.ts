import { createEffect, type InteractivitySchema } from "remotion";

type HeightOnlyWarpParams = {
  readonly leftScale?: number;
  readonly rightScale?: number;
};

type HeightOnlyWarpState = {
  readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;
  readonly texture: WebGLTexture;
  readonly vao: WebGLVertexArrayObject;
  readonly vbo: WebGLBuffer;
  readonly uLeftScale: WebGLUniformLocation | null;
  readonly uRightScale: WebGLUniformLocation | null;
  readonly uSource: WebGLUniformLocation | null;
};

const vertexShader = `#version 300 es
layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aUv;
out vec2 vUv;

void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSource;
uniform float uLeftScale;
uniform float uRightScale;

void main() {
  float heightScale = mix(uLeftScale, uRightScale, vUv.x);
  float sourceY = (vUv.y - 0.5) / heightScale + 0.5;

  if (sourceY < 0.0 || sourceY > 1.0) {
    fragColor = vec4(0.0);
    return;
  }

  // X is passed through unchanged, so glyph widths stay constant.
  fragColor = texture(uSource, vec2(vUv.x, sourceY));
}
`;

const compileShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Could not create a shader for heightOnlyWarp().");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`heightOnlyWarp() shader compilation failed: ${message}`);
  }

  return shader;
};

const createProgram = (gl: WebGL2RenderingContext) => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Could not create the heightOnlyWarp() program.");
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`heightOnlyWarp() program linking failed: ${message}`);
  }

  return program;
};

const heightOnlyWarpSchema = {
  leftScale: {
    type: "number",
    min: 0.01,
    max: 4,
    step: 0.01,
    default: 1,
    description: "Vertical scale at the left edge",
    hiddenFromList: false,
  },
  rightScale: {
    type: "number",
    min: 0.01,
    max: 4,
    step: 0.01,
    default: 1,
    description: "Vertical scale at the right edge",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

const resolve = ({ leftScale = 1, rightScale = 1 }: HeightOnlyWarpParams) => ({
  leftScale,
  rightScale,
});

const validateScale = (value: number, name: string) => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive finite number.`);
  }
};

export const heightOnlyWarp = createEffect<
  HeightOnlyWarpParams,
  HeightOnlyWarpState
>({
  type: "ch.jkweb.heightOnlyWarp",
  label: "heightOnlyWarp()",
  documentationLink: null,
  backend: "webgl2",
  calculateKey: (params) => {
    const { leftScale, rightScale } = resolve(params);
    return `height-only-warp-${leftScale}-${rightScale}`;
  },
  setup: (target) => {
    const gl = target.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      throw new Error("heightOnlyWarp() requires WebGL2.");
    }

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    const program = createProgram(gl);
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    const texture = gl.createTexture();
    if (!vao || !vbo || !texture) {
      throw new Error("Could not initialize heightOnlyWarp() WebGL resources.");
    }

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return {
      gl,
      program,
      texture,
      vao,
      vbo,
      uLeftScale: gl.getUniformLocation(program, "uLeftScale"),
      uRightScale: gl.getUniformLocation(program, "uRightScale"),
      uSource: gl.getUniformLocation(program, "uSource"),
    };
  },
  apply: ({ source, width, height, params, state, flipSourceY }) => {
    const { leftScale, rightScale } = resolve(params);
    const { gl } = state;

    gl.viewport(0, 0, width, height);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipSourceY);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      source as TexImageSource,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(state.program);
    gl.uniform1i(state.uSource, 0);
    gl.uniform1f(state.uLeftScale, leftScale);
    gl.uniform1f(state.uRightScale, rightScale);
    gl.bindVertexArray(state.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(null);
  },
  cleanup: ({ gl, program, texture, vao, vbo }) => {
    gl.deleteTexture(texture);
    gl.deleteBuffer(vbo);
    gl.deleteProgram(program);
    gl.deleteVertexArray(vao);
  },
  schema: heightOnlyWarpSchema,
  validateParams: (params) => {
    const { leftScale, rightScale } = resolve(params);
    validateScale(leftScale, "leftScale");
    validateScale(rightScale, "rightScale");
  },
});
