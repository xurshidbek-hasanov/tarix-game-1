/* ===== SAVOLLAR (slaydlar asosida) — p: ball, q: savol, o: variantlar, a: to‘g‘ri javob indeksi ===== */
const CATS = [
 {name:"Huquqiy asoslar",t:[
  {p:100,q:"Konstitutsiyaning nechanchi moddasi fuqarolarning ijtimoiy ta’minot olish huquqini kafolatlaydi?",o:["14-modda","39-modda","40-modda","45-modda"],a:1},
  {p:200,q:"Konstitutsiyaning 40-moddasi qaysi huquqni mustahkamlaydi?",o:["Mulk huquqini","Malakali tibbiy xizmatdan foydalanish huquqini","Ta’lim olish huquqini","Mehnat qilish huquqini"],a:1},
  {p:300,q:"Ijtimoiy siyosat davlatning qaysi yo‘nalishdagi faoliyatidir?",o:["Aholi farovonligi, turmush sifati va ijtimoiy adolatni ta’minlash","Faqat soliq yig‘ish","Tashqi savdoni boshqarish","Faqat pul-kredit siyosati"],a:0}]},
 {name:"Manzilli yordam va mahalla",t:[
  {p:100,q:"Dastlabki umumiy qo‘llab-quvvatlashdan keyin qaysi yordam mexanizmi kuchaydi?",o:["Manzilli yordam","Yagona soliq","Bepul tarqatish","Valyuta ayirboshlash"],a:0},
  {p:200,q:"2000-yilda mahallalar orqali aholiga ko‘rsatilgan ijtimoiy yordam hajmi qancha bo‘lgan?",o:["5,4 mlrd so‘m","54,3 mlrd so‘m","543 mlrd so‘m","72,4 mlrd so‘m"],a:1},
  {p:300,q:"1991–1994-yillarda davlat budjeti orqali ijtimoiy qo‘llab-quvvatlashning nechta dan ortiq yo‘nalishi moliyalashtirildi?",o:["10 dan ortiq","20 dan ortiq","30 dan ortiq","100 dan ortiq"],a:2}]},
 {name:"Infratuzilma va uy-joy",t:[
  {p:100,q:"1991–2007-yillarda qishloq joylarda necha km gaz tarmog‘i qurilgan?",o:["7 ming km","36 ming km","72 ming km","120 ming km"],a:2},
  {p:200,q:"Qishloqda gaz bilan ta’minlanganlik darajasi qanday o‘zgargan?",o:["5 foizdan 30 foizga","17 foizdan 78 foizga","40 foizdan 90 foizga","52 foizdan 77 foizga"],a:1},
  {p:300,q:"1991–2000-yillarda qancha uy-joy qurilgani taqdimotda qayd etilgan?",o:["7 mln kv. metr","70 mln kv. metr","700 mln kv. metr","17 mln kv. metr"],a:1}]},
 {name:"Sog‘liqni saqlash",t:[
  {p:100,q:"1998-yil 10-noyabrda qanday hujjat qabul qilindi?",o:["Soliq kodeksi","Sog‘liqni saqlash tizimini isloh qilish Davlat dasturi","Mehnat kodeksi","Ta’lim to‘g‘risidagi qonun"],a:1},
  {p:200,q:"1993-yilda qaysi farmatsevtika tuzilmasi tashkil etilgan?",o:["“Dori-darmon”","“O‘zfarmsanoat”","“Kinderdorf”","“Obod mahalla”"],a:1},
  {p:300,q:"1990-yildagi 835 ta dorixona soni 2010-yilga kelib nechtaga yetgan?",o:["1 200","2 722","4 837","8 350"],a:2}]},
 {name:"2017-yildan raqamli davr",t:[
  {p:100,q:"2017-yil qanday yil deb e’lon qilingan?",o:["Ijtimoiy himoya yili","Yoshlar yili","Xalq bilan muloqot va inson manfaatlari yili","Barkamol avlod yili"],a:2},
  {p:200,q:"“Ijtimoiy himoya yagona reyestri” respublika bo‘yicha qachondan ishga tushirilgan?",o:["2019-yil 1-oktabr","2020-yil 1-sentabr","2021-yil 5-mart","2017-yil 1-yanvar"],a:1},
  {p:300,q:"Yagona reyestr 2019-yil 1-oktabrdan qaysi viloyatda sinov tariqasida ishga tushirilgan?",o:["Sirdaryo","Surxondaryo","Xorazm","Navoiy"],a:0}]}
];

/* ===== YORDAMCHILAR ===== */
const $=s=>document.querySelector(s), COLORS=["#e3b04b","#2fb7a7","#e0735a","#9a8ae6","#86c46a"];
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let teams=[],turn=0,cur=null,timer=null,left=0,done=0,locked=false,n=3,muted=false;
const TOTAL=CATS.reduce((s,c)=>s+c.t.length,0), TIME=20;

/* ===== OVOZ ===== */
let ac;
function tone(f,d=.15,type="sine",at=0,v=.12){
  if(muted)return; ac=ac||new (window.AudioContext||window.webkitAudioContext)();
  const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+at;
  o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
  o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d);
}
const sfx={ok:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.25,"triangle",i*.09)),no:()=>{tone(180,.35,"sawtooth",0,.1);tone(140,.4,"sawtooth",.15,.1)},tick:()=>tone(900,.05,"square",0,.05),open:()=>tone(392,.2,"sine",0,.1)};
$("#mute").onclick=e=>{muted=!muted;e.currentTarget.classList.toggle("off",muted)};

/* ===== FON: yulduzlar, chang, konfetti ===== */
const cv=$("#fx"),cx=cv.getContext("2d");let W,H,stars=[],dust=[],conf=[];
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;stars=Array.from({length:Math.round(W*H/9000)},()=>({x:Math.random()*W,y:Math.random()*H*.65,r:Math.random()*1.4+.3,p:Math.random()*6}));dust=Array.from({length:40},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.6,v:Math.random()*.5+.15}))}
addEventListener("resize",size);size();
function burst(x,y,k=60,cols=[...COLORS,"#fff3d0"]){if(reduce)return;for(let i=0;i<k;i++){const a=Math.random()*6.28,s=Math.random()*7+2;conf.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-4,w:Math.random()*7+4,h:Math.random()*4+3,c:cols[i%cols.length],r:Math.random()*6,l:100+Math.random()*50})}}
(function loop(t){
  cx.clearRect(0,0,W,H);
  if(!reduce){
    stars.forEach(s=>{cx.globalAlpha=.35+.65*Math.abs(Math.sin(t/1200+s.p));cx.fillStyle="#fff";cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.28);cx.fill()});
    cx.fillStyle="#f6d98a";dust.forEach(d=>{d.x+=d.v;d.y-=d.v*.25;if(d.x>W)d.x=0;if(d.y<0)d.y=H;cx.globalAlpha=.25;cx.beginPath();cx.arc(d.x,d.y,d.r,0,6.28);cx.fill()});
  }
  conf=conf.filter(p=>p.l-->0);conf.forEach(p=>{p.vy+=.22;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.r+=.2;cx.save();cx.globalAlpha=Math.min(1,p.l/30);cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()});
  requestAnimationFrame(loop);
})(0);

/* ===== BOSHLANG‘ICH EKRAN ===== */
function drawStart(){
  $(".count").innerHTML=[2,3,4,5].map(k=>`<button class="${k==n?"on":""}" data-n="${k}">${k}</button>`).join("");
  const old=[...document.querySelectorAll("#names input")].map(i=>i.value);
  $("#names").innerHTML=Array.from({length:n},(_,i)=>`<input style="--c:${COLORS[i]}" maxlength="18" value="${old[i]||""}" placeholder="${i+1}-jamoa nomi" aria-label="${i+1}-jamoa nomi">`).join("");
}
$(".count").onclick=e=>{const k=+e.target.dataset.n;if(k){n=k;drawStart();sfx.tick()}};
$("#go").onclick=()=>{
  teams=[...document.querySelectorAll("#names input")].map((el,i)=>({name:el.value.trim()||`${i+1}-jamoa`,score:0,c:COLORS[i],shown:0}));
  turn=0;done=0;$("#start").hidden=true;$("#game").hidden=false;sfx.open();buildBoard();drawScores();
};

/* ===== TAXTA ===== */
function buildBoard(){
  let h=CATS.map(c=>`<div class="cat">${c.name}</div>`).join("");
  for(let r=0;r<3;r++)CATS.forEach((c,ci)=>{h+=`<button class="tile" style="--i:${r*5+ci}" data-c="${ci}" data-r="${r}">${c.t[r].p}</button>`});
  $("#board").innerHTML=h;
}
$("#board").onclick=e=>{const b=e.target.closest(".tile");if(b&&!b.disabled&&!cur)openQ(+b.dataset.c,+b.dataset.r,b)};
function drawScores(){
  $("#scores").innerHTML=teams.map((t,i)=>`<div class="chip ${i==turn?"act":""}" style="--c:${t.c}"><small>${t.name}</small><b id="sc${i}">${t.shown}</b></div>`).join("");
  $("#turn").innerHTML=`Navbat: <span style="--c:${teams[turn].c}">${teams[turn].name}</span>`;
  teams.forEach((t,i)=>{const el=$("#sc"+i);const step=()=>{if(t.shown==t.score)return;t.shown+=Math.sign(t.score-t.shown)*Math.min(10,Math.abs(t.score-t.shown));el.textContent=t.shown;requestAnimationFrame(step)};step()});
}

/* ===== SAVOL ===== */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function openQ(ci,ri,btn){
  const q=CATS[ci].t[ri];cur={ci,ri,btn,q};locked=false;
  document.body.dataset.era=ci;sfx.open();
  $("#qcat").textContent=CATS[ci].name;$("#qpts").textContent=q.p+" ball";$("#qtext").textContent=q.q;
  const opts=q.o.map((t,i)=>({t,ok:i==q.a}));shuffle(opts);cur.opts=opts;
  $("#opts").innerHTML=opts.map((o,i)=>`<button class="opt" data-i="${i}">${"ABCD"[i]}.  ${o.t}</button>`).join("");
  $("#fb").textContent="";$("#next").hidden=true;$(".card").className="card";$("#modal").hidden=false;
  left=TIME;tick();clearInterval(timer);timer=setInterval(tick,100);
}
function tick(){
  left=Math.max(0,left-(timer?.1:0));if(!timer)left=TIME;
  const bar=$("#bar");bar.style.transform=`scaleX(${left/TIME})`;bar.classList.toggle("low",left<6);
  if(timer&&left<=5&&Math.abs(left-Math.round(left))<.06&&left>0)sfx.tick();
  if(timer&&left<=0)answer(-1);
}
$("#opts").onclick=e=>{const b=e.target.closest(".opt");if(b&&!locked)answer(+b.dataset.i)};
function answer(i){
  locked=true;clearInterval(timer);timer=null;
  const {q,opts,btn}=cur,t=teams[turn],good=i>=0&&opts[i].ok;
  document.querySelectorAll(".opt").forEach((b,k)=>{b.disabled=true;if(opts[k].ok)b.classList.add("ok");else if(k==i)b.classList.add("no")});
  if(good){
    t.score+=q.p;sfx.ok();const r=$(".card").getBoundingClientRect();burst(r.left+r.width/2,r.top+60,90);
    $("#fb").style.color="#7fe3d6";$("#fb").textContent=`To‘g‘ri! ${t.name} +${q.p} ball`;
  }else{
    sfx.no();$(".card").classList.add("shake");
    $("#fb").style.color="#ff9a80";$("#fb").textContent=i<0?"Vaqt tugadi. Ball berilmadi.":"Noto‘g‘ri javob. Ball berilmadi.";
  }
  btn.disabled=true;btn.textContent=good?"✓":"✕";btn.style.setProperty("--c",good?t.c:"#888");
  done++;$("#next").hidden=false;$("#next").focus();drawScores();
}
$("#next").onclick=()=>{
  $("#modal").hidden=true;cur=null;document.body.dataset.era=-1;
  if(done>=TOTAL)return finish();
  turn=(turn+1)%teams.length;drawScores();
};

/* ===== YAKUN ===== */
function finish(){
  $("#game").hidden=true;$("#end").hidden=false;
  const s=[...teams].sort((a,b)=>b.score-a.score),top=s[0].score;
  $("#podium").innerHTML=s.map((t,i)=>`<div class="pod ${t.score==top?"w":""}" style="--c:${t.c};--i:${i}"><small>${t.score==top?"👑 ":""}${t.name}</small><b>${t.score}</b></div>`).join("");
  sfx.ok();let k=0;const iv=setInterval(()=>{burst(Math.random()*W,H*.3,70);if(++k>8)clearInterval(iv)},450);
}
$("#again").onclick=()=>location.reload();
drawStart();
