/* Scientific view: physically labelled schematic, NOT a wavefunction solution. */
(()=>{
const spectral={
 1:[410.2,434.0,486.1,656.3], 2:[447.1,501.6,587.6,667.8],
 3:[670.8], 10:[585.2,640.2,703.2], 11:[589.0,589.6],
 80:[404.7,435.8,546.1,577.0,579.1]
};
const uses={
 1:[['Üzemanyagcellák és ammóniagyártás','Brennstoffzellen und Ammoniakherstellung'],['Hidrogénezési eljárások','Hydrierungsprozesse']],
 2:[['Kriogén hűtés','Kryogene Kühlung'],['Szivárgásvizsgálat','Lecksuche']],
 6:[['Grafit elektródák','Graphitelektroden'],['Gyémánt vágóeszközök','Diamant-Schneidwerkzeuge']],
 7:[['Műtrágyagyártás','Düngemittelproduktion'],['Védőgáz egyes ipari eljárásoknál','Schutzgas bei Industrieprozessen']],
 8:[['Orvosi oxigénellátás','Medizinische Sauerstoffversorgung'],['Acélgyártás','Stahlproduktion']],
 10:[['Fényreklámok és jelzőlámpák','Leuchtreklame und Signallampen']],
 11:[['Nátriumgőzlámpák','Natriumdampflampen'],['Hőátadó közeg speciális reaktorokban','Wärmeträger in speziellen Reaktoren']],
 14:[['Félvezető mikrochipek','Halbleiter-Mikrochips'],['Napelemek','Solarzellen']],
 26:[['Acél és mágnesek','Stahl und Magnete'],['Gépszerkezetek','Maschinenbau']],
 29:[['Villamos vezetékek','Elektrische Leitungen'],['Hőcserélők','Wärmetauscher']],
 47:[['Érintkezők és vezető felületek','Kontakte und leitfähige Oberflächen']],
 60:[['Nagy teljesítményű mágnesek','Hochleistungsmagnete'],['Lézerek és optikai anyagok','Laser und optische Materialien']],
 80:[['Fénycsövek (történeti)','Leuchtstofflampen (historisch)'],['Mérőeszközök (történeti)','Messgeräte (historisch)']]
};
const insight={
 1:['Egy elektronja van; a Balmer-vonalak a látható tartományban figyelhetők meg.','Ein Elektron; die Balmer-Linien liegen im sichtbaren Spektralbereich.'],
 6:['Négy vegyértékelektronja teszi lehetővé a sokféle kovalens szerkezetet.','Vier Valenzelektronen ermöglichen vielfältige kovalente Strukturen.'],
 7:['Öt vegyértékelektronja van; a N₂ molekulában erős hármas kötés alakul ki.','Fünf Valenzelektronen; in N₂ bildet sich eine starke Dreifachbindung.'],
 8:['Hat vegyértékelektronja miatt sok vegyületben két kovalens kötést alakít ki.','Mit sechs Valenzelektronen bildet Sauerstoff in vielen Verbindungen zwei kovalente Bindungen.'],
 11:['Egy vegyértékelektront könnyen leadhat, gyakran Na⁺ iont képez.','Ein Valenzelektron kann leicht abgegeben werden; häufig entsteht Na⁺.']
};
const h=(a,b)=>lang==='hu'?a:b;
const map={alkali:'#ff8864',earth:'#efbb66',transition:'#77b2ff',post:'#72d4ad',metalloid:'#c89afa',nonmetal:'#53dbb9',halogen:'#96e4a1',noble:'#68daf6',lanth:'#ffaa73',act:'#ff8cbd'};
const getEl=()=>elements[selected-1];
function row(label,value){let el=document.createElement('div');el.className='science-kv';let l=document.createElement('span'),v=document.createElement('strong');l.textContent=label;v.textContent=value;el.append(l,v);return el}
function spectrumColor(w){let hue=w<450?264:w<490?218:w<520?174:w<565?108:w<590?62:w<620?35:0;return `hsl(${hue} 100% 67%)`}
window.updateScientificPanel=function(force=false){
 if(atomVisualMode!=='scientific')return;
 const e=getEl(),key=`${e.z}-${lang}`;
 if(!force&&window.scienceLastKey===key)return;
 window.scienceLastKey=key;
 const addon=document.getElementById('scientificAddon');addon.style.setProperty('--sc-accent',map[e.cat]||'#69d2f1');
 const ess=document.getElementById('scienceEssentials');ess.replaceChildren();
 const occ=shellCounts(e.z), val=occ[occ.length-1]||0;
 const entries=[
 [h('Protonok / elektronok','Protonen / Elektronen'),`${e.z} p⁺ / ${e.z} e⁻`],
 [h('Legkülső héj elektronjai','Elektronen der äußersten Schale'),String(val)],
 [h('Elektronhéjak','Elektronenschalen'),occ.join(' · ')],
 [h('Tömeg (átlagos atomtömeg)','Mittlere Atommasse'),`${e.mass} u`],
 [h('Periódus / csoport','Periode / Gruppe'),`${e.r<=7?e.r:'f'} / ${e.g}`]
 ];for(const [l,v] of entries)ess.append(row(l,v));
 document.getElementById('scienceInsight').textContent=(insight[e.z]||[h('Az elektronkonfiguráció és a kötéstípus a részletes adatlapon vizsgálható.','Elektronenkonfiguration und Bindungen sind in der Detailansicht zu finden.'),h('Az elektronkonfiguráció és a kötéstípus a részletes adatlapon vizsgálható.','Elektronenkonfiguration und Bindungen sind in der Detailansicht zu finden.')])[lang==='hu'?0:1];
 const list=document.getElementById('scienceUses');list.replaceChildren();const items=uses[e.z];
 if(items){items.forEach((u,i)=>{const v=document.createElement('div');v.className='science-uses';const no=document.createElement('small');no.textContent=String(i+1).padStart(2,'0');v.append(no,document.createTextNode(u[lang==='hu'?0:1]));list.append(v)})}
 else {const p=document.createElement('p');p.className='science-small';p.textContent=h('Ehhez az elemhez még nincs ellenőrzött felhasználási lista.','Für dieses Element liegt noch keine kuratierte Anwendungsliste vor.');list.append(p)}
 const spectrum=document.getElementById('scienceSpectrum');spectrum.replaceChildren();const lines=spectral[e.z]||[];spectrum.style.background=lines.length?'':'#101c2b';
 for(const nm of lines){if(nm<380||nm>750)continue;const line=document.createElement('div');line.className='science-line';line.style.left=`${(nm-380)/370*100}%`;line.style.color=spectrumColor(nm);line.style.background=spectrumColor(nm);line.title=`${nm.toFixed(1)} nm`;spectrum.append(line)}
 const note=document.getElementById('scienceSpectrumNote');note.textContent=lines.length?
 h(`Válogatott, közelítő atomos emissziós vonalak (nm): ${lines.join(' · ')}. Nem teljes spektrum; függ a gerjesztéstől.`,`Ausgewählte, gerundete atomare Emissionslinien (nm): ${lines.join(' · ')}. Kein vollständiges Spektrum; anregungsabhängig.`):
 h('Nincs ellenőrzött látható emissziós vonaladat ehhez az elemhez; nem jelenítünk meg kitalált spektrumot.','Keine kuratierten sichtbaren Emissionslinien verfügbar; es wird kein Spektrum erfunden.');
 document.getElementById('scienceModelNote').textContent=h('Tudományos megjegyzés: a Scientific animáció látványos, elektronkonfigurációt követő szemléltető modell. A fénylő körívek nem valódi elektronpályák; az orbitálalakok nem számított hullámfüggvények. A spektrális vonalak tájékoztató hullámhosszak, referencia: NIST Atomic Spectra Database.','Wissenschaftlicher Hinweis: Scientific ist eine anschauliche Illustration, keine berechnete Wellenfunktion. Leuchtende Bahnen sind keine realen Elektronenbahnen. Spektrallinien sind ausgewählte Referenzwellenlängen, Quelle: NIST Atomic Spectra Database.');
 const nav=document.getElementById('scienceNavigator');nav.replaceChildren();const start=Math.max(1,Math.min(109,e.z-5));for(let z=start;z<=Math.min(118,start+10);z++){const a=elements[z-1],b=document.createElement('button');b.textContent=a.s;b.title=`${a.z} · ${a[lang]}`;b.classList.toggle('active',a.z===e.z);b.onclick=()=>{selected=a.z;render();updateScientificPanel(true)};nav.append(b)}
};
function paintScientific(){const rect=cv.getBoundingClientRect();if(rect.width<2)return;const dpr=Math.min(devicePixelRatio||1,2),W=rect.width,H=rect.height;cv.width=Math.max(1,Math.round(W*dpr));cv.height=Math.max(1,Math.round(H*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
 const e=getEl(),col=map[e.cat]||'#58dcef',base=Math.min(W,H)*.33*zoom,cx=W/2,cy=H/2+7,shells=shellCounts(e.z);
 const halo=ctx.createRadialGradient(cx,cy,1,cx,cy,base*1.45);halo.addColorStop(0,col+'38');halo.addColorStop(.7,col+'10');halo.addColorStop(1,col+'00');ctx.fillStyle=halo;ctx.fillRect(cx-base*1.5,cy-base*1.5,base*3,base*3);
 ctx.save();ctx.globalCompositeOperation='screen';
 // Shells are illustrative: orbit planes and electron markers are not physical trajectories.
 for(let k=0;k<shells.length;k++){
  const radius=base*(.35+k*.105),tilt=k*.76+Math.PI/4;ctx.beginPath();
  for(let n=0;n<=115;n++){const a=n/115*Math.PI*2;let [x,y]=project(Math.cos(a)*radius,Math.sin(a)*radius*Math.cos(tilt),Math.sin(a)*radius*Math.sin(tilt));if(n===0)ctx.moveTo(cx+x,cy+y);else ctx.lineTo(cx+x,cy+y)}
  ctx.strokeStyle=col;ctx.globalAlpha=.16+.03*k;ctx.lineWidth=2.7;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
  const count=Math.min(shells[k],22);for(let j=0;j<count;j++){let a=(j/count)*Math.PI*2+(playing?clock*.6/(k+1):clock*.6/(k+1));let [x,y,z]=project(Math.cos(a)*radius,Math.sin(a)*radius*Math.cos(tilt),Math.sin(a)*radius*Math.sin(tilt));ctx.globalAlpha=.6+Math.max(0,z/base)*.35;ctx.fillStyle='#f7fbff';ctx.shadowColor='#fff';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(cx+x,cy+y,3.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 }
 // Distinct orbital motifs by s/p/d/f occupancy family, schematic only.
 const shapes=e.z<=2?1:e.z<=10?3:e.z<=20?4:e.z<=56?5:7;
 for(let i=0;i<shapes;i++){const a=clock*.04+i*Math.PI/shapes;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.globalAlpha=.14;ctx.shadowColor=col;ctx.shadowBlur=16;ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(0,0,base*(.28+.03*(i%3)),base*.68,a*.16,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;ctx.restore()}
 ctx.globalAlpha=1;ctx.restore();
 const coreR=Math.max(10,Math.min(30,base*.14)),g=ctx.createRadialGradient(cx-coreR*.3,cy-coreR*.3,1,cx,cy,coreR*1.6);g.addColorStop(0,'#fff');g.addColorStop(.25,col);g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,coreR*1.6,0,Math.PI*2);ctx.fill();
 ctx.font='600 12px ui-monospace,monospace';ctx.fillStyle='#d7eaf6';ctx.textAlign='center';ctx.fillText(`${e.s} · Z=${e.z} · ${shells.join('·')}`,cx,Math.max(18,H-18));
 if(playing){clock+=.009;rotY+=.00065}
}
window.scientificFrame=function(){paintScientific();updateScientificPanel()};
})();
