precision mediump float;
varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisp;
uniform float uMix;
uniform float uDispFactor;
void main() {
  vec2 disp = texture2D(uDisp, vUv).rg;
  vec2 dispVec = (disp * 2.0 - 1.0) * uDispFactor;
  vec2 uv1 = vUv + dispVec * (1.0 - uMix);
  vec2 uv2 = vUv - dispVec * uMix;
  vec4 tex1 = texture2D(uTexture1, uv1);
  vec4 tex2 = texture2D(uTexture2, uv2);
  vec4 final = mix(tex1, tex2, uMix);
  gl_FragColor = final;
}
