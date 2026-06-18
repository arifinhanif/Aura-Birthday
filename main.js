/* ══════════════════════════════
   PHOTOS + PRELOAD / LOADING SCREEN
   (images are now real files referenced directly via src="assets/img/..." in the HTML —
    no more base64 key-swapping, which removes the timing bug from earlier versions)
══════════════════════════════ */
const PHOTO_PATHS = [
  'assets/img/sky1.jpg','assets/img/sky2.jpg',
  'assets/img/flower1.jpg','assets/img/flower2.jpg','assets/img/flower3.jpg',
  'assets/img/masjid.jpg','assets/img/cherry.jpg',
  'assets/img/moment1.jpg','assets/img/moment2.jpg','assets/img/moment3.jpg',
  'assets/img/book.jpg'
];

/* Lightbox data — order matches openLightbox(index) calls in markup */
const LB_DATA = [
  {src:'assets/img/sky1.jpg',    cap:'langit itu luasnya sepertimu ✦',                 meta:'Chapter 01 · The Sky That Reminds Me Of You'},
  {src:'assets/img/sky2.jpg',    cap:'warna favoritmu, warna ketenanganmu 💙',          meta:'Chapter 01 · The Sky That Reminds Me Of You'},
  {src:'assets/img/flower1.jpg', cap:'merah seperti keberanianmu 🌺',                   meta:'Chapter 02 · Little Things Are Beautiful'},
  {src:'assets/img/flower2.jpg', cap:'putih seperti hatimu 🤍',                         meta:'Chapter 02 · Little Things Are Beautiful'},
  {src:'assets/img/flower3.jpg', cap:'cantik bahkan saat gugur ✿',                     meta:'Chapter 02 · Little Things Are Beautiful'},
  {src:'assets/img/masjid.jpg',  cap:'di sini hatinya menemukan tenang 🌙',             meta:'Chapter 03 · A Place Full Of Peace'},
  {src:'assets/img/cherry.jpg',  cap:'kebeningan dalam setiap detik yang ia jalani 🌸', meta:'Chapter 03 · A Place Full Of Peace'},
  {src:'assets/img/moment1.jpg', cap:'bunga kering yang diawetkan seperti kenangan ✦', meta:'Chapter 04 · Some Moments Are Worth Keeping'},
  {src:'assets/img/moment2.jpg', cap:'biru adalah warnanya, warna langitnya 💙',        meta:'Chapter 04 · Some Moments Are Worth Keeping'},
  {src:'assets/img/moment3.jpg', cap:'mengalir dengan tenang, seperti Aura 🪼',         meta:'Chapter 04 · Some Moments Are Worth Keeping'},
];
let lbIdx = 0;
function openLightbox(i){
  lbIdx = i;
  const img = document.getElementById('lb-img');
  img.classList.remove('loaded');
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
}
function renderLightbox(){
  const d = LB_DATA[lbIdx];
  const img = document.getElementById('lb-img');
  img.classList.remove('loaded');
  img.src = d.src;
  img.alt = d.cap;
  document.getElementById('lb-cap').textContent = d.cap;
  document.getElementById('lb-meta').textContent = d.meta;
  if(img.complete){
    requestAnimationFrame(()=>requestAnimationFrame(()=>img.classList.add('loaded')));
  } else {
    img.onload = ()=>img.classList.add('loaded');
  }
}
function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); }
function lbNav(dir){ lbIdx = (lbIdx + dir + LB_DATA.length) % LB_DATA.length; renderLightbox(); }
document.getElementById('lightbox').addEventListener('click', e=>{ if(e.target.id==='lightbox') closeLightbox(); });
document.addEventListener('keydown', e=>{
  if(!document.getElementById('lightbox').classList.contains('open')) return;
  if(e.key==='Escape') closeLightbox();
  if(e.key==='ArrowRight') lbNav(1);
  if(e.key==='ArrowLeft') lbNav(-1);
});
let lbTouchX=null;
document.querySelector('.lb-stage').addEventListener('touchstart', e=>{ lbTouchX = e.touches[0].clientX; });
document.querySelector('.lb-stage').addEventListener('touchend', e=>{
  if(lbTouchX===null) return;
  const dx = e.changedTouches[0].clientX - lbTouchX;
  if(Math.abs(dx) > 40) lbNav(dx > 0 ? -1 : 1);
  lbTouchX = null;
});

/* Loading screen: wait for all photo + audio assets to be genuinely decoded, then reveal password gate */
function runLoadingScreen(){
  const fillEl = document.getElementById('ld-fill');
  const pctEl = document.getElementById('ld-pct');
  const assets = PHOTO_PATHS;
  let loaded = 0;
  const total = assets.length + 1; // +1 for audio
  function bump(){
    loaded++;
    const pct = Math.round((loaded/total)*100);
    fillEl.style.width = pct + '%';
    pctEl.textContent = 'PREPARING THE UNIVERSE · ' + pct + '%';
    if(loaded >= total) finishLoading();
  }
  assets.forEach(src=>{
    const im = new Image();
    im.onload = bump; im.onerror = bump;
    im.src = src;
  });
  // audio readiness is bumped once src is assigned later (see music init)
  window.__bumpAudioLoad = bump;
  // Safety net: never block longer than ~4s even on slow devices
  setTimeout(()=>{ if(loaded < total){ loaded = total; fillEl.style.width='100%'; pctEl.textContent='PREPARING THE UNIVERSE · 100%'; finishLoading(); } }, 4000);
}
let loadingDone = false;
function finishLoading(){
  if(loadingDone) return; loadingDone = true;
  setTimeout(()=>{
    document.getElementById('ld').classList.add('gone');
    setTimeout(()=>{
      document.getElementById('ld').style.display='none';
      document.getElementById('pw').style.display='flex';
    }, 1200);
  }, 350);
}
runLoadingScreen();

/* ══════════════════════════════
   CURSOR
══════════════════════════════ */
const cd=document.getElementById('cd'), cr=document.getElementById('cr');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px'});
(function animR(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(animR)})();
document.querySelectorAll('button,.pol,.el,.stlb,.thing-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>cr.style.transform='translate(-50%,-50%) scale(1.9)');
  el.addEventListener('mouseleave',()=>cr.style.transform='translate(-50%,-50%) scale(1)');
});
if('ontouchstart' in window){document.getElementById('cur').style.display='none';document.body.style.cursor='auto'}

/* MAGNETIC HOVER — buttons gently follow the cursor within their bounds */
document.querySelectorAll('.pw-btn,.sb-btn,.mb-btn,.lb-close,.lb-prev,.lb-next').forEach(el=>{
  if('ontouchstart' in window) return;
  el.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2) * .28;
    const dy = (e.clientY - r.top - r.height/2) * .28;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform = ''; });
});

/* ══════════════════════════════
   STAR BACKGROUND CANVAS
══════════════════════════════ */
const sc=document.getElementById('sc'),sctx=sc.getContext('2d');
let stars=[];
function resizeSC(){sc.width=window.innerWidth;sc.height=window.innerHeight;initS()}
function initS(){
  stars=[];
  const n=Math.floor(sc.width*sc.height/2800);
  for(let i=0;i<n;i++) stars.push({x:Math.random()*sc.width,y:Math.random()*sc.height,r:Math.random()*1.4+.25,o:Math.random(),s:Math.random()*.005+.002,d:Math.random()>.5?1:-1});
}
function drawS(){
  sctx.clearRect(0,0,sc.width,sc.height);
  stars.forEach(s=>{s.o+=s.s*s.d;if(s.o>1||s.o<.08)s.d*=-1;sctx.beginPath();sctx.arc(s.x,s.y,s.r,0,Math.PI*2);sctx.fillStyle=`rgba(147,197,253,${s.o})`;sctx.fill()});
  requestAnimationFrame(drawS);
}
window.addEventListener('resize',resizeSC);
resizeSC(); drawS();

/* AMBIENT SHOOTING STARS */
function spawnShootingStar(){
  const s = document.createElement('div');
  s.className = 'shoot';
  const startX = Math.random()*window.innerWidth*.6 + window.innerWidth*.2;
  const startY = Math.random()*window.innerHeight*.3;
  const len = 140 + Math.random()*120;
  const angle = 18 + Math.random()*10;
  s.style.left = startX+'px'; s.style.top = startY+'px';
  document.body.appendChild(s);
  const rad = angle*Math.PI/180;
  const dx = Math.cos(rad)*len, dy = Math.sin(rad)*len;
  s.animate([
    {transform:'translate(0,0) scaleX(1)', opacity:0},
    {transform:'translate('+(dx*.15)+'px,'+(dy*.15)+'px) scaleX(1)', opacity:1, offset:.15},
    {transform:'translate('+dx+'px,'+dy+'px) scaleX(.3)', opacity:0}
  ], {duration: 900+Math.random()*400, easing:'cubic-bezier(.3,.6,.4,1)'});
  setTimeout(()=>s.remove(), 1400);
}
function scheduleShootingStars(){
  spawnShootingStar();
  setTimeout(scheduleShootingStars, 6000 + Math.random()*9000);
}
setTimeout(scheduleShootingStars, 4000);

/* ══════════════════════════════
   CLICK SPARKS
══════════════════════════════ */
const spArr=['✦','★','♡','·','✿'];
document.addEventListener('click',e=>{
  if(e.target.closest('#pw')||e.target.closest('#intro')) return;
  for(let i=0;i<4;i++){
    const s=document.createElement('div');s.className='sp';
    s.textContent=spArr[Math.floor(Math.random()*spArr.length)];
    s.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;color:${['#7dd3fc','#93c5fd','#60a5fa','#e0f2fe'][i%4]};animation-delay:${i*.07}s;font-size:${8+Math.random()*9}px`;
    document.body.appendChild(s);setTimeout(()=>s.remove(),1200);
  }
});

/* ══════════════════════════════
   PASSWORD
══════════════════════════════ */
const PASSWORD='01072025';
function checkPw(){
  const v=document.getElementById('pw-in').value.trim();
  if(v===PASSWORD){
    handleGesture();
    pwExplode();
    document.getElementById('pw').classList.add('gone');
    setTimeout(()=>{document.getElementById('pw').style.display='none'; startIntro()},1400);
  } else {
    const err=document.getElementById('pw-err');
    err.classList.add('show');setTimeout(()=>err.classList.remove('show'),2600);
    document.getElementById('pw-in').value='';
    const inp=document.getElementById('pw-in');
    inp.style.borderColor='rgba(249,168,212,.45)';setTimeout(()=>inp.style.borderColor='',700);
    inp.animate([
      {transform:'translateX(0)'},{transform:'translateX(-9px)'},{transform:'translateX(8px)'},
      {transform:'translateX(-6px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}
    ], {duration:420, easing:'ease-out'});
  }
}
document.getElementById('pw-in').addEventListener('keydown',e=>{if(e.key==='Enter')checkPw()});

function pwExplode(){
  const area=document.getElementById('pw-ptcl');
  for(let i=0;i<65;i++){
    const p=document.createElement('div');
    const angle=Math.random()*360,dist=80+Math.random()*220;
    const tx=Math.cos(angle*Math.PI/180)*dist, ty=Math.sin(angle*Math.PI/180)*dist;
    p.style.cssText=`position:absolute;width:${3+Math.random()*6}px;height:${3+Math.random()*6}px;background:${['#3b82f6','#7dd3fc','#93c5fd','#60a5fa','#e0f2fe'][i%5]};border-radius:50%;left:50%;top:50%;animation:pex ${.8+Math.random()*1}s ease-out ${Math.random()*.3}s forwards`;
    p.style.setProperty('--tx',tx+'px');p.style.setProperty('--ty',ty+'px');
    area.appendChild(p);setTimeout(()=>p.remove(),1600);
  }
}
const pxSt=document.createElement('style');
pxSt.textContent='@keyframes pex{0%{opacity:1;transform:translate(-50%,-50%) scale(0)}100%{opacity:0;transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(1)}}';
document.head.appendChild(pxSt);

/* ══════════════════════════════
   CINEMATIC INTRO
══════════════════════════════ */
function startIntro(){
  const el=document.getElementById('intro');
  el.style.display='flex';
  requestAnimationFrame(()=>{ el.style.opacity='1'; });
  setTimeout(()=>document.getElementById('il1').classList.add('v'),500);
  setTimeout(()=>document.getElementById('il2').classList.add('v'),1900);
  setTimeout(()=>document.getElementById('iname').classList.add('v'),3400);
  setTimeout(()=>document.getElementById('idate').classList.add('v'),4200);
  setTimeout(()=>{
    el.style.opacity='';
    el.classList.add('gone');
    setTimeout(()=>{
      el.style.display='none';
      document.getElementById('site').style.opacity='1';
      document.getElementById('mbar').style.display='flex';
      document.getElementById('secnav').classList.add('show');
      startMusic();
      const heroLr=document.getElementById('lr-target');
      if(heroLr){ setTimeout(()=>revealLetters(heroLr), 250); }
    },1400);
  },5800);
}

/* ══════════════════════════════
   MUSIC — HTML5 Audio + real-time Web Audio analyser
══════════════════════════════ */
let playing=false;
const audioEl=document.getElementById('audio-player');
const vizEls=[];
const mbViz=document.getElementById('mb-viz');
const VIZ_BARS = 18;
for(let i=0;i<VIZ_BARS;i++){const b=document.createElement('div');b.className='vb';b.style.setProperty('--h','5px');mbViz.appendChild(b);vizEls.push(b)}
function setViz(on){vizEls.forEach(b=>b.classList.toggle('p',on))}
function updUI(){document.getElementById('mb-t').textContent='Sampai Jadi Debu';document.getElementById('mb-a').textContent='Banda Neira'}

let audioCtx=null, analyser=null, freqData=null, vizSourceConnected=false, vizRAF=null;
let silentFrameCount=0;
const SILENT_FRAME_LIMIT = 90; // ~1.5s at 60fps before falling back to idle motion
function ensureAudioGraph(){
  if(vizSourceConnected) return;
  try{
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(audioEl);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    freqData = new Uint8Array(analyser.frequencyBinCount);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
    vizSourceConnected = true;
  }catch(err){ vizSourceConnected = false; }
}
function drawRealViz(){
  vizRAF = requestAnimationFrame(drawRealViz);
  if(!playing) return;
  let gotRealData = false;
  if(analyser){
    analyser.getByteFrequencyData(freqData);
    const sum = freqData.reduce((a,b)=>a+b,0);
    if(sum > 0){
      gotRealData = true;
      silentFrameCount = 0;
      const step = Math.floor(freqData.length / VIZ_BARS) || 1;
      for(let i=0;i<VIZ_BARS;i++){
        const v = freqData[i*step] || 0;
        const h = Math.max(3, (v/255)*26);
        vizEls[i].style.height = h+'px';
        vizEls[i].style.animation = 'none';
      }
    }
  }
  if(!gotRealData){
    silentFrameCount++;
    // Fallback: gentle idle wave so the bar never looks frozen/broken
    // (covers rare devices/browsers where the analyser can't read data)
    if(silentFrameCount > SILENT_FRAME_LIMIT){
      const t = performance.now()/260;
      for(let i=0;i<VIZ_BARS;i++){
        const h = 4 + Math.abs(Math.sin(t + i*0.5)) * 9;
        vizEls[i].style.height = h+'px';
        vizEls[i].style.animation = 'none';
      }
    }
  }
}
requestAnimationFrame(drawRealViz);

function handleGesture(){
  if(!audioEl.currentSrc) return;
  ensureAudioGraph();
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
  audioEl.volume=0;
  audioEl.play().then(()=>{
    playing=true;
    document.getElementById('mb-play').textContent='⏸';
    setViz(true);
    let vol=0;
    const fi=setInterval(()=>{vol=Math.min(vol+0.03,1);audioEl.volume=vol;if(vol>=1)clearInterval(fi)},80);
  }).catch(()=>{});
}
function startMusic(){
  updUI();
}
function togPlay(){
  if(!audioEl.currentSrc) return;
  ensureAudioGraph();
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
  if(playing){
    audioEl.pause();playing=false;
    document.getElementById('mb-play').textContent='▶';setViz(false);
  } else {
    audioEl.play();playing=true;
    document.getElementById('mb-play').textContent='⏸';setViz(true);
  }
}
let muted=false, prevVol=1;
function toggleMute(){
  muted=!muted;
  const btn=document.getElementById('mb-mute');
  if(muted){ prevVol=audioEl.volume; audioEl.volume=0; btn.textContent='🔇'; }
  else { audioEl.volume=prevVol||1; btn.textContent='🔊'; }
}
function seekTrack(e){
  if(!audioEl.duration) return;
  const track=document.getElementById('mbar-progress');
  const r=track.getBoundingClientRect();
  const pct=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));
  audioEl.currentTime = pct*audioEl.duration;
}
audioEl.addEventListener('timeupdate', ()=>{
  if(!audioEl.duration) return;
  const pct=(audioEl.currentTime/audioEl.duration)*100;
  document.getElementById('mbar-progress-fill').style.width = pct+'%';
});
// Audio source is set directly in the HTML <audio> tag (assets/audio/song.mp3).
// We just wire up loading-screen readiness signals here.
(function(){
  audioEl.loop=true;
  if(audioEl.readyState >= 3){
    if(window.__bumpAudioLoad){ window.__bumpAudioLoad(); window.__bumpAudioLoad=null; }
  } else {
    audioEl.addEventListener('canplaythrough', function onReady(){
      if(window.__bumpAudioLoad){ window.__bumpAudioLoad(); window.__bumpAudioLoad=null; }
      audioEl.removeEventListener('canplaythrough', onReady);
    });
  }
  audioEl.addEventListener('error', function onErr(){
    if(window.__bumpAudioLoad){ window.__bumpAudioLoad(); window.__bumpAudioLoad=null; }
  });
})();

/* ══════════════════════════════
   SCROLL REVEAL + PROGRESS
══════════════════════════════ */
const spb=document.getElementById('spb');
document.querySelectorAll('.rev,.rev2,.rev3').forEach(el=>{
  new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v');e.target.dispatchEvent(new Event('revealed'))}})},{threshold:.09}).observe(el);
});
window.addEventListener('scroll',()=>spb.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%');


/* LETTER-BY-LETTER REVEAL for signature titles */
function buildLetterReveal(el){
  const lines = (el.dataset.lr||el.textContent).split('|');
  el.innerHTML='';
  lines.forEach((line,li)=>{
    if(li>0) el.appendChild(document.createElement('br'));
    line.split('').forEach((ch,ci)=>{
      const span=document.createElement('span');
      span.className='lr-char';
      span.textContent=ch===' '?'\u00A0':ch;
      span.style.transitionDelay=(li*0.5 + ci*0.035)+'s';
      el.appendChild(span);
    });
  });
}
function revealLetters(el){ el.querySelectorAll('.lr-char').forEach(c=>c.classList.add('v')); }
['lr-target','final-lr-target'].forEach(id=>{
  const el=document.getElementById(id);
  if(el) buildLetterReveal(el);
});
new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting) revealLetters(e.target)})},{threshold:.5}).observe(document.getElementById('final-lr-target'));
// hero letter reveal fires once intro finishes (called from startIntro flow below)

/* SECTION NAV DOTS */
(function buildSecNav(){
  const defs=[
    {id:'hero',label:'Hero'},{id:'story',label:'Story'},{id:'things',label:'Little Things'},
    {id:'chem',label:'Chemistry'},{id:'music-sec',label:'Soundtrack'},{id:'photos',label:'Photos'},
    {id:'memconst',label:'Memories'},{id:'const',label:'Constellation'},{id:'letter',label:'Letter'},
    {id:'bookq',label:'Quote'},{id:'future',label:'Future'},{id:'final',label:'Final'}
  ];
  const nav=document.getElementById('secnav');
  const dots=[];
  defs.forEach(d=>{
    const el=document.getElementById(d.id);
    if(!el) return;
    const dot=document.createElement('div');
    dot.className='sn-dot'; dot.dataset.label=d.label;
    dot.addEventListener('click',()=>el.scrollIntoView({behavior:'smooth'}));
    nav.appendChild(dot);
    dots.push({el,dot});
  });
  function updateActive(){
    let current=dots[0];
    dots.forEach(d=>{ if(d.el.getBoundingClientRect().top < window.innerHeight*.5) current=d; });
    dots.forEach(d=>d.dot.classList.toggle('active', d===current));
  }
  window.addEventListener('scroll', updateActive);
  updateActive();
})();

/* ══════════════════════════════
   100 LITTLE THINGS
══════════════════════════════ */
const things=[
  "She likes blue — because maybe even her favorite color describes her: calm, deep, and full of sky.",
  "She loves chemistry, maybe because she sees beauty in things others don't notice.",
  "She sings — because some feelings are easier expressed through melodies.",
  "She's lowkey, and that's exactly what makes her presence so meaningful.",
  "She doesn't need to be the loudest in the room to be the most remembered.",
  "There's something about the way she carries herself — quiet, but certain.",
  "She finds peace in small things: a good book, a quiet evening, a song with meaning.",
  "She is sholeha — and that kind of inner peace is rare and beautiful.",
  "She chose food technology — because she sees science as a way to nourish the world.",
  "Her calmness isn't emptiness. It's depth that most people mistake for silence.",
  "She listens to Banda Neira — songs that feel like a letter written to the universe.",
  "She keeps dried flowers — because she knows some things are worth preserving.",
  "She doesn't overshare — and that makes everything she shares feel like a gift.",
  "She has a universe inside her that most people never get to see.",
  "She loves Taylor Swift — the storytelling, the feeling, the honesty in every lyric.",
  "She's the kind of person who makes others feel seen without trying.",
  "She doesn't need validation from everyone — only from the people who truly matter.",
  "She's graceful in a way that can't be taught. It's just... her.",
  "She probably doesn't know how much her presence means to people around her.",
  "She sees the masjid at night as home — and that says everything about who she is.",
  "She holds on to meaningful things — not things that are just beautiful on the surface.",
  "She's the kind of friend who doesn't need to say much to make you feel understood.",
  "She probably loves the sky after rain — clean, quiet, and full of light.",
  "She's soft, but don't mistake softness for fragility.",
  "She's growing into someone extraordinary — and she's only just beginning.",
];
const grid=document.getElementById('things-grid');
things.forEach((t,i)=>{
  const c=document.createElement('div');c.className='thing-card rev';
  c.innerHTML=`<div class="tc-num">No. ${String(i+1).padStart(2,'0')}</div><div class="tc-txt">${t}</div>`;
  grid.appendChild(c);
  new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v')}})},{threshold:.08}).observe(c);
});

/* ══════════════════════════════
   CHEMISTRY CANVAS
══════════════════════════════ */
const cc=document.getElementById('chemC'),cctx=cc.getContext('2d');
let mols=[];
function resCC(){cc.width=cc.parentElement.offsetWidth;cc.height=cc.parentElement.offsetHeight}
function initM(){mols=[];for(let i=0;i<14;i++)mols.push({x:Math.random()*cc.width,y:Math.random()*cc.height,r:Math.random()*16+7,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,c:['rgba(59,130,246,','rgba(125,211,252,','rgba(96,165,250,'][i%3]})}
function drawM(){
  cctx.clearRect(0,0,cc.width,cc.height);
  for(let i=0;i<mols.length;i++)for(let j=i+1;j<mols.length;j++){const dx=mols[j].x-mols[i].x,dy=mols[j].y-mols[i].y,d=Math.sqrt(dx*dx+dy*dy);if(d<150){cctx.beginPath();cctx.moveTo(mols[i].x,mols[i].y);cctx.lineTo(mols[j].x,mols[j].y);cctx.strokeStyle=`rgba(125,211,252,${.15*(1-d/150)})`;cctx.lineWidth=1;cctx.stroke()}}
  mols.forEach(m=>{m.x+=m.vx;m.y+=m.vy;if(m.x<0||m.x>cc.width)m.vx*=-1;if(m.y<0||m.y>cc.height)m.vy*=-1;const g=cctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r);g.addColorStop(0,m.c+'.55)');g.addColorStop(1,m.c+'0)');cctx.beginPath();cctx.arc(m.x,m.y,m.r,0,Math.PI*2);cctx.fillStyle=g;cctx.fill()});
  requestAnimationFrame(drawM);
}
window.addEventListener('resize',()=>{resCC();initM()});
setTimeout(()=>{resCC();initM();drawM()},500);

/* ══════════════════════════════
   MEMORY CONSTELLATION (interactive)
══════════════════════════════ */
const memCanvas=document.getElementById('memC'),mctx=memCanvas.getContext('2d');
const memStars=[
  {x:.12,y:.2, title:'Pertama Kali Melihatmu', body:'Waktu PTA. Kamu hanya melintas. Tapi ada sesuatu yang tertinggal.'},
  {x:.38,y:.08,title:'Lagu yang Mengingatkanku', body:'"Sampai Jadi Debu" — Banda Neira. Setiap kali lagu ini terdengar, wajahmu yang pertama terlintas.'},
  {x:.65,y:.18,title:'Hal Kecil yang Aku Suka', body:'Cara kamu tenang. Cara kamu tidak mencoba terlalu keras untuk diperhatikan.'},
  {x:.88,y:.35,title:'Doa untuk Aura', body:'Semoga hidupmu selalu diiringi ketenangan. Semoga setiap langkahmu dilindungi.'},
  {x:.78,y:.68,title:'Warna Kamu', body:'Biru. Seperti langit, seperti kedalaman, seperti seseorang yang ingin selalu dijaga.'},
  {x:.5, y:.82,title:'Momen Diam yang Bermakna', body:'Kamu tidak perlu banyak berkata. Kehadiranmu sudah cukup mengatakan segalanya.'},
  {x:.22,y:.72,title:'Apa yang Membuatmu Berbeda', body:'Kamu melihat keindahan di tempat yang orang lain lewatkan. Itulah hal yang paling langka.'},
  {x:.05,y:.5, title:'18 Tahun Menjadi Aura', body:'18 tahun bertumbuh menjadi seseorang yang tenang, dalam, dan begitu berharga.'},
];
const memBonds=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,7],[2,5],[0,6],[3,6]];
let memAnim=0,hovMem=-1,clickMem=-1;
const tooltip=document.getElementById('mem-tip'),ttTitle=document.getElementById('mem-tip-title'),ttBody=document.getElementById('mem-tip-body');

function resizeMem(){const w=Math.min(700,memCanvas.parentElement.offsetWidth-24);memCanvas.width=w;memCanvas.height=Math.round(w*.58)}
function drawMem(){
  mctx.clearRect(0,0,memCanvas.width,memCanvas.height);
  const W=memCanvas.width,H=memCanvas.height; memAnim+=.008;
  memBonds.forEach(([a,b])=>{
    const pa=memStars[a],pb=memStars[b];
    mctx.beginPath();mctx.moveTo(pa.x*W,pa.y*H);mctx.lineTo(pb.x*W,pb.y*H);
    mctx.strokeStyle='rgba(125,211,252,.1)';mctx.lineWidth=1;mctx.stroke();
  });
  memStars.forEach((s,i)=>{
    const x=s.x*W,y=s.y*H;const pulse=1+.3*Math.sin(memAnim+i*1.3);
    const isH=(hovMem===i||clickMem===i);const r=isH?18:11*pulse;
    const g=mctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(125,211,252,${isH?.95:.75})`);g.addColorStop(.4,`rgba(59,130,246,${isH?.4:.25})`);g.addColorStop(1,'rgba(59,130,246,0)');
    mctx.beginPath();mctx.arc(x,y,r,0,Math.PI*2);mctx.fillStyle=g;mctx.fill();
    mctx.beginPath();mctx.arc(x,y,isH?4:2.5,0,Math.PI*2);mctx.fillStyle='rgba(220,240,255,.95)';mctx.fill();
  });
  requestAnimationFrame(drawMem);
}
memCanvas.addEventListener('mousemove',e=>{
  const r=memCanvas.getBoundingClientRect();
  const mx=(e.clientX-r.left)*(memCanvas.width/r.width),my=(e.clientY-r.top)*(memCanvas.height/r.height);
  hovMem=-1;
  memStars.forEach((s,i)=>{const dx=s.x*memCanvas.width-mx,dy=s.y*memCanvas.height-my;if(Math.sqrt(dx*dx+dy*dy)<22){hovMem=i;memCanvas.style.cursor='pointer'}});
  if(hovMem===-1)memCanvas.style.cursor='default';
});
memCanvas.addEventListener('click',e=>{
  if(hovMem===-1){tooltip.classList.remove('show');clickMem=-1;return}
  clickMem=hovMem;const s=memStars[clickMem];
  ttTitle.textContent=s.title;ttBody.textContent=s.body;
  tooltip.style.left=(e.clientX+14)+'px';tooltip.style.top=(e.clientY-10)+'px';
  tooltip.classList.add('show');
});
memCanvas.addEventListener('mouseleave',()=>{hovMem=-1});
document.addEventListener('click',e=>{if(!e.target.closest('#memC')&&!e.target.closest('#mem-tip')){tooltip.classList.remove('show');clickMem=-1}});
window.addEventListener('resize',()=>{resizeMem()});
setTimeout(()=>{resizeMem();drawMem()},600);

/* ══════════════════════════════
   CONSTELLATION OF AURA
══════════════════════════════ */
const con=document.getElementById('conC'),conctx=con.getContext('2d');
const sps=[
  {x:.15,y:.2,l:'Kind'},{x:.44,y:.08,l:'Beautiful'},{x:.72,y:.22,l:'Smart'},
  {x:.87,y:.55,l:'Graceful'},{x:.64,y:.8,l:'Dreamer'},{x:.3,y:.85,l:'Strong'},
  {x:.1,y:.62,l:'Sholeha'},{x:.5,y:.45,l:'Calm'},
];
const bnds=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,7],[7,4],[7,2],[7,5]];
let ca=0,hovS=-1;
function resizeCon(){const w=Math.min(560,con.parentElement.offsetWidth-24);con.width=w;con.height=Math.round(w*.62)}
function drawCon(){
  conctx.clearRect(0,0,con.width,con.height);const W=con.width,H=con.height;ca+=.01;
  bnds.forEach(([a,b])=>{const pa=sps[a],pb=sps[b];conctx.beginPath();conctx.moveTo(pa.x*W,pa.y*H);conctx.lineTo(pb.x*W,pb.y*H);conctx.strokeStyle='rgba(125,211,252,.12)';conctx.lineWidth=1;conctx.stroke()});
  sps.forEach((p,i)=>{
    const x=p.x*W,y=p.y*H;const pu=1+.28*Math.sin(ca+i*1.2);const isH=(hovS===i);
    const g=conctx.createRadialGradient(x,y,0,x,y,14*(isH?1.9:pu));
    g.addColorStop(0,`rgba(125,211,252,${isH?.95:.8})`);g.addColorStop(.4,'rgba(59,130,246,.3)');g.addColorStop(1,'rgba(59,130,246,0)');
    conctx.beginPath();conctx.arc(x,y,14*(isH?1.9:pu),0,Math.PI*2);conctx.fillStyle=g;conctx.fill();
    conctx.beginPath();conctx.arc(x,y,2.8,0,Math.PI*2);conctx.fillStyle='rgba(210,235,255,.95)';conctx.fill();
    conctx.font=`${W>380?11:9}px Inter`;conctx.fillStyle=`rgba(147,197,253,${isH?.95:.72})`;conctx.textAlign='center';
    conctx.fillText(p.l,x,y-17*(isH?1.6:pu));
  });
  requestAnimationFrame(drawCon);
}
con.addEventListener('mousemove',e=>{
  const r=con.getBoundingClientRect();const mx=(e.clientX-r.left)*(con.width/r.width),my=(e.clientY-r.top)*(con.height/r.height);
  hovS=-1;sps.forEach((p,i)=>{const dx=p.x*con.width-mx,dy=p.y*con.height-my;if(Math.sqrt(dx*dx+dy*dy)<22)hovS=i});
});
con.addEventListener('mouseleave',()=>hovS=-1);
window.addEventListener('resize',resizeCon);
setTimeout(()=>{resizeCon();drawCon()},600);

/* ══════════════════════════════
   FINAL SCENE CANVAS
══════════════════════════════ */
const fc=document.getElementById('finalC'),fctx=fc.getContext('2d');
let fStars=[];
function resizeF(){fc.width=fc.parentElement.offsetWidth;fc.height=fc.parentElement.offsetHeight;fStars=[];for(let i=0;i<120;i++)fStars.push({x:Math.random()*fc.width,y:Math.random()*fc.height,r:Math.random()*1.6+.3,o:Math.random(),s:Math.random()*.004+.002,d:Math.random()>.5?1:-1})}
function drawF(){fctx.clearRect(0,0,fc.width,fc.height);fStars.forEach(s=>{s.o+=s.s*s.d;if(s.o>1||s.o<.05)s.d*=-1;fctx.beginPath();fctx.arc(s.x,s.y,s.r,0,Math.PI*2);fctx.fillStyle=`rgba(147,197,253,${s.o})`;fctx.fill()});requestAnimationFrame(drawF)}
window.addEventListener('resize',resizeF);
setTimeout(()=>{resizeF();drawF()},600);

/* ══════════════════════════════
   MODAL
══════════════════════════════ */
function openModal(){document.getElementById('modal').classList.add('open');launchConfetti()}
function closeModal(){document.getElementById('modal').classList.remove('open')}
document.getElementById('modal').addEventListener('click',e=>{if(e.target===document.getElementById('modal'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function launchConfetti(){
  const area=document.getElementById('confetti');area.innerHTML='';
  const cols=['#3b82f6','#7dd3fc','#93c5fd','#60a5fa','#e0f2fe','#fbbf24','#fda4af'];
  const syms=['✦','💙','✿','·'];
  for(let i=0;i<90;i++){
    const p=document.createElement('div');
    const useSym = Math.random()>.72;
    if(useSym){
      p.textContent = syms[Math.floor(Math.random()*syms.length)];
      p.style.cssText=`position:absolute;font-size:${10+Math.random()*10}px;color:${cols[i%cols.length]};left:${Math.random()*100}%;top:-20px;animation:cfall ${1.6+Math.random()*2}s ease-in ${Math.random()*.9}s forwards;opacity:${.7+Math.random()*.3}`;
    } else {
      p.style.cssText=`position:absolute;width:${3+Math.random()*7}px;height:${3+Math.random()*7}px;background:${cols[i%cols.length]};left:${Math.random()*100}%;top:-20px;border-radius:${Math.random()>.5?'50%':'2px'};animation:cfall ${1.5+Math.random()*2}s ease-in ${Math.random()*.9}s forwards;opacity:${.6+Math.random()*.4}`;
    }
    area.appendChild(p);
  }
  const cs=document.createElement('style');cs.textContent='@keyframes cfall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';document.head.appendChild(cs);
}
