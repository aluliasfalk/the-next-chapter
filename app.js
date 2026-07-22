
const WEDDING=new Date(2000,9,21);
const RETIREMENT=new Date(2030,3,1);
const MS_DAY=86400000;
const daysBetween=(a,b)=>Math.max(0,Math.ceil((b-a)/MS_DAY));
function fullYears(from,to){let y=to.getFullYear()-from.getFullYear();if(new Date(to.getFullYear(),from.getMonth(),from.getDate())>to)y--;return y}
function calendarDifference(from,to){
  if(from>=to)return {years:0,months:0,days:0};
  let years=to.getFullYear()-from.getFullYear();
  let months=to.getMonth()-from.getMonth();
  let days=to.getDate()-from.getDate();
  if(days<0){
    months--;
    days+=new Date(to.getFullYear(),to.getMonth(),0).getDate();
  }
  if(months<0){
    years--;
    months+=12;
  }
  return {years,months,days};
}
function updateStats(){
  const now=new Date();
  document.querySelectorAll('[data-years-married]').forEach(el=>el.textContent=fullYears(WEDDING,now));
  document.querySelectorAll('[data-days-together]').forEach(el=>el.textContent=daysBetween(WEDDING,now).toLocaleString());
  document.querySelectorAll('[data-days-retirement]').forEach(el=>el.textContent=daysBetween(now,RETIREMENT).toLocaleString());
  const STAGE_ONE_END=new Date(2029,4,1);
  const stage1=calendarDifference(now,STAGE_ONE_END);
  const stage2=calendarDifference(STAGE_ONE_END,RETIREMENT);

  document.querySelectorAll('[data-stage1-years]').forEach(el=>el.textContent=stage1.years);
  document.querySelectorAll('[data-stage1-months]').forEach(el=>el.textContent=stage1.months);
  document.querySelectorAll('[data-stage1-days]').forEach(el=>el.textContent=stage1.days);

  document.querySelectorAll('[data-stage2-years]').forEach(el=>el.textContent=stage2.years);
  document.querySelectorAll('[data-stage2-months]').forEach(el=>el.textContent=stage2.months);
  document.querySelectorAll('[data-stage2-days]').forEach(el=>el.textContent=stage2.days);
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
