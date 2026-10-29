/* Chemistry Lab 1.4 optional teaching panel - additive extension of Beta 1.3. Apache-2.0. */
(function(){
'use strict';
const el=id=>document.getElementById(id);
const canvas=el('molCanvas');if(!canvas||!window.ChemistryEngine)return;
const host=canvas.parentElement; // Stable DOM host: moleculeInspector is re-rendered by the legacy application.
const panel=document.createElement('section');panel.id='engine14Panel';panel.className='panel';
panel.style.cssText='margin-top:12px;padding:14px;border-color:#315369';
panel.innerHTML='<div class="eyebrow" id="engine14Label">MOLEKULA ENGINE 2.0</div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:12px 0"><button type="button" id="engine14Hydrogens">+ H · Automatikus hidrogének</button><button type="button" id="engine14Refresh">↻ Elemzés</button></div><div class="note" id="engine14Analysis" aria-live="polite"></div>';
host.appendChild(panel);
const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=(hu,de)=>lang==='de'?de:hu;
const names={linear:['Lineáris','Linear'],bent:['Hajlított','Gewinkelt'],'trigonal-planar':['Trigonális sík','Trigonal-planar'],tetrahedral:['Tetraéderes','Tetraedrisch'],'trigonal-pyramidal':['Trigonális piramis','Trigonal-pyramidal'],unknown:['Nem meghatározható','Nicht bestimmbar']};
const bondNames={'nonpolar-covalent':['Apoláris kovalens','Unpolare kovalente Bindung'],'polar-covalent':['Poláris kovalens','Polare kovalente Bindung'],'ionic-possible':['Lehetséges ionos jelleg','Möglicher Ionenbindungscharakter'],ionic:['Ionos kapcsolati ábra','Ionische Nachbarschaft'],'metallic':['Fémes kapcsolat / rács','Metallische Nachbarschaft'],unknown:['Nem osztályozható','Nicht klassifizierbar']};
function repaint(){
 const result=ChemistryEngine.analyze(molAtoms,molBonds);
 el('engine14Label').textContent=tr('KÖTÉSEK ÉS TÉRGEOMETRIA','BINDUNGEN UND MOLEKÜLGEOMETRIE');
 el('engine14Hydrogens').textContent=tr('+ H · Automatikus hidrogének','+ H · Wasserstoff ergänzen');
 el('engine14Refresh').textContent=tr('↻ Elemzés','↻ Analysieren');
 let html='<b>'+htmlEscape(formula())+'</b> · '+tr('Atomok: ','Atome: ')+result.atoms+' · '+tr('Kapcsolatok: ','Verbindungen: ')+result.bonds+'<div style="margin-top:8px">';
 if(!molAtoms.length)html+=tr('Válassz egy molekulát vagy helyezz el atomokat.','Wähle ein Molekül oder platziere Atome.');
 else {
  const status={invalid:tr('Túlkötött atom: ellenőrizd a szerkezetet.','Überbindiges Atom: Struktur prüfen.'),incomplete:tr('Hiányos vegyérték: opcionálisan egészítsd ki hidrogénnel.','Unvollständige Valenz: optional Wasserstoff ergänzen.'),plausible:tr('A szokásos egyszerű vegyértékekkel összeegyeztethető.','Mit gewöhnlichen einfachen Valenzregeln vereinbar.')};
  html+='<div style="color:'+(result.validity==='invalid'?'#ff9c90':'#9bdcdd')+'">'+status[result.validity]+'</div>';
  if(result.centers.length){html+='<p><b>'+tr('Becsült VSEPR-geometria','Geschätzte VSEPR-Geometrie')+'</b></p>';
   result.centers.slice(0,12).forEach(c=>{let item=names[c.geometry]||names.unknown;html+='<div class="data"><span>'+htmlEscape(c.element)+' #'+(c.index+1)+'</span><b>'+item[lang==='de'?1:0]+(c.approxAngle!==null?' · ~'+c.approxAngle+'°':'')+'</b></div>'});}
  if(result.edges.length){html+='<p><b>'+tr('Kötésosztályozás','Bindungsklassifikation')+'</b></p>';
   result.edges.slice(0,20).forEach(e=>{let label=bondNames[e.type]||bondNames.unknown;html+='<div class="data"><span>'+htmlEscape(e.a)+' — '+htmlEscape(e.b)+'</span><b>'+label[lang==='de'?1:0]+(e.delta!==null?' · Δχ='+e.delta:'')+'</b></div>'});}
  const suggestions=ChemistryEngine.suggestedHydrogens(molAtoms,molBonds);
  html+='<p>'+tr('Javasolt H-atomok egyszerű semleges C/N/O szerkezethez: ','Vorgeschlagene H-Atome für einfache neutrale C/N/O-Struktur: ')+suggestions.reduce((n,x)=>n+x.count,0)+'</p>';
 }
 html+='</div><p class="hint">'+tr('Oktatási modell: a VSEPR kötésszögek közelítő értékek. Nem végez kvantumkémiai energiaoptimalizálást és nem igazolja a molekula tényleges stabilitását.','Lernmodell: VSEPR-Winkel sind Näherungen. Keine quantenchemische Energieoptimierung und kein Nachweis der tatsächlichen Stabilität.')+'</p>';
 el('engine14Analysis').innerHTML=html;
}
el('engine14Refresh').onclick=repaint;
el('engine14Hydrogens').onclick=()=>{
 const additions=ChemistryEngine.suggestedHydrogens(molAtoms,molBonds);
 if(!additions.length){repaint();return}
 snapshot();let next=Date.now()*1000;
 for(const {id,count} of additions){let parent=molAtoms.find(x=>x.id===id);if(!parent)continue;
  let existing=molBonds.filter(b=>b.a===id||b.b===id).length;
  for(let i=0;i<count;i++){
   const angle=(existing+i)*2*Math.PI/(existing+count)-Math.PI/2;
   const h={id:++next,s:'H',x:parent.x+65*Math.cos(angle),y:parent.y+65*Math.sin(angle)};
   molAtoms.push(h);molBonds.push({a:id,b:h.id,order:1});
  }
 }
 updateMolStatus();repaint();
};
// Existing code continuously updates status on editor actions. Keep its behavior and add a read-only analysis panel.
const previous=updateMolStatus;
updateMolStatus=function(){previous();repaint()};
const previousRender=render;
render=function(){previousRender();repaint()};
repaint();
})();
