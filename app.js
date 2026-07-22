
const WEDDING=new Date(2000,9,21),RETIREMENT=new Date(2030,3,1);
const days=(a,b)=>Math.max(0,Math.ceil((b-a)/86400000));
function fullYears(from,to){let y=to.getFullYear()-from.getFullYear();if(new Date(to.getFullYear(),from.getMonth(),from.getDate())>to)y--;return y}
function updateStats(){
  const now=new Date();
  document.querySelectorAll('[data-years-married]').forEach(x=>x.textContent=fullYears(WEDDING,now));
  document.querySelectorAll('[data-days-together]').forEach(x=>x.textContent=days(WEDDING,now).toLocaleString());
  document.querySelectorAll('[data-days-retirement]').forEach(x=>x.textContent=days(now,RETIREMENT).toLocaleString());
  let y=RETIREMENT.getFullYear()-now.getFullYear(),m=RETIREMENT.getMonth()-now.getMonth(),d=RETIREMENT.getDate()-now.getDate();
  if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()}
  if(m<0){y--;m+=12}
  document.querySelectorAll('[data-count-years]').forEach(x=>x.textContent=Math.max(0,y));
  document.querySelectorAll('[data-count-months]').forEach(x=>x.textContent=Math.max(0,m));
  document.querySelectorAll('[data-count-days]').forEach(x=>x.textContent=Math.max(0,d));
}
function route(){
  const page=(location.hash||'#home').slice(1);
  const target=document.querySelector(`[data-page="${page}"]`)||document.querySelector('[data-page="home"]');
  document.querySelectorAll('.route').forEach(x=>x.classList.toggle('active',x===target));
  document.querySelectorAll('[data-route]').forEach(x=>x.classList.toggle('active',x.dataset.route===target.dataset.page));
  document.querySelector('.mobileMenu')?.classList.remove('show');
  window.scrollTo({top:0,behavior:'smooth'});
}
window.addEventListener('hashchange',route);
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-route]');
  if(a){e.preventDefault();location.hash=a.dataset.route;route()}
});
document.getElementById('menuBtn')?.addEventListener('click',()=>document.querySelector('.mobileMenu')?.classList.toggle('show'));
document.getElementById('shareBtn')?.addEventListener('click',async()=>{
  const data={title:'The Next Chapter',text:'Allison & Brian — The Road to April 1, 2030',url:location.origin+location.pathname};
  if(navigator.share){try{await navigator.share(data)}catch(e){}}
  else{await navigator.clipboard.writeText(data.url);alert('Link copied.')}
});

let ctx,osc,gain,playing=false;
document.getElementById('soundBtn')?.addEventListener('click',()=>{
  const btn=document.getElementById('soundBtn');
  if(!playing){
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    osc=ctx.createOscillator();gain=ctx.createGain();
    osc.type='sine';osc.frequency.value=196;gain.gain.value=.025;
    osc.connect(gain);gain.connect(ctx.destination);osc.start();playing=true;
    btn.textContent='×';document.querySelector('.soundNote')?.classList.add('show');
  }else{
    try{osc.stop();ctx.close()}catch(e){}
    playing=false;btn.textContent='♫';document.querySelector('.soundNote')?.classList.remove('show');
  }
});
updateStats();route();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
