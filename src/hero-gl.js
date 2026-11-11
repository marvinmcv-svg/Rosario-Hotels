import * as THREE from 'three';

// Simplex noise (Ashima Arts / Ian McEwan, MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uTex0; uniform sampler2D uTex1;
uniform vec2 uImg0; uniform vec2 uImg1; uniform vec2 uRes;
uniform float uProgress; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
varying vec2 vUv;
${NOISE}
vec2 cover(vec2 uv, vec2 img, float zoom){
  float rs = uRes.x/uRes.y, ri = img.x/img.y;
  vec2 s = rs < ri ? vec2(rs/ri, 1.) : vec2(1., ri/rs);
  return (uv - .5) * s / zoom + .5;
}
void main(){
  vec2 uv = vUv;
  vec2 par = (uMouse - .5) * vec2(-.018, -.012);
  float n = snoise(vec3(uv * vec2(2.2, 1.6), uTime * .06));
  float n2 = snoise(vec3(uv * 7., uTime * .12 + 4.));

  // tide front sweeping up and across like water over salt
  float edge = (1. - uv.y) * .55 + uv.x * .45 + n * .22 + n2 * .03;
  float th = mix(-.45, 1.45, uProgress);
  float m = smoothstep(th - .22, th, edge);          // 1 = still old image
  float front = m * (1. - m) * 4.;                  // peaks at the moving edge

  // gentle cursor lens
  vec2 aspect = vec2(uRes.x / uRes.y, 1.);
  float d = distance(uv * aspect, uMouse * aspect);
  float lens = exp(-d * 4.5) * .012;
  vec2 toM = normalize(uv - uMouse + 1e-5) * lens;

  float zoom0 = 1.04 + uProgress * .12 + uScroll * .08;
  float zoom1 = 1.18 - uProgress * .14 + uScroll * .08;
  vec2 warp = vec2(n, n2) * front * .07;

  vec2 uv0 = cover(uv + par + warp + toM, uImg0, zoom0);
  vec2 uv1 = cover(uv + par - warp + toM, uImg1, zoom1);

  // chromatic split only along the front
  float ca = front * .006;
  vec3 c0 = vec3(texture2D(uTex0, uv0 + vec2(ca, 0.)).r, texture2D(uTex0, uv0).g, texture2D(uTex0, uv0 - vec2(ca, 0.)).b);
  vec3 c1 = vec3(texture2D(uTex1, uv1 - vec2(ca, 0.)).r, texture2D(uTex1, uv1).g, texture2D(uTex1, uv1 + vec2(ca, 0.)).b);
  vec3 col = mix(c1, c0, m);

  // salt-light shimmer on the front
  col += vec3(1., .93, .82) * front * .12 * (.6 + .4 * n2);

  // scroll darkening, vignette, grain
  col *= 1. - uScroll * .55;
  float vig = smoothstep(1.25, .35, length((uv - .5) * vec2(1.1, 1.3)));
  col *= mix(.72, 1., vig);
  float grain = fract(sin(dot(uv * uRes + uTime * 60., vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - .5) * .035;
  gl_FragColor = vec4(col, 1.);
}`;

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;

export function createHero(canvas, sources) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const loader = new THREE.TextureLoader();

  const uniforms = {
    uTex0: { value: null }, uTex1: { value: null },
    uImg0: { value: new THREE.Vector2(3, 2) }, uImg1: { value: new THREE.Vector2(3, 2) },
    uRes: { value: new THREE.Vector2(1, 1) },
    uProgress: { value: 0 }, uTime: { value: 0 }, uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(.5, .5) },
  };
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag }));
  scene.add(mesh);

  const textures = [];
  const ready = Promise.all(sources.map((src, i) => new Promise((res, rej) => {
    loader.load(src, (t) => {
      // sampled raw: values stay in sRGB, which is what the canvas expects
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      textures[i] = t;
      res(t);
    }, undefined, rej);
  }))).then(() => {
    setPair(0, 1);
  });

  function setPair(a, b) {
    const ta = textures[a], tb = textures[b];
    uniforms.uTex0.value = ta; uniforms.uTex1.value = tb;
    uniforms.uImg0.value.set(ta.image.width, ta.image.height);
    uniforms.uImg1.value.set(tb.image.width, tb.image.height);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  const target = new THREE.Vector2(.5, .5);
  window.addEventListener('pointermove', (e) => {
    target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  }, { passive: true });

  let running = true;
  function render(time) {
    if (!running || !uniforms.uTex0.value) return;
    uniforms.uTime.value = time;
    uniforms.uMouse.value.lerp(target, .06);
    renderer.render(scene, camera);
  }

  return {
    ready,
    uniforms,
    setPair,
    render,
    setRunning(v) { running = v; },
    count: sources.length,
  };
}
