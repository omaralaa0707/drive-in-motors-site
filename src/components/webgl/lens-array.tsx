"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useWebglHealth } from "@/lib/use-webgl-health";

/**
 * Drive In Motors photograph every car from the same few feet of their own
 * kerb — a Jetour in daylight, a Changan and a Kaiyi after dark, the sign in
 * the same place in all three. One patch of pavement, a different car
 * depending on when you looked.
 *
 * So the hero is a real lenticular print: the three photographs are
 * interleaved into vertical strips under an array of cylindrical lenses, and
 * each pixel refracts through its own lenslet to decide which strip it is
 * imaging. It is not a cross-fade — the lens geometry does the choosing, which
 * is why the picture snaps between cars over a narrow band of angle, shows the
 * colour fringing a real lenticular gives at the switch, and carries the
 * lenslet ridges across its own surface.
 */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform sampler2D uC;
  uniform vec2 uRes;
  uniform vec2 uImage;   // source image pixel size
  uniform float uAngle;  // viewing angle, -1..1
  uniform float uPitch;  // lenslets across the panel
  uniform float uTime;

  const float N = 3.0;

  vec3 srgbToLinear(vec3 c) { return pow(c, vec3(2.2)); }

  /** Cover-fit: the centred uv is MULTIPLIED by the aspect correction, not
   *  divided — dividing is contain, and samples off the end of the map. */
  vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
    float rp = res.x / res.y;
    float ri = img.x / img.y;
    vec2 c = uv - 0.5;
    if (rp > ri) c.y *= ri / rp; else c.x *= rp / ri;
    return c + 0.5;
  }

  vec3 sampleStrip(float idx, vec2 uv) {
    float i = floor(mod(idx + 0.5, N));
    if (i < 0.5) return srgbToLinear(texture2D(uA, uv).rgb);
    if (i < 1.5) return srgbToLinear(texture2D(uB, uv).rgb);
    return srgbToLinear(texture2D(uC, uv).rgb);
  }

  /**
   * A lenslet magnifies ONE interleaved strip to fill its own width, so at any
   * given angle the whole array is imaging the same strip and you see one
   * whole picture — not three sliced together. Which strip that is depends on
   * the angle, plus a gradient across the panel because the viewer is at a
   * finite distance: that gradient is why the change sweeps across a real
   * lenticular instead of flipping everywhere at once.
   */
  float phaseAt(vec2 uv, float angle) {
    return angle * 1.05 + (uv.x - 0.5) * 0.40;
  }

  vec3 imageAt(vec2 uv, vec2 img, float angle) {
    float f = fract(phaseAt(uv, angle)) * N;
    float idx = floor(f);
    float frac = f - idx;
    // The strips only mix in a narrow band as one hands over to the next.
    float bw = 0.17;
    float m = smoothstep(1.0 - bw, 1.0, frac) * 0.5
            + (1.0 - smoothstep(0.0, bw, frac)) * 0.0;
    return mix(sampleStrip(idx, img), sampleStrip(idx + 1.0, img), m);
  }

  void main() {
    vec2 uv = vUv;
    vec2 img = coverUv(uv, uRes, uImage);

    // Chromatic split: a real array disperses, so the three channels do not
    // hand over at exactly the same angle. This is the fringe at the flip.
    vec3 col;
    col.r = imageAt(uv, img, uAngle + 0.013).r;
    col.g = imageAt(uv, img, uAngle).g;
    col.b = imageAt(uv, img, uAngle - 0.013).b;

    // The lenslets themselves: bright along each crown, dark into the seams.
    float local = fract(uv.x * uPitch) - 0.5;
    float across = abs(local) * 2.0;
    col *= 1.0 - 0.20 * pow(across, 2.2);
    col = mix(col, col * 0.52, smoothstep(0.90, 1.0, across) * 0.7);

    // A raking specular bar, the way a light catches ribbed plastic.
    float glare = exp(-pow((uv.x - (0.5 + uAngle * 0.30)) * 3.0, 2.0));
    col += vec3(0.13, 0.15, 0.20) * glare * (0.22 + 0.42 * (1.0 - across));

    // back to sRGB for the renderer's own output conversion
    gl_FragColor = vec4(pow(max(col, 0.0), vec3(1.0 / 2.2)), 1.0);
  }
`;

function makeUniforms() {
  return {
    uA: { value: null as THREE.Texture | null },
    uB: { value: null as THREE.Texture | null },
    uC: { value: null as THREE.Texture | null },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImage: { value: new THREE.Vector2(760, 950) },
    uAngle: { value: 0 },
    uPitch: { value: 54 },
    uTime: { value: 0 },
  };
}

function Array3({
  textures,
  angle,
}: {
  textures: THREE.Texture[];
  angle: React.RefObject<number>;
}) {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const [uniforms] = useState(makeUniforms);

  useEffect(() => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uA.value = textures[0];
    m.uniforms.uB.value = textures[1];
    m.uniforms.uC.value = textures[2];
    const img = textures[0].image as { width: number; height: number };
    m.uniforms.uImage.value.set(img.width, img.height);
    m.needsUpdate = true;
  }, [textures]);

  useEffect(() => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
    // Enough lenslets to read as an array, few enough to stay legible.
    m.uniforms.uPitch.value = size.width < 520 ? 34 : 54;
  }, [size, dpr]);

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    const d = Math.min(delta, 0.05);
    m.uniforms.uTime.value += d;
    const target = angle.current;
    const cur = m.uniforms.uAngle.value as number;
    m.uniforms.uAngle.value = cur + (target - cur) * Math.min(1, d * 5.5);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthTest={false}
      />
    </mesh>
  );
}

function canRenderWebgl() {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      c.getContext("webgl2") ?? c.getContext("webgl") ?? c.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function LensArray({
  sources,
  className,
  alt,
  fallback,
}: {
  sources: string[];
  className?: string;
  alt: string;
  fallback: string;
}) {
  const { lost, bind } = useWebglHealth();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [textures, setTextures] = useState<THREE.Texture[] | null>(null);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const angle = useRef(0);

  useEffect(() => {
    // A capability probe cannot leave the effect: reading `window` in a lazy
    // initialiser makes the first client render disagree with the HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(canRenderWebgl());
  }, []);

  // Loaded here rather than through a hook so the colour space can be set on
  // the texture — the compiler rules forbid mutating anything a hook returned.
  useEffect(() => {
    let live = true;
    const loader = new THREE.TextureLoader();
    Promise.all(
      sources.map(
        (src) =>
          new Promise<THREE.Texture>((res, rej) => {
            loader.load(
              src,
              (t) => {
                t.colorSpace = THREE.SRGBColorSpace;
                t.minFilter = THREE.LinearFilter;
                t.magFilter = THREE.LinearFilter;
                t.generateMipmaps = false;
                res(t);
              },
              undefined,
              rej,
            );
          }),
      ),
    )
      .then((ts) => {
        if (live) setTextures(ts);
        else ts.forEach((t) => t.dispose());
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [sources]);

  // Bound to the window and hit-tested: the copy plate is a sibling of this
  // wrapper, so a listener on the wrapper alone would never fire once anything
  // is layered over it.
  useEffect(() => {
    const set = (clientX: number) => {
      const r = hostRef.current?.getBoundingClientRect();
      if (!r || r.width === 0) return;
      const x = (clientX - r.left) / r.width;
      angle.current = Math.max(-1, Math.min(1, (x - 0.5) * 2.4));
    };
    const onMove = (e: PointerEvent) => set(e.clientX);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) set(t.clientX);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  if (lost || supported !== true || !textures) {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fallback} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div ref={hostRef} className={`lens-host ${className ?? ""}`} role="img" aria-label={alt}>
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          opacity: ready ? 1 : 0,
          transition: "opacity 800ms ease",
        }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false }}
        onCreated={({ gl }) => {
          bind(gl.domElement);
          setReady(true);
        }}
      >
        <Suspense fallback={null}>
          <Array3 textures={textures} angle={angle} />
        </Suspense>
      </Canvas>
    </div>
  );
}
