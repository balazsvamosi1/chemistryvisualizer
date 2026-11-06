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
 const args=['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--hide-scrollbars','--no-first-run','--no-default-browser-check','--virtual-time-budget=3500','--dump-dom',url];
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
