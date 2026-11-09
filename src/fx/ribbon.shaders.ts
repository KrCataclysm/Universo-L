export const vertex = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
varying float vGlow;
varying float vMix;
void main() {
  vec3 p = position;
  float t = uTime * 0.28;
  float w = sin(p.x * 0.85 + t + p.y * 0.55) * 0.62
          + sin(p.x * 1.65 - t * 1.25 + p.y * 1.05) * 0.30
          + sin(p.y * 1.9 + t * 0.8) * 0.18;
  p.z = w * 1.35;
  p.y += sin(p.x * 0.55 + t) * 0.7 + uMouse.y * 0.45;
  p.x += uMouse.x * 0.35 * (p.y * 0.15);
  float fold = smoothstep(-1.2, 1.4, w);
  vGlow = 0.18 + fold * 0.82;
  vMix = (position.x + 6.0) / 12.0;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
}
`

export const fragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying float vGlow;
varying float vMix;
void main() {
  vec3 col = mix(mix(uA, uB, smoothstep(0.0, 0.55, vMix)), uC, smoothstep(0.45, 1.0, vMix));
  gl_FragColor = vec4(col * (0.55 + vGlow * 0.9), vGlow * 0.85);
}
`
