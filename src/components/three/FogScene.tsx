"use client";

import { useRef, useMemo, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const MAX_RIPPLES = 6;

function WildMountains() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const ripples = useRef<{ pos: THREE.Vector2; birth: number }[]>([]);
  const [, tick] = useState(0);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_ripples: { value: new Float32Array(MAX_RIPPLES * 3) },
      u_rippleCount: { value: 0 },
    }),
    []
  );

  const onClick = useCallback((e: THREE.Event) => {
    const uv = e.uv as THREE.Vector2;
    const r = ripples.current;
    r.push({ pos: uv.clone(), birth: performance.now() * 0.001 });
    if (r.length > MAX_RIPPLES) r.shift();
    tick((n) => n + 1);
  }, []);

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    const t = state.clock.elapsedTime;
    u.u_time.value = t;
    u.u_mouse.value.set(
      state.pointer.x * 0.5 + 0.5,
      state.pointer.y * 0.5 + 0.5
    );

    const data = u.u_ripples.value;
    let count = 0;
    for (let i = 0; i < ripples.current.length; i++) {
      const r = ripples.current[i];
      const age = t - r.birth;
      if (age < 3.5) {
        data[count * 3] = r.pos.x;
        data[count * 3 + 1] = r.pos.y;
        data[count * 3 + 2] = r.birth;
        count++;
      }
    }
    ripples.current = ripples.current.filter((r) => t - r.birth < 3.5);
    u.u_rippleCount.value = count;
  });

  const frag = `
    varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_ripples[${MAX_RIPPLES * 3}];
    uniform int u_rippleCount;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1.,0.)), f.x),
                 mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0, amp = 0.5;
      for (int i = 0; i < 5; i++) { v += amp * noise(p); p *= 2.0; amp *= 0.5; }
      return v;
    }

    void main() {
      vec2 uv = vUv;

      // ── SKY: moody, dramatic ──
      vec3 skyHigh = vec3(0.118, 0.149, 0.180);  // #1E2630 dark blue-grey
      vec3 skyMid  = vec3(0.153, 0.200, 0.216);  // #273338
      vec3 skyLow  = vec3(0.196, 0.243, 0.220);  // #323E38 forest tint
      float skyBlend = smoothstep(0.0, 0.6, uv.y);
      vec3 sky = mix(skyHigh, skyMid, skyBlend);
      sky = mix(sky, skyLow, smoothstep(0.4, 0.75, uv.y));

      // ── ATMOSPHERIC HAZE behind mountains ──
      float haze = fbm(uv * 4.0 + u_time * 0.03) * 0.08;

      // ── MOUNTAINS: jagged, wild, full-width ──
      float mt = 0.0;

      // Main dramatic peaks
      mt = max(mt, exp(-pow((uv.x - 0.12) / 0.22, 2.0)) * 0.62);  // central peak
      mt = max(mt, exp(-pow((uv.x - 0.48) / 0.18, 2.0)) * 0.55);  // right peak
      mt = max(mt, exp(-pow((uv.x + 0.38) / 0.20, 2.0)) * 0.58);  // left peak
      mt = max(mt, exp(-pow((uv.x + 0.70) / 0.16, 2.0)) * 0.42);  // far left
      mt = max(mt, exp(-pow((uv.x - 0.72) / 0.17, 2.0)) * 0.44);  // far right

      // Secondary ridges — wilder
      mt = max(mt, exp(-pow((uv.x + 0.05) / 0.35, 2.0)) * 0.35);
      mt = max(mt, exp(-pow((uv.x - 0.30) / 0.30, 2.0)) * 0.32);
      mt = max(mt, exp(-pow((uv.x + 0.55) / 0.28, 2.0)) * 0.28);

      // Jagged micro-peaks (procedural noise on ridge)
      float jagged = (noise(vec2(uv.x * 18.0, 0.5)) - 0.5) * 0.06;
      mt += jagged * smoothstep(0.25, 0.5, mt);

      // Foreground hills
      float fg = 0.0;
      fg = max(fg, exp(-pow((uv.x - 0.2) / 0.50, 2.0)) * 0.22);
      fg = max(fg, exp(-pow((uv.x + 0.35) / 0.55, 2.0)) * 0.18);
      fg = max(fg, exp(-pow((uv.x + 0.8) / 0.45, 2.0)) * 0.15);
      fg += (noise(vec2(uv.x * 12.0, 1.2)) - 0.5) * 0.04;

      // Mountain Y position — sits in lower half
      float ridgeY = 0.32 + mt;
      float fgY = 0.15 + fg;

      // Masks
      float mountainMask = smoothstep(ridgeY - 0.02, ridgeY + 0.005, uv.y);
      float fgMask = smoothstep(fgY - 0.015, fgY + 0.005, uv.y);

      // ── MOUNTAIN COLOR: deep forest greens ──
      vec3 mtBase  = vec3(0.102, 0.188, 0.145);  // #1A3025 forest
      vec3 mtMid   = vec3(0.141, 0.243, 0.180);  // #243E2E
      vec3 mtLight = vec3(0.176, 0.290, 0.216);  // #2D4A37

      // Texture on mountain faces
      float texScale = 60.0;
      float mtTex = fbm(uv * texScale + vec2(0.0, u_time * 0.01)) * 0.15;
      float ridgeLine = smoothstep(ridgeY - 0.04, ridgeY - 0.005, uv.y)
                      * (1.0 - mountainMask) * 0.3;
      vec3 mtCol = mix(mtBase, mtMid, mtTex + ridgeLine);
      mtCol = mix(mtCol, mtLight, smoothstep(0.28, 0.4, uv.y) * 0.3);

      // Tree texture — vertical streaks on slopes
      float trees = 0.0;
      for (int ti = 0; ti < 4; ti++) {
        float tx = uv.x * 40.0 + float(ti) * 7.3;
        float ty = uv.y * 60.0 + float(ti) * 11.7;
        trees += smoothstep(0.48, 0.52, noise(vec2(tx, ty))) * 0.04;
      }
      float onSlope = mountainMask * (1.0 - smoothstep(ridgeY - 0.02, ridgeY, uv.y));
      mtCol += trees * onSlope * vec3(0.02, 0.03, 0.01);

      // ── COMPOSITE BACKGROUND ──
      vec3 bg = sky + haze * vec3(0.06, 0.08, 0.04);
      bg = mix(bg, mtCol, mountainMask);
      // Foreground hills slightly lighter
      vec3 fgCol = mtCol * 1.15;
      bg = mix(bg, fgCol, fgMask * (1.0 - mountainMask));

      // ── FOG ──
      vec2 fogSt = uv * 2.8;
      vec2 mouse = u_mouse;

      // Force field
      vec2 toMouse = uv - mouse;
      float dist = length(toMouse);
      float force = exp(-dist * 4.0);
      float clearRadius = 0.38;

      // Vortex swirl
      float angle = atan(toMouse.y, toMouse.x);
      float swirl = force * 2.2;
      vec2 swirlUV = mouse + vec2(cos(angle + swirl), sin(angle + swirl)) * dist;
      float blend = force * smoothstep(0.06, 0.0, dist) * 0.75;
      vec2 sampleUV = mix(uv, swirlUV, blend);

      float fog1 = fbm(sampleUV * 2.5 + vec2(u_time * 0.04, u_time * 0.02));
      float fog2 = fbm(sampleUV * 1.3 + vec2(-u_time * 0.03, u_time * 0.04));
      float fog3 = fbm(sampleUV * 0.6 + vec2(u_time * 0.02, -u_time * 0.03));
      float fog = fog1 * 0.5 + fog2 * 0.35 + fog3 * 0.15;

      // Mouse clearing
      float clearZone = smoothstep(0.0, clearRadius, dist);
      float mouseClear = mix(0.1, 1.0, clearZone);

      // Ripples
      float rippleClear = 1.0;
      for (int ri = 0; ri < ${MAX_RIPPLES}; ri++) {
        if (ri >= u_rippleCount) break;
        int idx = ri * 3;
        vec2 rp = vec2(u_ripples[idx], u_ripples[idx+1]);
        float rb = u_ripples[idx+2];
        float ra = u_time - rb;
        if (ra < 0.0 || ra > 3.5) continue;
        float rd = distance(uv, rp);
        float ring = smoothstep(ra*0.1-0.01, ra*0.1, rd)
                   * (1.0-smoothstep(ra*0.1, ra*0.1+0.1, rd));
        rippleClear *= 1.0 - ring * (1.0-smoothstep(0.0, 3.5, ra)) * 0.85;
      }

      float fogClear = mouseClear * rippleClear;

      // Fog density — heavier in valleys
      float valley = smoothstep(0.2, 0.7, uv.y);
      float fogDensity = mix(0.3, 1.0, valley);
      float fogAlpha = fog * fogClear * fogDensity * 0.78;

      // Fog color — cool mist
      vec3 fogCol = mix(vec3(0.75, 0.78, 0.76), vec3(0.65, 0.70, 0.67), fog * 0.5);

      // ── COMPOSITE ──
      vec3 color = mix(bg, fogCol, clamp(fogAlpha, 0.0, 0.94));

      // Vignette
      float vignette = 1.0 - smoothstep(0.4, 1.5, length(uv - 0.5) * 1.6) * 0.35;
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh onClick={onClick}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }"
        fragmentShader={frag}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function MistScene() {
  return (
    <div className="absolute -inset-4 z-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        style={{
          background: "#1E2630",
        }}
      >
        <WildMountains />
      </Canvas>
    </div>
  );
}
