
const WEDDING=new Date(2000,9,21);
const RETIREMENT=new Date(2030,3,1);
const MS_DAY=86400000;
const daysBetween=(a,b)=>Math.max(0,Math.ceil((b-a)/MS_DAY));
function fullYears(from,to){let y=to.getFullYear()-from.getFullYear();if(new Date(to.getFullYear(),from.getMonth(),from.getDate())>to)y--;return y}
function updateStats(){
  const now=new Date();
  document.querySelectorAll('[data-years-married]').forEach(el=>el.textContent=fullYears(WEDDING,now));
  document.querySelectorAll('[data-days-together]').forEach(el=>el.textContent=daysBetween(WEDDING,now).toLocaleString());
  document.querySelectorAll('[data-days-retirement]').forEach(el=>el.textContent=daysBetween(now,RETIREMENT).toLocaleString());
  let y=RETIREMENT.getFullYear()-now.getFullYear(),m=RETIREMENT.getMonth()-now.getMonth(),d=RETIREMENT.getDate()-now.getDate();
  if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()}
  if(m<0){y--;m+=12}
  document.querySelectorAll('[data-count-years]').forEach(el=>el.textContent=Math.max(0,y));
  document.querySelectorAll('[data-count-months]').forEach(el=>el.textContent=Math.max(0,m));
  document.querySelectorAll('[data-count-days]').forEach(el=>el.textContent=Math.max(0,d));
}
function showRoute(){
  const requested=(location.hash||'#home').slice(1);
  const target=document.querySelector(`[data-page="${requested}"]`)||document.querySelector('[data-page="home"]');
  document.querySelectorAll('.route').forEach(el=>el.classList.toggle('active',el===target));
  document.querySelectorAll('[data-route]').forEach(el=>el.classList.toggle('active',el.dataset.route===target.dataset.page));
  document.getElementById('mobileMenu')?.classList.remove('show');
  window.scrollTo({top:0,behavior:'smooth'});
}
document.addEventListener('click',e=>{
  const link=e.target.closest('[data-route]');
  if(link){
    e.preventDefault();
    const route=link.dataset.route;
    if(location.hash==='#'+route)showRoute(); else location.hash=route;
  }
});
window.addEventListener('hashchange',showRoute);
document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('mobileMenu')?.classList.toggle('show'));
document.getElementById('shareBtn')?.addEventListener('click',async()=>{
  const data={title:'The Next Chapter',text:'Allison & Brian — The Road to April 1, 2030',url:location.origin+location.pathname};
  if(navigator.share){try{await navigator.share(data)}catch(e){}}
  else{try{await navigator.clipboard.writeText(data.url);alert('Link copied.')}catch(e){}}
});
let audioCtx,master,oscillators=[],playing=false;
function stopSound(){
  oscillators.forEach(o=>{try{o.stop()}catch(e){}});
  oscillators=[];
  if(audioCtx){try{audioCtx.close()}catch(e){}}
  playing=false;
  document.getElementById('soundBtn').textContent='♫';
  document.getElementById('toast').classList.remove('show');
}
document.getElementById('soundBtn')?.addEventListener('click',()=>{
  if(playing){stopSound();return}
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  master=audioCtx.createGain();master.gain.value=.018;master.connect(audioCtx.destination);
  [174.61,220,261.63].forEach((freq,i)=>{
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type=i===0?'sine':'triangle';o.frequency.value=freq;g.gain.value=i===0?.7:.25;
    o.connect(g);g.connect(master);o.start();oscillators.push(o);
  });
  playing=true;
  document.getElementById('soundBtn').textContent='×';
  document.getElementById('toast').classList.add('show');
});
updateStats();
showRoute();
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
