/* Chemistry Lab common education and scientific model disclosures. Apache-2.0. */
(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.ChemistryCurriculum=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){
'use strict';
const topics=[
{id:'atoms',tab:'periodTab',title:{hu:'Atomok és periódusos rendszer',de:'Atome und Periodensystem',en:'Atoms and periodic table'},
 lessons:[
 ['A rendszám a protonok száma. A semleges atom elektronjainak száma megegyezik a protonokéval. Az izotópok rendszáma azonos, neutronszámuk eltér.','Die Ordnungszahl ist die Protonenzahl. Neutrale Atome haben ebenso viele Elektronen. Isotope unterscheiden sich in der Neutronenzahl.','Atomic number equals proton count. A neutral atom has the same number of electrons. Isotopes differ in neutron count.'],
 ['A Bohr-modell rögzített héjakat ábrázoló tanulási eszköz, nem az elektronok valódi pályája. A kvantummechanikában az elektron állapotát hullámfüggvény írja le; a megjelenített pontfelhő valószínűségi sűrűséget szemléltet.','Bohr-Schalen sind ein Lehrmodell, keine realen Bahnen. Quantenmechanische Elektronen werden durch Wellenfunktionen beschrieben; Punktwolken illustrieren Wahrscheinlichkeitsdichten.','Bohr shells are a teaching model, not real electron paths. Quantum mechanics describes electrons with wavefunctions; the cloud illustrates probability density.'],
 ['A hidrogénszerű egyelektronos atomok pályaállapotai analitikusan meghatározhatók az alkalmazott közelítésben. Többelektronos atomokra a program árnyékolt hidrogénszerű közelítést használ, nem egzakt sok-elektronos megoldást.','Ein-Elektron-Orbitale sind im verwendeten Modell analytisch zugänglich. Für Mehrelektronenatome nutzt die App abgeschirmte wasserstoffähnliche Näherungen.','One-electron orbitals can be solved analytically under the stated model. Multi-electron views use a screened hydrogenic approximation.']
 ],questions:[
 ['Mit ad meg az elem rendszáma?','Was gibt die Ordnungszahl an?','What does atomic number specify?',['A protonok számát','Die Protonenzahl','Number of protons'],['A neutronok pontos számát','Die exakte Neutronenzahl','Exact neutron count'],['A moláris térfogatot','Das molare Volumen','Molar volume'],0],
 ['Miben különböznek az izotópok?','Worin unterscheiden sich Isotope?','How do isotopes differ?',['Neutronszámban','Neutronenzahl','Neutron count'],['Protonszámban','Protonenzahl','Proton count'],['Elemjelben','Elementsymbol','Chemical symbol'],0],
 ['Mit jelent a kvantummechanikai elektronfelhő?','Was bedeutet die Elektronenwolke?','What does an electron cloud represent?',['Valószínűségi sűrűséget','Wahrscheinlichkeitsdichte','Probability density'],['Rögzített klasszikus pályát','Eine feste klassische Bahn','A fixed classical orbit'],['A mag alakját','Die Form des Kerns','Nuclear shape'],1],
 ['Melyik modell használ közelítést a sok-elektronos atomokra?','Welches Modell nähert Mehrelektronenatome an?','Which model approximates multielectron atoms?',['Árnyékolt hidrogénszerű pályamodell','Abgeschirmtes wasserstoffähnliches Modell','Screened hydrogenic orbital model'],['Egzakt általános analitikus megoldás','Exakte allgemeine analytische Lösung','Exact general analytic solution'],['Bolygópálya számítása','Planetenbahn','Planetary orbit'],2]
 ]},
{id:'bonds',tab:'moleculeTab',title:{hu:'Kötések és molekulaszerkezet',de:'Bindungen und Molekülstruktur',en:'Bonding and molecular structure'},
 lessons:[
 ['A kovalens kötés elektronpár-megosztással magyarázható; az ionos kötés elektrosztatikus vonzásra épül. Az elektronegativitás-különbség csak támpont, nem dönt minden kötéstípusban.','Kovalente Bindungen werden mit geteilten Elektronenpaaren erklärt; ionische mit elektrostatischer Anziehung. Elektronegativitätsdifferenzen sind nur Hinweise.','Covalent bonds share electron density; ionic bonding involves electrostatic attraction. Electronegativity difference is a guide, not a universal classifier.'],
 ['A VSEPR a kötő és nemkötő elektronpárok taszításából jósol közelítő molekulaalakot: például H₂O hajlított, CO₂ lineáris, CH₄ tetraéderes. Nem kvantumkémiai optimalizálás.','VSEPR prognostiziert näherungsweise Geometrien anhand von Elektronenpaarabstoßung: H₂O gewinkelt, CO₂ linear, CH₄ tetraedrisch. Keine Quantenoptimierung.','VSEPR predicts approximate shapes based on electron-pair repulsion: H₂O bent, CO₂ linear, CH₄ tetrahedral. It is not a quantum optimization.'],
 ['Az egyszerű automatikus hidrogénkiegészítés csak kiválasztott, semleges vegyértékes esetekre érvényes. A töltések, rezonancia, aromásság és átmenetifém-kötések külön modellezést igényelnek. A referencia-koordináta és a becsült geometria nem egyenértékű.','Automatisches Ergänzen von H gilt nur für ausgewählte neutrale Fälle. Ladungen, Resonanz, Aromatizität und Übergangsmetallbindungen benötigen weitere Modelle. Referenz- und Schätzgeometrien sind verschieden.','Automatic hydrogen completion is limited to common neutral valence cases. Charges, resonance, aromaticity and transition-metal bonding require other models. Reference and estimated geometries are not equivalent.']
 ],questions:[
 ['Melyik molekula hajlított VSEPR-szerkezetű?','Welches Molekül ist nach VSEPR gewinkelt?','Which molecule is bent under VSEPR?',['H₂O','H₂O','H₂O'],['CO₂','CO₂','CO₂'],['CH₄','CH₄','CH₄'],1],
 ['Melyik molekula lineáris?','Welches Molekül ist linear?','Which molecule is linear?',['CO₂','CO₂','CO₂'],['H₂O','H₂O','H₂O'],['NH₃','NH₃','NH₃'],1],
 ['Mit jelent a becsült 3D geometria?','Was bedeutet geschätzte 3D-Geometrie?','What is an estimated 3D geometry?',['Közelítés, nem mérési bizonyíték','Näherung, kein Messnachweis','An approximation, not a measurement'],['Biztos energiaminimum','Garantiertes Energieminimum','Guaranteed energy minimum'],['Minden körülmény között azonos alak','Immer gleiche Form','Same shape under all conditions'],2],
 ['Melyik esetre nem általános az automatikus hidrogénkiegészítés?','Für welchen Fall ist automatisches H-Ergänzen nicht allgemein gültig?','For which case is automatic H completion not generally valid?',['Töltött vagy aromás rendszerekre','Geladene oder aromatische Systeme','Charged or aromatic structures'],['Egyszerű metánra','Einfaches Methan','Simple methane'],['Semleges vízmolekulára','Neutrales Wasser','Neutral water'],2]
 ]},
{id:'stoich',tab:'stoichTab',title:{hu:'Sztöchiometria és anyagmennyiség',de:'Stöchiometrie und Stoffmenge',en:'Stoichiometry and amount of substance'},
 lessons:[
 ['Az anyagmennyiség n molban, a tömeg m grammban, a moláris tömeg M g/molban mérhető: n = m/M. Mértékegységek: g / (g/mol) = mol. Először ellenőrizd a képletet és az egységeket.','Stoffmenge n in mol, Masse m in g und molare Masse M in g/mol: n = m/M. Einheit g/(g/mol)=mol.','Amount n in mol, mass m in g and molar mass M in g/mol obey n=m/M. Units cancel: g/(g/mol)=mol.'],
 ['A rendezett reakcióegyenlet együtthatói adják az anyagmennyiségek arányát. 2 H₂ + O₂ → 2 H₂O: 2 mol H₂-ből elegendő oxigénnel 2 mol víz keletkezhet. A korlátozó reagens határozza meg a maximális mennyiséget.','Die Koeffizienten geben Stoffmengenverhältnisse an: 2 H₂ + O₂ → 2 H₂O. Bei ausreichendem Sauerstoff ergeben 2 mol H₂ höchstens 2 mol H₂O.','Balanced coefficients set mole ratios: 2 H₂ + O₂ → 2 H₂O. With enough oxygen, 2 mol H₂ can form at most 2 mol water. The limiting reactant governs yield.'],
 ['Oldatkoncentráció: c = n/V, ahol V literben van. Hígításkor az oldott anyag anyagmennyisége változatlan esetben c₁V₁=c₂V₂. A százalékos kitermelés eltérhet az elméletitől.','Lösungskonzentration c=n/V mit V in Litern. Beim Verdünnen gilt c₁V₁=c₂V₂, sofern die gelöste Stoffmenge konstant bleibt. Reale Ausbeuten können abweichen.','Concentration c=n/V uses volume in litres. Dilution follows c₁V₁=c₂V₂ if solute amount is conserved. Actual yield may differ from theoretical yield.']
 ],questions:[
 ['Hogyan számítjuk az anyagmennyiséget tömegből?','Wie berechnet man die Stoffmenge aus Masse?','How do you calculate moles from mass?',['n = m/M','n = m/M','n = m/M'],['n = m·M','n = m·M','n = m·M'],['n = M/m','n = M/m','n = M/m'],0],
 ['Mennyi a víz moláris tömege közelítőleg?','Wie groß ist die molare Masse von Wasser ungefähr?','Approximately what is water’s molar mass?',['18 g/mol','18 g/mol','18 g/mol'],['2 g/mol','2 g/mol','2 g/mol'],['32 g/mol','32 g/mol','32 g/mol'],0],
 ['2 H₂ + O₂ → 2 H₂O esetén 4 mol H₂-ből elegendő O₂ mellett mennyi H₂O lehet?','Wie viel H₂O entstehen aus 4 mol H₂ bei genügend O₂?','With sufficient O₂, how much H₂O can form from 4 mol H₂?',['4 mol','4 mol','4 mol'],['2 mol','2 mol','2 mol'],['8 mol','8 mol','8 mol'],1],
 ['Mi a molaritás mértékegysége?','Welche Einheit hat die Molarität?','What is the unit of molarity?',['mol/L','mol/L','mol/L'],['g/mol','g/mol','g/mol'],['mol·g','mol·g','mol·g'],2]
 ]},
{id:'acids',tab:'acidBaseTab',title:{hu:'Savak, bázisok és titrálás',de:'Säuren, Basen und Titration',en:'Acids, bases and titration'},
 lessons:[
 ['Erős savak és bázisok a modellben teljesen disszociálnak, gyenge savak és bázisok egyensúlyra jutnak. A pH = −log₁₀[H₃O⁺] közelítés híg, ideális oldatokra használható; pontosan az aktivitás számít.','Starke Säuren/Basen dissoziieren im Modell vollständig; schwache stehen im Gleichgewicht. pH≈−log₁₀[H₃O⁺] gilt näherungsweise für verdünnte ideale Lösungen; exakt zählt die Aktivität.','Strong acids/bases dissociate completely in the model; weak species establish equilibria. pH≈−log₁₀[H₃O⁺] assumes dilute ideal solutions; activity matters more generally.'],
 ['Titráláskor ismert koncentrációjú oldatot adunk a vizsgált oldathoz. Az egyenértékpontnál a sztöchiometriai anyagmennyiségek megfelelnek az egyenlet arányainak. Nem minden egyenértékpont pH-ja 7: a gyenge sav–erős bázis rendszeré jellemzően 7 fölött van 25 °C-on.','Beim Titrieren wird eine Maßlösung zugegeben. Am Äquivalenzpunkt stimmen die Stoffmengen stöchiometrisch überein. Der pH ist nicht immer 7: schwache Säure mit starker Base hat typischerweise pH über 7 bei 25 °C.','Titration adds a solution of known concentration. At equivalence, stoichiometric amounts match the equation. Equivalence pH is not always 7: weak acid with strong base is typically above 7 at 25 °C.'],
 ['Az indikátor a saját átcsapási tartományában változtatja a színét. A titrálási végpont az indikátor jelzése, az egyenértékpont a kémiai arány teljesülése; ezek nem feltétlenül esnek pontosan egybe. A program 25 °C-os ideális közelítést használ.','Ein Indikator ändert die Farbe im Umschlagsbereich. Endpunkt und Äquivalenzpunkt sind nicht zwangsläufig gleich. Die App verwendet ein ideales Modell bei 25 °C.','Indicators change colour over a transition range. The observed endpoint and equivalence point can differ. The app uses an idealized 25 °C model.']
 ],questions:[
 ['Mekkora a semleges tiszta víz pH-ja 25 °C-on közelítőleg?','Welchen pH hat reines neutrales Wasser bei 25 °C ungefähr?','Approximately what is neutral pure water pH at 25 °C?',['7','7','7'],['1','1','1'],['14','14','14'],0],
 ['Mindig pH 7 a titrálás egyenértékpontja?','Ist der Äquivalenzpunkt immer bei pH 7?','Is titration equivalence always at pH 7?',['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak oldódáskor','Nur beim Lösen','Only during dissolution'],1],
 ['Mit jelent az indikátor átcsapási tartománya?','Was bedeutet der Umschlagsbereich eines Indikators?','What is an indicator transition range?',['A színváltás pH-tartományát','Den pH-Bereich des Farbumschlags','The pH range of its colour change'],['A moláris tömeget','Die molare Masse','Molar mass'],['A gáz térfogatát','Das Gasvolumen','Gas volume'],2],
 ['Melyik módszerrel határozható meg ismeretlen koncentráció?','Womit lässt sich eine unbekannte Konzentration bestimmen?','Which method can determine an unknown concentration?',['Titrálással','Titration','Titration'],['Elektronpálya-rajzzal','Elektronenbahnbild','An orbital drawing'],['Lángszín nélkül, puszta becsléssel','Durch bloßes Schätzen','By unsupported guessing'],2]
 ]},
{id:'bunsen',tab:'bunsenTab',title:{hu:'Lángfestés és emisszió',de:'Flammenprobe und Emission',en:'Flame tests and emission'},
 lessons:[
 ['A Bunsen-égő gázáramlása elsősorban a láng méretét, levegőnyílása az égés jellegét változtatja. Kevés levegőnél sárgás, többnél kékebb lehet a láng. A szimuláció nem helyettesíti a tanári felügyeletű kísérletet.','Gasfluss beeinflusst vor allem Größe, Luftzufuhr den Flammentyp. Wenig Luft: gelblich; mehr Luft: eher blau. Kein Ersatz für beaufsichtigtes Experimentieren.','Gas flow mainly changes size while air intake affects flame type. Low air: yellowish; more air: bluer. Simulation cannot replace supervised practice.'],
 ['A nátrium általában erős sárga, a kálium halványlila, a lítium vörös lángot ad. A szennyezett hurok nátriumot juttathat a lángba és elfedheti más elemek színét. A program RGB-közelítést mutat, nem mért spektrumot.','Natrium gelb, Kalium blassviolett, Lithium rot. Natriumverunreinigung kann andere Farben überdecken. RGB ist nur eine Annäherung.','Sodium yellow, potassium pale lilac and lithium red. Sodium contamination may mask other colours. RGB is illustrative, not measured spectral data.'],
 ['Gerjesztett atomok, ionok vagy molekulák fényt bocsátanak ki. Ez nem azonos a fémek oxidációjával: például a magnézium égése 2 Mg + O₂ → 2 MgO. A spektrum jellegzetes vonalakat tartalmazhat.','Angeregte Atome, Ionen oder Moleküle emittieren Licht; das ist nicht gleich Metalloxidation. Magnesium: 2 Mg + O₂ → 2 MgO. Spektren können charakteristische Linien zeigen.','Excited atoms, ions or molecules emit light; this differs from metal oxidation. Magnesium: 2 Mg + O₂ → 2 MgO. Spectra can contain characteristic lines.']
 ],questions:[
 ['Milyen a nátrium lángfestési színe?','Welche Flammenfarbe hat Natrium?','What is sodium’s flame-test colour?',['Erős sárga','Intensiv gelb','Intense yellow'],['Halványlila','Blassviolett','Pale lilac'],['Színtelen','Farblos','Colourless'],0],
 ['Mi takarhatja el a kálium halványlila színét?','Was kann Kaliums blassviolette Flamme überdecken?','What can mask potassium’s pale-lilac flame?',['Nátriumszennyeződés','Natriumverunreinigung','Sodium contamination'],['Az üveg mérete','Die Glasgröße','Glass size'],['A periódus száma','Die Periodenzahl','Period number'],1],
 ['Mi a magnézium égésének rendezett egyenlete?','Welche Gleichung beschreibt Magnesiumverbrennung?','Which equation describes burning magnesium?',['2 Mg + O₂ → 2 MgO','2 Mg + O₂ → 2 MgO','2 Mg + O₂ → 2 MgO'],['Mg + O₂ → MgO','Mg + O₂ → MgO','Mg + O₂ → MgO'],['Mg + H₂ → MgH','Mg + H₂ → MgH','Mg + H₂ → MgH'],1],
 ['Helyettesíti a szimuláció a valódi égős gyakorlatot?','Ersetzt die Simulation echte Brennerpraxis?','Does the simulation replace real burner practice?',['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak vizsgán','Nur in Prüfungen','Only for exams'],2]
 ]},
{id:'quest',tab:'gameTab',title:{hu:'Chemistry Quest: játék és valóság',de:'Chemistry Quest: Spiel und Realität',en:'Chemistry Quest: game and reality'},
 lessons:[
 ['A játékban atomokat gyűjtesz és receptekből eszközöket készítesz. A valós kémiában atomgyűjtésből nem lesz automatikusan vegyület: megfelelő kiindulási anyagokra, reakciókörülményekre és átalakulásra van szükség.','Im Spiel sammelt man Atome und stellt Gegenstände her. In Wirklichkeit entstehen Verbindungen nicht automatisch beim Atomsammeln; Edukte, Bedingungen und Reaktionen sind nötig.','The game collects atoms and crafts items. In real chemistry collecting atoms does not automatically synthesize compounds; reactants and reaction conditions matter.'],
 ['Molekulák kapcsolódását egy szerkezeti modell közelíti. Ionvegyület, például NaCl esetén nem különálló kovalens NaCl-molekula, hanem ionrács jellemző. A rendezett reakcióegyenlet anyagmennyiségi arányt ír le, nem készítési utasítást.','Molekülbindungen sind Strukturmodelle. NaCl bildet typischerweise ein Ionengitter, keine isolierten kovalenten NaCl-Moleküle. Ausgeglichene Reaktionsgleichungen sind Mengenverhältnisse, keine Herstellungsanleitung.','Molecular connections are structural models. NaCl forms an ionic lattice, not isolated covalent NaCl molecules. Balanced equations show mole ratios, not synthesis instructions.'],
 ['A játék tűzoltása, akadályellenfelei és fegyverei fikciós mechanikák. A valódi tűzoltó anyag megválasztása a tűzosztálytól és körülményektől függ; például a víz nem alkalmas minden tűzre. Kísérleti biztonságot nem szabad játékszabályokból levezetni.','Löschen, Gegner und Waffen sind fiktionale Spielregeln. Die Wahl eines Löschmittels hängt von Brandklasse und Bedingungen ab; Wasser ist nicht überall geeignet. Sicherheitsregeln dürfen nicht aus Spielen abgeleitet werden.','Fire effects, enemies and weapons are fictional game mechanics. Real extinguishing media depend on fire class and circumstances; water is not suitable for every fire. Never infer laboratory safety from game rules.']
 ],questions:[
 ['Létrejön-e víz attól, hogy 2 H és 1 O atomot összegyűjtesz a játékban?','Entsteht echtes Wasser durch das Sammeln von 2 H und 1 O im Spiel?','Does collecting 2 H and 1 O in the game make real water?',['Nem, ez játékmechanika','Nein, Spielmechanik','No, this is game mechanics'],['Igen, minden körülmény között','Ja, immer','Yes, always'],['Csak magas pontszámon','Nur bei hoher Punktzahl','Only at high score'],0],
 ['Milyen szerkezet jellemző szilárd NaCl-ra?','Welche Struktur hat festes NaCl typischerweise?','What structure is typical of solid NaCl?',['Ionrács','Ionengitter','Ionic lattice'],['Különálló NaCl kovalens molekulák','Einzelne kovalente NaCl-Moleküle','Separate covalent NaCl molecules'],['Fémrács','Metallgitter','Metal lattice'],1],
 ['Mit jelent egy rendezett reakcióegyenlet?','Was zeigt eine ausgeglichene Reaktionsgleichung?','What does a balanced chemical equation describe?',['Anyagmennyiségi arányokat','Stoffmengenverhältnisse','Stoichiometric ratios'],['Kísérleti biztonsági útmutatót','Eine Sicherheitsanleitung','A safety procedure'],['Játékbeli tűzerőt','Spiel-Schadenswert','Game damage output'],2],
 ['Minden tüzet lehet vízzel oltani?','Kann man jedes Feuer mit Wasser löschen?','Can water extinguish every type of fire?',['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak ha a játékban is','Nur wenn es im Spiel geht','Only when the game allows it'],2]
 ]}
];
const locales=['hu','de','en'];
// In the authored question bank the first option is always correct; session() randomizes both choice order and the answer index.
for(const topic of topics){topic.lesson=topic.lessons.map(x=>Object.fromEntries(locales.map((l,i)=>[l,x[i]])));topic.bank=topic.questions.map((x,i)=>({id:topic.id+'-'+i,lessonIndex:({atoms:[0,0,1,2],bonds:[1,1,2,2],stoich:[0,0,1,2],acids:[0,1,2,1],bunsen:[1,1,2,0],quest:[0,1,1,2]})[topic.id][i],q:Object.fromEntries(locales.map((l,j)=>[l,x[j]])),choices:Object.fromEntries(locales.map((l,j)=>[l,[x[3][j],x[4][j],x[5][j]]])),answer:0}))}
function academyTopic(id,tab,titles,lessonText,questions){
 const l=['hu','de','en'];const title=Object.fromEntries(l.map((k,i)=>[k,titles[i]]));
 const lesson=lessonText.map(row=>Object.fromEntries(l.map((k,i)=>[k,row[i]])));
 const bank=questions.map((row,i)=>({id:id+'-'+i,topic:id,lessonIndex:Math.min(i,lesson.length-1),q:Object.fromEntries(l.map((k,j)=>[k,row[0][j]])),choices:Object.fromEntries(l.map((k,j)=>[k,[row[1][j],row[2][j],row[3][j]]])),answer:0}));
 topics.push({id,tab,title,lesson,bank});
}
academyTopic('hunt','huntTab',['Elemvadászat','Elementjagd','Element Hunt'],[
['Az elemet a rendszáma (protonszáma) azonosítja. A vegyjelek közös nyelvet adnak.','Die Ordnungszahl (Protonenzahl) identifiziert das Element. Symbole sind international.','Atomic number (proton count) identifies an element. Chemical symbols are shared internationally.'],
['Az alkálifémek az 1., a halogének a 17., a nemesgázok a 18. csoportban találhatók. Egy csoport gyakran hasonló kémiát mutat.','Alkalimetalle stehen in Gruppe 1, Halogene in 17 und Edelgase in 18. Gruppen zeigen oft ähnliche Chemie.','Alkali metals are group 1, halogens group 17 and noble gases group 18. Groups often share chemistry.'],
['Elemvadászat után azonosítsd a hibás válaszhoz tartozó rendszámot, vegyjelet és csoportot. A színes csempék nem önmagukban tudományos jellemzők.','Nach der Elementjagd Ordnungszahl, Symbol und Gruppe der falsch erkannten Elemente prüfen.','After Element Hunt, review atomic number, symbol and group for incorrectly identified elements.']
],[
[['Mi az oxigén vegyjele?','Wie lautet das Sauerstoffsymbol?','What is oxygen’s symbol?'],['O','O','O'],['Og','Og','Og'],['Ox','Ox','Ox']],
[['Melyik csoport a nemesgázoké?','Welche Gruppe enthält Edelgase?','Which group contains noble gases?'],['18. csoport','Gruppe 18','Group 18'],['1. csoport','Gruppe 1','Group 1'],['17. csoport','Gruppe 17','Group 17']],
[['Mi azonosítja egyértelműen az elemet?','Was identifiziert das Element eindeutig?','What uniquely identifies an element?'],['Rendszám','Ordnungszahl','Atomic number'],['A csempe színe','Kachelfarbe','Tile colour'],['Az atom mérete minden esetben','Die Atomgröße immer','Atom size in all cases']],
[['Mit jelezhet a csoporttagság?','Was kann Gruppenzugehörigkeit anzeigen?','What may group membership suggest?'],['Hasonló kémiai tendenciákat','Ähnliche chemische Trends','Similar chemical trends'],['Azonos tömeget','Identische Masse','Identical mass'],['Azonos neutronszámot','Identische Neutronenzahl','Identical neutron count']]
]);
academyTopic('materials','materialsTab',['Anyagok és tulajdonságaik','Stoffe und Eigenschaften','Materials and properties'],[
['Az elem és a vegyület nem ugyanaz: Fe elem, H₂O vegyület. Az összetétel befolyásolja a tulajdonságokat.','Element und Verbindung sind verschieden: Fe ist Element, H₂O eine Verbindung.','An element differs from a compound: Fe is an element, H₂O is a compound.'],
['A gyémánt és grafit egyaránt szén, mégis más kötésrendszerük miatt eltérő tulajdonságúak. A szilárd konyhasó ionrácsot alkot.','Diamant und Graphit sind Kohlenstoff, aber anders gebunden. Festes Kochsalz bildet ein Ionengitter.','Diamond and graphite are both carbon with different bonds. Solid table salt forms an ionic lattice.'],
['A referenciaadat adott hőmérséklethez, nyomáshoz vagy kristályformához tartozhat. 3D rajz nem bizonyítja a stabilitást.','Referenzdaten hängen von Bedingungen ab. Eine 3D-Abbildung beweist keine Stabilität.','Reference data depend on conditions. A 3D model does not prove stability.']
],[
[['Mi a víz képlete?','Wie lautet die Formel für Wasser?','What is water’s formula?'],['H₂O','H₂O','H₂O'],['H₂','H₂','H₂'],['O₃','O₃','O₃']],
[['Miért különbözik a grafit és a gyémánt?','Warum unterscheiden sich Graphit und Diamant?','Why do graphite and diamond differ?'],['Eltérő szénszerkezetük miatt','Wegen unterschiedlicher Kohlenstoffstruktur','Different carbon bonding networks'],['Eltérő szén-rendszámuk miatt','Wegen verschiedener Kohlenstoff-Ordnungszahl','Different carbon atomic number'],['A gyémánt nem szén','Diamant ist kein Kohlenstoff','Diamond is not carbon']],
[['Milyen szilárd NaCl szerkezete?','Welche Struktur hat festes NaCl?','What is solid NaCl’s structure?'],['Ionrács','Ionengitter','Ionic lattice'],['Kovalens NaCl-molekulák','Kovalente NaCl-Moleküle','Separate covalent NaCl molecules'],['Fémrács','Metallgitter','Metallic lattice']],
[['Bizonyítja a 3D kép egy anyag stabilitását?','Beweist das 3D-Bild Stabilität?','Does a 3D image prove stability?'],['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak normál nyomáson','Nur bei Normaldruck','Only at standard pressure']]
]);
academyTopic('physics','physicsTab',['Molekulafizika és referenciaadatok','Molekülphysik und Referenzdaten','Molecular physics and reference data'],[
['A PubChem jellegű adatbázisok referenciavegyületek szerkezetét és tulajdonságait közölhetik. Az adat nem szimuláció.','PubChem-ähnliche Datenbanken liefern Referenzstrukturen und Eigenschaften. Daten sind keine Simulation.','PubChem-like databases provide reference structures and properties. Data are not a simulation.'],
['A hőmérséklet és nyomás körülményeket jelöl, de beállításuk önmagában nem molekuladinamikai számítás.','Temperatur und Druck sind Bedingungen; Regler allein führen keine Molekulardynamik aus.','Temperature and pressure are conditions; setting controls alone does not run molecular dynamics.'],
['Mért adatok, közelítő modellek és számított eredmények eltérő bizonyosságúak. Egy geometria önmagában nem stabilitásbizonyíték.','Messdaten, Modelle und Rechnungen haben verschiedene Aussagekraft. Geometrie beweist keine Stabilität.','Measured data, approximate models and computed results have different evidential weight. Geometry alone does not prove stability.']
],[
[['Mi a referenciaadat?','Was ist ein Referenzdatum?','What is reference data?'],['Forrásból származó adat','Ein Quellenwert','A sourced value'],['Mindig jóslat','Immer Prognose','Always a prediction'],['Mindig egzakt stabilitási bizonyíték','Immer Stabilitätsbeweis','Always proof of stability']],
[['Garantálja-e egy 3D szerkezet a stabilitást?','Garantiert eine 3D-Struktur Stabilität?','Does a 3D structure guarantee stability?'],['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak színesben','Nur farbig','Only in colour']],
[['A hőmérséklet-csúszka egyenlő a molekuladinamikával?','Ist ein Temperaturregler Molekulardynamik?','Does a temperature slider equal molecular dynamics?'],['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak 25 °C-on','Nur bei 25 °C','Only at 25 °C']],
[['Miért különböztetjük meg a modellt és a mérést?','Warum Modell und Messung unterscheiden?','Why distinguish model and measurement?'],['Eltérő eredetük és bizonytalanságuk miatt','Unterschiedliche Herkunft und Unsicherheit','Different provenance and uncertainty'],['Mert egyformák','Weil sie gleich sind','They are identical'],['Mert a mérés nem lehet szám','Messung kann keine Zahl sein','A measurement cannot be a number']]
]);
academyTopic('speculative','specTab',['Spekulatív modellek tudományos korlátai','Grenzen spekulativer Modelle','Limits of speculative models'],[
['A Hard, Extreme és Soft/Sandbox forgatókönyvek más-más szintű feltételezéseket tesznek. Nem azonosak ellenőrzött kémiai tényekkel.','Hard, Extreme und Soft/Sandbox sind unterschiedlich spekulative Szenarien, keine gesicherten chemischen Fakten.','Hard, Extreme and Soft/Sandbox are speculative scenarios, not all established chemistry.'],
['A Lennard–Jones-görbe egyszerűsített kölcsönhatási modell. Egy minimum nem bizonyítja új anyag létezését.','Das Lennard–Jones-Potential ist vereinfacht. Ein Minimum beweist keine neue Materie.','The Lennard–Jones potential is simplified. Its minimum does not prove the existence of new matter.'],
['A szcenárió-paraméter nem jelent igazolt hőmérséklet- vagy nyomásfüggő fázisstabilitást. Különítsd el a hipotézist a méréstől.','Szenarioparameter beweisen keine Phasenstabilität. Hypothese ist nicht Messung.','Scenario parameters do not prove phase stability. Hypotheses are not measurements.']
],[
[['Bizonyítja a potenciálminimum egy új anyag létezését?','Beweist ein Potentialminimum neues Material?','Does a potential minimum prove new material exists?'],['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak nagy minimum esetén','Nur bei großem Minimum','Only for large minima']],
[['Mire jó a Lennard–Jones-közelítés?','Was modelliert Lennard–Jones näherungsweise?','What does Lennard–Jones approximate?'],['Részecskék közti kölcsönhatást','Teilchenwechselwirkungen','Particle interactions'],['Minden kvantumállapotot pontosan','Alle Quantenzustände exakt','All quantum states exactly'],['Vegyértékelektronok számát','Anzahl der Valenzelektronen','Number of valence electrons']],
[['Egyenlő-e a hipotézis és a bizonyíték?','Sind Hypothese und Beleg identisch?','Is a hypothesis the same as evidence?'],['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak vákuumban','Nur im Vakuum','Only in vacuum']],
[['Bizonyít-e fázisstabilitást egy paraméter csúszkája?','Beweist ein Schieberegler Phasenstabilität?','Does adjusting a slider prove phase stability?'],['Nem','Nein','No'],['Igen','Ja','Yes'],['Csak alacsony nyomáson','Nur bei wenig Druck','Only at low pressure']]
]);
// Density discovery is a guided teaching aid, not a test: no scored question bank.
academyTopic('density','densityTab',['Sűrűség – felfedező leckék (7–8. osztály)','Dichte entdecken (Klasse 7–8)','Explore density (grades 7–8)'],[
 ['A tömeg (m) azt mutatja, mennyi anyag van egy testben; grammban vagy kilogrammban mérjük. A térfogat (V) azt mutatja, mennyi helyet foglal el; például cm³-ben vagy literben. Két egyforma tömegű test eltérő térfogatú lehet.','Die Masse (m) wird in Gramm oder Kilogramm gemessen. Das Volumen (V) gibt an, wie viel Raum ein Körper einnimmt, zum Beispiel in cm³ oder Litern. Zwei gleich schwere Körper können unterschiedlich groß sein.','Mass (m) is measured in grams or kilograms. Volume (V) tells us how much space an object occupies, for example in cm³ or litres. Two equally heavy objects can take up different amounts of space.'],
 ['A sűrűség egységnyi térfogatra jutó tömeg: ρ = m/V. Azonos térfogat mellett az ólom sokkal nehezebb, mint az alumínium. Az egyszerű modell pontjai azonos tömegrészeket jelölnek, nem valódi atomokat.','Dichte ist Masse pro Volumen: ρ = m/V. Bei gleichem Volumen ist Blei wesentlich schwerer als Aluminium. Die Punkte im einfachen Modell stellen gleiche Massenanteile dar, keine echten Atome.','Density means mass per volume: ρ = m/V. For the same volume, lead is considerably heavier than aluminium. The dots in the simple view represent equal portions of mass, not actual atoms.'],
 ['A sűrűséget a tömeg és a térfogat hányadosából számítjuk: ρ = m/V. Például 1000 cm³ alumínium tömege körülbelül 2700 g: 2700 ÷ 1000 = 2,7 g/cm³. Egy liter víz tömege 20 °C-on körülbelül 998 g.','Dichte berechnet man mit ρ = m/V. 1000 cm³ Aluminium besitzen etwa 2700 g Masse: 2700 ÷ 1000 = 2,7 g/cm³. Ein Liter Wasser hat bei 20 °C ungefähr eine Masse von 998 g.','Calculate density with ρ = m/V. For example, 1000 cm³ of aluminium has a mass of about 2700 g: 2700 ÷ 1000 = 2.7 g/cm³. One litre of water has a mass of about 998 g at 20 °C.'],
 ['A víznél kisebb átlagos sűrűségű test úszik, a nagyobb sűrűségű általában elsüllyed. A száraz fenyőfa sűrűsége például körülbelül 0,5 g/cm³, a vasé körülbelül 7,87 g/cm³, míg a vízé 0,998 g/cm³. Ez összehasonlítás, nem folyadékdinamikai szimuláció.','Ein Körper mit geringerer mittlerer Dichte als Wasser schwimmt normalerweise; mit größerer Dichte sinkt er im Allgemeinen. Trockenes Kiefernholz hat näherungsweise 0,5 g/cm³, Eisen 7,87 g/cm³ und Wasser bei 20 °C ungefähr 0,998 g/cm³. Der Vergleich ist keine Strömungssimulation.','An object with lower average density than water generally floats; an object with greater density generally sinks. Dry pine is approximately 0.5 g/cm³, iron 7.87 g/cm³, and water about 0.998 g/cm³ at 20 °C. This is a comparison, not a fluid simulation.']
],[]);
const densityActivities=Object.freeze([
 {scenario:{left:'lead',right:'aluminum',mode:'mass',quantity:1000,shape:'cube'},
  prompt:{hu:'Mindkét test tömege 1000 g. Melyik foglal el több helyet: az ólom vagy az alumínium?',de:'Beide Körper haben eine Masse von 1000 g. Welcher braucht mehr Platz: Blei oder Aluminium?',en:'Both samples have a mass of 1000 g. Which takes up more space: lead or aluminium?'},
  explanation:{hu:'Az alumínium nagyobb térfogatot foglal el ugyanakkora tömeg mellett. A tömeg és a térfogat két különböző tulajdonság.',de:'Bei gleicher Masse benötigt Aluminium mehr Platz. Masse und Volumen sind unterschiedliche Größen.',en:'At the same mass, aluminium occupies more volume. Mass and volume are different properties.'}},
 {scenario:{left:'lead',right:'aluminum',mode:'volume',quantity:1000,shape:'cube'},
  prompt:{hu:'Mindkét kocka 1000 cm³ térfogatú. Melyik nehezebb, és mit mutatnak a szemléltető pontok?',de:'Beide Würfel haben ein Volumen von 1000 cm³. Welcher ist schwerer und was zeigen die Punkte?',en:'Both cubes occupy 1000 cm³. Which is heavier, and what do the illustrative dots show?'},
  explanation:{hu:'Az ólom tömege 11,34 kg, az alumíniumé 2,70 kg. Az ólom sűrűsége körülbelül 4,2-szer nagyobb. Az alapmód pontjai azonos tömegrészeket jelölnek, nem atomokat.',de:'Blei hat 11,34 kg Masse, Aluminium 2,70 kg. Blei ist etwa 4,2-mal so dicht. Die Punkte im einfachen Modus stellen gleich schwere Portionen dar, keine Atome.',en:'Lead has a mass of 11.34 kg and aluminium 2.70 kg. Lead is about 4.2 times as dense. Basic-mode dots represent equal mass portions, not atoms.'}},
 {scenario:{left:'water',right:'aluminum',mode:'volume',quantity:1000,shape:'cube'},
  prompt:{hu:'A térfogat mindkét oldalon 1000 cm³. Oszd el a kiírt tömeget 1000-rel: mennyi a sűrűség g/cm³-ben?',de:'Beide Proben haben 1000 cm³ Volumen. Teile die angezeigte Masse in Gramm durch 1000: Wie groß ist die Dichte in g/cm³?',en:'Both samples have a volume of 1000 cm³. Divide the mass in grams by 1000. What is each density in g/cm³?'},
  explanation:{hu:'Víz: 998 g ÷ 1000 cm³ = 0,998 g/cm³. Alumínium: 2700 g ÷ 1000 cm³ = 2,70 g/cm³. A képlet: ρ = m/V.',de:'Wasser: 998 g ÷ 1000 cm³ = 0,998 g/cm³. Aluminium: 2700 g ÷ 1000 cm³ = 2,70 g/cm³. Die Formel lautet ρ = m/V.',en:'Water: 998 g ÷ 1000 cm³ = 0.998 g/cm³. Aluminium: 2700 g ÷ 1000 cm³ = 2.70 g/cm³. Formula: ρ = m/V.'}},
 {scenario:{left:'wood',right:'iron',mode:'volume',quantity:1000,shape:'cube'},
  prompt:{hu:'Nézd meg a fa és a vas „Vízben” jelzését. Melyik úszna, melyik süllyedne el?',de:'Vergleiche die Angaben „In Wasser“ für Holz und Eisen. Was schwimmt, was sinkt?',en:'Read the “In water” notes for wood and iron. Which would float and which would sink?'},
  explanation:{hu:'A száraz fa átlagos sűrűsége (kb. 0,50 g/cm³) kisebb a vízénél, ezért úszik. A vasé (kb. 7,87 g/cm³) nagyobb, ezért egy tömör vasdarab elsüllyed. Az alak és a bezárt levegő is számít, ezért egy acélhajó úszhat.',de:'Trockenes Holz (etwa 0,50 g/cm³) ist im Mittel weniger dicht als Wasser und schwimmt. Ein massives Stück Eisen (etwa 7,87 g/cm³) sinkt. Form und eingeschlossene Luft spielen ebenfalls eine Rolle: Ein Stahlschiff kann schwimmen.',en:'Dry wood (about 0.50 g/cm³) is less dense than water and floats. A solid piece of iron (about 7.87 g/cm³) sinks. Shape and trapped air also matter: a steel ship can float.'}}
]);

// The Bunsen Lab is simulation-only; its complete P2 teaching bank lives in Academy.
const bunsenEducation=(root&&root.BunsenEducation)||(typeof require==='function'?require('./bunsen-education.js'):null);
if(bunsenEducation){
 const at=topics.findIndex(t=>t.id==='bunsen');
 if(at>=0){
  const levelLabels={
   basic:{hu:'Bunsen – alapfok (7–8.)',de:'Bunsen – Basis (7–8)',en:'Bunsen – Basic (7–8)'},
   advanced:{hu:'Bunsen – haladó (9–10.)',de:'Bunsen – Fortgeschritten (9–10)',en:'Bunsen – Advanced (9–10)'},
   upper:{hu:'Bunsen – Oberstufe (11–13.)',de:'Bunsen – Oberstufe (11–13)',en:'Bunsen – Upper Secondary (11–13)'}
  };
  const bunTopics=bunsenEducation.levels.map(level=>({
   id:'bunsen-'+level,tab:'bunsenTab',title:levelLabels[level],
   lesson:bunsenEducation.lesson[level],
   bank:bunsenEducation.bank[level].map((item,i)=>({...item,id:'bunsen-'+level+'-'+i,topic:'bunsen-'+level,lessonIndex:item.lessonIndex}))
  }));
  topics.splice(at,1,...bunTopics);
 }
}
function shuffle(arr,rng=Math.random){const x=arr.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function session(id,exam=false,rng=Math.random){const set=id==='all'?topics.flatMap(t=>t.bank.map(q=>({...q,topic:t.id}))):topics.find(x=>x.id===id)?.bank.map(q=>({...q,topic:id}))||[];const count=id==='all'?(exam?14:10):(id.startsWith('bunsen-')?(exam?10:6):(exam?4:3));const selected=id==='all'&&exam?[...shuffle(topics.filter(t=>t.bank.length>0).map(t=>({...shuffle(t.bank,rng)[0],topic:t.id})),rng),...shuffle(set,rng)].filter((q,i,a)=>a.findIndex(x=>x.id===q.id)===i).slice(0,count):shuffle(set,rng).slice(0,count);return selected.map(q=>{const ord=shuffle([0,1,2],rng);return {...q,choices:Object.fromEntries(locales.map(l=>[l,ord.map(i=>q.choices[l][i])])),answer:ord.indexOf(q.answer)}})}
function grade(qs,answers){const correct=qs.filter((q,i)=>q.answer===answers[i]).length;return{correct,total:qs.length,percent:qs.length?Math.round(correct*100/qs.length):0,missed:qs.filter((q,i)=>q.answer!==answers[i])}}
return Object.freeze({topics,locales,session,grade,densityActivities});
});
(function(){
'use strict';if(typeof document==='undefined')return;
const api=window.ChemistryCurriculum,$=id=>document.getElementById(id),sec=$('curriculumSection'),tab=$('curriculumTab');if(!api||!sec||!tab)return;
const tr={hu:{title:'Kémia Akadémia',intro:'Válassz témát, tanuld meg a leckéket, gyakorolj, majd vizsgázz. A feladatok a leckékre épülnek.',all:'Átfogó kémia',learn:'Tanulás',practice:'Gyakorlás',exam:'Vizsga',check:'Ellenőrzés',next:'Következő',restart:'Újrakezdés',open:'Nyisd meg a kapcsolódó labort',lesson:'Lecke',question:'Kérdés',correct:'Helyes.',wrong:'Nem helyes.',choose:'Válassz választ.',review:'Kapcsolódó lecke megnyitása',score:'Eredmény',report:'Ismétlendő leckék',done:'Befejezve',limit:'A modellek szemléltetők, nem helyettesítik a valós kísérleteket.',topics:'Témakör',explain:'Magyarázat',hunt:'Elemvadászat'},de:{title:'Chemie-Akademie',intro:'Thema auswählen, Lektionen lesen, üben und prüfen. Alle Aufgaben basieren auf dem Lernstoff.',all:'Chemie gesamt',learn:'Lernen',practice:'Üben',exam:'Prüfung',check:'Prüfen',next:'Weiter',restart:'Neustart',open:'Zugehöriges Labor öffnen',lesson:'Lektion',question:'Frage',correct:'Richtig.',wrong:'Nicht richtig.',choose:'Antwort wählen.',review:'Zugehörige Lektion öffnen',score:'Ergebnis',report:'Lektionen zum Wiederholen',done:'Fertig',limit:'Modelle sind Illustrationen und ersetzen keine echten Experimente.',topics:'Thema',explain:'Erklärung',hunt:'Elementjagd'},en:{title:'Chemistry Academy',intro:'Choose a topic, read lessons, practise, then take an exam. Each question is taught in the lessons.',all:'All chemistry',learn:'Learn',practice:'Practice',exam:'Exam',check:'Check',next:'Next',restart:'Restart',open:'Open related lab',lesson:'Lesson',question:'Question',correct:'Correct.',wrong:'Incorrect.',choose:'Choose an answer.',review:'Open related lesson',score:'Score',report:'Lessons to review',done:'Complete',limit:'Models are illustrative and cannot replace real experiments.',topics:'Topic',explain:'Explanation',hunt:'Element Hunt'}};
let topic='atoms',mode='learn',index=0,answers=[],checked=false,completed=false,qs=[],recordedSession=false;
const hunt=$('huntSection');if(hunt)sec.append(hunt);
let densityRevealed=false,densityVisited=false;
const densityUI={
 hu:{intro:'Négy rövid, szabadon felfedezhető sűrűséglecke. Nincs pontozás, vizsga vagy tudásmérés.',observe:'Figyeld meg:',open:'Kísérlet megnyitása a Sűrűség laborban',back:'Vissza az Akadémia leckéjéhez',show:'Magyarázat megjelenítése',hide:'Magyarázat elrejtése',next:'Következő felfedezés',again:'Első lecke',note:'Az egyszerű modell pontjai azonos tömegű anyagrészeket jelölnek, nem atomokat. Nem kvantumfizikai szimuláció.',without:'Próbálgasd szabadon a csúszkát és az anyagokat, majd térj vissza a leckéhez.'},
 de:{intro:'Vier kurze Entdeckungslektionen zur Dichte. Ohne Punkte, Prüfungen oder Leistungsmessung.',observe:'Beobachte:',open:'Versuch im Dichtelabor öffnen',back:'Zurück zur Akademie-Lektion',show:'Erklärung anzeigen',hide:'Erklärung ausblenden',next:'Nächste Entdeckung',again:'Erste Lektion',note:'Die Punkte im einfachen Modell stehen für gleich schwere Materialportionen, nicht für Atome. Keine quantenphysikalische Simulation.',without:'Verändere den Regler und die Stoffe nach Belieben und kehre dann zur Lektion zurück.'},
 en:{intro:'Four short density discovery lessons. No scores, exams or assessment.',observe:'Explore:',open:'Open experiment in Density Lab',back:'Back to Academy lesson',show:'Show explanation',hide:'Hide explanation',next:'Next discovery',again:'First lesson',note:'Basic-model dots represent equal-mass portions, not atoms. This is not a quantum-physics simulation.',without:'Experiment freely with the slider and materials, then return to the lesson.'}
};
let densityReturnButton=null;
function closeDensityReturn(){if(densityReturnButton){densityReturnButton.remove();densityReturnButton=null;}}
function densityLabOpen(){
 const activity=api.densityActivities[index];
 if(!activity)return;
 const lab=$('densitySection');
 const controller=window.ChemistryDensityLab;
 if(!lab||typeof controller?.configure!=='function'){
  $('curriculumFeedback').textContent=densityUI[lang()].without;
  return;
 }
 densityVisited=true;
 controller.configure(activity.scenario);
 closeDensityReturn();
 densityReturnButton=document.createElement('button');
 densityReturnButton.id='academyDensityReturn';
 densityReturnButton.type='button';
 densityReturnButton.textContent=densityUI[lang()].back;
 densityReturnButton.className='academy-density-return';
 densityReturnButton.addEventListener('click',()=>{
  closeDensityReturn();window.ChemistryNavigation?.activate('curriculumTab');
  if(!window.ChemistryNavigation)$('curriculumTab').click();
  render();
 });
 lab.prepend(densityReturnButton);
 window.ChemistryNavigation?.activate('densityTab');
 if(!window.ChemistryNavigation)$('densityTab').click();
}
function renderDensityDiscovery(content){
 const ui=densityUI[lang()],topicData=api.topics.find(x=>x.id==='density'),activity=api.densityActivities[index];
 $('curriculumCheck').hidden=true;$('curriculumNext').hidden=true;$('curriculumRestart').hidden=true;
 $('curriculumOpen').hidden=true;
 const heading=add(content,'h3',topicData.title[lang()]+' · '+t('lesson')+' '+(index+1)+'/4');
 heading.className='academy-density-heading';
 add(content,'p',ui.intro,'academy-density-intro');
 add(content,'p',topicData.lesson[index][lang()],'academy-lesson');
 add(content,'strong',ui.observe);
 add(content,'p',activity.prompt[lang()],'academy-density-observation');
 const open=add(content,'button',ui.open,'academy-density-open');open.type='button';open.addEventListener('click',densityLabOpen);
 add(content,'p',ui.without,'hint');
 const reveal=add(content,'button',densityRevealed?ui.hide:ui.show,'academy-density-reveal');
 reveal.type='button';reveal.setAttribute('aria-expanded',String(densityRevealed));
 reveal.addEventListener('click',()=>{densityRevealed=!densityRevealed;render()});
 if(densityRevealed)add(content,'p',activity.explanation[lang()],'academy-density-explanation');
 const next=add(content,'button',index===3?ui.again:ui.next,'academy-density-next');
 next.type='button';next.addEventListener('click',()=>{index=(index+1)%4;densityRevealed=false;densityVisited=false;render()});
 add(content,'p',ui.note,'hint');
}
const lang=()=>['hu','de','en'].find(x=>$(x)?.classList.contains('active'))||'hu',t=k=>tr[lang()][k],add=(node,tag,str,cls)=>{const n=document.createElement(tag);n.textContent=str;if(cls)n.className=cls;node.append(n);return n};
function reset(){index=0;answers=[];checked=false;completed=false;recordedSession=false;densityRevealed=false;densityVisited=false;if(topic==='density')mode='learn';qs=mode==='learn'||mode==='guided'?[]:api.session(topic,mode==='exam');render()}
function jump(id){if(id==='huntSection'){mode='hunt';reset();return}const dest=$(id);if(!dest)return;const tabId=api.topics.find(x=>x.id===topic)?.tab;if(tabId&&window.ChemistryNavigation){$(tabId)?.click();window.ChemistryNavigation.activate(tabId);return}document.querySelectorAll('main > section').forEach(s=>s.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(b=>b.classList.remove('active'));dest.classList.remove('hidden');$(tabId)?.classList.add('active')}
function lessonButton(host,q){const b=add(host,'button',t('review')+' ('+t('lesson')+' '+(q.lessonIndex+1)+')');b.type='button';b.addEventListener('click',()=>{topic=q.topic;mode='learn';index=q.lessonIndex;qs=[];checked=false;completed=false;answers=[];render()})}

const guidedTexts={
 hu:{title:'Irányított tanulás',read:'1 · Lecke',predict:'2 · Előzetes tipp',lab:'3 · Laborfeladat',assess:'4 · Ellenőrzés',begin:'Tovább: előzetes tipp',go:'Kapcsolódó labor megnyitása',back:'Végezd el a kapcsolódó laborfeladatot, majd térj vissza az Akadémiára.',done:'Elvégeztem a laborfeladatot',unverified:'A feladat befejezését te igazolod; ez nem automatikus mérés.',verified:'A labor visszajelezte a feladat ellenőrzését.',advance:'Tovább',verify:'Válasz ellenőrzése',next:'Következő lecke',retry:'Újrapróbálás',choose:'Válassz egy választ.',predictQ:'Mit gondolsz a labor kipróbálása előtt?',assessQ:'Mit tanultál? Most válaszolj önállóan.',explain:'A kapcsolódó lecke magyarázata:',expected:'Helyes válasz:'},
 de:{title:'Geführtes Lernen',read:'1 · Lektion',predict:'2 · Vorhersage',lab:'3 · Laboraufgabe',assess:'4 · Überprüfung',begin:'Weiter zur Vorhersage',go:'Labor öffnen',back:'Löse die Laboraufgabe und kehre zur Akademie zurück.',done:'Ich habe die Laboraufgabe bearbeitet',unverified:'Diese Bestätigung ist Selbstauskunft, keine automatische Prüfung.',verified:'Das Labor hat eine Antwort geprüft.',advance:'Weiter',verify:'Antwort prüfen',next:'Nächste Lektion',retry:'Erneut versuchen',choose:'Bitte wähle eine Antwort.',predictQ:'Was vermutest du vor dem Versuch?',assessQ:'Was hast du gelernt? Antworte selbstständig.',explain:'Erklärung aus der Lektion:',expected:'Richtige Antwort:'},
 en:{title:'Guided learning',read:'1 · Lesson',predict:'2 · Prediction',lab:'3 · Lab task',assess:'4 · Check understanding',begin:'Continue to prediction',go:'Open related lab',back:'Complete the related lab activity and return to Academy.',done:'I completed the lab task',unverified:'This is self-reported, not an automatically verified completion.',verified:'The lab checked your response.',advance:'Continue',verify:'Check answer',next:'Next lesson',retry:'Try again',choose:'Choose an answer.',predictQ:'What do you predict before the lab?',assessQ:'What did you learn? Answer independently.',explain:'Explanation from the lesson:',expected:'Correct answer:'}
};
const guidedSections={atoms:'periodSection',bonds:'moleculeSection',stoich:'stoichSection',acids:'acidBaseSection',quest:'gameSection',hunt:'periodSection',materials:'materialsSection',physics:'physicsSection',speculative:'specSection','bunsen-basic':'bunsenSection','bunsen-advanced':'bunsenSection','bunsen-upper':'bunsenSection'};
let guidedStep=0,guidedPrediction=null,guidedAnswer=null,guidedConfirmed=false,guidedVisited=false,guidedEvidence=null,guidedEvaluated=false;
function guidedReset(){guidedStep=0;guidedPrediction=null;guidedAnswer=null;guidedConfirmed=false;guidedVisited=false;guidedEvidence=null;guidedEvaluated=false;window.ChemistryGuidedTask=null;}
function guidedQuestion(which){
 const node=api.topics.find(x=>x.id===topic);
 const primary=node.bank.filter(q=>q.lessonIndex===index);
 const pool=primary.length?primary:node.bank;
 const item=pool[which==='prediction'?0:(pool.length>1?1:0)];
 if(!item)return null;
 const order=which==='prediction'?[1,2,0]:[2,0,1];
 return {...item,choices:Object.fromEntries(api.locales.map(l=>[l,order.map(i=>item.choices[l][i])])),answer:order.indexOf(item.answer)};
}
function guidedButton(host,label,callback){
 const b=add(host,'button',label);b.type='button';b.addEventListener('click',callback);return b;
}
function guidedChoices(host,q,value,update){
 const group=add(host,'div','','academy-choices');group.setAttribute('role','radiogroup');group.setAttribute('aria-label',q.q[lang()]);
 q.choices[lang()].forEach((label,i)=>{
  const row=document.createElement('label'),radio=document.createElement('input');
  radio.type='radio';radio.name='guidedChoice'+guidedStep;radio.value=String(i);radio.checked=i===value;radio.disabled=guidedEvaluated;
  radio.addEventListener('change',()=>update(i));row.append(radio,document.createTextNode(' '+label));group.append(row);
 });
}
function renderGuided(content){
 const g=guidedTexts[lang()],node=api.topics.find(x=>x.id===topic),lesson=node.lesson[index];
 $('curriculumCheck').hidden=true;$('curriculumNext').hidden=true;
 add(content,'h3',node.title[lang()]+' · '+t('lesson')+' '+(index+1)+'/'+node.lesson.length);
 add(content,'p',[g.read,g.predict,g.lab,g.assess][guidedStep],'academy-count');
 if(guidedStep===0){add(content,'p',lesson[lang()],'academy-lesson');guidedButton(content,g.begin,()=>{guidedStep=1;render()});return;}
 const q=guidedQuestion(guidedStep===1?'prediction':'assessment');
 if(!q){add(content,'p',lesson[lang()]);return;}
 if(guidedStep===1){
  add(content,'h3',g.predictQ);add(content,'p',q.q[lang()]);
  guidedChoices(content,q,guidedPrediction,i=>{guidedPrediction=i});
  guidedButton(content,g.advance,()=>{if(guidedPrediction===null){$('curriculumFeedback').textContent=g.choose;return;}guidedStep=2;render()});return;
 }
 if(guidedStep===2){
  add(content,'p',g.back);add(content,'p',guidedEvidence?g.verified:g.unverified,'hint');
  guidedButton(content,g.go,()=>{
   guidedVisited=true;
   const lab=guidedSections[topic]||node.tab;
   window.ChemistryGuidedTask={topic,lessonIndex:index,lab,step:'experiment'};
   if(lab==='periodSection'){window.ChemistryNavigation?.activate('periodTab');return;}
   jump(lab);
  });
  guidedButton(content,g.done,()=>{
   if(!guidedVisited&&!guidedEvidence){$('curriculumFeedback').textContent=g.go;return;}
   guidedConfirmed=true;guidedStep=3;render();
  });
  return;
 }
 add(content,'h3',g.assessQ);add(content,'p',q.q[lang()]);
 guidedChoices(content,q,guidedAnswer,i=>{guidedAnswer=i});
 if(!guidedEvaluated){guidedButton(content,g.verify,()=>{if(guidedAnswer===null){$('curriculumFeedback').textContent=g.choose;return;}guidedEvaluated=true;window.ChemistryLearningProgress?.record(topic,guidedAnswer===q.answer,'guided');render()});return;}
 const correct=guidedAnswer===q.answer;
 add(content,'p',correct?t('correct'):t('wrong')+' '+g.expected+' '+q.choices[lang()][q.answer]);
 add(content,'p',g.explain+' '+lesson[lang()],'academy-lesson');
 if(!correct)guidedButton(content,g.retry,()=>{guidedAnswer=null;guidedEvaluated=false;render()});
 guidedButton(content,g.next,()=>{index=(index+1)%node.lesson.length;guidedReset();render()});
}
const guidedButtonMode=document.createElement('button');guidedButtonMode.type='button';guidedButtonMode.id='curriculumguided';
$('curriculumlearn')?.parentElement?.append(guidedButtonMode);
guidedButtonMode.addEventListener('click',()=>{topic=topic==='all'?'atoms':topic;mode='guided';guidedReset();reset()});
window.addEventListener?.('chemistry:lab-result',event=>{
 if(mode!=='guided'||guidedStep!==2||event.detail?.topic!==topic)return;
 guidedEvidence={task:event.detail.task,correct:!!event.detail.correct};render();
});

function render(){
 $('curriculumhunt').textContent=t('hunt');$('curriculumhunt').setAttribute('aria-pressed',String(mode==='hunt'));
 for(const v of ['learn','practice','exam']){$('curriculum'+v).textContent=t(v);$('curriculum'+v).setAttribute('aria-pressed',String(mode===v))}
 guidedButtonMode.textContent=guidedTexts[lang()].title;guidedButtonMode.setAttribute('aria-pressed',String(mode==='guided'));
 $('curriculumTab').textContent=t('title');
 $('curriculumTitle').textContent=t('title');$('curriculumIntro').textContent=t('intro');$('curriculumTopicLabel').textContent=t('topics');$('curriculumOpen').textContent=t('open');$('curriculumLimit').textContent=t('limit');
 const select=$('curriculumTopic'),old=topic;select.replaceChildren();for(const x of api.topics){let op=document.createElement('option');op.value=x.id;op.textContent=x.title[lang()];select.append(op)}if(mode!=='learn'&&mode!=='guided'){const option=document.createElement('option');option.value='all';option.textContent=t('all');select.append(option)}if(!Array.from(select.options).some(x=>x.value===old))topic='atoms';select.value=topic;
 $('curriculumOpen').hidden=topic==='all'||mode==='hunt';
 const isHunt=mode==='hunt';for(const id of ['curriculumTopic','curriculumTopicLabel','curriculumLimit','curriculumCheck','curriculumNext','curriculumRestart','curriculumFeedback'])$(id).hidden=isHunt;
 if(hunt)hunt.classList.toggle('hidden',!isHunt);
 const content=$('curriculumContent'),feedback=$('curriculumFeedback');content.replaceChildren();feedback.textContent='';$('curriculumCheck').textContent=t('check');$('curriculumNext').textContent=t('next');$('curriculumRestart').textContent=t('restart');$('curriculumCheck').hidden=mode==='learn'||mode==='guided'||checked||completed;$('curriculumNext').hidden=completed;
 if(mode==='hunt'){content.hidden=true;for(const id of ['curriculumCheck','curriculumNext','curriculumRestart'])$(id).hidden=true;return}content.hidden=false;
 if(topic==='density'){mode='learn';for(const v of ['practice','exam','curriculumguided']){const id=v==='curriculumguided'?v:'curriculum'+v;$(id).hidden=true}renderDensityDiscovery(content);return;}
 for(const id of ['curriculumpractice','curriculumexam','curriculumguided'])$(id).hidden=false;
 if(mode==='guided'){renderGuided(content);return;}
 if(mode==='learn'){
 const node=api.topics.find(x=>x.id===topic),lessons=node.lesson;index=Math.min(index,lessons.length-1);add(content,'h3',node.title[lang()]+' · '+t('lesson')+' '+(index+1)+'/'+lessons.length);add(content,'p',lessons[index][lang()],'academy-lesson');add(content,'p',t('limit'),'hint');$('curriculumNext').textContent=index===lessons.length-1?t('restart'):t('next');return;
 }
 if(completed){if(!recordedSession){qs.forEach((q,i)=>window.ChemistryLearningProgress?.record(q.topic,answers[i]===q.answer,mode));recordedSession=true;}const result=api.grade(qs,answers);add(content,'h3',t('score')+': '+result.correct+'/'+result.total+' ('+result.percent+'%)');if(result.missed.length){add(content,'h4',t('report'));const seen=new Set();for(const q of result.missed){const k=q.topic+':'+q.lessonIndex;if(seen.has(k))continue;seen.add(k);lessonButton(content,q)}}const list=add(content,'ol','');for(let i=0;i<qs.length;i++)add(list,'li',qs[i].q[lang()]+' — '+(qs[i].answer===answers[i]?t('correct'):t('wrong')+' '+qs[i].choices[lang()][qs[i].answer]));$('curriculumNext').hidden=true;return}
 const q=qs[index];if(!q)return;add(content,'p',t('question')+' '+(index+1)+'/'+qs.length,'academy-count');add(content,'h3',q.q[lang()]);const group=add(content,'div','','academy-choices');group.setAttribute('role','radiogroup');group.setAttribute('aria-label',q.q[lang()]);q.choices[lang()].forEach((label,i)=>{const row=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='academyAnswer';input.value=String(i);input.checked=answers[index]===i;input.disabled=checked;input.addEventListener('change',()=>{answers[index]=i});row.append(input,document.createTextNode(' '+label));group.append(row)});
 $('curriculumNext').hidden=!checked;
 if(checked){if(mode==='practice'){feedback.textContent=answers[index]===q.answer?t('correct'):t('wrong')+' '+q.choices[lang()][q.answer];lessonButton(content,q)}else feedback.textContent=''}
}
function show(){document.querySelectorAll('main > section').forEach(s=>s.classList.add('hidden'));document.querySelectorAll('.tabs > button').forEach(b=>b.classList.remove('active'));sec.classList.remove('hidden');tab.classList.add('active');render()}
tab.addEventListener('click',show);$('curriculumTopic').addEventListener('change',e=>{topic=e.target.value;closeDensityReturn();guidedReset();reset()});for(const v of ['learn','practice','exam','hunt'])$('curriculum'+v).addEventListener('click',()=>{mode=v;guidedReset();reset()});
const topicSections={atoms:'periodSection',bonds:'moleculeSection',stoich:'stoichSection',acids:'acidBaseSection',quest:'gameSection',hunt:'huntSection',materials:'materialsSection',physics:'physicsSection',speculative:'specSection','bunsen-basic':'bunsenSection','bunsen-advanced':'bunsenSection','bunsen-upper':'bunsenSection'};
$('curriculumOpen').addEventListener('click',()=>{if(topic==='density'){densityLabOpen();return}if(topicSections[topic])jump(topicSections[topic])});
$('curriculumCheck').addEventListener('click',()=>{if(!Number.isInteger(answers[index])){$('curriculumFeedback').textContent=t('choose');return}checked=true;render()});
$('curriculumNext').addEventListener('click',()=>{if(mode==='learn'){index=(index+1)%api.topics.find(x=>x.id===topic).lesson.length;render();return}if(!checked)return;if(index+1===qs.length)completed=true;else{index++;checked=false}render()});
$('curriculumRestart').addEventListener('click',()=>{guidedReset();reset()});
for(const id of ['hu','de','en'])$(id)?.addEventListener('click',()=>{queueMicrotask(render);requestAnimationFrame(render)});reset();
})();
