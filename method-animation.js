(()=>{
 const root=document.querySelector('#method-animation');if(!root)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const descriptions=[
  ['CANONICALIZE','Sensor-specific calibration and adapters express human and robot touch in a common contact schema. Validity masks distinguish missing measurements from observed no-contact values.'],
  ['ENCODE','Shared temporal and inter-finger encoders process 16 frames × 5 fingers, producing a 256-D tactile latent for each domain.'],
  ['ALIGN','During training, masked contact, force and phase targets and contrastive learning align contact semantics across sensors. Raw sensor channels are not matched directly.'],
  ['CONDITION','The robot tactile latent joins robot RGB and state to condition the policy. Human demonstrations support representation learning and auxiliary training supervision.'],
  ['ACT','The policy predicts arm and hand action chunks. During training, executed robot actions provide ground-truth action supervision.']
 ];
 let phase=0,mode='train',speed=1,wantsPlay=!reduced.matches,visible=false,elapsed=0,last=0,raf=0;
 const toggle=root.querySelector('#flow-toggle');
 const sequence=()=>mode==='train'?[0,1,2,3,4]:[0,1,3,4];
 function draw(){
  root.dataset.phase=phase;root.dataset.mode=mode;
  root.querySelectorAll('[data-flow-phase]').forEach(n=>n.classList.toggle('is-active',n.dataset.flowPhase.split(' ').includes(String(phase))));
  root.querySelectorAll('[data-flow-step]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.flowStep)===phase));b.disabled=mode==='deploy'&&b.dataset.flowStep==='2';});
  root.querySelector('#flow-stage-label').textContent=`${String(sequence().indexOf(phase)+1).padStart(2,'0')} / ${descriptions[phase][0]}`;
  let explanation=descriptions[phase][1];
  if(mode==='deploy')explanation={0:'Robot touch is calibrated and canonicalized with the robot adapter and validity masks. Human observations are not needed.',1:'The learned shared encoder turns a window of robot touch into a 256-D tactile representation.',3:'Robot touch, RGB and state condition the learned policy. Semantic alignment losses are not computed at deployment.',4:'The policy produces arm and hand action chunks for execution. Deployment runs inference; no ground-truth action targets are required.'}[phase];
  root.querySelector('#flow-explanation').textContent=explanation;
  toggle.textContent=wantsPlay?'Pause':'Play';toggle.setAttribute('aria-label',wantsPlay?'Pause method animation':'Play method animation');
 }
 function advance(){const s=sequence();phase=s[(s.indexOf(phase)+1)%s.length];draw();}
 function frame(now){if(!last)last=now;elapsed+=Math.min(now-last,100)*speed;last=now;if(elapsed>=3000){elapsed=0;advance();}raf=requestAnimationFrame(frame);}
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;const run=wantsPlay&&visible&&!document.hidden;root.classList.toggle('is-running',run);if(run)raf=requestAnimationFrame(frame);}
 toggle.addEventListener('click',()=>{wantsPlay=!wantsPlay;draw();sync();});
 root.querySelector('#flow-next').addEventListener('click',()=>{wantsPlay=false;elapsed=0;advance();sync();});
 root.querySelector('#flow-restart').addEventListener('click',()=>{phase=0;elapsed=0;wantsPlay=!reduced.matches;draw();sync();});
 root.querySelectorAll('[data-flow-step]').forEach(b=>b.addEventListener('click',()=>{phase=Number(b.dataset.flowStep);wantsPlay=false;elapsed=0;draw();sync();}));
 root.querySelectorAll('[data-flow-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.flowMode;phase=0;elapsed=0;root.querySelectorAll('[data-flow-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();sync();}));
 root.querySelectorAll('[data-flow-speed]').forEach(b=>b.addEventListener('click',()=>{speed=Number(b.dataset.flowSpeed);root.style.setProperty('--flow-speed',speed);root.querySelectorAll('[data-flow-speed]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.08}).observe(root);
 document.addEventListener('visibilitychange',sync);
 reduced.addEventListener('change',()=>{if(reduced.matches){wantsPlay=false;draw();sync();}});
 draw();
})();
