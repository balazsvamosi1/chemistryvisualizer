/* Additional English localization: original HU/DE dictionaries are preserved. */
(()=>{
const base={
 tagline:'Interactive periodic table and atom laboratory',elementLabel:'SELECTED ELEMENT',viewLabel:'ATOMIC VISUALIZATION',viewSub:'Simplified electron shell model',propertiesLabel:'ATOMIC DATA',tableLabel:'MAP OF THE ELEMENTS',tableTitle:'Periodic Table',search:'Search elements...',help:'Select an element • Drag to rotate • Scroll to zoom',atomic:'Atomic number',mass:'Relative atomic mass',protons:'Protons',neutrons:'Neutrons (estimate)',nucleusLegend:'Red: proton · Gold: neutron',electrons:'Electrons (neutral atom)',shells:'Electrons by shell',group:'Group',period:'Period',category:'Element family',model:'Educational illustration: electrons do not travel in fixed classical orbits. Neutron counts depend on the isotope. Nuclear geometry is schematic.',advancedNote:'Electron shell occupancies are simplified. Subshells and quantum states give a more accurate description.',basicNote:'Atomic number equals the number of protons. A neutral atom contains the same number of electrons.',unit:'u',unknown:'—'};
strings.en={...strings.de,...base};
const x={isotope:'Isotope (mass number)',approx:'Estimated isotope',stable:'Stable',radio:'Radioactive',isotopeNote:'Mass number differs from average atomic weight.',state:'State at 20 °C',boiling:'Boiling point (°C)',melting:'Melting point (°C)',conduct:'Electrical conductivity',good:'Good conductor',poor:'Poor conductor',semi:'Semiconductor',varies:'Depends on allotrope',solid:'Solid',liquid:'Liquid',gas:'Gas',unknown:'No verified data',sample:'Illustrative color, not a photograph',photo:'Real photographs (Wikimedia Commons, internet required)',molTitle:'MOLECULE BUILDER',molHeading:'Build a molecule!',molHelp:'Select an element, click empty space to add it. Click two atoms to add a bond; drag atoms to move them.',bondLabel:'Bond order',presetLabel:'Examples',undoMol:'↶ Undo',clearMol:'Clear',molScience:'2D structural editor with schematic particles. Valence checks are simplified, not a quantum geometry optimization.',molCanvasHelp:'Click: add/select atom · Drag: move',molEmpty:'Select an element and click the canvas.',molFormula:'Molecular formula',molWarning:'Warning: bond order exceeds typical valence.',molValid:'Typical valence not exceeded; chemical stability not established.',molAdvanced:'Molecule builder available in advanced mode.'};
extraText.en={...extraText.de,...x};
for(const [cat,tr] of Object.entries({alkali:'Alkali metal',earth:'Alkaline earth metal',transition:'Transition metal',post:'Post-transition metal',metalloid:'Metalloid',nonmetal:'Nonmetal',halogen:'Halogen',noble:'Noble gas',lanth:'Lanthanide',act:'Actinide'}))cats[cat][2]=tr;
const translations={periodTab:'Periodic Table',moleculeTab:'Molecule Builder',huntTab:'Element Hunt',materialsTab:'Materials Library',physicsTab:'Molecular Physics',specTab:'Speculative Physics',tableTitle:'Periodic Table',molTitle:'MOLECULE BUILDER',molHeading:'Build a molecule!',propertiesLabel:'ATOMIC DATA',reactionHeading:'Reaction Laboratory',materialsHeading:'Everyday Materials · Extensible Library',huntHeading:'Element Hunt',balanceTitle:'Balance the reaction',specHeading:'Speculative Physics'};
const labels={importMaterialsBtn:'＋ Import JSON',exportMaterialsBtn:'⇩ Example JSON',clearImportedBtn:'↺ Clear imported materials',balanceSolve:'✓ Check',balanceReveal:'? Show solution'};
// Keep older two-language scientific text available while progressively translating it.
const englishCats={sav:'Acids',bazis:'Bases',so:'Salts',fem:'Metals',gaz:'Gases',szerves:'Organic compounds',szervetlen:'Inorganic compounds',polimer:'Polymers',halozat:'Covalent networks',keverek:'Mixtures',molecule:'Molecules',egyeb:'Other'};
if(typeof catNames!=='undefined')catNames.en=Object.fromEntries(Object.entries(catNames.de).map(([k,v])=>[k,englishCats[k]||v]));
if(typeof modelKinds!=='undefined')modelKinds.en={...modelKinds.de};
if(typeof materialPhase!=='undefined')materialPhase.en={...materialPhase.de,solid:'Solid',liquid:'Liquid',gas:'Gas'};
if(typeof materials!=='undefined'){
 const names={H2O:'Water',CO2:'Carbon dioxide',CH4:'Methane',NH3:'Ammonia',NaCl:'Sodium chloride',O2:'Oxygen',N2:'Nitrogen',H2:'Hydrogen',C2H5OH:'Ethanol',CH3COOH:'Acetic acid',H2O2:'Hydrogen peroxide',C6H12O6:'Glucose',HCl:'Hydrogen chloride'};
 for(const m of materials)m.en=names[m.f]||m.de||m.hu;
}
const oldRender=render;
render=function(){oldRender();if(lang==='en'){
  for(const [id,v] of Object.entries(translations)){const n=document.getElementById(id);if(n)n.textContent=v}
  for(const [id,v] of Object.entries(labels)){const n=document.getElementById(id);if(n)n.textContent=v}
  const n=document.getElementById('materialSearch');if(n)n.placeholder='Search materials...';
  const h=document.getElementById('search');if(h)h.placeholder='Search elements...';
  const p=document.getElementById('molParticlesLabel');if(p)p.textContent='Protons, neutrons and electron shells';
  const q=document.getElementById('questSubtitle');if(q&&window.ChemQuest)ChemQuest.localize();
 }document.getElementById('en').classList.toggle('active',lang==='en')};
// Restore optional update routines when language switches. Existing modules are left intact.
document.getElementById('en').addEventListener('click',()=>{lang='en';render()});
})();
