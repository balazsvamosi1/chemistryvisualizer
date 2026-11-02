/* Visible, mode-specific scientific accuracy labels. */
(function(){'use strict';if(typeof document==='undefined')return;
const $=id=>document.getElementById(id),all={
hu:{
 bohr:'BOHR-MODELL · Csak szemléltetés. Az elektronok nem klasszikus körpályákon keringenek. A héjak az energiaszintek bevezetésére szolgálnak.',
 quantum:'KVANTUMNÉZET · Elektron-valószínűségi eloszlás szemléltetése, nem elektronpálya és nem közvetlen mérés. Hidrogénre analitikus, sok-elektronos atomokra közelítő pályamodell.',
 scientific:'SCIENTIFIC NÉZET · Kiválasztott referenciaadatok és sematikus vizualizáció. Spektrumok nem teljesek; a sok-elektronos pályák közelítések.',
 molecule:'MOLEKULAÉPÍTŐ · A vegyérték- és kötéstípus-jelzések egyszerűsített heurisztikák. A VSEPR csak közelítő szerkezetet jósol; töltés, rezonancia, aromásság és átmenetifém-kémia nincs teljesen modellezve.',
 geometry:'3D MODELL · Referencia-koordináta esetén ismert példaszerkezetet mutatunk, egyébként becsült elrendezést. A kép nem kvantumkémiai geometriaoptimalizálás és nem stabilitásbizonyíték.',
 quest:'JÁTÉK ÉS VALÓSÁG · Atomok gyűjtése és „fegyverek” készítése csak játékmechanika. Valódi vegyületekhez kiindulási anyagok és megfelelő reakciókörülmények szükségesek; a tűzoltási hatások és ellenfelek nem valós laboratóriumi eljárások.',
 comparison:['Játék: 2 H és 1 O gyűjtése → H₂O tárgy.','Valóság: víz keletkezése megfelelő reagensekkel és feltételekkel írható le: 2 H₂ + O₂ → 2 H₂O. Az egyenlet nem gyakorlati kísérleti útmutató.','Játék: NaCl „molekulafegyver”.','Valóság: a szilárd NaCl ionrács, nem különálló kovalens NaCl-molekulák halmaza.','Játék: kiválasztott töltet minden akadályt legyőzhet.','Valóság: reakciók és oltóanyagok alkalmazhatósága az anyagoktól és a körülményektől függ.']},
de:{
 bohr:'BOHR-MODELL · Nur didaktisch. Elektronen bewegen sich nicht auf klassischen Kreisbahnen. Schalen dienen der Einführung der Energieniveaus.',
 quantum:'QUANTENANSICHT · Illustration von Wahrscheinlichkeitsdichten, keine Bahnen oder direkten Messdaten. Analytisch für Wasserstoff; Näherung für Mehrelektronenatome.',
 scientific:'SCIENTIFIC-ANSICHT · Ausgewählte Referenzdaten und schematische Darstellung. Spektren sind nicht vollständig; Mehrelektronenorbitale werden angenähert.',
 molecule:'MOLEKÜLEDITOR · Valenz- und Bindungstypen beruhen auf Näherungen. VSEPR prognostiziert grobe Geometrien; Ladung, Resonanz, Aromatizität und Übergangsmetalle werden nicht vollständig modelliert.',
 geometry:'3D-MODELL · Entweder bekannte Referenzkoordinaten oder geschätzte Geometrie. Keine Quantenoptimierung und kein Stabilitätsbeleg.',
 quest:'SPIEL UND REALITÄT · Atome sammeln und „Waffen” herstellen sind Spielmechaniken. Echte Synthesen erfordern Edukte und Reaktionsbedingungen; Löscheffekte sind keine Laboranweisungen.',
 comparison:['Spiel: 2 H und 1 O sammeln → Wasser-Gegenstand.','Realität: 2 H₂ + O₂ → 2 H₂O beschreibt eine mögliche Reaktion unter geeigneten Bedingungen, keine praktische Anleitung.','Spiel: NaCl als „Molekülwaffe”.','Realität: festes NaCl bildet ein Ionengitter, keine einzelnen kovalenten NaCl-Moleküle.','Spiel: Munition besiegt beliebige Hindernisse.','Realität: Chemische Reaktionen und Löschmittel sind stoff- und bedingungsabhängig.']},
en:{
 bohr:'BOHR MODEL · Educational illustration only. Electrons do not travel in classical circular orbits; shells introduce energy-level concepts.',
 quantum:'QUANTUM VIEW · Illustration of probability density, not electron paths or direct measurements. Analytic for hydrogen; approximate for multielectron atoms.',
 scientific:'SCIENTIFIC VIEW · Selected reference data and schematic illustration. Spectra are incomplete and multielectron orbitals are approximations.',
 molecule:'MOLECULE BUILDER · Valence and bond labels use simplified heuristics. VSEPR only predicts approximate shapes; charges, resonance, aromaticity and transition-metal bonding are not fully modeled.',
 geometry:'3D MODEL · Reference coordinates are used when available, otherwise geometry is estimated. Neither a quantum optimization nor evidence of stability.',
 quest:'GAME VS REALITY · Collecting atoms and crafting “weapons” are gameplay rules. Real synthesis requires reagents and reaction conditions; fire effects and enemies are not laboratory procedures.',
 comparison:['Game: collect 2 H and 1 O → water item.','Reality: 2 H₂ + O₂ → 2 H₂O describes a reaction under suitable conditions, not practical instructions.','Game: NaCl as a “molecule weapon”.','Reality: solid NaCl forms an ionic lattice, not separate covalent NaCl molecules.','Game: selected ammunition defeats obstacles.','Reality: chemical reactions and extinguishing media depend on substances and conditions.']}
};
const lang=()=>['hu','de','en'].find(k=>$(k)?.classList.contains('active'))||'hu';
const model=document.createElement('p');model.id='chemistryAtomModelBadge';model.className='science-model-warning';model.setAttribute('role','note');const foot=$('viewSub')?.parentElement;if(foot)foot.append(model);
const molecule=document.createElement('p');molecule.id='chemistryMoleculeModelBadge';molecule.className='science-model-warning';molecule.setAttribute('role','note');$('molHeading')?.insertAdjacentElement('afterend',molecule);
const geometry=document.createElement('p');geometry.id='chemistryGeometryModelBadge';geometry.className='science-model-warning';geometry.setAttribute('role','note');$('molCanvas')?.insertAdjacentElement('afterend',geometry);
const game=$('gameSection');if(game){const comparison=document.createElement('details');comparison.id='chemistryQuestReality';comparison.className='science-model-warning quest-reality';const summary=document.createElement('summary');summary.id='chemistryQuestRealityTitle';comparison.append(summary);const list=document.createElement('div');list.id='chemistryQuestRealityItems';comparison.append(list);game.insertAdjacentElement('afterbegin',comparison)}
function update(){const L=all[lang()];let mode=$('scientificMode')?.classList.contains('active')?'scientific':$('quantumMode')?.classList.contains('active')?'quantum':'bohr';model.textContent=L[mode];molecule.textContent=L.molecule;geometry.textContent=L.geometry;const summary=$('chemistryQuestRealityTitle'),list=$('chemistryQuestRealityItems');if(summary&&list){summary.textContent=L.quest;list.replaceChildren();for(let i=0;i<L.comparison.length;i+=2){let p=document.createElement('p');let a=document.createElement('strong');a.textContent=L.comparison[i];p.append(a,document.createTextNode(' '+L.comparison[i+1]));list.append(p)}}}
for(const id of ['bohrMode','quantumMode','scientificMode','hu','de','en'])$(id)?.addEventListener('click',()=>queueMicrotask(update));update();
})();
