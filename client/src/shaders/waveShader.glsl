precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float noise(vec2 p){
  return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

float smoothstep(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

float smoothNoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = noise(i);
  float b = noise(i + vec2(1.0, 0.0));
  float c = noise(i + vec2(0.0, 1.0));
  float d = noise(i + vec2(1.0, 1.0));

  vec2 u = f*f*(3.0-2.0*f);

  return mix(a, b, u.x) +
         (c - a)*u.y*(1.0 - u.x) +
         (d - b)*u.x*u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 mouse = u_mouse / u_resolution.xy;
  
  float t = u_time * 0.3;
  
  float wave = sin(uv.x * 3.14 + t) * 0.5 + 0.5;
  wave += sin(uv.y * 3.14 + t * 0.7) * 0.3;
  
  float distort = smoothNoise(uv * 4.0 + t) * 0.2;
  
  vec3 col = mix(
    vec3(0.1, 0.3, 0.8),
    vec3(0.2, 0.5, 1.0),
    wave + distort
  );
  
  float dist = distance(uv, mouse);
  col += vec3(0.3, 0.5, 1.0) * (0.3 / (dist + 0.1)) * 0.1;
  
  gl_FragColor = vec4(col, 0.95);
}
