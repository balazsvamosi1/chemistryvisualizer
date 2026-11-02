/* Chemistry Quest: Ten-level educational adventure. Original code, MIT. */
(()=>{'use strict';
const $=id=>document.getElementById(id),cv=$('questCanvas'),ctx=cv.getContext('2d'),W=960,H=480;
const T={hu:{title:'Kémiai küldetés · 10 pálya',instructions:'A/D: mozgás · Space/W: ugrás · C: készítés · E: használat · Q/Tab: fegyverváltás · 1–0: fegyverválasztás',craft:'⚗ Készítés (C)',fire:'🧯 Használat (E)',next:'Következő pálya ▶',restart:'Újrakezdés',health:'Élet',atoms:'Atomok',active:'Aktív töltet',need:'Hiányzó atomok',made:'Elkészült',wrong:'Nem helyes. Próbáld újra!',collected:'Atom megszerezve',select:'Válassz receptet',make:'Elkészítés',cancel:'Mégse',locked:'Ez a recept még nincs feloldva.',insufficient:'Nincs elég atom.',noammo:'Nincs ilyen tölteted. Készíts a C gombbal!',hit:'Sérülés! Kerüld az ellenfelet és a csapdákat.',blocked:'A kijárat zárva. Teljesítsd az összes feladatot!',success:'Pálya teljesítve!',finished:'MIND A 10 PÁLYA TELJESÍTVE!',science:'Oktatási játékszabály: a gyűjtött atomok nem hoznak létre maguktól valódi anyagot.',chemfail:'Érvénytelen molekulamodell.',buildTitle:"Építsd fel a molekulát! Jelölj ki két atomot és a kötésrendjüket.",bondOrder:"Kötésrend",single:"Egyszeres",double:"Kettős",triple:"Hármas",clearBonds:"Kötések törlése",buildSelect:"Két különböző atomot válassz.",buildError:"A kapcsolatok nem felelnek meg a keresett szerkezetnek.",buildOk:"Helyes kapcsolódás! A molekula elkészíthető.",ionicNote:"Ionvegyület: ionarányt ellenőrzünk, nem kovalens molekulát.",incorrect:'Nem megfelelő reagens ehhez az akadályhoz.',hazard:'Vigyázat! Veszélyes kölcsönhatás.',effect:'Sikeres kémiai művelet!',question:'Válaszolj az atomkérdésre az atom felvételéhez.',prev:'Következő töltet',weapons:'Molekulafegyverek',charges:'töltet',empty:'Üres',selectWeapon:'Töltet kiválasztása',targets:"célpont",hydrogenBoost:"H₂-emelés – oktatási játékmechanika, nem valódi sugárhajtás",oxygenRequired:"A reakcióhoz CH₄ és 2 O₂ szükséges.",mission:"Küldetés: kijutni a kigyulladt kémiai laboratóriumból.",escape:"Menekülés a lángoló laborból",craftEquation:"A fegyver előállításához rendezd a reakcióegyenletet!",minions:"Kisebb ellenfelek",stage:"Szakasz",process:"Oktatási modell: a reakcióegyenlet az ipari/laboratóriumi elvet mutatja, nem az atomokból történő közvetlen készítést."},
de:{title:'Chemistry Quest · 10 Level',instructions:'A/D: bewegen · Space/W: springen · C: herstellen · E: verwenden · Q/Tab: wechseln · 1–0: auswählen',craft:'⚗ Herstellen (C)',fire:'🧯 Verwenden (E)',next:'Nächstes Level ▶',restart:'Neustart',health:'Leben',atoms:'Atome',active:'Aktive Ladung',need:'Fehlende Atome',made:'Hergestellt',wrong:'Falsch. Versuch es erneut!',collected:'Atom gesammelt',select:'Rezept wählen',make:'Herstellen',cancel:'Abbrechen',locked:'Rezept noch nicht freigeschaltet.',insufficient:'Nicht genug Atome.',noammo:'Keine Munition. Mit C herstellen!',hit:'Schaden! Meide Gegner und Fallen.',blocked:'Ausgang gesperrt. Löse alle Aufgaben!',success:'Level geschafft!',finished:'ALLE 10 LEVEL GESCHAFFT!',science:'Didaktisches Spielmodell: Atom-Sammeln ist keine tatsächliche Stoffherstellung.',chemfail:'Ungültiges Molekülmodell.',buildTitle:"Baue das Molekül: Wähle zwei Atome und eine Bindungsordnung.",bondOrder:"Bindungsordnung",single:"Einfach",double:"Doppelt",triple:"Dreifach",clearBonds:"Bindungen löschen",buildSelect:"Bitte zwei unterschiedliche Atome wählen.",buildError:"Die Bindungen entsprechen nicht der gesuchten Struktur.",buildOk:"Richtige Struktur! Molekül kann hergestellt werden.",ionicNote:"Ionenverbindung: Ionenverhältnis statt kovalenter Struktur.",incorrect:'Falsches Reagenz für dieses Hindernis.',hazard:'Achtung! Gefährliche Wechselwirkung.',effect:'Chemische Aufgabe gelöst!',question:'Beantworte die Frage, um das Atom zu sammeln.',prev:'Nächste Ladung',weapons:'Molekülwaffen',charges:'Ladungen',empty:'Leer',selectWeapon:'Ladung auswählen',targets:"Ziele",hydrogenBoost:"H₂-Auftrieb – didaktische Spielmechanik, kein echter Raketenantrieb",oxygenRequired:"Die Reaktion benötigt CH₄ und 2 O₂.",mission:"Mission: Entkomme aus dem brennenden Chemielabor.",escape:"Flucht aus dem brennenden Labor",craftEquation:"Gleiche die Reaktionsgleichung zur Herstellung deiner Munition aus!",minions:"Kleine Gegner",stage:"Abschnitt",process:"Lernmodell: Die Gleichung erklärt einen chemischen Herstellungsweg, keine direkte Synthese aus gesammelten Atomen."},
en:{title:'Chemistry Quest · 10 levels',instructions:'A/D: move · Space/W: jump · C: craft · E: use · Q/Tab: cycle weapons · 1–0: select weapon',craft:'⚗ Craft (C)',fire:'🧯 Use (E)',next:'Next level ▶',restart:'Restart',health:'Health',atoms:'Atoms',active:'Active ammo',need:'Missing atoms',made:'Crafted',wrong:'Incorrect. Try again!',collected:'Atom collected',select:'Select a recipe',make:'Craft',cancel:'Cancel',locked:'Recipe not yet unlocked.',insufficient:'Not enough atoms.',noammo:'No ammo. Craft with C!',hit:'Damage! Avoid enemies and hazards.',blocked:'Exit locked. Complete all objectives!',success:'Level complete!',finished:'ALL 10 LEVELS COMPLETE!',science:'Educational game model: collecting atoms is not a chemical synthesis.',chemfail:'Invalid molecular model.',buildTitle:"Build the molecule: select two atoms and their bond order.",bondOrder:"Bond order",single:"Single",double:"Double",triple:"Triple",clearBonds:"Clear bonds",buildSelect:"Choose two different atoms.",buildError:"These bonds do not match the target molecular structure.",buildOk:"Correct bonding! The molecule can be crafted.",ionicNote:"Ionic compound: we check ion ratios, not a covalent molecule.",incorrect:'Wrong reagent for this obstacle.',hazard:'Caution! Hazardous interaction.',effect:'Chemical challenge solved!',question:'Answer the atomic question to collect this atom.',prev:'Next weapon',weapons:'Molecule arsenal',charges:'charges',empty:'Empty',selectWeapon:'Select ammunition',targets:"targets",hydrogenBoost:"H₂ boost – educational gameplay, not actual propulsion",oxygenRequired:"The reaction requires CH₄ and 2 O₂.",mission:"Mission: escape the chemistry laboratory after a fire breaks out.",escape:"Escape the Burning Laboratory",craftEquation:"Balance the chemical equation to prepare your ammunition!",minions:"Small enemies",stage:"Stage",process:"Educational model: the equation illustrates a preparation route, not direct synthesis from collected atoms."}};
const langNow=()=>typeof lang==='string'&&T[lang]?lang:'hu',tr=k=>T[langNow()][k]||k;
const RECIPES=[
{id:'H2O',f:'H₂O',atoms:{H:2,O:1},kind:'molecule',edges:[['O','H',1],['O','H',1]]},
{id:'CO2',f:'CO₂',atoms:{C:1,O:2},kind:'molecule',edges:[['C','O',2],['C','O',2]]},
{id:'H2',f:'H₂',atoms:{H:2},kind:'molecule',edges:[['H','H',1]]},
{id:'NaOH',f:'NaOH',atoms:{Na:1,O:1,H:1},kind:'ionic',note:'Na⁺ + OH⁻'},
{id:'HCl',f:'HCl',atoms:{H:1,Cl:1},kind:'molecule',edges:[['H','Cl',1]],note:'Sósav: HCl vizes oldata'},
{id:'NH3',f:'NH₃',atoms:{N:1,H:3},kind:'molecule',edges:[['N','H',1],['N','H',1],['N','H',1]]},
{id:'NaCl',f:'NaCl',atoms:{Na:1,Cl:1},kind:'ionic',note:'Na⁺/Cl⁻ ionrács'},
{id:'CaOH2',f:'Ca(OH)₂',atoms:{Ca:1,O:2,H:2},kind:'ionic',note:'Ca²⁺ + 2 OH⁻'},
{id:'H2O2',f:'H₂O₂',atoms:{H:2,O:2},kind:'molecule',edges:[['H','O',1],['O','O',1],['O','H',1]]},
{id:'CH4',f:'CH₄',atoms:{C:1,H:4},kind:'molecule',edges:[['C','H',1],['C','H',1],['C','H',1],['C','H',1]]},
{id:'O2',f:'O₂',atoms:{O:2},kind:'molecule',edges:[['O','O',2]]}];
const R=Object.fromEntries(RECIPES.map(r=>[r.id,r]));
const stageCode=n=>(Math.floor(n/5)+1)+'-'+(n%5+1);
const L=[
{title:['A hőelvonás csarnoka','Halle der Kühlung','Hall of Heat Removal'],recipe:'H2O',targets:[['wood_fire','Parázsló Fa-gólem','Ember Wood Golem']],atoms:{H:2,O:1},fact:'Víz: a hőelvonás segíthet a fa égésének megszüntetésében.'},
{title:['Zárlatos szerverterem','Kurzschluss im Serverraum','Short-Circuit Server Room'],recipe:'CO2',targets:[['wood_fire','Égő faláda','Burning crate'],['electric_fire','Zárlatos Szerver-robot','Short-Circuit Server Robot']],atoms:{C:1,O:2,H:2},fact:'Áram alatt lévő berendezésre vizet permetezni veszélyes; a CO₂ nem vezető oltóközeg.'},
{title:['Rozsdás szellőzőfolyosó','Verrosteter Lüftungsschacht','Rusted Ventilation Shaft'],recipe:'H2',targets:[['rust_knight','Rozsda-lovag','Rust Knight']],atoms:{H:2},fact:'Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O: redukció megfelelő körülmények, például magas hőmérséklet mellett.'},
{title:['Korróziós csatorna','Korrosionskanal','Corrosion Canal'],recipe:'NaOH',targets:[['acid_slime','Sav-nyálka','Acid Slime']],atoms:{Na:1,O:1,H:1},fact:'HCl + NaOH → NaCl + H₂O. Az oldat végső pH-ja az anyagmennyiségektől függ.'},
{title:['Karbonátraktár','Karbonatlager','Carbonate Storage'],recipe:'HCl',targets:[['limestone_wall','Mészkőfal','Limestone Wall']],atoms:{H:1,Cl:1},fact:'CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑; sav hatására a karbonát pezseg.'},
{title:['A komplexek csarnoka','Halle der Komplexe','Hall of Complexes'],recipe:'NH3',targets:[['copper_guard','Réz(II)-komplex őr','Copper(II) Guard']],atoms:{N:1,H:3},fact:'Ammóniával alkalmas oldatban mélykék [Cu(NH₃)₄]²⁺ komplex keletkezhet.'},
{title:['A fagyott labor','Gefrorenes Labor','Frozen Laboratory'],recipe:'NaCl',targets:[['ice_shield','Jégpajzs','Ice Shield'],['electrolyte_bridge','Elektrolit-híd','Electrolyte Bridge'],['silver_sensor','Ezüstion-szenzor','Silver Ion Sensor']],atoms:{Na:3,Cl:3},fact:'NaCl csökkenti a víz fagyáspontját, az ionok elektromos vezetést tesznek lehetővé és Ag⁺ + Cl⁻ → AgCl↓.'},
{title:['Gázanalitikai kamra','Gasanalysekammer','Gas Analysis Chamber'],recipe:'CaOH2',targets:[['co2_ghost','CO₂-fantom','CO₂ Phantom']],atoms:{Ca:1,O:2,H:2},fact:'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O: mészvíz-próba.'},
{title:['Biokémiai karantén','Biochemische Quarantäne','Biochemical Quarantine'],recipe:'H2O2',targets:[['spore_colony','Spóratelep','Spore Colony']],atoms:{H:2,O:2},fact:'2 H₂O₂ → 2 H₂O + O₂; a katalizátor gyorsítja a bomlást.'},
{title:['Kriogén reaktor','Kryogener Reaktor','Cryogenic Reactor'],recipe:'CH4',targets:[['cryogenic_armor','Mészkőpáncél','Limestone Armor'],['cryogenic_acid','Savpajzs','Acid Shield'],['cryogenic_core','Kriogén mag','Cryogenic Core']],atoms:{C:1,H:4,O:4},fact:'CH₄ + 2 O₂ → CO₂ + 2 H₂O; égéshez oxigén és gyújtási energia kell.'}
];

const QUEST_LEVEL_FACTS={"de":["Wasser entzieht dem brennenden Holz Wärme und kann so die Flammen löschen.","Wasser darf nicht auf unter Spannung stehende Anlagen gesprüht werden; CO₂ ist ein nichtleitendes Löschmittel.","Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O: Reduktion erfordert geeignete Bedingungen, etwa hohe Temperatur.","HCl + NaOH → NaCl + H₂O. Der endgültige pH-Wert hängt von den Stoffmengen ab.","CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑; Carbonate schäumen bei Kontakt mit Säure.","In geeigneter Lösung kann Ammoniak mit Cu²⁺ einen tiefblauen [Cu(NH₃)₄]²⁺-Komplex bilden.","NaCl senkt den Gefrierpunkt, Ionen ermöglichen elektrische Leitfähigkeit, und Ag⁺ + Cl⁻ → AgCl↓.","Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O: Kalkwasserprobe.","2 H₂O₂ → 2 H₂O + O₂; ein Katalysator beschleunigt die Zersetzung.","CH₄ + 2 O₂ → CO₂ + 2 H₂O; Verbrennung benötigt Sauerstoff und Zündenergie."],"en":["Water removes heat and can help extinguish burning wood.","Spraying water on energized electrical equipment is hazardous; CO₂ is a nonconductive extinguishing agent.","Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O: reduction requires suitable conditions, such as high temperature.","HCl + NaOH → NaCl + H₂O. The final pH depends on the quantities of reactants.","CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑; carbonates fizz on contact with acid.","Ammonia can form a deep-blue [Cu(NH₃)₄]²⁺ complex with Cu²⁺ in a suitable solution.","NaCl lowers water's freezing point, dissolved ions conduct electricity, and Ag⁺ + Cl⁻ → AgCl↓.","Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O: the limewater test.","2 H₂O₂ → 2 H₂O + O₂; a catalyst speeds up decomposition.","CH₄ + 2 O₂ → CO₂ + 2 H₂O; combustion requires oxygen and ignition energy."]};
const QUEST_TARGET_NAMES={"hu":{"wood_fire":"Parázsló Fa-gólem","electric_fire":"Zárlatos szerverrobot","rust_knight":"Rozsda-lovag","acid_slime":"Sav-nyálka","limestone_wall":"Mészkőfal","copper_guard":"Réz(II)-őr","ice_shield":"Jégpajzs","electrolyte_bridge":"Elektrolit-híd","silver_sensor":"Ezüstion-szenzor","co2_ghost":"CO₂-fantom","spore_colony":"Spóratelep","cryogenic_armor":"Mészkőpáncél","cryogenic_acid":"Savpajzs","cryogenic_core":"Kriogén mag"},"de":{"wood_fire":"Glühender Holz-Golem","electric_fire":"Kurzschluss-Serverroboter","rust_knight":"Rostritter","acid_slime":"Säureschleim","limestone_wall":"Kalksteinwand","copper_guard":"Kupfer(II)-Wächter","ice_shield":"Eisschild","electrolyte_bridge":"Elektrolytbrücke","silver_sensor":"Silberionen-Sensor","co2_ghost":"CO₂-Phantom","spore_colony":"Sporenkolonie","cryogenic_armor":"Kalksteinpanzer","cryogenic_acid":"Säureschild","cryogenic_core":"Kryogener Kern"},"en":{"wood_fire":"Ember Wood Golem","electric_fire":"Short-Circuit Server Robot","rust_knight":"Rust Knight","acid_slime":"Acid Slime","limestone_wall":"Limestone Wall","copper_guard":"Copper(II) Guard","ice_shield":"Ice Shield","electrolyte_bridge":"Electrolyte Bridge","silver_sensor":"Silver Ion Sensor","co2_ghost":"CO₂ Phantom","spore_colony":"Spore Colony","cryogenic_armor":"Limestone Armor","cryogenic_acid":"Acid Shield","cryogenic_core":"Cryogenic Core"}};
const QUEST_OBSTACLE_NAMES={"hu":{"embers":"Parázs","steam":"Gőz","sparks":"Szikrák","rocks":"Sziklák","acid":"Sav","drip":"Maró cseppek","ice":"Jég","mist":"Köd","spores":"Spórák"},"de":{"embers":"Glut","steam":"Dampf","sparks":"Funken","rocks":"Felsen","acid":"Säure","drip":"Ätzende Tropfen","ice":"Eis","mist":"Nebel","spores":"Sporen"},"en":{"embers":"Embers","steam":"Steam","sparks":"Sparks","rocks":"Rocks","acid":"Acid","drip":"Corrosive drips","ice":"Ice","mist":"Mist","spores":"Spores"}};
const QUEST_ELEMENT_NAMES={"H":["hidrogén","Wasserstoff","hydrogen"],"O":["oxigén","Sauerstoff","oxygen"],"C":["szén","Kohlenstoff","carbon"],"N":["nitrogén","Stickstoff","nitrogen"],"Na":["nátrium","Natrium","sodium"],"Cl":["klór","Chlor","chlorine"],"Ca":["kalcium","Calcium","calcium"],"S":["kén","Schwefel","sulfur"],"Mg":["magnézium","Magnesium","magnesium"],"Cu":["réz","Kupfer","copper"],"Ag":["ezüst","Silber","silver"]};
function levelFact(){return langNow()==='hu'?L[level].fact:QUEST_LEVEL_FACTS[langNow()][level]}
function obstacleName(type){return QUEST_OBSTACLE_NAMES[langNow()][type]||type}
function targetName(type){return QUEST_TARGET_NAMES[langNow()][type]||type}
function atomName(symbol,language=langNow()){const index=language==='hu'?0:language==='de'?1:2;return QUEST_ELEMENT_NAMES[symbol]?.[index]||symbol}
// Ground hazards are level-specific, not merely decorative. Keep passages jumpable.
const OBSTACLE_SETS=[
 [['embers',620,405,65],['steam',1330,399,52]],
 [['sparks',610,402,70],['sparks',1300,402,60]],
 [['rocks',650,401,65],['steam',1470,401,55]],
 [['acid',620,408,74],['acid',1390,408,70]],
 [['rocks',620,401,65],['drip',1430,400,60]],
 [['acid',620,408,65],['steam',1390,401,70]],
 [['ice',620,411,100],['sparks',1370,401,58]],
 [['mist',630,401,66],['mist',1330,401,60]],
 [['spores',630,406,75],['spores',1360,406,75]],
 [['ice',610,411,115],['sparks',1370,401,65]]
];
function createObstacles(n){return OBSTACLE_SETS[n].map(([type,x,y,w])=>({type,x,y,w,h:425-y,phase:Math.random()*6.28}));}
// Visual presentation profiles: the chemistry result still comes from MATRIX.
const AMMO_FX={
 H2O:{color:'#61d7ff',trail:'#b9f2ff',r:6,gravity:185,style:'drops'},
 CO2:{color:'#e1eaf0',trail:'#a4bbc9',r:11,gravity:-16,style:'cloud'},
 H2:{color:'#d7faff',trail:'#efffff',r:5,gravity:-70,style:'bubbles'},
 NaOH:{color:'#a9f65a',trail:'#e6ffac',r:7,gravity:100,style:'droplets'},
 HCl:{color:'#e0f288',trail:'#f3ffc9',r:7,gravity:35,style:'mist'},
 NH3:{color:'#ad8cff',trail:'#e3dbff',r:9,gravity:-45,style:'mist'},
 NaCl:{color:'#ffffff',trail:'#d3ecff',r:5,gravity:210,style:'crystals'},
 CaOH2:{color:'#f0fcf7',trail:'#cedddd',r:8,gravity:110,style:'milky'},
 H2O2:{color:'#83d8fc',trail:'#d8fcff',r:7,gravity:70,style:'foam'},
 CH4:{color:'#ffb75f',trail:'#ffe59b',r:8,gravity:-80,style:'flame'},
 O2:{color:'#ff9a9a',trail:'#ffdddd',r:7,gravity:-60,style:'bubbles'}
};
const REACTIONS={
 wood_fire:{H2O:['A víz hőt von el; gőz képződik.','Water removes heat; steam forms.','Wasser entzieht Wärme; Dampf entsteht.'],CO2:['A CO₂ csökkenti az oxigén hozzáférhetőségét.','CO₂ displaces oxygen locally.','CO₂ verdrängt lokal Sauerstoff.']},
 electric_fire:{CO2:['A CO₂ nem vezető oltóközeg; a berendezés áramtalanítása továbbra is fontos.','CO₂ is nonconductive; disconnecting power remains essential.','CO₂ ist nichtleitend; Strom abschalten bleibt wichtig.'],H2O:['Az ionokat tartalmazó víz áramütésveszélyes.','Ion-containing water may create an electric-shock hazard.','Ionenhaltiges Wasser kann Stromschläge verursachen.']},
 rust_knight:{H2:['Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O (emelt hőmérséklet szükséges).','Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O (requires elevated temperature).','Fe₂O₃ + 3 H₂ → 2 Fe + 3 H₂O (erhöhte Temperatur nötig).']},
 acid_slime:{NaOH:['HCl + NaOH → NaCl + H₂O · semlegesítés.','HCl + NaOH → NaCl + H₂O · neutralization.','HCl + NaOH → NaCl + H₂O · Neutralisation.']},
 limestone_wall:{HCl:['CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑ · pezsgés.','CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑ · fizzing.','CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑ · Gasentwicklung.']},
 copper_guard:{NH3:['Cu²⁺ + 4 NH₃ ⇌ [Cu(NH₃)₄]²⁺ · mélykék komplex oldatban.','Cu²⁺ + 4 NH₃ ⇌ [Cu(NH₃)₄]²⁺ · deep-blue solution complex.','Cu²⁺ + 4 NH₃ ⇌ [Cu(NH₃)₄]²⁺ · tiefblauer Komplex in Lösung.']},
 ice_shield:{NaCl:['Oldódó NaCl csökkenti a víz fagyáspontját.','Dissolved NaCl lowers water’s freezing point.','Gelöstes NaCl senkt den Gefrierpunkt.']},
 electrolyte_bridge:{NaCl:['Na⁺ és Cl⁻ ionok növelik az oldat vezetőképességét.','Na⁺ and Cl⁻ ions increase solution conductivity.','Na⁺- und Cl⁻-Ionen erhöhen die Leitfähigkeit.']},
 silver_sensor:{NaCl:['Ag⁺ + Cl⁻ → AgCl↓ · fehér csapadék.','Ag⁺ + Cl⁻ → AgCl↓ · white precipitate.','Ag⁺ + Cl⁻ → AgCl↓ · weißer Niederschlag.']},
 co2_ghost:{CaOH2:['Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O · fehér zavarosodás.','Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O · white cloudiness.','Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O · weiße Trübung.']},
 spore_colony:{H2O2:['2 H₂O₂ → 2 H₂O + O₂↑ · katalizált bomlás és oxigénbuborékok.','2 H₂O₂ → 2 H₂O + O₂↑ · catalyzed breakdown and oxygen bubbles.','2 H₂O₂ → 2 H₂O + O₂↑ · katalysierter Zerfall und Blasen.']},
 cryogenic_core:{CH4:['CH₄ + 2 O₂ → CO₂ + 2 H₂O + hő · gyújtás szükséges.','CH₄ + 2 O₂ → CO₂ + 2 H₂O + heat · ignition required.','CH₄ + 2 O₂ → CO₂ + 2 H₂O + Wärme · Zündung nötig.']}
};
function reactionNote(type,ammo){return (REACTIONS[type]?.[ammo]||[])[langNow()==='hu'?0:langNow()==='en'?1:2]||'';}
function burst(x,y,ammo,count=22){const fx=AMMO_FX[ammo]||AMMO_FX.H2O;for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,sp=35+Math.random()*155;particles.push({x,y,vx:Math.cos(angle)*sp,vy:Math.sin(angle)*sp-50,life:.45+Math.random()*.65,maxLife:1.1,color:i%3?fx.color:fx.trail,r:2+Math.random()*4})}}
const MATRIX={
wood_fire:{H2O:{effect:'defeat'},CO2:{effect:'defeat'},H2:{effect:'harm'},CH4:{effect:'harm'}},
electric_fire:{CO2:{effect:'defeat'},H2O:{effect:'harm'}},
rust_knight:{H2:{effect:'defeat',grant:{H2O:1}},HCl:{effect:'defeat'}},
acid_slime:{NaOH:{effect:'defeat',grant:{NaCl:1}},CaOH2:{effect:'defeat'},NH3:{effect:'defeat'},HCl:{effect:'buff'}},
limestone_wall:{HCl:{effect:'defeat',grant:{CO2:1}}},copper_guard:{NH3:{effect:'defeat'}},
ice_shield:{NaCl:{effect:'defeat'},H2O:{effect:'buff'}},electrolyte_bridge:{NaCl:{effect:'defeat'}},silver_sensor:{NaCl:{effect:'defeat'}},
co2_ghost:{CaOH2:{effect:'defeat'}},spore_colony:{H2O2:{effect:'defeat'},H2O:{effect:'buff'}},
cryogenic_armor:{HCl:{effect:'defeat'}},cryogenic_acid:{NaOH:{effect:'defeat'}},cryogenic_core:{CH4:{effect:'defeat',requires:{O2:2}},CO2:{effect:'buff'},H2O:{effect:'buff'}}
};
const atomMeta={H:[1,1,1,'Nemfém','Nonmetal','Nichtmetall'],O:[8,2,6,'Nemfém','Nonmetal','Nichtmetall'],C:[6,2,4,'Nemfém','Nonmetal','Nichtmetall'],N:[7,2,5,'Nemfém','Nonmetal','Nichtmetall'],Na:[11,3,1,'Alkálifém','Alkali metal','Alkalimetall'],Cl:[17,3,7,'Halogén','Halogen','Halogen'],Ca:[20,4,2,'Alkáliföldfém','Alkaline earth metal','Erdalkalimetall'],S:[16,3,6,'Nemfém','Nonmetal','Nichtmetall'],Mg:[12,3,2,'Alkáliföldfém','Alkaline earth metal','Erdalkalimetall'],Cu:[29,4,1,'Átmenetifém','Transition metal','Übergangsmetall'],Ag:[47,5,1,'Átmenetifém','Transition metal','Übergangsmetall']};
const usedQuestions=new Map();let level=0,player,atoms,targets,inventory,arsenal,selected='H2O',keys={},camera=0,elapsed=0,damageCooldown=0,shootCooldown=0,jumpBuffer=0,coyote=0,face=1,shots=[],modal='',pendingAtom=null,questionAnswer=null,completed=false,notification='',paused=false,transition=0,frames=0,specialPlatforms=[],springPads=[],particles=[],levelObstacles=[];
const questionEl=document.createElement('div');questionEl.id='questAtomicQuiz';questionEl.className='quest-quiz';questionEl.hidden=true;cv.insertAdjacentElement('beforebegin',questionEl);
const craftEl=document.createElement('div');craftEl.id='questCraftMenu';craftEl.className='quest-quiz';craftEl.hidden=true;cv.insertAdjacentElement('beforebegin',craftEl);
const arsenalEl=$('questArsenal'); // Stable HUD container in index.html; never create duplicates.

const next=document.createElement('button');next.id='questNext';next.textContent=tr('next');next.hidden=true;cv.insertAdjacentElement('afterend',next);next.onclick=()=>{if(level<9)loadLevel(level+1)};
const fireButton=document.createElement('button');fireButton.id='questFire';fireButton.textContent='E · 🧯';fireButton.type='button';$('questCraft').insertAdjacentElement('afterend',fireButton);fireButton.onclick=fire;
function say(s){notification=s;$('questMessage').textContent=s}
function nameFor(arr){return arr[langNow()==='hu'?0:langNow()==='de'?1:2]}
function createAtoms(){const entries=[];let i=0;for(const [sym,n] of Object.entries(L[level].atoms)){for(let j=0;j<n;j++){const group=Math.floor(i/3),off=i%3;entries.push({s:sym,x:150+i*Math.min(145,1450/Math.max(1,Object.values(L[level].atoms).reduce((a,b)=>a+b,0)-1)),y:310-(off===1?55:off===2?20:0),taken:false,respawnAt:0});i++}}return entries}
function freshArsenal(){return Object.fromEntries(RECIPES.map(r=>[r.id,0]))}
function loadLevel(n){level=n;player={x:48,y:373,w:25,h:36,vx:0,vy:0,ground:false,hp:3};atoms=createAtoms();if(n>0){const all=new Set();for(const recipe of RECIPES.slice(0,n+1)){for(const sym of Object.keys(recipe.atoms))all.add(sym)}for(const sym of all){if(!atoms.some(a=>a.s===sym))atoms.push({s:sym,x:220+atoms.length*64%1250,y:300,taken:false,respawnAt:0})}}minions=makeMinions(n);enemyShots=[];targets=L[level].targets.map(([type,hu,en],i)=>({type,name:[hu,QUEST_TARGET_NAMES.de[type]||hu,en],x:level===6?1560+i*180:level===9?1850:1780+i*190,y:388,w:40,h:37,alive:true,dir:1,phase:i}));inventory=Object.fromEntries(Object.keys(atomMeta).map(s=>[s,0]));if(!arsenal)arsenal=freshArsenal();if(level===1)arsenal.H2O=Math.max(1,arsenal.H2O);if(level===9){arsenal.HCl=Math.max(1,arsenal.HCl);arsenal.NaOH=Math.max(1,arsenal.NaOH)}selected=R[L[level].recipe].id;keys={};camera=0;elapsed=0;damageCooldown=0;shootCooldown=0;jumpBuffer=0;coyote=0;face=1;shots=[];specialPlatforms=[];springPads=[];particles=[];levelObstacles=createObstacles(n);modal='';pendingAtom=null;activeQuestQuestion=null;pendingReaction=null;pendingCraftReaction=null;rxnPane.hidden=true;completed=false;transition=0;questionEl.hidden=true;craftEl.hidden=true;next.hidden=true;cv.focus({preventScroll:true});say(stageCode(level)+' · '+tr('mission')+' '+nameFor(L[level].title)+' · '+levelFact());hud()}
function clearModal(){modal='';activeQuestQuestion=null;pendingReaction=null;pendingCraftReaction=null;rxnPane.hidden=true;questionEl.hidden=true;craftEl.hidden=true;cv.focus({preventScroll:true})}
function questionPool(symbol){const z=atomMeta[symbol],n={hu:atomName(symbol,'hu'),de:atomName(symbol,'de'),en:atomName(symbol,'en')};
 const period=x=>String(x),category={hu:z[3],en:z[4],de:z[5]};
 const fam={hu:['Nemfém','Alkálifém','Alkáliföldfém','Halogén','Átmenetifém'],de:['Nichtmetall','Alkalimetall','Erdalkalimetall','Halogen','Übergangsmetall'],en:['Nonmetal','Alkali metal','Alkaline earth metal','Halogen','Transition metal']};
 const wrongFamilies=Object.fromEntries(['hu','de','en'].map(language=>[language,fam[language].filter(v=>v!==category[language]).slice(0,2)]));
 const alternateNames=(language)=>Object.entries(QUEST_ELEMENT_NAMES).filter(([key])=>key!==symbol).slice(0,2).map(([,v])=>v[language==='hu'?0:language==='de'?1:2]);
 return [
 {q:{hu:`Mennyi a(z) ${n.hu} rendszáma?`,de:`Welche Ordnungszahl hat ${n.de}?`,en:`What is the atomic number of ${n.en}?`},a:String(z[0]),bad:[String(z[0]+1),String(z[0]+2)]},
 {q:{hu:`Hány protonja van a(z) ${n.hu} atomnak?`,de:`Wie viele Protonen hat ${n.de}?`,en:`How many protons does ${n.en} have?`},a:String(z[0]),bad:[String(z[0]+1),String(z[0]+3)]},
 {q:{hu:`Melyik periódusban található a(z) ${n.hu}?`,de:`In welcher Periode steht ${n.de}?`,en:`Which period contains ${n.en}?`},a:period(z[1]),bad:[period((z[1]%7)+1),period(((z[1]+1)%7)+1)]},
 {q:{hu:`Hány elektronja van a semleges ${symbol}-atomnak?`,de:`Wie viele Elektronen hat ein neutrales ${symbol}-Atom?`,en:`How many electrons does a neutral ${symbol} atom have?`},a:String(z[0]),bad:[String(z[0]+1),String(Math.max(0,z[0]-1))]},
 {q:{hu:`Melyik elemcsaládba tartozik a(z) ${n.hu}?`,de:`Zu welcher Elementgruppe gehört ${n.de}?`,en:`Which element family does ${n.en} belong to?`},a:category,bad:[Object.fromEntries(['hu','de','en'].map(l=>[l,wrongFamilies[l][0]])),Object.fromEntries(['hu','de','en'].map(l=>[l,wrongFamilies[l][1]]))]},
 {q:{hu:`Mi a(z) ${n.hu} vegyjele?`,de:`Was ist das chemische Symbol für ${n.de}?`,en:`What is the chemical symbol for ${n.en}?`},a:symbol,bad:Object.keys(QUEST_ELEMENT_NAMES).filter(key=>key!==symbol).slice(0,2)},
 {q:{hu:`Melyik elem neve tartozik a(z) ${symbol} vegyjelhez?`,de:`Welches Element hat das Symbol ${symbol}?`,en:`Which element has the symbol ${symbol}?`},a:n,bad:[0,1].map(i=>Object.fromEntries(['hu','de','en'].map(l=>[l,alternateNames(l)[i]])))}
 ]}
const questionAnswerText=value=>typeof value==='string'?value:value?.[langNow()]||'';
let activeQuestQuestion=null;
function renderQuestQuestion(){
 if(!activeQuestQuestion)return;
 const {atom,q,options}=activeQuestQuestion;
 questionEl.replaceChildren();
 const title=document.createElement('strong');title.textContent=atom.s+' · '+q.q[langNow()];questionEl.append(title);
 const row=document.createElement('div');row.className='quest-options';
 for(const option of options){const b=document.createElement('button');b.textContent=questionAnswerText(option.value);b.disabled=!!option.disabled;
 b.onclick=()=>{if(!option.correct){option.disabled=true;b.disabled=true;say(tr('wrong'));return}
 atom.taken=true;atom.respawnAt=elapsed+5;inventory[atom.s]=(inventory[atom.s]||0)+1;pendingAtom=null;activeQuestQuestion=null;clearModal();say(tr('collected')+': '+atom.s);hud()};row.append(b)}
 questionEl.append(row);
}
function showQuestion(atom){
 if(modal)return;
 pendingAtom=atom;modal='question';questionEl.hidden=false;
 const pool=questionPool(atom.s),used=usedQuestions.get(atom.s)||new Set();if(used.size>=pool.length)used.clear();
 const avail=pool.map((_,i)=>i).filter(i=>!used.has(i)),index=avail[Math.floor(Math.random()*avail.length)];used.add(index);usedQuestions.set(atom.s,used);
 const q=pool[index],options=[q.a,...q.bad].map((value,i)=>({value,correct:i===0,disabled:false}));
 for(let i=options.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[options[i],options[j]]=[options[j],options[i]]}
 activeQuestQuestion={atom,q,options};renderQuestQuestion();say(tr('question'));
}
function validRecipe(r){if(r.kind==='ionic')return true;const nodes=[],edges=[];let i=0;const put=s=>{const id='n'+i++;nodes.push({id,s});return id};if(r.id==='H2O'){const o=put('O');for(let j=0;j<2;j++)edges.push({a:o,b:put('H'),order:1,kind:'covalent'})}else if(r.id==='CO2'){const c=put('C');for(let j=0;j<2;j++)edges.push({a:c,b:put('O'),order:2,kind:'covalent'})}else if(r.id==='NH3'||r.id==='CH4'){const center=put(r.id==='NH3'?'N':'C');for(let j=0;j<(r.id==='NH3'?3:4);j++)edges.push({a:center,b:put('H'),order:1,kind:'covalent'})}else if(r.id==='H2O2'){const o1=put('O'),o2=put('O');edges.push({a:o1,b:o2,order:1,kind:'covalent'},{a:o1,b:put('H'),order:1,kind:'covalent'},{a:o2,b:put('H'),order:1,kind:'covalent'})}else if(r.id==='HCl'){edges.push({a:put('H'),b:put('Cl'),order:1,kind:'covalent'})}else if(r.id==='H2'||r.id==='O2'){edges.push({a:put(r.id==='H2'?'H':'O'),b:put(r.id==='H2'?'H':'O'),order:r.id==='H2'?1:2,kind:'covalent'})}else return false;
try{const result=window.ChemistryEngine?.analyze(nodes,edges);return !result?.issues?.length}catch{return false}}

function builderNodes(recipe){const nodes=[];for(const [symbol,count] of Object.entries(recipe.atoms))for(let i=0;i<count;i++)nodes.push({symbol,id:symbol+'-'+(i+1)});return nodes}
function referenceBonds(recipe,nodes){
 const ids=s=>nodes.map((n,i)=>n.symbol===s?i:-1).filter(i=>i>=0);
 if(recipe.id==='H2O')return ids('H').map(i=>({a:ids('O')[0],b:i,order:1}));
 if(recipe.id==='CO2')return ids('O').map(i=>({a:ids('C')[0],b:i,order:2}));
 if(recipe.id==='H2')return [{a:ids('H')[0],b:ids('H')[1],order:1}];
 if(recipe.id==='O2')return [{a:ids('O')[0],b:ids('O')[1],order:2}];
 if(recipe.id==='HCl')return [{a:ids('H')[0],b:ids('Cl')[0],order:1}];
 if(recipe.id==='NH3'||recipe.id==='CH4'){const center=recipe.id==='NH3'?'N':'C';return ids('H').map(i=>({a:ids(center)[0],b:i,order:1}))}
 if(recipe.id==='H2O2'){const [o1,o2]=ids('O'),[h1,h2]=ids('H');return [{a:o1,b:o2,order:1},{a:o1,b:h1,order:1},{a:o2,b:h2,order:1}]}
 return null;
}
function graphMatches(recipe,bonds){
 if(!recipe||recipe.kind!=='molecule'||!Array.isArray(bonds))return false;
 const nodes=builderNodes(recipe),expected=referenceBonds(recipe,nodes);
 if(!expected||bonds.length!==expected.length)return false;
 const encode=(a,b)=>[Math.min(a,b),Math.max(a,b)].join('-');
 const actual=new Map();
 for(const b of bonds){if(!Number.isInteger(b.a)||!Number.isInteger(b.b)||b.a<0||b.b<0||b.a>=nodes.length||b.b>=nodes.length||b.a===b.b||![1,2,3].includes(b.order))return false;const key=encode(b.a,b.b);if(actual.has(key))return false;actual.set(key,b.order)}
 const groups=Object.values(Object.groupBy?Object.groupBy(nodes.map((n,i)=>({s:n.symbol,i})),n=>n.s):nodes.reduce((o,n,i)=>((o[n.symbol]??=[]).push({i}),o),{})).map(xs=>xs.map(x=>x.i));
 const permute=xs=>xs.length<2?[xs]:xs.flatMap((x,i)=>permute(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest]));
 function tryMapping(k,mapping){if(k===groups.length){const seen=new Map();for(const b of expected)seen.set(encode(mapping[b.a],mapping[b.b]),b.order);return seen.size===actual.size&&[...seen].every(([key,val])=>actual.get(key)===val)}
 for(const candidate of permute(groups[k])){const next=mapping.slice();groups[k].forEach((original,i)=>next[original]=candidate[i]);if(tryMapping(k+1,next))return true}return false}
 return tryMapping(0,Array(nodes.length).fill(-1))
}
let builderState=null;
function showBondWorkbench(recipe,root){
 builderState={recipe:recipe.id,nodes:builderNodes(recipe),bonds:[],selected:null};
 const title=document.createElement('p');title.textContent=tr('buildTitle');root.append(title);
 const atomRow=document.createElement('div');atomRow.className='quest-builder-atoms';root.append(atomRow);
 const label=document.createElement('label');label.textContent=tr('bondOrder')+' ';
 const order=document.createElement('select');order.id='questBondOrder';for(const [n,text] of [[1,'single'],[2,'double'],[3,'triple']]){const option=document.createElement('option');option.value=String(n);option.textContent=tr(text);order.append(option)}label.append(order);root.append(label);
 const bonds=document.createElement('div');bonds.className='quest-builder-bonds';root.append(bonds);
 const feedback=document.createElement('div');feedback.className='quest-builder-feedback';feedback.setAttribute('role','status');root.append(feedback);
 function redraw(){atomRow.replaceChildren();builderState.nodes.forEach((a,i)=>{const b=document.createElement('button');b.type='button';b.className='quest-builder-atom'+(builderState.selected===i?' selected':'');b.textContent=a.symbol+' '+(i+1);b.onclick=()=>{if(builderState.selected===null){builderState.selected=i;redraw();return}
 const old=builderState.selected;builderState.selected=null;if(old===i){feedback.textContent=tr('buildSelect');redraw();return}
 const x=Math.min(i,old),y=Math.max(i,old);builderState.bonds=builderState.bonds.filter(b=>b.a!==x||b.b!==y);builderState.bonds.push({a:x,b:y,order:Number(order.value)});feedback.textContent='';redraw()};atomRow.append(b)});
 bonds.textContent=builderState.bonds.map(b=>builderState.nodes[b.a].id+' '+['','—','=','≡'][b.order]+' '+builderState.nodes[b.b].id).join(' · ')||'—'}
 redraw();const clear=document.createElement('button');clear.type='button';clear.textContent=tr('clearBonds');clear.onclick=()=>{builderState.bonds=[];builderState.selected=null;feedback.textContent='';redraw()};root.append(clear);
 return ()=>{const ok=graphMatches(recipe,builderState.bonds);feedback.textContent=tr(ok?'buildOk':'buildError');return ok}
}

function craft(recipeId,structureApproved=false){if(modal==='question'||completed)return false;const r=R[recipeId];if(!r||(RECIPES.indexOf(r)>level&&recipeId!=='O2')){say(tr('locked'));return false}if(Object.entries(r.atoms).some(([k,v])=>(inventory[k]||0)<v)){say(tr('insufficient')+' '+Object.entries(r.atoms).map(([k,v])=>k+': '+Math.max(0,v-(inventory[k]||0))).join(', '));return false}if(!validRecipe(r)){say(tr('chemfail'));return false}if(level>=2&&r.kind==='molecule'&&!structureApproved){say(tr('buildError'));return false}for(const [k,v] of Object.entries(r.atoms))inventory[k]-=v;arsenal[recipeId]++;selected=recipeId;clearModal();say(tr('made')+': '+r.f);hud();return true}
function showCraft(){if(modal==='question'||completed)return;modal='craft';craftEl.hidden=false;craftEl.replaceChildren();const h=document.createElement('strong');h.textContent=tr('select');craftEl.append(h);const sel=document.createElement('select');sel.id='questRecipeSelect';sel.style.cssText='display:block;width:100%;margin:10px 0;padding:9px;background:#173049;color:#fff';for(let i=0;i<RECIPES.length;i++){const r=RECIPES[i],o=document.createElement('option');o.value=r.id;o.disabled=i>level&&r.id!=='O2';o.textContent=r.f+' · '+Object.entries(r.atoms).map(([s,n])=>n+'×'+s).join(' + ')+(o.disabled?' 🔒':'');sel.append(o)}sel.value=L[level].recipe;craftEl.append(sel);const buttons=document.createElement('div');buttons.className='quest-options';const workbench=document.createElement('div');workbench.className='quest-builder';craftEl.append(workbench);let validate=null;function switchRecipe(){workbench.replaceChildren();builderState=null;const r=R[sel.value];if(level>=2&&r.kind==='molecule')validate=showBondWorkbench(r,workbench);else{validate=null;if(r.kind==='ionic'){const msg=document.createElement('p');msg.textContent=tr('ionicNote')+' '+(r.note||'');workbench.append(msg)}}}sel.onchange=switchRecipe;switchRecipe();const go=document.createElement('button');go.textContent=tr('make');go.onclick=()=>{if(validate&&!validate())return;if(level>=3){startCraftReaction(sel.value);return}craft(sel.value,true)};const close=document.createElement('button');close.textContent=tr('cancel');close.onclick=clearModal;buttons.append(go,close);craftEl.append(buttons)}
function cycleWeapon(delta=1){const a=RECIPES.filter((r,i)=>i<=level||r.id==='O2').map(r=>r.id);selectWeapon(a[(a.indexOf(selected)+delta+a.length)%a.length])}
function selectWeapon(id){
 const index=RECIPES.findIndex(r=>r.id===id);
 if(index<0 || (index>level && id!=='O2'))return false;
 selected=id;hud();return true;
}
function renderArsenalHUD(){
 arsenalEl.setAttribute('aria-label',tr('weapons'));
 arsenalEl.replaceChildren();
 const unlocked=RECIPES.filter((r,i)=>i<=level||r.id==='O2');
 for(const r of unlocked){
  const index=RECIPES.indexOf(r),count=arsenal[r.id]||0;
  const slot=document.createElement('button');
  slot.type='button';slot.className='quest-weapon-slot'+(selected===r.id?' active':'')+(count===0?' empty':'');
  slot.setAttribute('aria-pressed',String(selected===r.id));
  slot.setAttribute('aria-label',`${tr('selectWeapon')}: ${r.f}, ${count} ${tr('charges')}`);
  slot.title=`${r.f} · ${count} ${tr('charges')}`;
  const shortcut=document.createElement('span');shortcut.className='slot-shortcut';shortcut.textContent=index<10?String(index===9?0:index+1):'·';
  const formula=document.createElement('span');formula.className='slot-formula';formula.textContent=r.f;
  const number=document.createElement('span');number.className='slot-count';number.textContent=`×${count}`;
  slot.append(shortcut,formula,number);
  slot.onclick=()=>selectWeapon(r.id);
  arsenalEl.append(slot);
 }
}
function hud(){
 $('questHealth').textContent='♥ '+tr('health')+': '+player.hp+'/3';
 $('questInventory').textContent=tr('atoms')+': '+Object.entries(inventory).filter(([,n])=>n>0).map(([s,n])=>s+'×'+n).join('  ')+'  | '+tr('active')+': '+R[selected].f+' ('+arsenal[selected]+')';
 $('questGoal').textContent=stageCode(level)+' · '+nameFor(L[level].title)+' · '+(targets.filter(t=>t.alive).length+minions.filter(t=>t.alive).length)+' '+tr('targets');
 $('questRecipe').textContent=levelFact()+' · '+tr('science');
 renderArsenalHUD();
}
function hurt(){if(damageCooldown>0)return;damageCooldown=1.5;player.hp--;say(tr('hit'));player.vy=-260;player.x=Math.max(0,player.x-65);if(player.hp<=0){player.hp=3;player.x=50;player.y=365;player.vy=0}hud()}
function fire(){if(modal||completed)return;if((arsenal[selected]||0)<1){say(tr('noammo'));return}if(shootCooldown>0)return;shootCooldown=.35;arsenal[selected]--;if(level===2&&selected==='H2'&&!player.ground){player.vy=-625;say(tr('hydrogenBoost'));hud();return}shots.push({x:player.x+(face>0?31:-4),y:player.y+17,vx:face*(selected==='NaCl'?520:selected==='CO2'?470:670),vy:selected==='NaCl'?-95:0,r:AMMO_FX[selected].r,life:2.3,ammo:selected});hud()}


let pendingCraftReaction=null;
function startCraftReaction(recipeId){
 const engine=window.ReactionEngine;
 const id=engine?.craftReactions?.[recipeId],model=engine?.model(id);
 if(!model){say(tr('chemfail'));return false}
 const recipe=R[recipeId];
 if(!recipe||Object.entries(recipe.atoms).some(([key,amount])=>(inventory[key]||0)<amount)){say(tr('insufficient'));return false}
 pendingCraftReaction={recipeId,id,selection:{reactants:0,products:0,values:model.parts.map(()=>1)}};
 modal='craft-reaction';craftEl.hidden=true;renderCraftReaction();return true
}
function renderCraftReaction(){
 if(!pendingCraftReaction)return;
 const {recipeId,id,selection}=pendingCraftReaction,engine=window.ReactionEngine,model=engine.model(id);
 rxnPane.hidden=false;rxnPane.replaceChildren();
 const title=document.createElement('strong');title.textContent=tr('craftEquation')+' · '+R[recipeId].f;rxnPane.append(title);
 const note=document.createElement('p');note.textContent=tr('process')+' ('+(engine.catalog[id].condition||'reaction')+')';rxnPane.append(note);
 for(const side of ['reactants','products']){
  const label=document.createElement('label');label.textContent=rxnT(side==='reactants'?'react':'prod');
  const select=document.createElement('select');select.className='quest-rxn-side';
  engine.sideOptions(id,side).forEach((option,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=option.label;select.append(o)});
  select.value=String(selection[side]);select.onchange=()=>selection[side]=Number(select.value);
  label.append(select);rxnPane.append(label);
 }
 const label=document.createElement('p');label.textContent=rxnT('coeff');rxnPane.append(label);
 const row=document.createElement('div');row.className='quest-rxn-coeffs';
 model.parts.forEach((part,i)=>{const x=document.createElement('label');x.textContent=part;const input=document.createElement('input');input.type='number';input.min='1';input.max='99';input.value=String(selection.values[i]);input.oninput=()=>selection.values[i]=Number(input.value);x.append(input);row.append(x)});
 rxnPane.append(row);
 const feedback=document.createElement('p');feedback.className='quest-reaction-feedback';feedback.setAttribute('role','status');rxnPane.append(feedback);
 const buttons=document.createElement('div');buttons.className='quest-options';
 const confirm=document.createElement('button');confirm.type='button';confirm.textContent=rxnT('check');confirm.onclick=()=>{
  const left=engine.sideOptions(id,'reactants')[selection.reactants]?.keys,right=engine.sideOptions(id,'products')[selection.products]?.keys;
  const outcome=engine.check(id,selection.values,left,right);
  if(!outcome.ok){feedback.textContent=rxnT(outcome.reason==='wrong-reaction'?'wrong':'balance');return}
  pendingCraftReaction=null;rxnPane.hidden=true;rxnPane.replaceChildren();modal='craft';
  craft(recipeId,true);
 };
 const back=document.createElement('button');back.type='button';back.textContent=rxnT('cancel');back.onclick=()=>{pendingCraftReaction=null;rxnPane.hidden=true;rxnPane.replaceChildren();modal='';showCraft()};
 buttons.append(confirm,back);rxnPane.append(buttons);
}


const MINION_TYPES=['limestone_wall','copper_guard','silver_sensor','co2_ghost','spore_colony','acid_slime'];
let minions=[];
function makeMinions(n){
 if(n<4)return [];
 const type=MINION_TYPES[Math.min(n-4,MINION_TYPES.length-1)];
 return [810,1235].map((x,i)=>({type,x,y:389,w:29,h:34,alive:true,minion:true,dir:i?-1:1,origin:x,phase:i,attack:2+i,range:55}));
}
function advanceMinions(dt){
 for(const m of minions){
  if(!m.alive)continue;
  m.x+=m.dir*(80+level*3)*dt;
  if(Math.abs(m.x-m.origin)>m.range)m.dir*=-1;
  if(overlap(m,player)){hurt();continue}
  m.attack-=dt;
  if(m.attack<=0&&Math.abs(m.x-player.x)<255){
   m.attack=2.2+Math.random()*1.4;
   if(Math.abs(m.y-player.y)<55){
    enemyShots.push({x:m.x+m.w/2,y:m.y+12,vx:Math.sign(player.x-m.x)*180,life:1.6,kind:m.type});
   }
  }
 }
}
let enemyShots=[];
function advanceEnemyShots(dt){
 for(const shot of enemyShots){shot.x+=shot.vx*dt;shot.life-=dt;if(shot.life>0&&overlap({x:shot.x,y:shot.y,w:9,h:9},player)){hurt();shot.life=0}}
 enemyShots=enemyShots.filter(x=>x.life>0);
}
const QUEST_CHEM_RXN={acid_slime:'neutral',limestone_wall:'limestone',copper_guard:'complex',silver_sensor:'silver',co2_ghost:'limewater',spore_colony:'peroxide',cryogenic_armor:'limestone',cryogenic_acid:'neutral',cryogenic_core:'methane'};
const QUEST_RXN_TEXT={
 hu:{title:'Reakcióegyenlet-labor',react:'Kiindulási anyagok',prod:'Termékek',coeff:'Együtthatók',check:'Egyenlet ellenőrzése',cancel:'Vissza',ok:'Helyes reakció és rendezett egyenlet!',wrong:'A kiválasztott reagensek vagy termékek nem felelnek meg a reakciónak.',balance:'Az atomok (és ionoknál a töltés) száma nem egyezik.',notice:'Állítsd össze a kémiai reakciót az ellenfél semlegesítéséhez.',condition:'A reakcióhoz megfelelő körülmények is szükségesek.'},
 de:{title:'Reaktionsgleichungs-Labor',react:'Edukte',prod:'Produkte',coeff:'Koeffizienten',check:'Gleichung prüfen',cancel:'Zurück',ok:'Richtige Reaktion und ausgeglichene Gleichung!',wrong:'Ausgewählte Edukte oder Produkte passen nicht zur Reaktion.',balance:'Atombilanz (und Ionenladung) stimmt nicht.',notice:'Stelle die Reaktion zusammen, um den Gegner zu neutralisieren.',condition:'Die Reaktion benötigt geeignete Bedingungen.'},
 en:{title:'Reaction Equation Workbench',react:'Reactants',prod:'Products',coeff:'Coefficients',check:'Check equation',cancel:'Back',ok:'Correct reaction and balanced equation!',wrong:'The selected reactants or products do not match this reaction.',balance:'Atoms (or ionic charges) are not balanced.',notice:'Build the chemical equation to neutralize the enemy.',condition:'This reaction also requires appropriate conditions.'}
};
const rxnT=key=>QUEST_RXN_TEXT[langNow()][key];
const rxnPane=document.createElement('div');rxnPane.className='quest-quiz quest-reaction-pane';rxnPane.id='questReactionWorkbench';rxnPane.hidden=true;cv.insertAdjacentElement('beforebegin',rxnPane);
let pendingReaction=null;
function reactionChallenge(target,ammo){
 const id=QUEST_CHEM_RXN[target.type],engine=window.ReactionEngine,model=engine?.model(id);
 if(!model)return false;
 const selection={reactants:0,products:0,values:model.solution.map(()=>1)};
 pendingReaction={target,ammo,id,selection};modal='reaction';renderReactionChallenge();return true;
}
function renderReactionChallenge(){
 if(!pendingReaction)return;const {target,ammo,id,selection}=pendingReaction;
 const engine=window.ReactionEngine,model=engine.model(id);rxnPane.hidden=false;rxnPane.replaceChildren();
 const head=document.createElement('strong');head.textContent=rxnT('title')+' · '+targetName(target.type);rxnPane.append(head);
 const intro=document.createElement('p');intro.textContent=rxnT('notice');rxnPane.append(intro);
 const feedback=document.createElement('p');feedback.className='quest-reaction-feedback';feedback.setAttribute('role','status');
 const selects=[];
 for(const side of ['reactants','products']){
  const label=document.createElement('label');label.textContent=rxnT(side==='reactants'?'react':'prod')+' ';
  const select=document.createElement('select');select.className='quest-rxn-side';
  const options=engine.sideOptions(id,side);options.forEach((option,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=option.label;select.append(o)});
  select.value=String(selection[side]);select.onchange=()=>selection[side]=Number(select.value);selects.push(select);label.append(select);rxnPane.append(label);
 }
 const coeffLabel=document.createElement('p');coeffLabel.textContent=rxnT('coeff');rxnPane.append(coeffLabel);
 const coeffRow=document.createElement('div');coeffRow.className='quest-rxn-coeffs';
 model.parts.forEach((part,i)=>{const label=document.createElement('label');label.textContent=part;const input=document.createElement('input');input.type='number';input.min='1';input.max='99';input.step='1';input.value=String(selection.values[i]);input.setAttribute('aria-label',part);input.oninput=()=>selection.values[i]=Number(input.value);label.append(input);coeffRow.append(label)});
 rxnPane.append(coeffRow);
 const buttons=document.createElement('div');buttons.className='quest-options';
 const verify=document.createElement('button');verify.type='button';verify.textContent=rxnT('check');
 verify.onclick=()=>{
  const reactants=engine.sideOptions(id,'reactants')[selection.reactants]?.keys;
  const products=engine.sideOptions(id,'products')[selection.products]?.keys;
  const result=engine.check(id,selection.values,reactants,products);
  if(result.ok){
   pendingReaction=null;modal='';rxnPane.hidden=true;rxnPane.replaceChildren();
   resolveTarget(target,ammo,true);say(rxnT('ok')+' · '+reactionNote(target.type,ammo));return;
  }
  feedback.textContent=rxnT(result.reason==='wrong-reaction'?'wrong':'balance');
 };
 const back=document.createElement('button');back.type='button';back.textContent=rxnT('cancel');back.onclick=()=>{pendingReaction=null;modal='';rxnPane.hidden=true;rxnPane.replaceChildren();hud()};
 buttons.append(verify,back);rxnPane.append(feedback,buttons);
}

function resolveTarget(target,ammo,validated=false){const rule=MATRIX[target.type]?.[ammo];if(!rule){say(tr('incorrect')+' '+R[ammo].f+' → '+targetName(target.type));return}if(rule.effect==='harm'){burst(target.x,target.y,ammo);hurt();say(reactionNote(target.type,ammo)||tr('hazard')+' '+targetName(target.type));return}if(rule.effect==='buff'){target.w=Math.min(70,target.w+8);burst(target.x,target.y,ammo,12);say(tr('hazard')+' '+targetName(target.type));return}if(rule.requires){for(const [k,n] of Object.entries(rule.requires))if((arsenal[k]||0)<n){say(tr('oxygenRequired'));return}for(const [k,n] of Object.entries(rule.requires))arsenal[k]-=n}if(rule.effect==='defeat'){if(level>=3&&!validated&&reactionChallenge(target,ammo))return;burst(target.x+target.w/2,target.y+target.h/2,ammo,38);target.alive=false;if(target.type==='co2_ghost')specialPlatforms.push({x:target.x,y:target.y,w:105,h:18});if(target.type==='spore_colony')springPads.push({x:target.x,y:target.y+18,w:75,h:12});for(const [k,n] of Object.entries(rule.grant||{}))arsenal[k]=(arsenal[k]||0)+n;say((reactionNote(target.type,ammo)||tr('effect'))+' · '+target.type);hud()}}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
const grounds=[{x:0,y:425,w:360,h:55},{x:400,y:425,w:370,h:55},{x:810,y:425,w:400,h:55},{x:1240,y:425,w:400,h:55},{x:1680,y:425,w:560,h:55}];const ledges=[[160,338,140],[420,325,140],[680,293,150],[950,348,140],[1200,318,155],[1450,298,130],[1690,339,145],[1880,306,145]].map(([x,y,w])=>({x,y,w,h:17}));const gate={x:2170,y:333,w:40,h:92};
function physics(dt){if(completed||modal||document.hidden)return;elapsed+=dt;damageCooldown=Math.max(0,damageCooldown-dt);shootCooldown=Math.max(0,shootCooldown-dt);coyote=Math.max(0,coyote-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);const dir=(keys.left?-1:0)+(keys.right?1:0);if(dir)face=dir;player.vx=dir*230;if(jumpBuffer>0&&(player.ground||coyote>0)){player.vy=-540;player.ground=false;jumpBuffer=0;coyote=0}const oldY=player.y;player.x=Math.max(0,Math.min(2215,player.x+player.vx*dt));player.vy=Math.min(800,player.vy+1000*dt);player.y+=player.vy*dt;let landed=false;for(const p of grounds.concat(ledges,specialPlatforms)){if(player.vy>=0&&oldY+player.h<=p.y+7&&player.y+player.h>=p.y&&player.x+player.w>p.x+4&&player.x<p.x+p.w-4){player.y=p.y-player.h;player.vy=0;landed=true}}if(landed){player.ground=true;coyote=.12}else if(player.ground){player.ground=false;coyote=.12}for(const pad of springPads){if(overlap(player,pad)&&player.vy>=0){player.vy=-720;player.ground=false;player.y=pad.y-player.h-3}}for(const o of levelObstacles){if(overlap(player,o)&&damageCooldown<=0){hurt();player.vy=-245;break}}if(player.y>520){hurt();player.x=65;player.y=320;player.vy=0}for(const a of atoms){if(a.taken&&elapsed>=a.respawnAt)a.taken=false;if(!a.taken&&Math.hypot(a.x-player.x-12,a.y-player.y-17)<41){showQuestion(a);break}}
advanceMinions(dt);advanceEnemyShots(dt);const target=targets.find(t=>t.alive);if(target){if(target.type!=='limestone_wall'&&target.type!=='electrolyte_bridge'&&target.type!=='ice_shield'){target.x+=target.dir*dt*(level===1?90:60);const tx=target.phase===0?1780:1780+target.phase*160;if(target.x<tx-70||target.x>tx+70)target.dir*=-1}if(overlap(player,target)){hurt()}if(player.x>target.x-35&&player.x<target.x+target.w){player.x=target.x-35}}
for(const shot of shots){shot.x+=shot.vx*dt;shot.vy+=AMMO_FX[shot.ammo].gravity*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const t of minions.concat(targets)){if(!t.alive)continue;if(shot.x>t.x-8&&shot.x<t.x+t.w+8&&shot.y>t.y-35&&shot.y<t.y+t.h){shot.life=0;shot.refund=true;resolveTarget(t,shot.ammo);break}}}for(const shot of shots){if(shot.life<=0&&shot.x>=0&&shot.x<2300&&shot.refund!==true){arsenal[shot.ammo]++;shot.refund=true;hud()}}shots=shots.filter(s=>s.life>0&&s.x>=0&&s.x<2300&&s.y<480);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);if(player.x>gate.x-50){if(targets.every(t=>!t.alive)&&minions.every(t=>!t.alive)){completed=true;next.hidden=level===9;say(level===9?tr('finished'):tr('success'));try{localStorage.setItem('chemistryQuestHighestLevel',String(Math.max(level+1,Number(localStorage.getItem('chemistryQuestHighestLevel')||'0'))))}catch{}if(level===9)try{localStorage.setItem('chemistryQuestTenWon','true')}catch{}}else{player.x=gate.x-50;say(tr('blocked'))}}camera=Math.max(0,Math.min(1280,player.x-290))}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))}
function draw(){const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#08142b');bg.addColorStop(1,`hsl(${215+level*9},29%,27%)`);ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);for(let i=0;i<85;i++)rect(((i*173)%2600-camera*.25)%1100,14+i*79%265,2,2,'#7b94b5');for(let i=0;i<25;i++)rect(i*115-camera*.4,190+i%4*15,75,240,'#1a2945');ctx.save();ctx.translate(-Math.floor(camera),0);for(const p of grounds.concat(ledges,specialPlatforms)){rect(p.x,p.y,p.w,p.h,'#334a63');rect(p.x,p.y,p.w,7,'#65c9a2')}for(const o of levelObstacles){const color={embers:'#ff7445',steam:'#9fd9e1',sparks:'#ffe074',rocks:'#a28b78',acid:'#9aff6a',drip:'#c1da6b',ice:'#8be9ff',mist:'#abafff',spores:'#b3e568'}[o.type];rect(o.x,o.y,o.w,o.h,color);ctx.fillStyle=o.type==='sparks'?'#fff5bf':'#172842';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(obstacleName(o.type).toUpperCase(),o.x+o.w/2,o.y-8);for(let i=0;i<o.w;i+=15)rect(o.x+i,o.y-6+Math.sin(elapsed*5+i)*3,7,5,color)}for(const pad of springPads)rect(pad.x,pad.y,pad.w,pad.h,'#90b9ff');for(const a of atoms){if(a.taken)continue;const y=a.y+Math.sin(elapsed*3+a.x)*4;ctx.shadowBlur=16;ctx.shadowColor='#96dcff';ctx.fillStyle=a.s==='O'?'#ff827d':a.s==='H'?'#d7eeff':'#9de0ba';ctx.beginPath();ctx.arc(a.x,y,16,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#10283e';ctx.font='bold 15px monospace';ctx.textAlign='center';ctx.fillText(a.s,a.x,y+5)}
for(const t of minions.concat(targets)){if(!t.alive)continue;const x=t.x,y=t.y;rect(x,y,t.w,t.h,t.minion?'#a76bef':t.type.includes('ice')?'#83d9ff':t.type.includes('acid')?'#a4fc65':t.type.includes('ghost')?'#b9b6ff':'#f49161');rect(x+5,y+9,t.w-10,11,'#f9d88e');rect(x+8,y+14,5,5,'#152e46');rect(x+t.w-13,y+14,5,5,'#152e46');ctx.fillStyle='#f9d1a2';ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText(targetName(t.type),x+t.w/2,y-16)}for(const shot of enemyShots){rect(shot.x,shot.y,9,9,'#ff5c72')}for(const s of shots){const fx=AMMO_FX[s.ammo];ctx.save();ctx.globalAlpha=.45;ctx.fillStyle=fx.trail;ctx.beginPath();ctx.arc(s.x-s.vx*.018,s.y-s.vy*.018,fx.r*.75,0,2*Math.PI);ctx.fill();ctx.restore();ctx.fillStyle=fx.color;if(fx.style==='crystals'){ctx.fillRect(s.x-5,s.y-5,10,10)}else if(fx.style==='cloud'||fx.style==='mist'||fx.style==='milky'){for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(s.x+i*5-5,s.y+(i%2)*4,fx.r*.65,0,2*Math.PI);ctx.fill()}}else if(fx.style==='drops'||fx.style==='droplets'){ctx.beginPath();ctx.ellipse(s.x,s.y,fx.r*1.7,fx.r*.65,0,0,2*Math.PI);ctx.fill()}else if(fx.style==='flame'){ctx.beginPath();ctx.moveTo(s.x-9,s.y);ctx.lineTo(s.x+12,s.y-8);ctx.lineTo(s.x+4,s.y+9);ctx.fill()}else{ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,2*Math.PI);ctx.fill()}}for(const p of particles){ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.life/p.maxLife));ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,2*Math.PI);ctx.fill();ctx.restore()}rect(gate.x,gate.y,gate.w,gate.h,targets.every(t=>!t.alive)?'#4af0a5':'#ff9b73');rect(gate.x+9,gate.y+11,22,60,'#15283e');const x=Math.round(player.x),y=Math.round(player.y);if(damageCooldown<.01||Math.floor(elapsed*12)%2===0){rect(x+6,y,13,6,'#ffe6b6');rect(x+3,y+6,19,13,'#74d6f0');rect(x+7,y+9,12,5,'#1b3048');rect(x+2,y+19,23,13,'#eeb66c');rect(x+7,y+21,11,8,'#8de4da');rect(x+4,y+32,7,5,'#e3f0ff');rect(x+16,y+32,7,5,'#e3f0ff')}ctx.restore();ctx.fillStyle='#e6f5ff';ctx.font='bold 14px monospace';ctx.textAlign='left';ctx.fillText(tr('stage')+' '+stageCode(level)+' · '+nameFor(L[level].title),18,27);if(completed){rect(230,162,500,128,'#14374a');ctx.fillStyle='#b0ffd2';ctx.textAlign='center';ctx.font='bold 24px monospace';ctx.fillText(tr('success'),480,226)}}
let lastTime=0;function tick(ms){const dt=Math.min(.033,(ms-lastTime)/1000||.016);lastTime=ms;if(!$('gameSection').classList.contains('hidden')&&!document.hidden){physics(dt);draw();requestAnimationFrame(tick)}else setTimeout(()=>requestAnimationFrame(tick),200)}
const binds={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};document.addEventListener('keydown',e=>{if($('gameSection').classList.contains('hidden'))return;if(e.code==='Escape'&&modal==='craft'){clearModal();return}if(modal==='craft'&&e.code==='KeyC'){clearModal();return}if(modal||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(binds[e.code])keys[binds[e.code]]=true;if(['Space','KeyW','ArrowUp'].includes(e.code)){jumpBuffer=.19;e.preventDefault()}if(e.code==='KeyC'&&!e.repeat)showCraft();if(e.code==='KeyE'&&!e.repeat)fire();if((e.code==='KeyQ'||e.code==='Tab')&&!e.repeat){cycleWeapon();e.preventDefault()}const n=/^Digit([0-9])$/.exec(e.code);if(n){const idx=(Number(n[1])+9)%10;if(idx<RECIPES.length&&(idx<=level||RECIPES[idx].id==='O2')){selectWeapon(RECIPES[idx].id)}}if(['ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});document.addEventListener('keyup',e=>{if(binds[e.code])keys[binds[e.code]]=false});window.addEventListener('blur',()=>keys={});for(const [id,k] of [['questLeft','left'],['questRight','right']]){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;b.setPointerCapture(e.pointerId)});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys[k]=false)}$('questJump').onclick=()=>jumpBuffer=.19;$('questCraft').onclick=showCraft;$('questRestart').onclick=()=>loadLevel(level);$('questMute').onclick=()=>{$('questMute').textContent=$('questMute').textContent==='♫'?'♪':'♫'};
function localize(){$('questSubtitle').textContent=tr('escape')+' · '+tr('mission');$('questCraftLabel').textContent=tr('craft');$('questInstructions').textContent=tr('instructions');$('questRestart').title=tr('restart');fireButton.textContent=tr('fire');next.textContent=tr('next');if(modal==='question')renderQuestQuestion();if(modal==='reaction')renderReactionChallenge();if(modal==='craft-reaction')renderCraftReaction();if(modal==='craft'){const recipe=$('questRecipeSelect')?.value;showCraft();const el=$('questRecipeSelect');if(recipe&&el){el.value=recipe;if(typeof el.onchange==='function')el.onchange()}}if(!modal&&notification.includes(' · ')&&notification.includes('→')===false&&notification.includes('H₂ boost')===false)say(stageCode(level)+' · '+tr('mission')+' '+nameFor(L[level].title)+' · '+levelFact());hud()}
function show(){tab='quest';for(const id of ['periodSection','moleculeSection','huntSection','materialsSection','physicsSection','specSection','reactionSection','atomDetail']){$(id)?.classList.add('hidden')}document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));$('gameTab').classList.add('active');$('gameSection').classList.remove('hidden');localize();cv.focus({preventScroll:true})}
$('gameTab').onclick=show;for(const languageButton of ['hu','de','en'])$(languageButton)?.addEventListener('click',()=>localize());document.querySelectorAll('.tabs button:not(#gameTab)').forEach(b=>b.addEventListener('click',()=>{$('gameSection').classList.add('hidden');keys={}},true));
window.ChemQuest={localize,reset:()=>loadLevel(0),craft:showCraft,debug:()=>({level:level+1,inventory:{...inventory},arsenal:{...arsenal},selected,completed,obstacles:levelObstacles.map(o=>({type:o.type,x:o.x,w:o.w})),particleCount:particles.length,minions:minions.map(t=>({type:t.type,alive:t.alive,x:t.x})),enemyProjectiles:enemyShots.length,shotStyles:Object.fromEntries(Object.entries(AMMO_FX).map(([k,v])=>[k,v.style])),targets:targets.map(t=>({type:t.type,alive:t.alive})),player:{...player},questionsUsed:Object.fromEntries([...usedQuestions].map(([k,v])=>[k,v.size]))}),test:{stageCode,startCraftReaction,reactionChallenge,reactionMap:QUEST_CHEM_RXN,questionPool,levelFact,targetName,obstacleName,builderGraph:(id,bonds)=>graphMatches(R[id],bonds),referenceGraph:id=>referenceBonds(R[id],builderNodes(R[id])),advance:dt=>physics(dt),setPlayer:(x,y,ground=false)=>{player.x=x;player.y=y;player.vy=0;player.ground=ground},setInventory:a=>{Object.assign(inventory,a);hud()},setBoss:x=>{if(targets[0]){targets[0].x=x;targets[0].alive=true}},craft:(id)=>craft(id,true),fire,select:id=>selectWeapon(id),setAmmo:(id,n)=>{arsenal[id]=n;hud()},answerCorrect:()=>{if(pendingAtom){pendingAtom.taken=true;inventory[pendingAtom.s]++;pendingAtom=null;clearModal();hud()}},loadLevel,complete:()=>{targets.forEach(t=>t.alive=false);minions.forEach(t=>t.alive=false);player.x=gate.x-49;physics(.02)},resolve:(type,ammo)=>{const t=targets.concat(minions).find(t=>t.type===type&&t.alive);if(t)resolveTarget(t,ammo,true)}}};arsenal=freshArsenal();loadLevel(0);localize();requestAnimationFrame(tick);
})();
