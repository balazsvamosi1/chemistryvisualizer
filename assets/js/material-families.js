/* Chemistry Lab material families and deeper educational descriptions. Original Apache-2.0. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryMaterialFamilies=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const familyNames={
 water:['Víz és vizes oldatok','Wasser und Lösungen','Water and solutions'],
 gases:['Elemi gázok','Elementare Gase','Elemental gases'],
 oxides:['Oxidok és gázvegyületek','Oxide und Gasverbindungen','Oxides and gaseous compounds'],
 acids:['Savak','Säuren','Acids'],
 bases:['Bázisok és hidroxidok','Basen und Hydroxide','Bases and hydroxides'],
 carbonates:['Karbonátok és hidrogén-karbonátok','Carbonate und Hydrogencarbonate','Carbonates and bicarbonates'],
 salts:['Egyéb ionos sók','Weitere ionische Salze','Other ionic salts'],
 metals:['Fémek','Metalle','Metals'],
 carbon:['Szénmódosulatok és atomrácsok','Kohlenstoffmodifikationen und Atomgitter','Carbon allotropes and covalent networks'],
 hydrocarbons:['Szénhidrogének: alkánok, alkének, alkinek','Kohlenwasserstoffe: Alkane, Alkene, Alkine','Hydrocarbons: alkanes, alkenes and alkynes'],
 alcohols:['Alkoholok és rokon szerves anyagok','Alkohole und verwandte Stoffe','Alcohols and related organic compounds'],
 sugars:['Cukrok és biológiai molekulák','Zucker und Biomoleküle','Sugars and biomolecules'],
 polymers:['Polimerek','Polymere','Polymers'],
 other:['További anyagok','Weitere Stoffe','Other materials']
};
const definitions={
 water:['Víz','Ecet (ecetsav)','Szénsav'],
 gases:['Hidrogén','Oxigén','Nitrogén','Klór','Fluor','Hélium','Argon','Ózon'],
 oxides:['Szén-dioxid','Szén-monoxid','Hidrogén-peroxid','Kalcium-oxid','Vas(III)-oxid'],
 acids:['Sósav','Hidrogén-klorid','Kénsav','Salétromsav','Foszforsav','Citromsav','Tejsav','Hangyasav','Aszkorbinsav (C-vitamin)'],
 bases:['Ammónia','Nátrium-hidroxid','Kálium-hidroxid','Kalcium-hidroxid','Magnézium-hidroxid'],
 carbonates:['Szódabikarbóna','Kálcium-karbonát','Nátrium-karbonát'],
 salts:['Konyhasó','Kalcium-klorid','Réz-szulfát','Kálium-nitrát','Ammónium-klorid'],
 metals:['Vas','Réz','Alumínium','Arany','Ezüst','Cink','Magnézium'],
 carbon:['Grafit','Gyémánt','Szilícium-dioxid','Kén','Foszfor (fehér)'],
 hydrocarbons:['Metán','Etán','Propán','Bután','Etén','Etin','Benzol'],
 alcohols:['Metanol','Etanol','Glicerin','Aceton'],
 sugars:['Szőlőcukor','Kristálycukor','Koffein'],
 polymers:['Keményítő','Cellulóz','Polietilén','PVC']
};
const nameToFamily=new Map();for(const [group,names] of Object.entries(definitions))names.forEach((name,i)=>nameToFamily.set(name,{group,rank:i}));
const familyNotes={
 water:['A víz oldószerként fontos, de az oldatok tulajdonságai az oldott anyagoktól is függenek. Az oldat képlete és a tiszta komponens képlete nem azonos fogalom.','Wasser ist ein wichtiges Lösungsmittel; Eigenschaften hängen von gelösten Stoffen ab. Lösung und reiner Stoff sind nicht dasselbe.','Water is an important solvent, but solutions depend on dissolved substances. A solution is not the same as a pure compound.'],
 gases:['Az elemi gázok lehetnek kétatomos molekulák vagy egyatomos nemesgázok. A reakcióképességük erősen eltér.','Elementare Gase können zweiatomige Moleküle oder einzelne Edelgasatome sein. Ihre Reaktivität unterscheidet sich.','Elemental gases can be diatomic molecules or individual noble-gas atoms; their chemical reactivity differs greatly.'],
 oxides:['Az oxidokban oxigén kapcsolódik más elemekhez. A CO₂ és CO példája mutatja, hogy az összetétel változása a tulajdonságokat is megváltoztathatja.','Oxide enthalten Sauerstoff und weitere Elemente. CO₂ und CO zeigen unterschiedliche Eigenschaften.','Oxides contain oxygen and other elements. CO₂ and CO illustrate how composition changes properties.'],
 acids:['A savak protonátadásra képes rendszerek; erősségük, koncentrációjuk és reakciókészségük nem ugyanaz. A többértékű savak több lépésben disszociálhatnak.','Säurestärke, Konzentration und Reaktivität sind verschieden. Mehrprotonige Säuren können stufenweise dissoziieren.','Acid strength, concentration and reactivity are different concepts. Polyprotic acids can dissociate stepwise.'],
 bases:['A bázisok protonfelvételre képesek; a lúg vizes, bázikus oldat. A szilárd hidroxid és a belőle készült oldat különböző rendszer.','Basen können Protonen aufnehmen; Laugen sind basische wässrige Lösungen. Feststoff und Lösung sind verschieden.','Bases accept protons; alkalis are basic aqueous solutions. A solid hydroxide and its solution are different systems.'],
 carbonates:['A karbonátion és a hidrogén-karbonátion sav hatására CO₂ fejlődéséhez vezethet. A gázfejlődést meg kell különböztetni a forrástól.','Carbonat und Hydrogencarbonat können mit Säure CO₂ freisetzen. Gasentwicklung ist nicht Sieden.','Carbonate and bicarbonate can release CO₂ upon acidification. Gas evolution is not boiling.'],
 salts:['A sók szilárd formájukban gyakran ionrácsosak. A képletük összetételi arányt és nem önálló kovalens molekulát jelöl.','Salze bilden häufig Ionengitter; ihre Formeln beschreiben Verhältnisse und keine getrennten kovalenten Moleküle.','Solid salts commonly form ionic lattices; their formulas describe composition ratios, not individual covalent molecules.'],
 metals:['A fémekben delokalizált elektronok segítik az elektromos vezetést. A korrózió és savakkal való reakció nem minden fémnél azonos.','Delokalisierte Elektronen ermöglichen Leitfähigkeit. Korrosion und Säurereaktionen hängen vom Metall ab.','Delocalized electrons support electrical conduction. Corrosion and acid reactivity vary across metals.'],
 carbon:['Az azonos elem különböző atomszerkezete eltérő tulajdonságokat adhat. A grafit és a gyémánt közös kémiai eleme a szén, de más a kötésrendszerük.','Gleiches Element, verschiedene Struktur: Graphit und Diamant bestehen aus Kohlenstoff, unterscheiden sich aber in der Bindung.','Different atomic arrangements can give the same element different properties: graphite and diamond are both carbon.'],
 hydrocarbons:['A szénhidrogének szénből és hidrogénből állnak. Az egyszeres, kettős vagy hármas kötés megváltoztatja a molekula tulajdonságait.','Kohlenwasserstoffe enthalten C und H; Einfach-, Doppel- und Dreifachbindungen beeinflussen die Eigenschaften.','Hydrocarbons contain carbon and hydrogen; single, double and triple bonds affect their properties.'],
 alcohols:['Az alkoholok hidroxilcsoportot tartalmaznak. A funkciós csoport, a molekula mérete és szerkezete határozza meg a tulajdonságok jelentős részét; nem minden oxigéntartalmú szerves anyag alkohol.','Alkohole besitzen Hydroxylgruppen; andere sauerstoffhaltige organische Stoffe sind nicht automatisch Alkohole.','Alcohols contain hydroxyl groups; not all oxygen-containing organic compounds are alcohols.'],
 sugars:['A cukrok és biomolekulák sokféle szerkezetűek. A képlet önmagában nem mutatja meg a kötések elrendezését vagy a biológiai szerepet.','Biomoleküle besitzen sehr unterschiedliche Strukturen; die Summenformel allein zeigt weder Bindungen noch biologische Funktion.','Sugars and biomolecules have varied structures; a formula alone does not reveal connectivity or biological role.'],
 polymers:['A polimerek sok ismétlődő egységet tartalmazó láncok vagy hálózatok. Az n jel a lánchossztól függ; nem egyetlen rögzített molekulaméretet jelent.','Polymere bestehen aus vielen Wiederholungseinheiten. n steht für eine variable Kettenlänge.','Polymers comprise repeating units. The symbol n represents variable chain length, not one fixed molecule size.'],
 other:['Az anyag összetétele és szerkezete együtt határozza meg a tulajdonságait.','Zusammensetzung und Struktur bestimmen gemeinsam die Eigenschaften.','Composition and structure jointly determine properties.']
};
const extended={
 'Víz':['A vízmolekula hajlított, poláris. A molekulák közötti hidrogénkötések fontosak a viszonylag magas forráspontban, a felületi feszültségben és a jég kisebb sűrűségében.','Das Wassermolekül ist gewinkelt und polar. Wasserstoffbrücken beeinflussen Siedepunkt, Oberflächenspannung und Eisdichte.','Water molecules are bent and polar. Hydrogen bonding helps explain its comparatively high boiling point, surface tension and ice being less dense than liquid water.'],
 'Arany':['Az arany nemesfém, általában ellenáll a nem oxidáló sósavnak és önmagában a salétromsavnak. A feloldódáshoz az oxidáció és az oldott aranykomplexek képződése együttesen lehet szükséges.','Gold widersteht normalerweise Salzsäure und Salpetersäure allein. Auflösung kann Oxidation und Komplexbildung erfordern.','Gold generally resists hydrochloric acid and nitric acid alone. Dissolution can require both oxidation and stabilization of gold complexes.'],
 'Grafit':['A grafitban a szénatomok síkbeli, hatszöges rétegekbe kapcsolódnak. A rétegek közötti gyengébb kölcsönhatások miatt könnyen hasad; elektromosan vezetőképes.','Graphit enthält hexagonale Kohlenstoffschichten, kann leicht entlang der Schichten gleiten und leitet Strom.','Graphite consists of hexagonal carbon layers; interlayer interactions allow sliding, while the layers conduct electricity.'],
 'Gyémánt':['A gyémántban minden szénatom tetraéderes kovalens hálózat része. A háromdimenziós szerkezet nagy keménységet és alacsony elektromos vezetőképességet eredményez.','Diamant besitzt ein dreidimensionales tetraedrisches Kohlenstoffnetz; er ist hart und elektrisch isolierend.','Diamond forms a three-dimensional tetrahedral carbon network, giving high hardness and low electrical conductivity.'],
 'Szódabikarbóna':['A nátrium-hidrogén-karbonát só, nem tiszta bázikus molekula. Savval reagálva szén-dioxid-gáz képződhet, amely pezsgésként látható.','Natriumhydrogencarbonat ist ein Salz. Mit Säure kann es CO₂ freisetzen, was Blasen erzeugt.','Sodium bicarbonate is an ionic salt. Acidification can release CO₂ gas, observed as fizzing.'],
 'Konyhasó':['A kristályos NaCl nem különálló NaCl-molekulákból áll, hanem Na⁺ és Cl⁻ ionok ismétlődő rácsából. Vízben az ionok hidratálódva kerülhetnek oldatba.','Festes NaCl bildet ein Gitter aus Na⁺- und Cl⁻-Ionen. In Wasser können die Ionen hydratisiert werden.','Solid NaCl is an extended lattice of Na⁺ and Cl⁻ ions. In water, hydrated ions can disperse through the solution.'],
 'Etanol':['Az etanolban az OH-csoport miatt hidrogénkötések jöhetnek létre. Vízzel elegyedik, de az alkoholok tulajdonságai a szénlánc növekedésével változnak.','Ethanol kann über die OH-Gruppe Wasserstoffbrücken bilden und ist mit Wasser mischbar.','Ethanol hydrogen-bonds through its OH group and mixes with water; alcohol properties change with chain length.'],
 'Metanol':['A metanol a legegyszerűbb alkohol. Az etanolhoz hasonló képlete és szerkezeti csoportja ellenére erősen mérgező; ez jól mutatja a kis szerkezeti különbségek jelentőségét.','Methanol ist der einfachste Alkohol. Trotz Ähnlichkeit mit Ethanol ist er hochgiftig.','Methanol is the simplest alcohol; despite its similarity to ethanol, it is highly toxic.'],
 'Szén-dioxid':['A CO₂ lineáris molekula. Vízben oldódva több egymással összefüggő egyensúlyon keresztül hat a kémhatásra; a szilárd CO₂ szublimál.','CO₂ ist linear. In Wasser beeinflusst es Carbonatgleichgewichte; festes CO₂ sublimiert.','CO₂ is linear. Dissolved CO₂ participates in carbonate equilibria; solid CO₂ sublimates.']
};
function family(m){return nameToFamily.get(m.hu)?.group||({sav:'acids',bazis:'bases',so:'salts',fem:'metals',gaz:'gases',szerves:'alcohols',polimer:'polymers',keverek:'water'}[m.category]||'other')}
function sort(items){const order=Object.keys(familyNames);return items.slice().sort((a,b)=>{
 const fa=family(a.m),fb=family(b.m),diff=order.indexOf(fa)-order.indexOf(fb);if(diff)return diff;
 return (nameToFamily.get(a.m.hu)?.rank??999)-(nameToFamily.get(b.m.hu)?.rank??999)||a.m.hu.localeCompare(b.m.hu,'hu')
})}
function detail(m,lang='hu'){const idx=Math.max(0,['hu','de','en'].indexOf(lang)),fam=family(m);return{family:fam,title:familyNames[fam][idx],general:familyNotes[fam][idx],specific:(extended[m.hu]||m.description||[])[idx]||m.description?.[idx===0?0:1]||''}}
return Object.freeze({family,sort,detail,familyNames});
});
