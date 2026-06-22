"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL port of the app's ElevenLabs orb (ui/primitives/orb-shader.ts).
 * The fragment shader is a near-verbatim translation of the SkSL source
 * (float2→vec2, `uniform shader uPerlin`→sampler2D, etc.), and the per-frame
 * envelope loop mirrors orb.tsx's useFrameCallback exactly.
 *
 * `playing` drives the agent state: idle (calm ambient) when paused,
 * a "talking" envelope when audio is playing so the plasma comes alive.
 */

const FRAG = `
precision highp float;

uniform float uTime;
uniform float uAnimation;
uniform float uInverted;
uniform float uOffset0;
uniform float uOffset1;
uniform float uOffset2;
uniform float uOffset3;
uniform float uOffset4;
uniform float uOffset5;
uniform float uOffset6;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform vec2 uResolution;
uniform sampler2D uPerlin;

const float PI = 3.14159265358979323846;

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

// SkSL sampled uPerlin.eval(uv * uTextureSize); on a texSize-sized texture
// that normalizes to uv, so we sample uv directly with REPEAT wrap.
float samplePerlin(vec2 uv) {
    return texture2D(uPerlin, uv).r;
}

float sharpRing(vec3 decomposed, float time) {
    float ringStart = 1.0;
    float ringWidth = 0.3;
    float noiseScale = 5.0;
    float n = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );
    n = (n - 0.5) * 2.5;
    return ringStart + n * ringWidth * 1.5;
}

float smoothRingFn(vec3 decomposed, float time) {
    float ringStart = 0.9;
    float ringWidth = 0.2;
    float noiseScale = 6.0;
    float n = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );
    n = (n - 0.5) * 5.0;
    return ringStart + n * ringWidth;
}

float flow(vec3 decomposed, float time) {
    return mix(
        samplePerlin(vec2(time, decomposed.x / 2.0)),
        samplePerlin(vec2(time, decomposed.y / 2.0)),
        decomposed.z
    );
}

bool drawOval(vec2 polarUv, vec2 polarCenter, float a, float b, bool reverseGradient, float softness, out vec4 outColor) {
    vec2 p = polarUv - polarCenter;
    float oval = (p.x * p.x) / (a * a) + (p.y * p.y) / (b * b);
    float edge = smoothstep(1.0, 1.0 - softness, oval);
    if (edge > 0.0) {
        float gradient = reverseGradient ? (1.0 - (p.x / a + 1.0) / 2.0) : ((p.x / a + 1.0) / 2.0);
        gradient = mix(0.5, gradient, 0.1);
        outColor = vec4(vec3(gradient), 0.85 * edge);
        return true;
    }
    outColor = vec4(0.0);
    return false;
}

vec3 colorRamp(float grayscale, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
    if (grayscale < 0.33) {
        return mix(c1, c2, grayscale * 3.0);
    } else if (grayscale < 0.66) {
        return mix(c2, c3, (grayscale - 0.33) * 3.0);
    } else {
        return mix(c3, c4, (grayscale - 0.66) * 3.0);
    }
}

vec4 applyOval(vec4 color, float theta, float radius, float center, float offset, bool reverseGradient) {
    float c = center + 0.5 * sin(uTime / 20.0 + offset);
    float n = samplePerlin(vec2(mod(c + uTime * 0.05, 1.0), 0.5));
    float a = 0.5 + n * 0.3;
    float b = n * mix(3.5, 2.5, uInputVolume);

    float distTheta = min(
        abs(theta - c),
        min(
            abs(theta + 2.0 * PI - c),
            abs(theta - 2.0 * PI - c)
        )
    );
    float distRadius = radius;
    float softness = 0.6;

    vec4 ovalColor;
    if (drawOval(vec2(distTheta, distRadius), vec2(0.0, 0.0), a, b, reverseGradient, softness, ovalColor)) {
        color.rgb = mix(color.rgb, ovalColor.rgb, ovalColor.a);
        color.a = max(color.a, ovalColor.a);
    }
    return color;
}

void main() {
    // Skia origin is top-left; flip GL's bottom-left to match the app.
    vec2 fragCoord = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
    vec2 vUv = fragCoord / uResolution;
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);
    if (theta < 0.0) theta += 2.0 * PI;

    float zN = sqrt(max(0.0, 1.0 - radius * radius));
    vec3 N = vec3(uv, zN);

    vec3 L = normalize(vec3(
        sin(uTime * 0.25) * 0.6,
        cos(uTime * 0.18) * 0.6,
        0.9
    ));

    float diffuse = 0.5 + 0.5 * dot(N, L);
    float spec = pow(max(dot(N, L), 0.0), 48.0);

    float iriPhase = fract(0.5 + zN * 0.4 + noise2D(uv * 2.0 + uTime * 0.05) * 0.2);

    vec3 decomposed = vec3(
        theta / (2.0 * PI),
        mod(theta / (2.0 * PI) + 0.5, 1.0) + 1.0,
        abs(theta / PI - 1.0)
    );

    float n = flow(decomposed, radius * 0.03 - uAnimation * 0.2) - 0.5;
    theta += n * mix(0.08, 0.25, uOutputVolume);

    vec4 color = vec4(1.0, 1.0, 1.0, 0.0);

    color = applyOval(color, theta, radius, 0.0,      uOffset0, false);
    color = applyOval(color, theta, radius, 0.5 * PI, uOffset1, true);
    color = applyOval(color, theta, radius, 1.0 * PI, uOffset2, false);
    color = applyOval(color, theta, radius, 1.5 * PI, uOffset3, true);
    color = applyOval(color, theta, radius, 2.0 * PI, uOffset4, false);
    color = applyOval(color, theta, radius, 2.5 * PI, uOffset5, true);
    color = applyOval(color, theta, radius, 3.0 * PI, uOffset6, false);

    float ringRadius1 = sharpRing(decomposed, uTime * 0.1);
    float ringRadius2 = smoothRingFn(decomposed, uTime * 0.1);

    float inputRadius1 = radius + uInputVolume * 0.2;
    float inputRadius2 = radius + uInputVolume * 0.15;
    float opacity1 = mix(0.2, 0.6, uInputVolume);
    float opacity2 = mix(0.15, 0.45, uInputVolume);

    float ringAlpha1 = (inputRadius2 >= ringRadius1) ? opacity1 : 0.0;
    float ringAlpha2 = smoothstep(ringRadius2 - 0.05, ringRadius2 + 0.05, inputRadius1) * opacity2;
    float totalRingAlpha = max(ringAlpha1, ringAlpha2);

    vec3 ringColor = vec3(1.0);
    color.rgb = 1.0 - (1.0 - color.rgb) * (1.0 - ringColor * totalRingAlpha);
    color.a = max(color.a, totalRingAlpha);

    vec3 c1 = vec3(0.0);
    vec3 c2 = uColor1;
    vec3 c3 = uColor2;
    vec3 c4 = vec3(1.0);

    float luminance = mix(color.r, 1.0 - color.r, uInverted);
    luminance *= mix(0.55, 1.08, diffuse);
    luminance += spec * 0.45 * color.a;
    luminance = clamp(luminance, 0.0, 1.0);

    color.rgb = colorRamp(luminance, c1, c2, c3, c4);

    vec3 iriTone = mix(uColor1, uColor2, iriPhase);
    color.rgb = mix(color.rgb, iriTone, 0.15 * color.a);

    float sparkle = noise2D(fragCoord * 0.5 + uTime * 3.0) - 0.5;
    color.rgb += sparkle * 0.04 * color.a;

    float discMask = smoothstep(1.0, 0.99, radius);
    color.a *= uOpacity * discMask;
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    color.rgb *= color.a; // premultiplied — matches Skia output

    gl_FragColor = color;
}
`;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// Classic brand pair (ORB_TIME_OF_DAY_COLORS.day): lavender l6 → l8.
const COLOR1 = hexToRgb01("#D4C1F9");
const COLOR2 = hexToRgb01("#AB9EF5");

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error("[Orb] shader compile error:", gl.getShaderInfoLog(sh));
  }
  return sh;
}

export function Orb({
  playing,
  size = 200,
}: {
  playing: boolean;
  size?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Seven per-oval phase offsets, seeded once (matches the app).
    const offsets = Array.from({ length: 7 }, () => Math.random() * Math.PI * 2);

    const U = (name: string) => gl.getUniformLocation(prog, name);
    const uTime = U("uTime");
    const uAnimation = U("uAnimation");
    const uInputVolume = U("uInputVolume");
    const uOutputVolume = U("uOutputVolume");
    const uColor1 = U("uColor1");
    const uColor2 = U("uColor2");
    const uResolution = U("uResolution");

    gl.uniform1i(U("uPerlin") as WebGLUniformLocation, 0);
    gl.uniform1f(U("uInverted"), 0);
    gl.uniform1f(U("uOpacity"), 1);
    gl.uniform3fv(uColor1, COLOR1);
    gl.uniform3fv(uColor2, COLOR2);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    offsets.forEach((o, i) => gl.uniform1f(U(`uOffset${i}`), o));

    // Perlin noise texture with REPEAT wrap (256×256, power-of-two).
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([128, 128, 128, 255])
    );
    const img = new Image();
    img.src = "/orb-perlin.png";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);

    // Per-frame envelope — mirrors orb.tsx useFrameCallback exactly.
    let time = 0;
    let animation = 0;
    let animSpeed = 0.1;
    let inputVol = 0;
    let outputVol = 0.3;
    let prev = 0;
    let raf = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016);
      prev = now;
      time += dt;
      const t = time;

      // Resting orb gently breathes (a hero on the share page); playing
      // drives the app's full "talking" envelope. Both stay within the
      // app's own uniform ranges.
      let targetIn: number;
      let targetOut: number;
      if (playingRef.current) {
        targetIn = Math.max(0, Math.min(1, 0.65 + 0.22 * Math.sin(4.8 * t)));
        targetOut = Math.max(0, Math.min(1, 0.75 + 0.22 * Math.sin(3.6 * t)));
      } else {
        targetIn = Math.max(0, Math.min(1, 0.28 + 0.1 * Math.sin(1.1 * t)));
        targetOut = Math.max(0, Math.min(1, 0.45 + 0.08 * Math.sin(0.8 * t)));
      }
      inputVol += (targetIn - inputVol) * 0.2;
      outputVol += (targetOut - outputVol) * 0.2;

      const diff = outputVol - 1;
      const targetSpeed = 0.1 + (1 - diff * diff) * 0.9;
      animSpeed += (targetSpeed - animSpeed) * 0.12;
      animation += dt * animSpeed;

      gl.uniform1f(uTime, time);
      gl.uniform1f(uAnimation, animation);
      gl.uniform1f(uInputVolume, inputVol);
      gl.uniform1f(uOutputVolume, outputVol);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteTexture(tex);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="rounded-full"
      aria-hidden
    />
  );
}
