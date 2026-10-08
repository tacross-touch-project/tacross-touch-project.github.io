const tasks=[
 {title:'Fixed-point dispensing',description:'Grasp the tool, dispense the prescribed dose at the target, and return without leakage.',challenge:'Regulate grasp and squeeze while controlling the dispensed dose.',sequence:'dispense',clips:[['dispense-one','Success · One drop'],['dispense-two','Success · Two drops'],['dispense-failure','Failure example']]},
 {title:'Beaker-to-beaker liquid transfer',description:'Lift from the right, transfer liquid to the left beaker without early dripping, and return to the right.',challenge:'Maintain a secure grasp and control liquid release during transfer.',sequence:'transfer',clips:[['transfer-one','Success · One drop'],['transfer-three','Success · Three drops'],['transfer-failure','Failure example']]},
 {title:'Precision pipetting',description:'Aspirate liquid, dispense at the petri-dish target without leakage, and return the tool.',challenge:'Coordinate fine squeezing with precise placement of the pipette tip.',sequence:'pipette',clips:[['pipette-one','Success · One drop'],['pipette-three','Success · Three drops'],['pipette-failure','Failure example']]},
 {title:'Sequential fruit pick-and-place',description:'Pick the strawberry, then the grape, and place both stably without damage.',challenge:'Adjust contact for objects with different geometry and compliance.',sequence:'fruit',clips:[['fruit-success','Successful execution'],['fruit-failure','Failure example']]}
];
const executionGrid=document.querySelector('#execution-grid');
function setTask(index){
 const t=tasks[index];
 document.querySelectorAll('[data-task]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});
 document.querySelector('#task-panel').setAttribute('aria-labelledby',`tab-${index}`);
 document.querySelector('#task-number').textContent=`TASK 0${index+1}`;
 document.querySelector('#task-title').textContent=t.title;
 document.querySelector('#task-description').textContent=t.description;
 document.querySelector('#task-challenge').textContent=t.challenge;
 executionGrid.querySelectorAll('video').forEach(v=>{v.pause();visibility.unobserve(v);v.removeAttribute('src');v.querySelectorAll('source').forEach(s=>s.remove());v.load();});
 executionGrid.dataset.count=t.clips.length;
 executionGrid.replaceChildren(...t.clips.map(([name,label])=>{
  const card=document.createElement('figure');card.className='execution-card';
  const caption=document.createElement('figcaption');caption.textContent=label;
  const clip=document.createElement('video');
  clip.controls=true;clip.muted=true;clip.defaultMuted=true;clip.autoplay=true;clip.loop=true;clip.playsInline=true;clip.preload='auto';
  clip.poster=`assets/${name}.jpg`;clip.src=`assets/${name}.mp4`;
  clip.setAttribute('aria-label',`${t.title}: ${label}`);
  visibility.observe(clip);
  const speed=document.createElement('p');speed.className='execution-speed';speed.textContent='2× source playback';
  card.append(caption,clip,speed);return card;
 }));
 const im=document.querySelector('#task-sequence');im.src=`assets/${t.sequence}-sequence.webp`;im.alt=`${t.title}: human and robot keyframes, tactile maps and force traces`;
}
document.querySelectorAll('[data-task]').forEach((b,i)=>{b.addEventListener('click',()=>setTask(i));b.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%4;else if(e.key==='ArrowLeft')n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();setTask(n);document.querySelector(`#tab-${n}`).focus();});});
const hero=document.querySelector('#hero-video'),toggle=document.querySelector('#hero-toggle');
let heroWantsPlayback=true,heroVisible=false;
function syncHeroPlayback(){
 if(heroWantsPlayback&&heroVisible&&!document.hidden){hero.play().catch(()=>{toggle.textContent='▶ Play overview';toggle.setAttribute('aria-label','Play overview video');});}
 else hero.pause();
}
toggle.addEventListener('click',()=>{heroWantsPlayback=hero.paused;syncHeroPlayback();});
hero.addEventListener('play',()=>{toggle.textContent='Ⅱ Pause overview';toggle.setAttribute('aria-label','Pause overview video');});
hero.addEventListener('pause',()=>{toggle.textContent='▶ Play overview';toggle.setAttribute('aria-label','Play overview video');});
const visibility=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.target===hero){heroVisible=e.isIntersecting;syncHeroPlayback();}
 else if(e.isIntersecting&&!document.hidden&&e.target.isConnected)e.target.play().catch(()=>{});
 else e.target.pause();
}),{threshold:.1});
visibility.observe(hero);
let backgroundPausedClips=[];
document.addEventListener('visibilitychange',()=>{
 syncHeroPlayback();
 if(document.hidden){backgroundPausedClips=[...executionGrid.querySelectorAll('video')].filter(v=>!v.paused);backgroundPausedClips.forEach(v=>v.pause());}
 else{backgroundPausedClips.filter(v=>v.isConnected).forEach(v=>v.play().catch(()=>{}));backgroundPausedClips=[];}
});
document.querySelector('#copy-citation').addEventListener('click',async e=>{const text=document.querySelector('#citation').textContent;try{await navigator.clipboard.writeText(text);}catch{const range=document.createRange();range.selectNodeContents(document.querySelector('#citation'));const s=window.getSelection();s.removeAllRanges();s.addRange(range);e.target.textContent='Select & copy';document.querySelector('#copy-status').textContent='Citation selected. Use your browser copy command.';return;}e.target.textContent='Copied ✓';document.querySelector('#copy-status').textContent='BibTeX copied to clipboard.';setTimeout(()=>e.target.textContent='Copy BibTeX',2000);});
setTask(0);

const figureDialog=document.querySelector('#figure-dialog');
let figureOpener=null;
document.querySelectorAll('.paper-zoom').forEach(link=>link.addEventListener('click',event=>{
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();figureOpener=link;
 const source=link.querySelector('img'),full=figureDialog.querySelector('img');
 full.src=link.href;full.alt=source.alt;
 figureDialog.querySelector('p').textContent=link.parentElement.querySelector('figcaption').textContent;
 figureDialog.showModal();
}));
figureDialog.querySelector('.figure-close').addEventListener('click',()=>figureDialog.close());
figureDialog.addEventListener('click',event=>{if(event.target===figureDialog){const r=figureDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)figureDialog.close();}});
figureDialog.addEventListener('close',()=>figureOpener?.focus());

const readingNav=document.querySelector('.reading-nav');
const readingSections=[...document.querySelectorAll('#overview,#demos,#method,#system,#dataset,#results,#resources')];
let readingTick=false;
function updateReadingNav(){
 readingTick=false;
 const section=readingSections.filter(s=>s.getBoundingClientRect().top<=window.innerHeight*.35).at(-1);
 readingNav.hidden=!section||section.id==='demos';
 document.querySelectorAll('.reading-nav a,header nav a').forEach(a=>{const active=a.hash===`#${section?.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
function scheduleReadingNav(){if(!readingTick){readingTick=true;requestAnimationFrame(updateReadingNav);}}
window.addEventListener('scroll',scheduleReadingNav,{passive:true});
window.addEventListener('resize',scheduleReadingNav);
updateReadingNav();
