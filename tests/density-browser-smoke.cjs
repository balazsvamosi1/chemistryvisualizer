/* Actual Chromium pixel smoke test for the Density Lab. No npm dependencies. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {spawn,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const candidates=[process.env.CHROME_BIN,'google-chrome','google-chrome-stable','chromium','chromium-browser'].filter(Boolean);
const chrome=candidates.find(cmd=>spawnSync(cmd,['--version'],{encoding:'utf8',timeout:5000}).status===0);
if(!chrome){console.error('Chromium or Google Chrome is required for density pixel testing');process.exit(1);}
const probe=`<script>
window.addEventListener('load',()=>{
 try{
   const tab=document.getElementById('densityTab');tab.click();
   window.ChemistryNavigation?.activate('densityTab',false);
   const lab=window.ChemistryDensityLab;
   if(!lab)throw new Error('Density UI did not initialize');
   lab.render();
   const sample=c=>{
     const canvas=document.getElementById(c),ctx=canvas.getContext('2d');
     if(!ctx)throw new Error('2D canvas unavailable '+c);
     const w=canvas.width,h=canvas.height,p=ctx.getImageData(0,0,w,h).data;
     let count=0,minX=w,maxX=0,minY=h,maxY=0,nonbg=0,max=[0,0,0,0];
     for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
       const i=(y*w+x)*4;
       if(p[i]!==11||p[i+1]!==32||p[i+2]!==50)nonbg++;
       max[0]=Math.max(max[0],p[i]);max[1]=Math.max(max[1],p[i+1]);max[2]=Math.max(max[2],p[i+2]);max[3]=Math.max(max[3],p[i+3]);
       if(p[i]>215&&p[i+1]>225&&p[i+2]>230){
         count++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
       }
     }
     return{count,nonbg,width:maxX-minX,height:maxY-minY,max,canvas:[w,h],rect:canvas.getBoundingClientRect().width,debug:canvas.getAttribute('data-density-debug')};
   };
   const beforeA=sample('densityCanvasA'),beforeB=sample('densityCanvasB');
   if(beforeA.count<100||beforeB.count<100)throw new Error('Canvas blank: '+JSON.stringify({beforeA,beforeB}));
   const selectA=document.getElementById('densityMaterialA'),selectB=document.getElementById('densityMaterialB');
   if(selectA.value!=='water'||selectB.value!=='aluminum')throw new Error('Wrong default materials: '+selectA.value+'/'+selectB.value);
   // School view is the DEFAULT. Lead must look denser than aluminium in
   // equal volumes; each dot is a constant mass, NOT a literal atom.
   const advanced=document.getElementById('densityAdvanced');
   if(!advanced||advanced.checked)throw new Error('Classroom mode must be the default');
   if(!document.getElementById('densityModelInfo').textContent.includes('NEM kvantumfizikai'))
     throw new Error('Missing explicit non-quantum-model disclaimer');
   document.getElementById('densityPreset5').click();
   const beginnerA=document.getElementById('densityParticleInfoA'),beginnerB=document.getElementById('densityParticleInfoB');
   const countPb=Number(beginnerA.getAttribute('data-markers')),countAl=Number(beginnerB.getAttribute('data-markers'));
   if(!(countPb>countAl*3.5))throw new Error('Lead fails to look denser in classroom mode: '+countPb+'/'+countAl);
   if(!beginnerA.textContent.includes('1 pont = ')||beginnerA.textContent.includes('mol'))
     throw new Error('Default points falsely described as atoms/moles: '+beginnerA.textContent);
   const firstScale=beginnerA.getAttribute('data-marker-scale'),secondScale=beginnerB.getAttribute('data-marker-scale');
   if(firstScale!==secondScale)throw new Error('Classroom samples use different grams-per-dot');
   const modeEqualMass=document.getElementById('densityMode');
   modeEqualMass.value='mass';modeEqualMass.dispatchEvent(new Event('change',{bubbles:true}));
   if(Number(beginnerA.getAttribute('data-markers'))!==Number(beginnerB.getAttribute('data-markers')))
     throw new Error('Equal-mass classroom samples must contain equal dot counts');
   const packedLead=sample('densityCanvasA'),looseAl=sample('densityCanvasB');
   if(!(packedLead.width<looseAl.width*.82))
     throw new Error('Lead box is not visibly smaller in equal-mass mode');
   // Old, scientifically focused tests still run with Advanced explicitly ON.
   advanced.checked=true;advanced.dispatchEvent(new Event('change',{bubbles:true}));
   document.getElementById('densityMaterialA').value='water';
   document.getElementById('densityMaterialB').value='aluminum';
   document.getElementById('densityMode').value='volume';
   document.getElementById('densityMode').dispatchEvent(new Event('change',{bubbles:true}));
   const fillA=document.getElementById('densityMeterFillA'),fillB=document.getElementById('densityMeterFillB');
   const massFraction=parseFloat(fillA.style.width),metalMassPercent=parseFloat(fillB.style.width);
   if(!(massFraction>30&&massFraction<40&&metalMassPercent===100))
     throw new Error('Equal-volume mass bars must show real density difference: '+massFraction+'/'+metalMassPercent);
   const mode=document.getElementById('densityMode');mode.value='mass';mode.dispatchEvent(new Event('change',{bubbles:true}));
   const left=sample('densityCanvasA'),right=sample('densityCanvasB');
   if(!(left.width>right.width*1.18))throw new Error('Equal-mass samples not visibly sized by volume: '+JSON.stringify({left,right}));
   const waterVolumePercent=parseFloat(fillA.style.width),alVolumePercent=parseFloat(fillB.style.width);
   if(!(waterVolumePercent===100&&alVolumePercent>30&&alVolumePercent<40))
     throw new Error('Equal-mass volume bars must show real difference: '+waterVolumePercent+'/'+alVolumePercent);
   const slider=document.getElementById('densityQuantity'),at1000=left.width;
   slider.value='100';slider.dispatchEvent(new Event('input',{bubbles:true}));
   const at100=sample('densityCanvasA');
   if(!(at100.width<at1000*.75))throw new Error('Changing quantity should visibly shrink both cubes: '+JSON.stringify({at100,at1000}));
   // The earlier version plateaued above ~1400: every step must now increase
   // the actual pixel size, not only the number of particles.
   const measured=[];
   for(const amount of [100,500,1000,2500,5000]){
     slider.value=String(amount);slider.dispatchEvent(new Event('input',{bubbles:true}));
     const a=sample('densityCanvasA'),b=sample('densityCanvasB');
     measured.push([amount,a.width,b.width]);
     const rhoA=document.getElementById('densitySelectedA').textContent;
     const rhoB=document.getElementById('densitySelectedB').textContent;
     if(!rhoA.includes('g/cm³')||!rhoB.includes('g/cm³'))
       throw new Error('Density in g/cm³ absent beside material name: '+rhoA+' / '+rhoB);
   }
   for(let i=1;i<measured.length;i++){
      if(!(measured[i][1]>measured[i-1][1]*1.08&&measured[i][2]>measured[i-1][2]*1.08))
        throw new Error('Cube size plateaued even though volume increased: '+JSON.stringify(measured));
   }
   if(!document.getElementById('densityMaterialA').selectedOptions[0].textContent.includes('g/cm³'))
      throw new Error('Dropdown options missing g/cm³ density');
   document.getElementById('densityPreset5').click();
   if(document.getElementById('densityMaterialA').value!=='lead'||document.getElementById('densityMaterialB').value!=='aluminum')
     throw new Error('Lead preset did not change material selections');
   document.getElementById('densityPreset7').click();
   if(document.getElementById('densityMaterialA').value!=='helium'||document.getElementById('densityMaterialB').value!=='carbonDioxide')
     throw new Error('Gas preset did not change material selections');
   const gasInfo=document.getElementById('densityExplanation').textContent;
   if(!gasInfo.includes('gázok')&&document.getElementById('hu')?.classList.contains('active'))
     throw new Error('Gas law explanation is missing');
   const gasA=sample('densityCanvasA'),gasB=sample('densityCanvasB');
   if(gasA.count<100||gasB.count<100)throw new Error('Gas diagrams are blank: '+JSON.stringify({gasA,gasB}));
   // Prove that particle counts visibly track the slider without changing the
   // number of real molecules shown one-for-one.
   const modeVolume=document.getElementById('densityMode');
   modeVolume.value='volume';modeVolume.dispatchEvent(new Event('change',{bubbles:true}));
   const chooseA=document.getElementById('densityMaterialA'),chooseB=document.getElementById('densityMaterialB');
   chooseA.value='water';chooseB.value='lead';chooseB.dispatchEvent(new Event('change',{bubbles:true}));
   const initialWater=Number(document.getElementById('densityParticleInfoA').getAttribute('data-markers'));
   const initialLead=Number(document.getElementById('densityParticleInfoB').getAttribute('data-markers'));
   if(!(initialWater>0&&Math.abs(initialWater-initialLead)<=2))
     throw new Error('Water/lead representative number density wrong: '+initialWater+'/'+initialLead);
   const amount=document.getElementById('densityQuantity');
   amount.value='5000';amount.dispatchEvent(new Event('input',{bubbles:true}));
   const largeWater=Number(document.getElementById('densityParticleInfoA').getAttribute('data-markers'));
   const largeLead=Number(document.getElementById('densityParticleInfoB').getAttribute('data-markers'));
   if(!(largeWater>initialWater*3&&largeLead>initialLead*3))
     throw new Error('Particle markers must grow when the volume slider grows: '+JSON.stringify({initialWater,initialLead,largeWater,largeLead}));
   const finalA=sample('densityCanvasA'),finalB=sample('densityCanvasB');
   if(finalA.count<100||finalB.count<100)throw new Error('Updated particle diagrams disappeared');
   chooseA.value='water';chooseB.value='argon';chooseB.dispatchEvent(new Event('change',{bubbles:true}));
   const piA=document.getElementById('densityParticleInfoA'),piB=document.getElementById('densityParticleInfoB');
   const waterSymbols=Number(piA.getAttribute('data-markers')),argonSymbols=Number(piB.getAttribute('data-markers'));
   const waterEquivalent=Number(piA.getAttribute('data-marker-equivalent')),argonEquivalent=Number(piB.getAttribute('data-marker-equivalent'));
   const waterScale=Number(piA.getAttribute('data-marker-scale')),argonScale=Number(piB.getAttribute('data-marker-scale'));
   if(!(waterSymbols>80&&argonSymbols===1&&argonEquivalent<.5&&waterEquivalent>100&&waterScale===argonScale))
     throw new Error('Water/argon common scale failed: '+JSON.stringify({waterSymbols,argonSymbols,waterEquivalent,argonEquivalent,waterScale,argonScale}));
   if(!piB.textContent.includes('egyenérték'))throw new Error('Argon fractional indicator missing');
   if(!document.getElementById('densityExplanation').textContent.includes('Közös részecskeszámskála'))throw new Error('Shared scale explanation missing');
   if(!document.getElementById('densitySelectedB').textContent.includes('0,0016607'))throw new Error('Argon density changed unexpectedly');
   advanced.checked=false;advanced.dispatchEvent(new Event('change',{bubbles:true}));
   document.getElementById('densityPreset5').click();
   if(!(Number(beginnerA.getAttribute('data-markers'))>Number(beginnerB.getAttribute('data-markers'))*3.5))
     throw new Error('Switching back to simple mode did not restore mass-based markers');
   // Desktop viewport must place both 3D canvases next to the live controls,
   // not below a tall toolbar that forces the student to scroll.
   const workspace=document.querySelector('#densitySection .density-workspace');
   const controls=document.querySelector('#densitySection .density-workspace > .density-controls');
   const modelA=document.getElementById('densityCanvasA');
   const modelB=document.getElementById('densityCanvasB');
   const wr=workspace.getBoundingClientRect(),cr=controls.getBoundingClientRect();
   const ar=modelA.getBoundingClientRect(),br=modelB.getBoundingClientRect();
   if(window.innerWidth>=1100){
     if(!(ar.left>=cr.right-3&&br.left>ar.left&&Math.abs(ar.top-br.top)<6))
       throw new Error('Desktop workspace must show two cubes alongside controls: '+JSON.stringify({viewport:window.innerWidth,controls:[cr.x,cr.y,cr.width,cr.height],a:[ar.x,ar.y,ar.width,ar.height],b:[br.x,br.y,br.width,br.height]}));
     if(!(ar.top<cr.bottom&&br.top<cr.bottom))
       throw new Error('Canvas starts too low: student would have to scroll from the slider to see cubes');
     const summary=document.getElementById('densityComparisonLead').getBoundingClientRect();
     if(!(summary.x>=cr.x-2&&summary.right<=cr.right+2))
       throw new Error('Live comparison summary no longer near the controls');
   }
   // Four non-assessed Academy lessons must open the SAME physical lab,
   // preload its settings, then return to the exact lesson without scoring.
   const academy=document.getElementById('curriculumTab');academy.click();
   const topicSelect=document.getElementById('curriculumTopic');
   topicSelect.value='density';topicSelect.dispatchEvent(new Event('change',{bubbles:true}));
   const academyPanel=document.getElementById('curriculumSection');
   if(academyPanel.classList.contains('hidden'))throw new Error('Academy tab not visible');
   const topics=document.getElementById('curriculumContent');
   const cases=[
     ['lead','aluminum','mass',1000],
     ['lead','aluminum','volume',1000],
     ['water','aluminum','volume',1000],
     ['wood','iron','volume',1000]
   ];
   if(document.getElementById('curriculumexam').hidden!==true
       ||document.getElementById('curriculumpractice').hidden!==true)
     throw new Error('Density discovery must not offer quizzes or exams');
   for(let i=0;i<cases.length;i++){
     const launch=topics.querySelector('.academy-density-open');
     if(!launch)throw new Error('Missing Academy discovery lab launch at lesson '+i);
     launch.click();
     const [aId,bId,modeId,q]=cases[i];
     const state=window.ChemistryDensityLab.getComparison();
     if(!(state.left.id===aId&&state.right.id===bId&&state.mode===modeId
       &&state.quantity===q))
       throw new Error('Academy lab preset mismatch at lesson '+i+': '+JSON.stringify(state));
     if(document.getElementById('densitySection').classList.contains('hidden'))
       throw new Error('Density lab not shown from Academy');
     const back=document.getElementById('academyDensityReturn');
     if(!back)throw new Error('No return to Academy');
     back.click();
     if(academyPanel.classList.contains('hidden')||document.getElementById('academyDensityReturn'))
       throw new Error('Returning from lab did not restore Academy');
     const explanation=topics.querySelector('.academy-density-reveal');
     if(!explanation)throw new Error('Non-scored explanation control missing');
     explanation.click();
     if(!topics.querySelector('.academy-density-explanation'))
       throw new Error('Explanation not shown at lesson '+i);
     if(topics.querySelector('input[type="radio"]'))
       throw new Error('Density discovery must not ask scored questions');
     topics.querySelector('.academy-density-next').click();
   }
   if(!topics.textContent.includes('1/4'))throw new Error('Fourth lesson did not wrap to first');
   // Dual-substance phase comparison: shared temperature, two animated
   // canvases, 11 materials, eight presets and validated state changes.
   document.getElementById('densityTab').click();
   window.ChemistryNavigation?.activate('densityTab',false);
   const phaseButton=document.getElementById('densityViewPhase');
   phaseButton.click();
   const dual=window.ChemistryPhaseCompare;
   if(!dual)throw new Error('Dual-phase UI did not initialize');
   const phasePanel=document.getElementById('densityPhasePanel');
   if(phasePanel.hidden||document.getElementById('densitySection').dataset.densityView!=='phase')
    throw new Error('Phase comparison did not open');
   if(document.getElementById('phaseMaterialA').options.length!==11||
      document.getElementById('phaseMaterialB').options.length!==11)
    throw new Error('The 11 substances are not available in both selectors');
   if(document.querySelectorAll('#phaseComparePresets button').length!==8)
    throw new Error('The 8 comparison presets are missing');
   const pixel=id=>{
    const c=document.getElementById(id),ctx=c?.getContext('2d');
    if(!ctx)throw new Error('Missing phase canvas: '+id);
    const d=ctx.getImageData(0,0,c.width,c.height).data;let bright=0;
    for(let i=0;i<d.length;i+=24)if(d[i]>80&&d[i+1]>130&&d[i+2]>100)bright++;
    if(bright<45)throw new Error('Phase canvas blank: '+id+'/'+bright);
   };
   for(const [a,b,t,pa,pb] of [
    ['water','ethanol',20,'liquid','liquid'],
    ['lead','aluminum',400,'liquid','solid'],
    ['oxygen','carbonDioxide',-100,'gas','solid'],
    ['nitrogen','oxygen',-200,'liquid','liquid'],
    ['sulfur','paraffin',60,'solid','softening'],
    ['water','ethanol',100,'boiling','gas']
   ]){
    if(!dual.select(a,b,t))throw new Error('Valid phase selection rejected');
    const s=dual.getSnapshot();
    if(s.left.phase!==pa||s.right.phase!==pb||s.temperature!==t)
      throw new Error('Wrong phase state for '+a+'/'+b+'/'+t+': '+s.left.phase+'/'+s.right.phase);
    pixel('phaseCanvasA');pixel('phaseCanvasB');
    if(!document.getElementById('phaseDensityA').textContent||
       !document.getElementById('phaseVolumeB').textContent)throw new Error('Missing phase statistics');
   }
   dual.select('carbonDioxide','water',-78);
   if(!document.getElementById('phaseStateA').textContent.includes('Szublimáció'))
    throw new Error('CO2 sublimation not explained');
   dual.select('paraffin','sulfur',300);
   if(document.getElementById('phaseBoilA').textContent.includes('°C'))
    throw new Error('Paraffin given fictitious single boiling temperature');
   dual.select('water','ethanol',20);
   if(!document.getElementById('phaseCaution').textContent.includes('NEM kvantumfizikai'))
    throw new Error('Missing teaching accuracy warning');
   if(window.innerWidth>=1100){
    const a=document.getElementById('phaseCanvasA').getBoundingClientRect(),
      b=document.getElementById('phaseCanvasB').getBoundingClientRect(),
      ctrl=document.querySelector('.density-phase-controls').getBoundingClientRect();
    if(!(a.left>=ctrl.right-4&&b.left>a.left&&Math.abs(a.top-b.top)<6))
     throw new Error('Two phase models are not side by side with temperature controls');
   }
   window.ChemistryDensityLab.configure({left:'lead',right:'aluminum',mode:'volume',quantity:1000,shape:'cube'});
   if(document.getElementById('densitySection').dataset.densityView!=='compare'||!phasePanel.hidden)
    throw new Error('Returning from Academy did not restore original density laboratory');
   document.documentElement.setAttribute('data-density-smoke','PASS');
 }catch(error){document.documentElement.setAttribute('data-density-smoke','FAIL: '+error.message);console.error(error);}
});
</script>`;
const mime=p=>p.endsWith('.js')?'text/javascript':p.endsWith('.css')?'text/css':p.endsWith('.json')?'application/json':p.endsWith('.html')?'text/html':'application/octet-stream';
const server=http.createServer((req,res)=>{
 try{
  const reqPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname),target=path.resolve(root,'.'+reqPath);
  if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);return res.end('Forbidden');}
  if(reqPath==='/'||reqPath==='/index.html'){
   let body=fs.readFileSync(path.join(root,'index.html'),'utf8');
   body=body.replace('</body>',probe+'</body>');
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(body);
  }
  if(!fs.statSync(target).isFile()){res.writeHead(404);return res.end('Not a file');}
  res.writeHead(200,{'Content-Type':mime(target),'Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
 }catch(e){res.writeHead(404);res.end('Not Found');}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port+'/';
 const args=['--headless=new','--window-size=1440,900','--force-device-scale-factor=1','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--hide-scrollbars','--no-first-run','--no-default-browser-check','--virtual-time-budget=3500','--dump-dom',url];
 const child=spawn(chrome,args,{stdio:['ignore','pipe','pipe']});
 let output='',errors='';child.stdout.setEncoding('utf8');child.stderr.setEncoding('utf8');
 child.stdout.on('data',chunk=>output+=chunk);
 child.stderr.on('data',chunk=>errors+=chunk);
 const exit=await Promise.race([
  new Promise(resolve=>child.on('close',code=>resolve({code}))),
  new Promise(resolve=>setTimeout(()=>{child.kill('SIGKILL');resolve({code:124});},30000))
 ]);
 server.close();
 const result=output.match(/data-density-smoke="([^"]*)"/)?.[1];
 console.log('Chromium pixel smoke:',result||'NO RESULT', 'exit',exit.code);
 if(result!=='PASS'||exit.code!==0){console.error(errors.slice(-3000));process.exitCode=1;}
})();
