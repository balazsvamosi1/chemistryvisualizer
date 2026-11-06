/* Chemistry Lab 0.2105 — student-friendly welcome screen. Apache-2.0. */
(()=>{
'use strict';
if(typeof document==='undefined')return;
const $=id=>document.getElementById(id),host=$('homeSection'),tab=$('homeTab');
if(!host||!tab)return;
const locale=()=>['hu','de','en'].find(id=>$(id)?.classList.contains('active'))||'hu';
const t={
 hu:{tab:'Kezdőlap',eyebrow:'INTERAKTÍV KÉMIAI SEGÉDLET',title:'Fedezd fel a kémiát!',intro:'Itt megnézheted, hogyan épülnek fel az atomok és a molekulák. Kipróbálhatsz virtuális feladatokat, és játékosan gyakorolhatsz. Használd a tanórák és a tankönyv mellett.',how:'Hogyan használd?',steps:['Válassz egy témát az alábbi lehetőségek közül.','Nézd meg, próbáld ki, és változtass a beállításokon.','Olvasd el a magyarázatokat és a modellek korlátait is.'],features:'Mit találhatsz itt?',open:'Megnyitás',limits:'Mire nem való?',limit:['Ez nem valódi laboratórium. A virtuális reakciók és játékok nem útmutatók valódi kísérletekhez.','Az atomok, elektronok és molekulák képei egyszerűsített modellek. Nem bizonyítják, hogy egy molekula stabil vagy előállítható.','Ez nem dolgozat vagy osztályozó rendszer. A kérdések és a statisztikák csak a gyakorlást segítik.','Néhány molekulafizikai adatlekérés csak helyi Python-szerverrel működik, a GitHub Pages-en nem.'],return:'Bármikor visszatérhetsz ide a Kezdőlap füllel.',groups:['Felfedezés','Virtuális laborok','Tanulás és játék','Haladó témák']},
 de:{tab:'Startseite',eyebrow:'INTERAKTIVE LERNHILFE FÜR CHEMIE',title:'Entdecke die Chemie!',intro:'Hier kannst du Atome und Moleküle erkunden, virtuelle Aufgaben ausprobieren und spielerisch üben. Nutze die Seite ergänzend zum Unterricht und zum Schulbuch.',how:'Wie funktioniert es?',steps:['Wähle unten ein Thema aus.','Schau es dir an, probiere es aus und ändere die Einstellungen.','Lies auch die Erklärungen und Grenzen der Modelle.'],features:'Was findest du hier?',open:'Öffnen',limits:'Wofür ist es nicht gedacht?',limit:['Kein echtes Labor: Virtuelle Reaktionen und Spiele sind keine Anleitung für echte Experimente.','Die Bilder von Atomen, Elektronen und Molekülen sind vereinfachte Modelle. Sie beweisen nicht, dass ein Molekül stabil oder herstellbar ist.','Kein Prüfungs- oder Notensystem. Fragen und Statistiken helfen nur beim Üben.','Einige Molekülphysik-Datenfunktionen benötigen einen lokalen Python-Server und laufen nicht auf GitHub Pages.'],return:'Über den Reiter Startseite kommst du jederzeit hierher zurück.',groups:['Entdecken','Virtuelle Labore','Lernen und Spielen','Fortgeschrittene Themen']},
 en:{tab:'Home',eyebrow:'INTERACTIVE CHEMISTRY LEARNING AID',title:'Explore chemistry!',intro:'Here you can explore atoms and molecules, try virtual activities, and practise through games. Use this page alongside lessons and textbooks.',how:'How do you use it?',steps:['Choose a topic below.','Look around, try things out, and change the settings.','Read the explanations and the limits of each model.'],features:'What can you do here?',open:'Open',limits:'What is it not for?',limit:['Not a real laboratory: virtual reactions and games are not instructions for real experiments.','Pictures of atoms, electrons, and molecules are simplified models. They do not prove a molecule is stable or can be made.','Not a grading or exam system. Questions and statistics are only for practice.','Some molecular physics data features need a local Python server and do not work on GitHub Pages.'],return:'You can return here any time using the Home tab.',groups:['Explore','Virtual labs','Learn and play','Advanced topics']}
};
const cards=[
[0,'periodTab',['Atomok és periódusos rendszer','Atome und Periodensystem','Atoms and periodic table'],['Keress elemeket, nézd meg az atomokat és az izotópokat.','Finde Elemente und erkunde Atome und Isotope.','Find elements and explore atoms and isotopes.']],
[0,'moleculeTab',['Molekulaépítő','Moleküleditor','Molecule builder'],['Építs molekulákat és vizsgáld a kötéseket.','Baue Moleküle und untersuche Bindungen.','Build molecules and explore bonds.']],
[0,'materialsTab',['Anyagkönyvtár','Stoffbibliothek','Materials library'],['Hasonlíts össze hétköznapi anyagokat.','Vergleiche alltägliche Stoffe.','Compare familiar substances.']],
[1,'bunsenTab',['Bunsen Lab','Bunsen-Labor','Bunsen Lab'],['Ismerd meg virtuálisan a labor eszközeit.','Entdecke Laborgeräte in einer Simulation.','Explore lab equipment in a simulation.']],
[1,'stoichTab',['Sztöchiometria','Stöchiometrie','Stoichiometry'],['Próbálj ki kémiai számításokat.','Übe chemische Berechnungen.','Try chemical calculations.']],
[1,'acidBaseTab',['Sav–bázis labor','Säure-Base-Labor','Acid–base lab'],['Kísérletezz virtuálisan a pH-val.','Experimentiere virtuell mit dem pH-Wert.','Explore pH through virtual activities.']],
[2,'curriculumTab',['Kémia Akadémia','Chemie-Akademie','Chemistry Academy'],['Rövid leckék, gyakorlás és kapcsolódó laborok.','Kurze Lektionen, Übungen und passende Labore.','Short lessons, practice, and related labs.']],
[2,'gameTab',['Chemistry Quest','Chemistry Quest','Chemistry Quest'],['Kitalált kalandjáték kémiai feladatokkal.','Fiktives Abenteuerspiel mit Chemieaufgaben.','Fictional adventure with chemistry challenges.']],
[2,'mazeTab',['Reakció-labirintus','Reaktionslabyrinth','Reaction Maze'],['Gyűjts atomokat kvízekkel a játékban.','Sammle Atome durch Quizfragen im Spiel.','Collect atoms by answering quizzes.']],
[3,'physicsTab',['Molekulafizika','Molekülphysik','Molecular physics'],['Referenciaadatok; néhány funkcióhoz helyi szerver kell.','Referenzdaten; manche Funktionen brauchen einen lokalen Server.','Reference data; some features need a local server.']],
[3,'specTab',['Spekulatív fizika','Spekulative Physik','Speculative physics'],['Válaszd szét a bevett tudományt és a feltételezéseket.','Unterscheide gesicherte Physik von Hypothesen.','Compare established physics with hypotheses.']]
];
const make=(tag,value,cls)=>{const e=document.createElement(tag);if(value!==undefined)e.textContent=value;if(cls)e.className=cls;return e;};
function openTab(id){const dest=$(id);if(!dest)return;dest.click();window.ChemistryNavigation?.activate(id);}
function render(){
 const lang=locale(),i=['hu','de','en'].indexOf(lang),s=t[lang];tab.textContent=s.tab;host.replaceChildren();
 const hero=make('div',undefined,'home-hero');hero.append(make('p',s.eyebrow,'home-kicker'),make('h2',s.title),make('p',s.intro,'home-intro'));host.append(hero);
 const how=make('section',undefined,'home-how');how.append(make('h3',s.how));const ol=make('ol');s.steps.forEach(x=>ol.append(make('li',x)));how.append(ol);host.append(how,make('h3',s.features,'home-features-title'));
 for(let group=0;group<4;group++){
  const section=make('section',undefined,'home-group');section.append(make('h4',s.groups[group]));
  const grid=make('div',undefined,'home-grid');
  for(const card of cards.filter(x=>x[0]===group)){
   const article=make('article',undefined,'home-card');article.append(make('h5',card[2][i]),make('p',card[3][i]));
   const button=make('button',s.open+': '+card[2][i],'home-open');button.type='button';button.addEventListener('click',()=>openTab(card[1]));
   article.append(button);grid.append(article);
  }
  section.append(grid);host.append(section);
 }
 const limit=make('section',undefined,'home-limits');limit.append(make('h3',s.limits));const ul=make('ul');s.limit.forEach(x=>ul.append(make('li',x)));limit.append(ul);host.append(limit,make('p',s.return,'home-footer'));
}
for(const lang of ['hu','de','en'])$(lang)?.addEventListener('click',()=>queueMicrotask(render));
render();window.ChemistryHome={render};
})();
