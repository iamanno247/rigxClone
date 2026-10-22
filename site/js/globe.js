(async()=>{const _e=document.getElementById("hero"),F=_e?.querySelector(".hero__sticky"),w=document.getElementById("stage"),ve=document.getElementById("heroHint"),ct=document.getElementById("stageLoader"),ut=document.getElementById("globePins"),dt=document.getElementById("motionToggle"),ft=document.getElementById("nav"),X=document.getElementById("heroContent"),Y=window.RIGX&&window.RIGX.globe;if(!F||!w||!Y)return;const C=matchMedia("(prefers-reduced-motion: reduce)").matches,so="/assets/geo/countries-110m.json?v=JRbJFYZ8e6",pt=e=>{[ct,ve,w,ut].forEach(t=>t?.remove()),console.warn("RIGX globe:",e)};await new Promise(e=>requestAnimationFrame(()=>setTimeout(e,0)));let a,ge,ue;try{[a,ge,ue]=await Promise.all([import("/js/vendor/three.globe.min.js?v=t3ERJxItBn"),window.topojson||Promise.reject(new Error("topojson missing")),fetch(so).then(e=>{if(!e.ok)throw new Error("map "+e.status);return e.json()})])}catch(e){return pt(e)}const E=()=>globalThis.scheduler?.yield?scheduler.yield():new Promise(e=>setTimeout(e,0));await E();let A;const He=matchMedia("(pointer: coarse), (max-width: 799px)").matches,z=He;try{A=new a.WebGLRenderer({canvas:w,antialias:!He,alpha:!0,powerPreference:"high-performance"})}catch(e){return pt(e)}A.setClearColor(0,0);const ht=[];for(const e of document.styleSheets)try{for(const t of e.cssRules)t.selectorText===":root"&&ht.push(t.style)}catch{}const xe=e=>{const t=ht.map(o=>o.getPropertyValue(e).trim()).find(Boolean)||getComputedStyle(document.documentElement).getPropertyValue(e).trim();return new a.Color(t)},lo=xe("--ink-2"),ye=xe("--paper"),Ge=xe("--accent"),Q=xe("--accent-hi"),P=Math.PI/180,Z=e=>Math.min(1,Math.max(0,e)),S=(e,t,o)=>e+(t-e)*o,Ie=(e,t,o)=>{const n=Z((o-e)/(t-e));return n*n*(3-2*n)},co=e=>Math.atan2(Math.sin(e),Math.cos(e)),de=(e,t,o=1)=>new a.Vector3(Math.cos(e*P)*Math.sin(t*P),Math.sin(e*P),Math.cos(e*P)*Math.cos(t*P)).multiplyScalar(o),uo=(e,t,o,n)=>e.clone().multiplyScalar(Math.sin((1-n)*o)).add(t.clone().multiplyScalar(Math.sin(n*o))).divideScalar(Math.sin(o));await E();const ie=new a.Scene,mt=30,fo=Math.tan(mt/2*P),B=new a.PerspectiveCamera(mt,1,.1,60),L=new a.Group;ie.add(L);const Fe=(e,t)=>z?new a.MeshLambertMaterial(e):new a.MeshStandardMaterial({...e,...t}),ke=new a.Mesh(new a.SphereGeometry(1,z?64:128,z?40:96),Fe({color:lo},{roughness:.95,metalness:0}));L.add(ke);const vt=new a.DirectionalLight(16777215,3.6);vt.position.set(-3,3.2,4);const gt=new a.DirectionalLight(Q,1.5);gt.position.set(4.5,.6,-3),ie.add(vt,gt,new a.AmbientLight(16777215,.2));const po=new a.Mesh(new a.SphereGeometry(1.012,z?64:96,z?40:64),new a.ShaderMaterial({transparent:!0,depthWrite:!1,side:a.FrontSide,uniforms:{uCol:{value:Q}},vertexShader:`
    varying float vRim;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vRim = 1.0 - abs(dot(normalize(normalMatrix * normal), normalize(-mv.xyz)));
      gl_Position = projectionMatrix * mv;
    }`,fragmentShader:`
    uniform vec3 uCol;
    varying float vRim;
    void main() {
      float a = pow(vRim, 7.0) * 0.38;
      if (a < 0.004) discard;
      gl_FragColor = vec4(uCol, a);
      #include <colorspace_fragment>
    }`}));ie.add(po),await E();const xt=ge.feature(ue,ue.objects.countries).features;window.RIGX.geo={topojson:ge,countries:xt};const k=Y.pins.map((e,t)=>({...e,i:t,v:de(e.lat,e.lng)})),re={...Y.hub,hub:!0,v:de(Y.hub.lat,Y.hub.lng)},yt=[...new Set(k.map(e=>e.country).filter(Boolean))];k.forEach(e=>e.ci=e.country?yt.indexOf(e.country)+1:0);const wt=yt.map(e=>{const t=window.RIGX.shapes&&window.RIGX.shapes[e],o=t?{geometry:t}:xt.find(n=>n.id===e);return o?(o.geometry.type==="Polygon"?[o.geometry.coordinates]:o.geometry.coordinates).map(n=>{let i=180,r=-180,d=90,u=-90;return n[0].forEach(([l,h])=>{i=Math.min(i,l),r=Math.max(r,l),d=Math.min(d,h),u=Math.max(u,h)}),{poly:n,box:[i,r,d,u]}}):null}),ho=(e,t,o)=>{let n=!1;for(let i=0,r=o.length-1;i<o.length;r=i++){const[d,u]=o[i],[l,h]=o[r];u>t!=h>t&&e<(l-d)*(t-u)/(h-u)+d&&(n=!n)}return n},bt=(e,t)=>{for(let o=0;o<wt.length;o++)for(const{poly:n,box:i}of wt[o]||[]){if(e<i[0]||e>i[1]||t<i[2]||t>i[3])continue;let r=!1;for(const d of n)ho(e,t,d)&&(r=!r);if(r)return o+1}return 0};await E();const ee=z?1024:2048,we=ee/2,De=document.createElement("canvas");De.width=ee,De.height=we;const se=De.getContext("2d",{willReadFrequently:!0});se.fillStyle="#fff";const Mt=ge.feature(ue,ue.objects.land);(Mt.features||[Mt]).forEach(({geometry:e})=>{(e.type==="Polygon"?[e.coordinates]:e.coordinates).forEach(t=>{const o=t.map(n=>{let i=null,r=0;return n.map(([d,u])=>{let l=d+r;return i!==null&&l-i>180?(r-=360,l-=360):i!==null&&l-i<-180&&(r+=360,l+=360),i=l,[l,u]})});se.beginPath(),[-360,0,360].forEach(n=>o.forEach(i=>i.forEach(([r,d],u)=>{const l=(r+n+180)/360*ee,h=(90-d)/180*we;u?se.lineTo(l,h):se.moveTo(l,h)}))),se.fill("evenodd")})});const mo=se.getImageData(0,0,ee,we).data;await E();const qe=z?256:320,Rt=Math.round(qe*.47),Pt=[],St=[],Oe=[];for(let e=0;e<Rt;e++){const t=90-(e+.5)*180/Rt;if(t<-58)break;e%12===11&&await E();const o=Math.round(qe*Math.cos(t*P));for(let n=0;n<o;n++){const i=-180+(n+(e&1)*.5)*360/o,r=Math.min(ee-1,Math.floor((i+180)/360*ee)),d=Math.floor((90-t)/180*we);if(mo[(d*ee+r)*4+3]<128)continue;const u=de(t,i,1.002);Pt.push(u.x,u.y,u.z);const l=bt(i,t);St.push(l),Oe.push({lat:t,lng:i,ci:l})}}const Lt=360/qe*P*.64,vo=.008,Ct=.03,go=.075,be=1+Ct;await E();const le=new a.BoxGeometry(1,1,1).translate(0,.5,0);{const e=Array.from(le.index.array);le.setIndex([...e.slice(0,18),...e.slice(24)]),le.clearGroups()}const Et=z?new a.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,1,0):le;[...new Set([le,Et])].forEach(e=>{const t=e.attributes.position,o=[];for(let n=0;n<t.count;n++){const i=.35+.65*t.getY(n);o.push(i,i,i)}e.setAttribute("color",new a.Float32BufferAttribute(o,3))});const xo=new a.Vector3(0,1,0),Me=new a.Vector3,ce=new a.Vector3,Tt=new a.Vector3,At=new a.Matrix4;function zt(e,t,o){return Me.copy(de(e,t)),ce.crossVectors(xo,Me),ce.lengthSq()<1e-8&&ce.set(1,0,0),ce.normalize(),Tt.crossVectors(ce,Me),At.makeBasis(ce.multiplyScalar(Lt),Me.clone().multiplyScalar(o),Tt.multiplyScalar(Lt)),At.setPosition(de(e,t,.998))}const Re=Oe.filter(e=>!e.ci),$e=Oe.filter(e=>e.ci),yo=ye.clone().multiplyScalar(.95),Ve=10,Bt=.075,Xe={uPops:{value:Array.from({length:Ve},()=>new a.Vector4(0,0,1,0))},uPopHi:{value:Q}},_t=`
uniform vec4 uPops[${Ve}];
varying float vPop;`,Ht=`
      vec3 popBase = normalize(vec3(instanceMatrix[3]));
      float pop = 0.0;
      for (int i = 0; i < ${Ve}; i++) {
        vec4 q = uPops[i];
        if (q.w < 0.002) continue;
        float a = acos(clamp(dot(popBase, q.xyz), -1.0, 1.0)) / ${Bt.toFixed(3)};
        pop = max(pop, q.w * exp(-a * a));
      }
      vPop = pop;`,Gt=(e,t)=>{e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform vec3 uPopHi;
varying float vPop;`).replace("#include <color_fragment>",`#include <color_fragment>
      diffuseColor.rgb = mix(diffuseColor.rgb, uPopHi, ${t} * vPop);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      totalEmissiveRadiance += uPopHi * 0.3 * vPop;`)},It=Fe({color:yo,vertexColors:!0},{roughness:.78,metalness:0});It.onBeforeCompile=e=>{Object.assign(e.uniforms,Xe),e.vertexShader=e.vertexShader.replace("#include <common>","#include <common>"+_t).replace("#include <begin_vertex>",`#include <begin_vertex>${Ht}
      transformed.y *= 1.0 + 2.2 * pop;`),Gt(e,"0.85")};const Ft=new a.InstancedMesh(Et,It,Re.length);for(let e=0;e<Re.length;e++)Ft.setMatrixAt(e,zt(Re[e].lat,Re[e].lng,vo)),e%2e3===1999&&await E();L.add(Ft);const kt=le.clone();kt.setAttribute("aLit",new a.InstancedBufferAttribute(new Float32Array($e.map(e=>e.ci)),1));const _={uHot:{value:0},uRise:{value:0},uPrev:{value:0},uFall:{value:0},uLitH:{value:Ct},uHotH:{value:go}},Dt=Fe({color:Q,emissive:Ge,emissiveIntensity:.45,vertexColors:!0},{roughness:.55,metalness:0});Dt.onBeforeCompile=e=>{Object.assign(e.uniforms,_,Xe),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float aLit;
uniform float uHot, uRise, uPrev, uFall, uLitH, uHotH;`+_t).replace("#include <begin_vertex>",`#include <begin_vertex>${Ht}
      float lift = (abs(aLit - uHot) < 0.5 ? uRise : 0.0) + (abs(aLit - uPrev) < 0.5 ? uFall : 0.0);
      transformed.y *= mix(uLitH, uHotH, clamp(lift, 0.0, 1.0)) * (1.0 + 0.35 * pop);`),Gt(e,"0.5")};const qt=new a.InstancedMesh(kt,Dt,$e.length);$e.forEach((e,t)=>qt.setMatrixAt(t,zt(e.lat,e.lng,1))),L.add(qt);const fe=[re,...k];fe.forEach((e,t)=>{e.level=fe.slice(0,t).filter(n=>n.v.angleTo(e.v)<11*P).length,e.len=.1+e.level*.13,e.base=e.v.clone().multiplyScalar(be+.002),e.tip=e.v.clone().multiplyScalar(be+e.len),e.stemMat=new a.LineBasicMaterial({color:ye,transparent:!0,opacity:.5}),L.add(new a.Line(new a.BufferGeometry().setFromPoints([e.base,e.tip]),e.stemMat)),e.discMat=new a.MeshBasicMaterial({color:e.hub?ye:Q,transparent:!0,side:a.DoubleSide});const o=new a.Mesh(new a.CircleGeometry(e.hub?.018:.013,28),e.discMat);if(o.position.copy(e.v).multiplyScalar(be+.003),o.lookAt(e.v.clone().multiplyScalar(2)),L.add(o),e.hub){const n=new a.Mesh(new a.RingGeometry(.03,.036,40),e.discMat);n.position.copy(o.position),n.quaternion.copy(o.quaternion),L.add(n)}}),await E();const We=z?64:128,je=z?4:6,Ne=.24,pe=[];for(const[e,t]of k.filter(o=>o.v.angleTo(re.v)>14*P).entries()){e%2===1&&await E();const o=t.v.angleTo(re.v),n=Math.min(.32,.05+o*.17),i=[];for(let h=0;h<=64;h++){const G=h/64;i.push(uo(t.v,re.v,o,G).multiplyScalar(be+.004+Math.sin(Math.PI*G)*n))}const r=new a.CatmullRomCurve3(i),d=new a.LineBasicMaterial({color:Ge,transparent:!0,opacity:.7}),u=new a.Line(new a.BufferGeometry().setFromPoints(r.getPoints(160)),d),l=new a.Mesh(new a.TubeGeometry(r,We,.0055,je,!1),new a.MeshBasicMaterial({color:Q}));L.add(u,l),pe.push({p:t,trailMat:d,tube:l,off:e*.37%1})}const wo=(e,t)=>{const o=Math.floor(Z(t)*We),n=Math.ceil(Z(t+Ne)*We);e.tube.geometry.setDrawRange(o*je*6,Math.max(0,n-o)*je*6)};C&&pe.forEach(e=>e.tube.geometry.setDrawRange(0,1/0));const Pe=32,he=4,Ye=(new URLSearchParams(location.search).get("bg")||Y.background||"pixels")==="contours"?"contours":"pixels",Ot=`
  uniform vec2 uRes, uShift;
  uniform float uPx, uTime, uNow, uReveal;
  uniform vec3 uGlobe, uPtr, uLine, uHi;
  uniform vec4 uQuiet;                                         // the headline's box: lines calm down behind it
  uniform float uQuietA;
  uniform vec3 uTrail[${Pe}];
  uniform vec3 uRip[${he}];

  // 3D simplex noise: Ashima Arts / Stefan Gustavson (MIT)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

`,bo=Ot+`
  float wave;                                                  // how much a shockwave is passing here (lights lines up)
  float height(vec2 fc) {
    vec2 p = (fc - 0.5 * uRes) / uRes.y + uShift;             // screen-height units, drifts with scroll/cursor
    vec3 q = vec3(p * 1.3, uTime * 0.04);
    float h = snoise(q) * 0.6 + snoise(q * 2.1 + vec3(7.3, 1.7, 3.1)) * 0.2;
    wave = 0.0;
    float dg = length(fc - uGlobe.xy) / uGlobe.z;              // distance from the globe, in globe radii
    h += 1.3 * exp(-0.55 * dg);                                // the summit it stands on: contours ring it
    for (int i = 0; i < ${Pe}; i++) {                       // the cursor's trail lifts the ground
      vec3 t = uTrail[i];
      if (t.z <= 0.001) continue;
      vec2 d = (fc - t.xy) / (uPx * 120.0);
      h += t.z * 0.035 * exp(-dot(d, d));                     // shallow per point: a moving cursor leaves a wake, not a spike
    }
    for (int i = 0; i < ${he}; i++) {                        // shockwaves from clicks / taps
      vec3 r = uRip[i];
      float age = uNow - r.z;
      if (age < 0.0 || age > 2.6) continue;
      float x = (length(fc - r.xy) / uPx - age * 420.0) / 70.0;
      float k = exp(-x * x) * (1.0 - age / 2.6);
      h += 0.4 * k;
      wave += k;
    }
    return h;
  }

  void main() {
    vec2 fc = gl_FragCoord.xy;
    float v = height(fc) * 9.0;                                // 9 contour intervals per unit of height
    float w = max(fwidth(v), 1e-5);
    float d = abs(fract(v + 0.5) - 0.5) / w;                   // distance to the nearest contour, device px
    float index = 1.0 - step(0.5, mod(floor(v + 0.5), 5.0));   // every fifth line is an index contour (survey maps)
    float lw = uPx * mix(0.5, 0.8, index);
    float line = 1.0 - smoothstep(lw, lw + 1.0, d);
    vec2 cd = (fc - uPtr.xy) / (uPx * 190.0);
    float near = min(1.0, exp(-dot(cd, cd)) * uPtr.z + wave);  // lines around the cursor (and under a shockwave) light up violet
    vec2 qd = max(uQuiet.xy - fc, fc - uQuiet.zw);
    float quiet = (1.0 - smoothstep(-10.0 * uPx, 60.0 * uPx, max(qd.x, qd.y))) * uQuietA;
    float a = line * mix(0.075, 0.17, index) * (1.0 + near * 5.0) * (1.0 - 0.55 * quiet);
    if (a < 0.004) discard;
    gl_FragColor = vec4(mix(uLine, uHi, near), min(a, 0.8));
    #include <colorspace_fragment>
  }`,Mo=Ot+`
  // ordered dithering: 8×8 Bayer threshold map, built from 2×2 steps
  float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
  float bayer8(vec2 a) { return bayer2(0.25 * a) * 0.0625 + bayer2(0.5 * a) * 0.25 + bayer2(a); }
  float hash(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
  uniform sampler2D uGlow;                                     // per-pixel glow, kept between frames
  uniform float uHole;                                         // radius of the clear space round the cursor (canvas px)

  void main() {
    vec2 id = floor(gl_FragCoord.xy);
    vec2 fc = id + 0.5;
    float thr = bayer8(id);                                    // this pixel switches on once the tone passes its threshold
    vec2 p = (fc - 0.5 * uRes) / uRes.y + uShift;
    float n = snoise(vec3(p * 1.5, uTime * 0.05)) * 0.65 + snoise(vec3(p * 3.4 + 4.0, uTime * 0.08)) * 0.35;
    float tone = smoothstep(-0.35, 0.75, n) * 0.7;             // open ground with drifting patches of pixels
    float dg = length(fc - uGlobe.xy) / uGlobe.z;              // distance from the globe, in globe radii
    tone *= smoothstep(1.02, 1.5, dg);                         // a clear margin round the globe
    vec2 qd = max(uQuiet.xy - fc, fc - uQuiet.zw);
    float quiet = (1.0 - smoothstep(-10.0 * uPx, 60.0 * uPx, max(qd.x, qd.y))) * uQuietA;
    tone *= 1.0 - 0.8 * quiet;                                 // calm behind the headline
    tone *= clamp(uReveal * 4.0 - dg * 0.35, 0.0, 1.0);        // on load the field resolves outward from the globe

    // round the cursor: a small clear space, then a loose scatter of glowing pixels that fades out
    // (g is a ring kept in the glow buffer; it fades in ~0.15 s and out ~0.7 s, pixel by pixel)
    if (uPtr.z > 0.5 && length(fc - uPtr.xy) < uHole) discard;   // the clear space: even the field steps aside
    float g = texture2D(uGlow, fc / uRes).r;
    float h = hash(id);
    float sh = snoise(vec3(p * 26.0, uTime * 1.1)) * 0.5 + 0.5; // fine flicker: which pixels glow keeps changing, without clumping
    bool glowOn = h < g * (0.2 + 0.24 * sh);                   // scattered single pixels, not a solid ring
    float k = g * (0.6 + 0.4 * hash(id + 17.0));               // each at its own brightness
    float lit = smoothstep(0.02, 0.3, g);
    float act = 0.0;
    for (int i = 0; i < ${he}; i++) {                        // click / tap: a ring of pixels rolls out
      vec3 r = uRip[i];
      float age = uNow - r.z;
      if (age < 0.0 || age > 2.2) continue;
      float x = (length(fc - r.xy) / uPx - age * 380.0) / 26.0;
      act = max(act, exp(-x * x) * exp(-1.4 * age) * 1.1);
    }
    // below a floor nothing lights: in an 8×8 Bayer map 1 pixel in 64 has a zero threshold, and faint
    // tails would otherwise switch on a regular lattice of stray pixels
    bool hot = act > max(thr, 0.06);
    bool on = tone > max(thr, 0.05);
    if (!hot && !on && !glowOn) discard;
    float bright = step(thr, (tone - 0.3) * 1.6);              // the densest patches get a second, brighter grey
    if (hot) gl_FragColor = vec4(uHi, 0.9);
    else if (glowOn) gl_FragColor = vec4(mix(uHi, uLine, 0.35 * k * k), 0.4 + 0.58 * k);   // glowing pixel; the brightest run paler
    else gl_FragColor = vec4(mix(uLine, uHi, lit), (0.09 + 0.1 * bright) * (1.0 + 1.6 * lit));  // field pixels in the ring warm up too
    #include <colorspace_fragment>
  }`,Ro=`
  uniform sampler2D uPrev;
  uniform vec2 uRes;
  uniform vec4 uBrush;                                         // cursor now (xy) and last frame (zw), canvas px
  uniform float uOn, uDt, uR, uHole;
  float segDist(vec2 q, vec2 a, vec2 b) { vec2 qa = q - a, ba = b - a; float t = clamp(dot(qa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0); return length(qa - ba * t); }
  void main() {
    vec2 fc = gl_FragCoord.xy;
    float old = texture2D(uPrev, fc / uRes).r;
    float d = segDist(fc, uBrush.zw, uBrush.xy);              // the whole path since last frame: no gaps on fast moves
    // a ring: nothing right round the cursor, brightest just outside that, fading out to uR
    float ring = smoothstep(uHole, uHole * 1.8, d) * (1.0 - smoothstep(uHole * 1.8, uR, d));
    float target = uOn * ring;
    float v = target > old ? min(target, old + uDt / 0.15) : max(target, old - uDt / 0.7);   // fade in 0.15 s, fade out 0.7 s
    v *= smoothstep(uHole * 0.8, uHole, length(fc - uBrush.xy));   // the space round the cursor stays clear, even of a fading wake
    gl_FragColor = vec4(v, 0.0, 0.0, 1.0);
  }`;await E();const x=(()=>{const e=A,t={uRes:{value:new a.Vector2(1,1)},uShift:{value:new a.Vector2},uPx:{value:1},uTime:{value:0},uNow:{value:0},uReveal:{value:0},uGlobe:{value:new a.Vector3(0,0,100)},uPtr:{value:new a.Vector3},uQuiet:{value:new a.Vector4(0,0,0,0)},uQuietA:{value:0},uLine:{value:ye},uHi:{value:Q},uTrail:{value:Array.from({length:Pe},()=>new a.Vector3)},uRip:{value:Array.from({length:he},()=>new a.Vector3(0,0,-99))},uGlow:{value:null},uHole:{value:4}},o=new a.BufferGeometry;o.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const n=new a.Mesh(o,new a.ShaderMaterial({uniforms:t,blending:a.NoBlending,depthTest:!1,depthWrite:!1,vertexShader:"void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:(Ye==="pixels"?Mo:bo).replace("#include <colorspace_fragment>","gl_FragColor = sRGBTransferOETF(gl_FragColor);")}));n.frustumCulled=!1;const i=new a.Scene;i.add(n);const r=new a.Camera,d=Ye==="pixels"?a.NearestFilter:a.LinearFilter,u=new a.WebGLRenderTarget(1,1,{minFilter:d,magFilter:d,depthBuffer:!1}),l={uTex:{value:u.texture},uView:{value:new a.Vector2(1,1)},uDpr:{value:1},uGrid:{value:new a.Vector2(1,1)}},h=new a.Mesh(o,new a.ShaderMaterial({uniforms:l,transparent:!0,depthTest:!1,depthWrite:!1,vertexShader:"void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`
      uniform sampler2D uTex; uniform vec2 uView, uGrid; uniform float uDpr;
      void main() {
        vec2 css = vec2(gl_FragCoord.x, uView.y - gl_FragCoord.y) / uDpr;
        gl_FragColor = texture2D(uTex, vec2(css.x, uGrid.y - css.y) / uGrid);
      }`}));h.frustumCulled=!1;const G=new a.Scene;G.add(h);const rt={minFilter:a.NearestFilter,magFilter:a.NearestFilter,depthBuffer:!1};let $=null,I=null;const V={uPrev:{value:null},uRes:t.uRes,uBrush:{value:new a.Vector4(-1e4,-1e4,-1e4,-1e4)},uOn:{value:0},uDt:{value:.016},uR:{value:10},uHole:{value:4}},st=new a.Mesh(o,new a.ShaderMaterial({uniforms:V,depthTest:!1,depthWrite:!1,vertexShader:"void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Ro}));st.frustumCulled=!1;const s=new a.Scene;return s.add(st),{u:t,mode:Ye,px:1,hc:1,resize(c,v){if(this.mode==="pixels"){const g=c<600?5:6,f=Math.ceil(c/g),p=Math.ceil(v/g);this.px=1/g,this.hc=p*g,u.setSize(f,p),$?($.setSize(f,p),I.setSize(f,p)):($=new a.WebGLRenderTarget(f,p,rt),I=new a.WebGLRenderTarget(f,p,rt)),l.uGrid.value.set(f*g,p*g),t.uRes.value.set(f,p)}else this.px=Math.min(devicePixelRatio,1.5),this.hc=v,u.setSize(Math.round(c*this.px),Math.round(v*this.px)),l.uGrid.value.set(c,v),t.uRes.value.set(Math.round(c*this.px),Math.round(v*this.px));e.getDrawingBufferSize(l.uView.value),l.uDpr.value=e.getPixelRatio(),t.uPx.value=this.px},glow(c,v,g,f,p,H,b,j){$&&(V.uPrev.value=$.texture,V.uOn.value=c,V.uDt.value=H,V.uR.value=b,V.uHole.value=j,V.uBrush.value.set(v,g,f,p),e.setRenderTarget(I),e.render(s,r),e.setRenderTarget(null),[$,I]=[I,$],t.uGlow.value=$.texture)},render(){e.setRenderTarget(u),e.render(i,r),e.setRenderTarget(null)},draw(){e.render(G,r)},compile(){return Promise.all([e.compileAsync(i,r),e.compileAsync(s,r),e.compileAsync(G,r)])},read(c,v,g,f){this.render();const p=new Uint8Array(g*f*4);return e.readRenderTargetPixels(u,c,v,g,f,p),p}}})();await E();const W=e=>String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);fe.forEach(e=>{const t=document.createElement(e.hub?"a":"button");if(t.className="pin"+(e.hub?" pin--hub":""),e.hub)t.href="#network",t.innerHTML=`<b>${W(e.label)}</b><small>${W(e.note)}</small>`,t.setAttribute("aria-label",`${e.label}: ${e.note}. See the network`);else{t.type="button";const o=Math.min(18,Math.sqrt(300/(e.ratio||1))),n=e.logo?`<i class="brand-logo" role="img" aria-label="${W(e.name)}" style="--logo:url('${W(new URL(e.logo,location.href).href)}');color:${W(e.color||"currentColor")};width:${(o*(e.ratio||1)).toFixed(1)}px;height:${o.toFixed(1)}px"></i>`:W(e.name);t.innerHTML=`<span class="pin__logo">${n}</span><span class="pin__cc">${W(e.cc)}</span><span class="pin__meta"><b>${W(e.maker)}</b><small>${W(e.place)}</small></span>`,t.setAttribute("aria-label",`${e.name} (${e.maker}), based in ${e.place}. ${Y.clickAction==="scroll"?`Show ${e.name} in Brands we've worked with`:"Show every brand from there on a map"}`),t.addEventListener("mouseenter",()=>te(e.i,"chip")),t.addEventListener("mouseleave",()=>te(-1,"chip")),t.addEventListener("focus",()=>te(e.i,"chip")),t.addEventListener("blur",()=>te(-1,"chip")),t.addEventListener("click",()=>{const i=t.getBoundingClientRect();$t(e.i,i.left+i.width/2,i.top+i.height/2)})}ut.appendChild(t),e.el=t});let D=-1,Se="";function te(e,t){e===D||e<0&&t!==Se&&D>=0||(D=e,Se=e>=0?t:"",_.uPrev.value=_.uHot.value,_.uFall.value=_.uRise.value,_.uHot.value=e>=0?k[e].ci:0,_.uRise.value=0,k.forEach(o=>o.el.classList.toggle("is-hot",o.i===e)),pe.forEach(o=>{o.trailMat.opacity=e<0||o.p.i===e?.7:.25,o.trailMat.color.copy(o.p.i===e?Q:Ge)}),Te=!0)}function $t(e,t,o){const n=k[e];if(n){if(Y.clickAction!=="scroll"&&n.country&&window.RIGX.showCountry)return window.RIGX.showCountry(n.country,{x:t,y:o,cc:n.cc});n.brand&&window.RIGX.openBrand&&window.RIGX.openBrand(n.brand)}}const Vt=.07;let oe=-60*P,q=.32,U=0,ne=0,Qe=C?0:Vt,Le=!C,Ue=0,Ce=performance.now(),Je=0;const Po=performance.now();let m=null;const Ee={x:0,y:0},J={x:0,y:0},K=[],Xt=[],T={x:-1e4,y:-1e4},O={x:-1e4,y:-1e4};let Ke=!1,Ze=0;const So=2500,Wt=30;let jt=0,et=-1e9,Lo=0,tt=0,Nt=0,Yt=0;const ot=()=>{Yt=performance.now()+2500};addEventListener("pointerdown",ot,{passive:!0}),addEventListener("pointermove",ot,{passive:!0}),addEventListener("scroll",ot,{passive:!0});const Qt=(e,t,o,n)=>{K.push({x:e,y:t,t:n,s:o}),K.length>Pe&&K.shift()},Co=(e,t)=>{!C&&x&&(Xt[Lo++%he]={x:e,y:t,t:performance.now()/1e3})};let M=1,R=1,nt=!0,Ut=1,Jt=0,Te=!0;const y={cx:0,cy:0,r:100};function at(){M=F.clientWidth,R=F.clientHeight,nt=innerWidth>800&&innerWidth/innerHeight>1,Ut=Math.min(devicePixelRatio,He?1.5:2),A.setPixelRatio(Ut),A.setSize(M,R,!1),x?.resize(M,R),Jt=X?X.offsetTop+X.offsetHeight:R*.5,Te=!0}await E(),addEventListener("resize",at),at();function Eo(e){if(nt){const i=Math.min(R*.36,M*.25),r=Math.min(R*.4,M*.3);return{cx:S(M*.71,M*.5,e),cy:S(R*.53,R*.52,e),r:S(i,r,e)}}const t=Jt+64,o=Math.min(M*.42,Math.max((R-t)*.46,M*.34),340),n=Math.min(M*.44,R*.3,380);return{cx:M/2,cy:S(t+o,R*.5,e),r:S(o,n,e)}}function To(){const e=y.cx-M/2,t=y.cy-R/2,o=M+2*Math.abs(e),n=R+2*Math.abs(t);B.aspect=o/n,B.setViewOffset(o,n,o/2-y.cx,n/2-y.cy,M,R);const i=y.r/(n/(2*fo)),r=Math.sqrt(1+1/(i*i));B.position.set(J.x*.35,-J.y*.25,r),B.lookAt(0,0,0),B.updateProjectionMatrix()}const Ae=new a.Raycaster,ze=new a.Vector2,Kt=(e,t,o=1)=>{const n=w.getBoundingClientRect();return Math.hypot(e-n.left-y.cx,t-n.top-y.cy)<y.r*o};function Zt(e,t,o=!1){const n=w.getBoundingClientRect();ze.set((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1),Ae.setFromCamera(ze,B);const i=Ae.intersectObject(ke)[0];if(!i)return-1;const r=L.worldToLocal(i.point.clone()).normalize();let d=-1,u=(o?12:7)*P;if(k.forEach((l,h)=>{const G=l.v.angleTo(r);G<u&&(u=G,d=h)}),d<0){const l=bt(Math.atan2(r.x,r.z)/P,Math.asin(r.y)/P);l&&(d=k.findIndex(h=>h.ci===l))}return d}const ae={x:0,y:0,on:!1};function Ao(e,t){const o=w.getBoundingClientRect();ze.set((e-o.left)/o.width*2-1,-((t-o.top)/o.height)*2+1),Ae.setFromCamera(ze,B);const n=Ae.intersectObject(ke)[0];return n?L.worldToLocal(n.point.clone()).normalize():null}w.addEventListener("pointerdown",e=>{if(!Kt(e.clientX,e.clientY,1.12)){const t=F.getBoundingClientRect();Co(e.clientX-t.left,e.clientY-t.top);return}m={id:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:performance.now(),t0:performance.now(),moved:0,touch:e.pointerType!=="mouse"},U=ne=0;try{w.setPointerCapture(e.pointerId)}catch{}w.classList.add("is-dragging")}),w.addEventListener("pointermove",e=>{if(m&&e.pointerId===m.id){const n=performance.now(),i=Math.max(1,n-m.t)/1e3,r=e.clientX-m.x,d=e.clientY-m.y,u=1/y.r;m.x=e.clientX,m.y=e.clientY,m.t=n,m.moved+=Math.abs(r)+Math.abs(d),oe+=r*u,q=Math.max(-.7,Math.min(1,q+d*u)),U=S(U,r*u/i,.5),ne=S(ne,d*u/i,.5);return}if(e.pointerType!=="mouse")return;ae.x=e.clientX,ae.y=e.clientY,ae.on=!0;const t=Kt(e.clientX,e.clientY,1.12),o=t?Zt(e.clientX,e.clientY):-1;Se!=="chip"&&te(o,"globe"),w.classList.toggle("is-point",o>=0),w.classList.toggle("is-grab",t&&o<0)});const eo=e=>{if(!m||e.pointerId!==m.id)return;const t=Math.hypot(e.clientX-m.x0,e.clientY-m.y0);if((m.touch?t<16&&performance.now()-m.t0<600:m.moved<6)&&e.type==="pointerup"){const n=Zt(m.x0,m.y0,m.touch);n>=0&&(U=ne=0,$t(n,m.x0,m.y0))}performance.now()-m.t>80&&(U=ne=0),m=null,Je=performance.now(),w.classList.remove("is-dragging")};w.addEventListener("pointerup",eo),w.addEventListener("pointercancel",eo),w.addEventListener("pointerleave",()=>{ae.on=!1}),w.addEventListener("pointerleave",()=>{Se==="globe"&&te(-1,"globe"),w.classList.remove("is-point","is-grab")}),addEventListener("pointermove",e=>{const t=F.getBoundingClientRect(),o=e.clientX-t.left,n=e.clientY-t.top,i=performance.now();if(e.pointerType==="mouse"?(Ee.x=e.clientX/innerWidth*2-1,Ee.y=e.clientY/innerHeight*2-1,et=i,Ke=!0):Ze=i+350,T.x=o,T.y=n,C)return;const r=K[K.length-1];(r?Math.hypot(o-r.x,n-r.y):1e9)>18&&(Qt(o,n,1,i),jt=i)},{passive:!0}),document.documentElement.addEventListener("mouseleave",()=>{Ke=!1}),addEventListener("pointerdown",e=>{if(e.pointerType==="mouse")return;const t=F.getBoundingClientRect();T.x=O.x=e.clientX-t.left,T.y=O.y=e.clientY-t.top,Ze=performance.now()+350},{passive:!0}),dt?.addEventListener("click",()=>{Le=!dt.classList.contains("is-paused")});const it=new a.Vector3,to=new a.Vector3,oo=new a.Vector3,zo=-re.lng*P,Bo=re.lat*P*.9;let no=[];const me=(e,t,o)=>{const n=e._rigx||={};n[t]!==o&&(n[t]=o,e.style[t]=o)},Be=e=>(Math.round(e*devicePixelRatio)/devicePixelRatio).toFixed(2),ao=()=>X.style.opacity===""?1:+X.style.opacity;function io(e){if(requestAnimationFrame(io),z&&e-Ce<(m||D>=0||e<Yt?9.5:28))return;const t=Math.min(.05,(e-Ce)/1e3);Ce=e;const o=_e.getBoundingClientRect();if(o.bottom<=0)return;(F.clientWidth!==M||F.clientHeight!==R)&&at();const n=_e.offsetHeight-R,i=n>0?Z(-o.top/n):0,r=Ie(.06,.5,i);if(!m){oe+=U*t,q+=ne*t;const s=Math.exp(-t*2.6);U*=s,ne*=s;const c=D>=0||Math.abs(U)>.02||window.RIGX.countryOpen;if(Qe=S(Qe,Le&&!c?Vt*(1-r):0,1-Math.exp(-t*2)),oe+=Qe*t,r>.001){const v=1-Math.exp(-t*5*r);oe+=co(zo-oe)*v,q+=(Bo-q)*v}else e-Je>1500&&(q+=(.32-q)*(1-Math.exp(-t*.8)));q=Math.max(-.7,Math.min(1,q))}L.rotation.set(q,oe,0,"XYZ");const d=1-Math.exp(-t*(C?60:7));_.uRise.value=S(_.uRise.value,_.uHot.value?1:0,d),_.uFall.value=S(_.uFall.value,0,d);const u=1-Math.exp(-t*3);J.x=S(J.x,C?0:Ee.x,u),J.y=S(J.y,C?0:Ee.y,u),Object.assign(y,Eo(r)),To();const l=ae.on&&!C?(L.updateMatrixWorld(),Ao(ae.x,ae.y)):null,h=Xe.uPops.value;if(l&&((h[0].w<.002||l.dot(h[0])<Math.cos(Bt*.5))&&(h.unshift(h.pop()),h[0].w=h[1].w),h[0].set(l.x,l.y,l.z,h[0].w)),h.forEach((s,c)=>{s.w=c===0&&l?S(s.w,1,1-Math.exp(-t*14)):s.w*Math.exp(-t*3.5)}),Le&&(Ue+=t),C||pe.forEach(s=>{const c=D===s.p.i?.5:.3;wo(s,(Ue*c+s.off)%1*(1+Ne)-Ne)}),x){if(x.mode==="contours"&&!C&&Le&&e-et>3500){const f=e/1e3,p=y.cx+Math.cos(f*.21)*y.r*1.5+Math.sin(f*.13)*y.r*.4,H=y.cy+Math.sin(f*.17)*y.r*1.1,b=K[K.length-1];(!b||Math.hypot(p-b.x,H-b.y)>18)&&(Qt(p,H,.7,e),jt=e)}const s=x.u,c=x.px,v=x.hc;s.uReveal.value=C?1:Z((e-Po)/1700);const g=Ke&&e-et<So;if(tt=S(tt,g?1:0,1-Math.exp(-t*4)),s.uTime.value=Ue,s.uNow.value=e/1e3,s.uShift.value.set(J.x*.03,-i*.45-J.y*.02),s.uGlobe.value.set(y.cx*c,(v-y.cy)*c,y.r*c),s.uPtr.value.set(T.x*c,(v-T.y)*c,tt),X){const f=F.getBoundingClientRect(),p=X.getBoundingClientRect();s.uQuiet.value.set((p.left-f.left)*c,(v-(p.bottom-f.top))*c,(p.right-f.left)*c,(v-(p.top-f.top))*c),s.uQuietA.value=ao()}if(s.uTrail.value.forEach((f,p)=>{const H=K[p];if(!H)return f.set(0,0,0);const b=Z(1-(e-H.t)/1800);f.set(H.x*c,(v-H.y)*c,H.s*b*b)}),Xt.forEach((f,p)=>s.uRip.value[p].set(f.x*c,(v-f.y)*c,f.t)),x.mode==="pixels"){const f=!C&&(g||e<Ze)?1:0;Math.hypot(T.x-O.x,T.y-O.y)>260&&(O.x=T.x,O.y=T.y),s.uHole.value=Wt*c,f&&(Nt=e+1500),e<Nt&&x.glow(f,T.x*c,(v-T.y)*c,O.x*c,(v-O.y)*c,t,120*c,Wt*c),O.x=T.x,O.y=T.y}x.render()}L.updateMatrixWorld(),x?(x.draw(),A.autoClear=!1,A.render(ie,B),A.autoClear=!0):A.render(ie,B),Te&&(no=fe.map(s=>[s.el.offsetWidth,s.el.offsetHeight]),Te=!1);const G=ft?ft.getBoundingClientRect().bottom:0,$=X&&ao()>.3?[...X.children].map(s=>s.getBoundingClientRect()):[],I=F.getBoundingClientRect();B.getWorldPosition(oo);const V=[];fe.map((s,c)=>{it.copy(s.tip).applyMatrix4(L.matrixWorld),to.copy(s.v).transformDirection(L.matrixWorld);const v=to.dot(oo.clone().sub(it).normalize()),g=it.clone().project(B);return{m:s,n:c,facing:v,x:(g.x*.5+.5)*M,y:(-g.y*.5+.5)*R}}).sort((s,c)=>(c.m.i===D)-(s.m.i===D)||c.facing-s.facing).forEach(({m:s,n:c,facing:v,x:g,y:f})=>{const[p,H]=no[c];g=Math.min(M-p/2-10,Math.max(p/2+10,g));const b={l:g-p/2-4,r:g+p/2+4,t:f-H-8,b:f};let j=Ie(.1,.35,v);const ro=N=>b.l<N.right&&b.r>N.left&&b.t<N.bottom&&b.b>N.top;j>0&&s.i!==D&&(V.some(ro)||$.some(N=>ro({left:N.left-I.left,right:N.right-I.left,top:N.top-I.top,bottom:N.bottom-I.top}))||b.t<G-I.top)&&(j=0),j>.05&&V.push({left:b.l,right:b.r,top:b.t,bottom:b.b}),s.opS=C?j:S(s.opS??0,j,1-Math.exp(-t*14)),Math.abs(s.opS-j)<.01&&(s.opS=j);const lt=Math.round(s.opS*50)/50;me(s.el,"transform",`translate3d(${Be(g)}px, ${Be(f)}px, 0) translate(-50%, calc(-100% - 4px))`),me(s.el,"opacity",String(lt)),me(s.el,"visibility",lt>.05?"visible":"hidden"),s.stemMat.opacity=.5*lt,s.discMat.opacity=Ie(-.05,.2,v)}),ve&&(me(ve,"transform",`translate3d(${Be(y.cx)}px, ${Be(y.cy+y.r+26)}px, 0) translate(-50%, 0)`),me(ve,"opacity",nt?(.9*(1-Z(i/.06))).toFixed(2):"0"))}await E();try{await Promise.all([A.compileAsync(ie,B),x?.compile()])}catch{}ct?.classList.add("is-done"),requestAnimationFrame(e=>{Ce=e,Je=e,io(e)}),window.__rigxGlobe={get layout(){return{...y}},get yaw(){return oe},get hot(){return D},lite:z,get triangles(){return A.info.render.triangles},get calls(){return A.info.render.calls},dots:Pt.length/3,litDots:St.filter(Boolean).length,pins:k.map(e=>e.name),routes:pe.length,setHot:e=>te(e,"chip"),probe(e,t,o,n){if(!x)return null;const i=x.px,r=x.read(Math.round(e*i),Math.round((x.hc-t-n)*i),Math.max(1,Math.round(o*i)),Math.max(1,Math.round(n*i)));let d=0,u=0;for(let l=0;l<r.length;l+=4)d=Math.max(d,r[l+3]),r[l+3]>8&&(u=Math.max(u,r[l+2]-r[l+1]));return{maxAlpha:d,violet:u}},get terrain(){return x&&{mode:x.mode,now:x.u.uNow.value,rip:x.u.uRip.value.map(e=>e.toArray().map(t=>+t.toFixed(2))),trail:x.u.uTrail.value.filter(e=>e.z>0).length}}}})();
