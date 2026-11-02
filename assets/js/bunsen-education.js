/* Bunsen Lab P2 learning experience. Educational—not real lab operating instructions. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.BunsenEducation=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const levels=['basic','advanced','upper'];
const bank={
 basic:[
 {topic:'safety',q:{hu:'Helyettesíti a szimuláció a valódi Bunsen-égős gyakorlatot?',de:'Ersetzt die Simulation die praktische Arbeit am Bunsenbrenner?',en:'Does the simulation replace real Bunsen burner practice?'},choices:{hu:['Igen','Nem, csak szemlélteti a jelenségeket','Csak vizsgán'],de:['Ja','Nein, sie veranschaulicht nur','Nur in Prüfungen'],en:['Yes','No, it only illustrates concepts','Only in exams']},answer:1,why:{hu:'Valódi kísérletek és biztonsági rutinok csak felügyelet mellett gyakorolhatók.',de:'Echte Versuche und Sicherheitsroutinen müssen beaufsichtigt geübt werden.',en:'Real experiments and safety routines require supervised hands-on practice.'}},
 {topic:'burner',q:{hu:'Mit szabályoz a Bunsen-égő forgatható gyűrűje?',de:'Was regelt der drehbare Ring?',en:'What does the rotating collar control?'},choices:{hu:['Levegő beáramlása','A mintában lévő só mennyisége','A kibocsátott foton frekvenciája'],de:['Luftzufuhr','Salzmenge in der Probe','Photonenfrequenz'],en:['Air intake','Salt quantity in sample','Photon frequency']},answer:0},
 {topic:'flame',q:{hu:'Milyen általában a kevés levegővel égő láng?',de:'Wie ist die Flamme bei geringer Luftzufuhr?',en:'What is the flame generally like with low air intake?'},choices:{hu:['Világító, sárgás','Láthatatlan','Kizárólag zöld'],de:['Leuchtend, gelblich','Unsichtbar','Nur grün'],en:['Luminous yellowish','Invisible','Only green']},answer:0},
 {topic:'colour',q:{hu:'Melyik fémvegyület ad jellemzően erős sárga lángszínt?',de:'Welche Metallverbindung färbt die Flamme meist intensiv gelb?',en:'Which metal compound commonly gives an intense yellow flame?'},choices:{hu:['Nátrium','Réz','Lítium'],de:['Natrium','Kupfer','Lithium'],en:['Sodium','Copper','Lithium']},answer:0},
 {topic:'chemistry',q:{hu:'A magnézium fehér égése hagyományos lángfestés?',de:'Ist die weiße Magnesiumverbrennung eine klassische Flammenprobe?',en:'Is bright magnesium burning a conventional flame test?'},choices:{hu:['Igen','Nem, oxidációs reakció','Csak kék lángnál'],de:['Ja','Nein, eine Oxidationsreaktion','Nur in blauer Flamme'],en:['Yes','No, an oxidation reaction','Only in a blue flame']},answer:1},
 {topic:'safety',q:{hu:'Miért veszélyes a nyitott gázcsap meggyújtás nélkül?',de:'Warum ist eine offene Gaszufuhr ohne Flamme gefährlich?',en:'Why is an open gas supply without flame dangerous?'},choices:{hu:['Mert gáz gyűlhet össze','Mert a vas megolvad','Mert megszűnik az oxigén'],de:['Gas kann sich ansammeln','Eisen schmilzt','Sauerstoff verschwindet'],en:['Gas can accumulate','Iron melts','Oxygen disappears']},answer:0}
 ],
 advanced:[
 {topic:'chemistry',q:{hu:'Melyik a magnézium égésének rendezett egyenlete?',de:'Welche Gleichung beschreibt Magnesiumverbrennung?',en:'Which is the balanced equation for burning magnesium?'},choices:{hu:['Mg + O₂ → MgO','2 Mg + O₂ → 2 MgO','Mg + O → MgO₂'],de:['Mg + O₂ → MgO','2 Mg + O₂ → 2 MgO','Mg + O → MgO₂'],en:['Mg + O₂ → MgO','2 Mg + O₂ → 2 MgO','Mg + O → MgO₂']},answer:1},
 {topic:'emission',q:{hu:'Mit jelent a gerjesztett X* részecske?',de:'Was bedeutet das angeregte Teilchen X*?',en:'What does the excited species X* represent?'},choices:{hu:['Magasabb energiájú állapotot','Kötelezően radioaktív atomot','Új kémiai elemet'],de:['Einen höheren Energiezustand','Immer ein radioaktives Atom','Ein neues Element'],en:['A higher-energy state','Necessarily a radioactive atom','A new element']},answer:0},
 {topic:'contamination',q:{hu:'Miért lehet sárga a kálium lángpróbája?',de:'Warum kann eine Kalium-Flammenprobe gelb erscheinen?',en:'Why might a potassium flame test look yellow?'},choices:{hu:['Nátriumszennyezés elfedheti','A kálium mindig sárga','A lángban nincs oxigén'],de:['Natriumverunreinigung kann überdecken','Kalium ist immer gelb','Es gibt keinen Sauerstoff'],en:['Sodium contamination may mask it','Potassium is always yellow','No oxygen is present']},answer:0},
 {topic:'flame',q:{hu:'Hol található a kék láng egyik legforróbb régiója?',de:'Wo liegt eine der heißesten Regionen der blauen Flamme?',en:'Where is one of the hottest regions in a blue flame?'},choices:{hu:['A belső kúp csúcsa fölött','A talpban','Az égőcső belsejében'],de:['Knapp über der Spitze des Innenkegels','Im Standfuß','Im Brennerrohr'],en:['Just above the inner cone tip','In the base','Inside the barrel']},answer:0},
 {topic:'metal',q:{hu:'Miért ég másképp egy alumíniumlemez és egy finom alumíniumpor?',de:'Warum brennen Alublech und feines Aluminiumpulver unterschiedlich?',en:'Why do aluminium sheet and fine powder burn differently?'},choices:{hu:['Oxidréteg és fajlagos felület miatt','Mert más elem','Mert csak a lemez mágneses'],de:['Oxidschicht und Oberfläche','Weil es andere Elemente sind','Nur Blech ist magnetisch'],en:['Oxide layer and surface area','They are different elements','Only sheet is magnetic']},answer:0},
 {topic:'spectrum',q:{hu:'Mire utal a nátrium 589 nm körüli kettőse?',de:'Was zeigt das Natrium-Dublett bei etwa 589 nm?',en:'What does sodium’s doublet near 589 nm represent?'},choices:{hu:['Jellemző emissziós átmenetekre','A láng hőmérsékletére pontosan','Két külön elemre'],de:['Charakteristische Emissionsübergänge','Exakt die Flammentemperatur','Zwei verschiedene Elemente'],en:['Characteristic emission transitions','Exact flame temperature','Two different elements']},answer:0}
 ],
 upper:[
 {topic:'photons',q:{hu:'Melyik képlet adja a foton energiáját a hullámhosszból?',de:'Welche Formel beschreibt die Photonenenergie aus der Wellenlänge?',en:'Which formula gives photon energy from wavelength?'},choices:{hu:['E = hc/λ','E = hλ/c','E = mc'],de:['E = hc/λ','E = hλ/c','E = mc'],en:['E = hc/λ','E = hλ/c','E = mc']},answer:0},
 {topic:'spectra',q:{hu:'Miért nem elég egyetlen spektrumvonal a láng teljes színének meghatározásához?',de:'Warum genügt eine Spektrallinie nicht für die gesamte Flammenfarbe?',en:'Why is one line insufficient to determine the complete flame colour?'},choices:{hu:['Több vonal, sáv és intenzitás számít','Minden foton ugyanolyan színű','A molekulák nem sugározhatnak'],de:['Mehrere Linien, Banden und Intensitäten zählen','Alle Photonen haben dieselbe Farbe','Moleküle emittieren nie'],en:['Multiple lines, bands and intensities matter','All photons have the same colour','Molecules cannot emit']},answer:0},
 {topic:'spectra',q:{hu:'A kálium 766,5 és 769,9 nm körüli erős vonalai hol helyezkednek el?',de:'Wo liegen die starken Kaliumlinien bei 766,5 und 769,9 nm?',en:'Where do strong potassium lines near 766.5 and 769.9 nm lie?'},choices:{hu:['A látható vörös szélén / közeli infravörösben','A röntgentartományban','A zöld tartományban'],de:['Am Rotrand / nahen Infrarot','Im Röntgenbereich','Im Grün'],en:['Red edge / near infrared','X-ray range','Green range']},answer:0},
 {topic:'chemistry',q:{hu:'Miért lehet fontos a CaOH a kalcium lángszínében?',de:'Warum kann CaOH zur Calcium-Flammenfarbe beitragen?',en:'Why can CaOH contribute to calcium flame colour?'},choices:{hu:['Molekuláris emisszióval','Mert csak a CaOH éghet','Mert nem léteznek Ca-atomvonalak'],de:['Durch molekulare Emission','Weil nur CaOH brennt','Weil Ca keine Atomlinien hat'],en:['Through molecular emission','Only CaOH can burn','Ca has no atomic lines']},answer:0},
 {topic:'model',q:{hu:'A program RGB-lángszíne hogyan keletkezik?',de:'Wie entsteht die RGB-Flammenfarbe im Programm?',en:'How is the RGB flame colour produced in the app?'},choices:{hu:['Szemléltető modellből, nem teljes spektrumszámításból','Mért spektrális teljesítményeloszlásból','Valódi kamera érzékelőjéből'],de:['Aus einem illustrativen Modell, keiner vollständigen Spektralrechnung','Aus gemessener spektraler Strahlung','Aus einem echten Kamerasensor'],en:['Illustrative model, not complete spectral calculation','Measured spectral radiance','Real camera sensor']},answer:0},
 {topic:'safety',q:{hu:'Mi a fő korlátja a virtuális gyújtási feladatnak?',de:'Was ist die wichtigste Grenze der virtuellen Zündübung?',en:'What is the main limitation of a virtual ignition exercise?'},choices:{hu:['Nem tanítja meg a valódi eszköz biztonságos kezelését','Nem jelenít meg atomokat','Nem lehet benne színt választani'],de:['Sie vermittelt nicht die sichere reale Bedienung','Sie zeigt keine Atome','Farbauswahl fehlt'],en:['It cannot teach safe real-world handling','It shows no atoms','It cannot select a colour']},answer:0}
 ]
};
const lesson={
 basic:[
 {hu:'A Bunsen-égő csőből, levegőszabályozó gyűrűből, levegőnyílásokból, gázcsatlakozásból és stabil talpból áll. A gáz mennyisége főként a láng méretét, a levegő beáramlása a láng jellegét befolyásolja.',de:'Der Bunsenbrenner besitzt Rohr, Luftregulierring, Öffnungen, Gasanschluss und Standfuß. Gas beeinflusst vor allem die Flammengröße, Luftzufuhr vor allem den Flammentyp.',en:'The burner has a barrel, air collar, air holes, gas inlet and base. Gas flow mainly affects flame size while air intake changes flame characteristics.'},
 {hu:'Kevés levegőnél a láng sárgás és világító; megfelelő levegőellátással kékebb és kevésbé világító. A lángfestésnél bizonyos atomok, ionok vagy molekulák fényt bocsátanak ki.',de:'Wenig Luft ergibt eine gelbliche, leuchtende Flamme; mehr Luft eine blauere, weniger leuchtende. Bei Flammenproben emittieren Atome, Ionen oder Moleküle Licht.',en:'Low air intake gives a yellowish luminous flame; sufficient air gives a bluer non-luminous flame. In a flame test atoms, ions or molecules emit light.'},
 {hu:'A nátrium lángszíne sárga, a lítiumé vörös, a rézvegyületeké gyakran zöldes-kék. A szimulált színek közelítések. Valódi Bunsen-égővel csak tanári felügyelet mellett gyakorolj.',de:'Natrium erscheint gelb, Lithium rot und Kupferverbindungen oft blaugrün. Die Farben sind Näherungen. Übe mit echten Brennern nur unter Aufsicht.',en:'Sodium is yellow, lithium red and copper compounds often blue-green. Colours are approximations. Real burner practice requires supervision.'}
 ],
 advanced:[
 {hu:'A lángban a részecskék energiafelvétellel gerjesztődhetnek, majd fotont bocsátanak ki: X + energia → X*, X* → X + hν. X lehet atom, ion vagy molekula; nem feltétlenül egyetlen atom.',de:'In der Flamme werden Spezies angeregt und emittieren Licht: X + Energie → X*, X* → X + hν. X kann Atom, Ion oder Molekül sein.',en:'In a flame species absorb energy then emit light: X + energy → X*, X* → X + hν. X can be an atom, ion or molecule.'},
 {hu:'Az égés más jelenség: 2 Mg + O₂ → 2 MgO, illetve 4 Al + 3 O₂ → 2 Al₂O₃. Az alumínium oxidrétege és a részecskeméret erősen befolyásolja a reakciót.',de:'Verbrennung ist anders: 2 Mg + O₂ → 2 MgO und 4 Al + 3 O₂ → 2 Al₂O₃. Oxidschicht und Partikelgröße beeinflussen Aluminium.',en:'Combustion differs: 2 Mg + O₂ → 2 MgO and 4 Al + 3 O₂ → 2 Al₂O₃. Oxide layer and particle size matter for aluminium.'},
 {hu:'A kék Bunsen-láng egyik legforróbb zónája a belső kúp csúcsa fölött található. A nátrium nyomnyi szennyezése a kálium halványlila lángját is elfedheti.',de:'Eine der heißesten Zonen liegt knapp über der Spitze des inneren blauen Kegels. Natriumspuren können das blassviolette Kalium überdecken.',en:'One of the hottest regions lies just above the inner blue cone tip. Sodium traces may mask the pale-lilac potassium flame.'}
 ],
 upper:[
 {hu:'A foton energiája E = hν = hc/λ. A spektrumvonalak meghatározott elektronátmenetekhez kapcsolódnak, de a megfigyelt lángszín több vonal és molekuláris sáv intenzitásának eredője.',de:'Photonenenergie: E = hν = hc/λ. Spektrallinien entsprechen Übergängen, doch die Flammenfarbe entsteht aus mehreren Linien und Molekülbanden mit verschiedenen Intensitäten.',en:'Photon energy: E = hν = hc/λ. Spectral lines correspond to transitions, but perceived flame colour combines multiple lines and molecular bands with different intensities.'},
 {hu:'Nátrium: 589,0 és 589,6 nm körüli sárga D-kettős. Kálium: 404,4 nm-es ibolya vonal, valamint 766,5 és 769,9 nm-es vörös széli/közeli infravörös vonalak. A spektroszkóp a vonalakat és nem csak a szemmel észlelt színt mutatja.',de:'Natrium: gelbes D-Dublett bei 589,0 und 589,6 nm. Kalium: 404,4 nm Violett und 766,5/769,9 nm am Rotrand/nahen Infrarot.',en:'Sodium: yellow D doublet near 589.0 and 589.6 nm. Potassium: 404.4 nm violet and 766.5/769.9 nm red-edge/near-infrared features.'},
 {hu:'A CaOH, SrOH és CuCl molekulák emissziója is hozzájárulhat bizonyos lángszínekhez. A Chemistry Lab spektrumpálcái és RGB-lángjai oktatási ábrázolások, nem kvantitatív szín- vagy spektrumrekonstrukciók.',de:'CaOH, SrOH und CuCl können zu Flammenfarben beitragen. Die dargestellten Linien und RGB-Flammen sind didaktische Illustrationen, keine quantitative Rekonstruktion.',en:'CaOH, SrOH and CuCl can contribute to flame colours. Displayed lines and RGB flames are educational illustrations, not quantitative reconstructions.'}
 ]
};

/* Each question is tied to a lesson and gives a rationale in three languages. */
const topicMap={
 basic:{safety:4,burner:0,flame:1,colour:2,chemistry:3},
 advanced:{chemistry:1,emission:0,contamination:2,flame:3,metal:1,spectrum:4},
 upper:{photons:0,spectra:1,chemistry:2,model:3,safety:4}
};
const lessonExtra={
 basic:[
 {hu:'Az égő fő részei: égőcső, forgatható levegőszabályozó gyűrű, levegőnyílások, gázbevezetés és talp. A gyűrű nem a gáz mennyiségét, hanem a keverékbe jutó levegőt szabályozza. A gázáramlás határozza meg elsősorban a láng méretét.',de:'Die Hauptteile: Brennerrohr, drehbarer Luftregulierring, Luftöffnungen, Gasanschluss und Standfuß. Der Ring beeinflusst die Luft, der Gasdurchfluss vor allem die Flammengröße.',en:'Main parts: barrel, rotating air collar, air holes, gas inlet, and base. The collar changes air intake; gas flow mainly controls flame size.'},
 {hu:'Kevés levegővel a láng sárgás és világító, mert izzó koromrészecskék sugározhatnak. Több levegő mellett a láng általában kékebb és kevésbé világító; a megfelelően beállított kék láng alkalmas fűtésre. A legforróbb régió közelítőleg a belső kúp csúcsa fölött van.',de:'Bei wenig Luft ist die Flamme gelblich und leuchtend, teils wegen glühender Rußpartikel. Mehr Luft führt meist zu einer blauen, weniger leuchtenden Heizflamme; besonders heiß ist der Bereich knapp über der Innenkegelspitze.',en:'Low air produces a luminous yellowish flame, partly from glowing soot. More air usually makes a bluer heating flame; a hot zone lies just above the inner cone tip.'},
 {hu:'Tiszta lángpróbában a nátrium erős sárga, a lítium vörös, a kálium halványlila, a kalcium téglavörös, a stroncium vörös, a bárium sárgászöld és bizonyos rézvegyületek kékeszöld színt adhatnak. A szín az anyag összetételétől és a körülményektől is függ.',de:'Bei sauberen Flammenproben: Natrium intensiv gelb, Lithium rot, Kalium blassviolett, Calcium ziegelrot, Strontium rot, Barium gelbgrün und manche Kupferverbindungen blaugrün. Die Farbe hängt von der Verbindung und den Bedingungen ab.',en:'Clean flame tests: sodium bright yellow, lithium red, potassium pale violet, calcium brick red, strontium red, barium yellow-green and some copper compounds blue-green. Results depend on compounds and conditions.'},
 {hu:'A lángfestésnél fényt kibocsátó részecskék gerjesztődnek, majd fényt sugároznak; ez nem feltétlenül kémiai égés. A magnézium fehér égése valódi oxidáció: 2 Mg + O₂ → 2 MgO. A vas égő szemcséi szikrázhatnak.',de:'Bei der Flammenprobe werden emittierende Teilchen angeregt: das ist nicht dasselbe wie chemische Verbrennung. Magnesium verbrennt weiß: 2 Mg + O₂ → 2 MgO. Brennende Eisenpartikel können Funken zeigen.',en:'Flame tests involve excited emitting species, not necessarily combustion. Magnesium burns by oxidation: 2 Mg + O₂ → 2 MgO. Burning iron particles may spark.'},
 {hu:'A valódi Bunsen-égő használata tanári felügyeletet és biztonsági szabályokat kíván. A nyitott, de meg nem gyújtott gázcsapnál gyúlékony gáz gyűlhet össze. A szimuláció nem tanítja meg az eszköz valódi, biztonságos kezelését.',de:'Ein echter Bunsenbrenner erfordert Aufsicht und Sicherheitsregeln. Bei offenem, ungezündetem Gasventil kann sich brennbares Gas ansammeln. Die Simulation ersetzt keine praktische Einweisung.',en:'A real Bunsen burner requires supervision and safety procedures. Gas can accumulate when the valve is open but unlit. A simulation cannot replace practical safety training.'},
 {hu:'Összefoglalás: állítsd be a levegőt, vizsgáld meg a tiszta láng színét, majd hasonlítsd össze a különböző sómintákat. A szimulált RGB-színek oktatási közelítések: a koncentráció, hőmérséklet, vegyület és szennyeződés megváltoztathatja őket.',de:'Zusammenfassung: Luft einstellen, Grundflamme beobachten und Salzproben vergleichen. RGB-Farben sind didaktische Näherungen; Konzentration, Temperatur, Verbindung und Verunreinigung beeinflussen sie.',en:'Review: adjust air, observe the clean base flame and compare salts. RGB colours are educational approximations affected by concentration, temperature, compound and contamination.'}
 ],
 advanced:[
 {hu:'Gerjesztés: X + energia → X*. Fénykibocsátás: X* → X + hν. A csillag magasabb energiájú állapotot jelent, nem radioaktivitást. Az X lehet atom, ion vagy molekula; a szín a kibocsátott fény jellemzőitől függ.',de:'Anregung: X + Energie → X*. Emission: X* → X + hν. Das Sternchen kennzeichnet einen höheren Energiezustand, keine Radioaktivität. X kann Atom, Ion oder Molekül sein.',en:'Excitation: X + energy → X*. Emission: X* → X + hν. The star indicates a higher-energy state, not radioactivity. X may be an atom, ion or molecule.'},
 {hu:'A magnézium égésének rendezett egyenlete 2 Mg + O₂ → 2 MgO; az alumíniumé 4 Al + 3 O₂ → 2 Al₂O₃. Az alumíniumot oxidréteg védi, a finom por nagy fajlagos felülete miatt másképp reagálhat, mint egy lemez.',de:'Magnesium: 2 Mg + O₂ → 2 MgO. Aluminium: 4 Al + 3 O₂ → 2 Al₂O₃. Eine Oxidschicht schützt Aluminium; feines Pulver reagiert wegen größerer spezifischer Oberfläche anders als Blech.',en:'Magnesium: 2 Mg + O₂ → 2 MgO; aluminium: 4 Al + 3 O₂ → 2 Al₂O₃. Aluminium oxide passivates the surface; fine powder has greater specific area than sheet.'},
 {hu:'A lángpróbánál a nátrium nyomnyi szennyezése erős sárga színével elfedheti a kálium halványlila jelét. Ezért kell tiszta mintahurok. A szennyeződés nélküli mintákat külön értelmezzük; a koncentráció a szín intenzitását is módosíthatja.',de:'Natriumspuren können mit starkem Gelb die blassviolette Kaliumflamme überdecken. Deshalb ist eine saubere Probenöse wichtig. Konzentration beeinflusst auch die Intensität.',en:'Trace sodium can mask potassium’s pale-lilac flame with intense yellow. A clean test loop matters. Concentration can also change observed intensity.'},
 {hu:'Kék fűtőlángnál a forró zóna jellemzően a belső kúp csúcsa fölött van. A gyűrű a levegő mennyiségét szabályozza, a gázáramlás inkább a láng méretét. A sárga világító láng nem azonos a kék, kevésbé világító fűtőlánggal.',de:'Bei der blauen Heizflamme liegt ein besonders heißer Bereich knapp oberhalb der Innenkegelspitze. Der Ring regelt Luft, der Gasfluss eher die Flammengröße. Gelbe Leuchtflamme und blaue Heizflamme sind verschieden.',en:'A hot region of the blue heating flame lies just above the inner cone tip. The collar regulates air while gas flow chiefly controls size. Yellow luminous and blue heating flames differ.'},
 {hu:'A nátrium sárga D-kettőse körülbelül 589,0 és 589,6 nm-nél látható; ezek jellegzetes emissziós átmenetek. Egy spektrumvonal adott hullámhosszú fényt jelöl. A rajz csak kiválasztott vonalakat mutat, nem teljes mérési spektrumot.',de:'Das gelbe Natrium-D-Dublett liegt bei etwa 589,0 und 589,6 nm: charakteristische Emissionsübergänge. Eine Linie steht für Licht einer bestimmten Wellenlänge. Das Diagramm zeigt nur ausgewählte Linien.',en:'The yellow sodium D doublet near 589.0 and 589.6 nm represents characteristic emission transitions. A spectral line marks a wavelength; this diagram shows selected lines, not a full measured spectrum.'},
 {hu:'Az oxidáció anyagátalakulás, az emisszió fénykibocsátás; együtt is előfordulhatnak. A lángfestés nem azonos a fémek égésével. A spektroszkópiai adatok és az RGB-lángok szemléltetések, nem mérési eredmények.',de:'Oxidation ist stoffliche Umwandlung, Emission Lichtabgabe; beides kann gleichzeitig auftreten. Flammenprobe und Metallverbrennung sind nicht dasselbe. RGB und Spektrum sind Illustrationen.',en:'Oxidation is chemical change while emission is release of light; both can occur together. A flame test differs from metal burning. RGB and spectra are educational illustrations.'}
 ],
 upper:[
 {hu:'A foton energiája E = hν = hc/λ. Itt h a Planck-állandó, c a fénysebesség, ν a frekvencia, λ a hullámhossz. Rövidebb hullámhosszhoz azonos közegben nagyobb fotonenergia tartozik.',de:'Photonenenergie E = hν = hc/λ. h ist das Plancksche Wirkungsquantum, c die Lichtgeschwindigkeit, ν Frequenz und λ Wellenlänge. Kürzere Wellenlänge bedeutet höhere Energie.',en:'Photon energy E = hν = hc/λ. h is Planck’s constant, c light speed, ν frequency, λ wavelength. Shorter wavelength means higher photon energy.'},
 {hu:'A láng színét több atomos vonal és molekuláris sáv intenzitása alakíthatja. A káliumnál a 404,4 nm-es ibolya vonal látható, míg a 766,5 és 769,9 nm-es erős vonalak a vörös szélén/közeli infravörösben vannak. Egyetlen vonal nem ad teljes színmodellt.',de:'Flammenfarbe kann von mehreren Atomlinien und Molekülbanden mit ihren Intensitäten abhängen. Kalium: 404,4 nm violett, 766,5/769,9 nm am Rotrand/nahen Infrarot. Eine Linie genügt nicht.',en:'Flame colour depends on intensities of multiple atomic lines and molecular bands. Potassium: 404.4 nm violet; 766.5/769.9 nm at the red edge/near infrared. One line is insufficient.'},
 {hu:'A kalcium esetén CaOH, stronciumnál SrOH, réznél például CuCl molekuláris emisszió is részt vehet a lángszín kialakításában. A színt nem mindig egyetlen szabad atom adja. A pontos kibocsátó részecske a vegyülettől és körülményektől függ.',de:'Bei Calcium kann CaOH, bei Strontium SrOH und bei Kupfer zum Beispiel CuCl mit Molekülemission beitragen. Die emittierende Spezies hängt von Verbindung und Bedingungen ab.',en:'CaOH may contribute for calcium, SrOH for strontium and CuCl for copper. Emitting species depend on compounds and conditions; not every colour is from one free atom.'},
 {hu:'A program RGB-színei és vonalspektrumai illusztrációk: nincs mért spektrális teljesítményeloszlás, vonalintenzitás vagy molekuláris sávrekonstrukció. Közeli infravörös vonal a grafikus látható spektrumban nem jelenik meg, de a hullámhosszlistában feltüntethető.',de:'RGB und Spektren sind Illustrationen ohne gemessene spektrale Leistungsverteilung, Intensitäten oder Molekülbanden. Nahinfrarote Linien können in der Liste stehen, ohne im sichtbaren Diagramm zu erscheinen.',en:'RGB colours and spectra are illustrations, not measured spectral distributions, line strengths or molecular bands. Near-infrared features may appear in the wavelength list but not the visible plot.'},
 {hu:'A szimuláció nem tanítja meg a valódi Bunsen-égő biztonságos kezelését; nyitott, meg nem gyújtott gázcsapnál gyúlékony gáz gyűlhet össze. A gyújtás és kísérletezés csak tanári felügyelettel végezhető.',de:'Die Simulation lehrt keine sichere praktische Brennerbedienung. Bei offenem, nicht entzündetem Gasventil kann sich brennbares Gas ansammeln. Echte Versuche erfordern Aufsicht.',en:'The simulation does not teach safe physical operation. Gas can accumulate from an open unlit valve. Real ignition and experiments require supervision.'},
 {hu:'A spektroszkópiai elemzésnél a hullámhosszak, intenzitások, spektrális felbontás és az eszköz érzékenysége számít. Az egymáshoz közeli 589,0 és 589,6 nm-es Na-vonalak szétválasztásához nagyítás vagy megfelelő felbontás szükséges.',de:'Spektroskopie hängt von Wellenlängen, Intensitäten, Auflösung und Empfindlichkeit ab. Das Na-Dublett bei 589,0 und 589,6 nm benötigt zum Trennen geeignete Auflösung oder Zoom.',en:'Spectroscopy depends on wavelengths, intensities, resolution and instrument sensitivity. The sodium 589.0/589.6 nm doublet requires sufficient resolution or zoom to separate.'}
 ]
};

function addQ(level,topic,lessonIndex,prompt,correct,distractor1,distractor2){
 const locales=['hu','de','en'],q={},choices={};
 for(let i=0;i<3;i++){q[locales[i]]=prompt[i];choices[locales[i]]=[correct[i],distractor1[i],distractor2[i]]}
 bank[level].push({topic,lessonIndex,q,choices,answer:0});
}
addQ('basic','burner',0,
 ['Melyik rész tartja stabilan az égőt?','Welches Teil hält den Brenner stabil?','Which part keeps the burner stable?'],
 ['A talp','Der Standfuß','The base'],['A láng belső kúpja','Der innere Flammenkegel','The inner flame cone'],['A fém sója','Das Metallsalz','The metal salt']);
addQ('basic','burner',0,
 ['Mi szabályozza elsősorban a láng méretét?','Was regelt vor allem die Flammengröße?','What mainly controls flame size?'],
 ['A gázáramlás','Der Gasdurchfluss','Gas flow'],['A só színe','Die Salzfarbe','Salt colour'],['A foton energiája','Die Photonenenergie','Photon energy']);
addQ('basic','flame',1,
 ['Milyen láng alkalmas általában fűtésre?','Welche Flamme eignet sich meist zum Erhitzen?','Which flame is generally used for heating?'],
 ['A megfelelően beállított kék láng','Eine richtig eingestellte blaue Flamme','A properly adjusted blue flame'],['Csak a sárga világító láng','Nur die gelbe Leuchtflamme','Only the yellow luminous flame'],['A láng nélküli égő','Ein Brenner ohne Flamme','An unlit burner']);
addQ('basic','flame',1,
 ['Miért sárgás a kevés levegős világító láng?','Warum ist eine Leuchtflamme bei wenig Luft gelblich?','Why is a low-air luminous flame yellowish?'],
 ['Részben izzó koromrészecskék miatt','Zum Teil wegen glühender Rußpartikel','Partly due to incandescent soot'],['Csak a réz miatt','Nur wegen Kupfer','Only because of copper'],['Mert nincs benne energia','Weil sie keine Energie hat','Because it has no energy']);
addQ('basic','colour',2,
 ['Melyik lángfestési szín jellemző a lítiumra?','Welche Flammenfarbe ist typisch für Lithium?','Which flame colour is typical for lithium?'],
 ['Vörös','Rot','Red'],['Intenzív sárga','Intensiv gelb','Bright yellow'],['Sárgászöld','Gelbgrün','Yellow-green']);
addQ('basic','colour',2,
 ['Melyik lángfestési szín jellemző a báriumra?','Welche Flammenfarbe ist typisch für Barium?','Which flame colour is typical for barium?'],
 ['Sárgászöld','Gelbgrün','Yellow-green'],['Kárminvörös','Karminrot','Carmine red'],['Hófehér','Schneeweiß','Snow white']);
addQ('basic','colour',2,
 ['A kálium lángszíne általában milyen?','Welche Flammenfarbe hat Kalium typischerweise?','What is potassium’s typical flame colour?'],
 ['Halványlila','Blassviolett','Pale lilac'],['Élénk narancssárga','Leuchtend orange','Bright orange'],['Fehér','Weiß','White']);
addQ('basic','chemistry',3,
 ['A vas égő szemcséinél mi figyelhető meg?','Was ist bei brennenden Eisenpartikeln sichtbar?','What can burning iron particles produce?'],
 ['Izzó szikrák','Glühende Funken','Incandescent sparks'],['Jellegzetes neonlila láng','Eine neonviolette Flamme','A neon-purple flame'],['Sötét fotonok','Dunkle Photonen','Dark photons']);
addQ('basic','safety',4,
 ['Ki felügyelje a valódi Bunsen-égős iskolai kísérletet?','Wer soll echte Bunsenversuche in der Schule beaufsichtigen?','Who should supervise a real school Bunsen burner experiment?'],
 ['A tanár','Die Lehrkraft','The teacher'],['Senki','Niemand','Nobody'],['Csak a szimuláció','Nur die Simulation','Only the simulation']);
addQ('basic','model',5,
 ['Miért nem pontosan ugyanilyen egy valódi láng színe?','Warum kann die echte Flammenfarbe anders aussehen?','Why can real flame colour differ?'],
 ['A vegyület és körülmények hatnak rá','Verbindung und Bedingungen beeinflussen sie','Compound and conditions affect it'],['Mert a programban nincs gázcsap','Weil das Programm kein Ventil hat','Because the app has no gas valve'],['Mert minden fém ugyanazt bocsátja ki','Weil alle Metalle gleich emittieren','All metals emit identically']);
addQ('advanced','emission',0,
 ['Mit jelöl a hν a kibocsátási sémában?','Was bedeutet hν im Emissionsschema?','What does hν represent in an emission schematic?'],
 ['A kibocsátott foton energiáját','Die Energie des emittierten Photons','Energy of the emitted photon'],['Egy új atommagot','Einen neuen Atomkern','A new nucleus'],['A gáz térfogatát','Das Gasvolumen','Gas volume']);
addQ('advanced','emission',0,
 ['Milyen részecske lehet az X egy emissziós sémában?','Welche Spezies kann X im Emissionsschema sein?','What can X represent in an emission diagram?'],
 ['Atom, ion vagy molekula','Atom, Ion oder Molekül','Atom, ion or molecule'],['Csak szabad elektron','Nur freies Elektron','Only a free electron'],['Csak proton','Nur Proton','Only a proton']);
addQ('advanced','chemistry',1,
 ['Melyik az alumínium oxidációjának rendezett egyenlete?','Welche Gleichung ist für die Oxidation von Aluminium ausgeglichen?','Which equation balances aluminium oxidation?'],
 ['4 Al + 3 O₂ → 2 Al₂O₃','4 Al + 3 O₂ → 2 Al₂O₃','4 Al + 3 O₂ → 2 Al₂O₃'],['Al + O₂ → AlO','Al + O₂ → AlO','Al + O₂ → AlO'],['2 Al + O₂ → 2 Al₂O₃','2 Al + O₂ → 2 Al₂O₃','2 Al + O₂ → 2 Al₂O₃']);
addQ('advanced','metal',1,
 ['Mi gátolhatja a tömör alumínium meggyulladását?','Was erschwert das Entzünden von massivem Aluminium?','What can hinder ignition of bulk aluminium?'],
 ['A felszíni oxidréteg','Die Oberflächenoxidschicht','Surface oxide layer'],['A nátrium D-kettőse','Das Natrium-D-Dublett','Sodium D doublet'],['A bárium színe','Die Bariumfarbe','Barium colour']);
addQ('advanced','contamination',2,
 ['Miért érdemes tiszta mintahurkot használni?','Warum eine saubere Probenöse verwenden?','Why use a clean sample loop?'],
 ['Szennyezés miatti téves szín elkerülésére','Um falsche Farben durch Verunreinigung zu vermeiden','To avoid contamination-induced false colours'],['Hogy nagyobb legyen a láng','Damit die Flamme größer wird','To enlarge the flame'],['Hogy csökkenjen a gravitáció','Damit die Schwerkraft sinkt','To reduce gravity']);
addQ('advanced','contamination',2,
 ['Mit változtathat a mintakoncentráció?','Was kann die Probenkonzentration verändern?','What can sample concentration change?'],
 ['A kibocsátott fény erősségét','Die Intensität des emittierten Lichts','Intensity of emitted light'],['A periódusos rendszer elemeit','Die Elemente im Periodensystem','Elements in the periodic table'],['A Planck-állandót','Die Planck-Konstante','Planck’s constant']);
addQ('advanced','flame',3,
 ['Mi a levegőszabályozó fő hatása?','Was bewirkt der Luftregulierring hauptsächlich?','What is the air collar’s primary effect?'],
 ['Az égés jellegét változtatja','Er verändert den Verbrennungscharakter','It changes flame combustion characteristics'],['Csak a gáz molekulatömegét','Nur die molare Masse des Gases','Only gas molecular mass'],['Az elem rendszámát','Die Ordnungszahl','Atomic number']);
addQ('advanced','spectrum',4,
 ['Mit jelent egy emissziós spektrumvonal?','Was zeigt eine Emissionsspektrallinie?','What does an emission line represent?'],
 ['Adott hullámhosszú kibocsátott fényt','Emittiertes Licht einer bestimmten Wellenlänge','Emitted light at a specific wavelength'],['A láng pontos térfogatát','Das genaue Flammenvolumen','Exact flame volume'],['Mindig a gáz összetételét teljesen','Immer die vollständige Gaszusammensetzung','Always full gas composition']);
addQ('advanced','spectrum',4,
 ['A nátrium D-kettőse hány közeli vonalból áll?','Aus wie vielen nahen Linien besteht das Natrium-D-Dublett?','How many closely spaced lines form the sodium D doublet?'],
 ['Kettőből','Aus zwei','Two'],['Egyből','Aus einer','One'],['Tízből','Aus zehn','Ten']);
addQ('advanced','model',5,
 ['Az oxidáció és a fényemisszió viszonya milyen?','Wie verhalten sich Oxidation und Lichtemission zueinander?','How do oxidation and light emission relate?'],
 ['Külön jelenségek, de együtt is lehetnek','Verschiedene Vorgänge, die gemeinsam auftreten können','Different processes that can coexist'],['Mindig pontosan ugyanaz','Sie sind immer exakt gleich','They are always identical'],['Soha nem lehetnek együtt','Sie können nie zusammen auftreten','They cannot coexist']);
addQ('upper','photons',0,
 ['Mi történik a foton energiájával kisebb hullámhosszon?','Wie ändert sich die Photonenenergie bei kürzerer Wellenlänge?','What happens to photon energy at shorter wavelength?'],
 ['Nő','Sie steigt','It increases'],['Csökken','Sie sinkt','It decreases'],['Mindig nulla','Sie ist immer null','It is always zero']);
addQ('upper','photons',0,
 ['Melyik jelölés a Planck-állandó?','Welches Symbol steht für das Plancksche Wirkungsquantum?','Which symbol represents Planck’s constant?'],
 ['h','h','h'],['λ','λ','λ'],['c','c','c']);
addQ('upper','spectra',1,
 ['A nátrium erős D-kettőse nagyjából milyen hullámhosszú?','Bei welchen Wellenlängen liegt das Natrium-D-Dublett?','Near which wavelengths is the sodium D doublet?'],
 ['589,0 és 589,6 nm','589,0 und 589,6 nm','589.0 and 589.6 nm'],['400 és 410 nm','400 und 410 nm','400 and 410 nm'],['100 és 110 nm','100 und 110 nm','100 and 110 nm']);
addQ('upper','spectra',1,
 ['Miért fontos a különböző vonalak intenzitása?','Warum sind die Intensitäten verschiedener Linien wichtig?','Why do different line intensities matter?'],
 ['Befolyásolják az észlelt összszínt','Sie beeinflussen die wahrgenommene Gesamtfarbe','They influence the perceived combined colour'],['Egyenlők a gravitációval','Sie entsprechen der Schwerkraft','They equal gravity'],['Kizárólag a cső hosszát adják','Sie geben nur die Rohrlänge an','They only specify barrel length']);
addQ('upper','chemistry',2,
 ['Melyik molekula járulhat hozzá rézvegyület lángszínéhez?','Welches Molekül kann zur Kupfer-Flammenfarbe beitragen?','Which molecule may contribute to copper flame colour?'],
 ['CuCl','CuCl','CuCl'],['H₂','H₂','H₂'],['N₂','N₂','N₂']);
addQ('upper','chemistry',2,
 ['Mi járulhat hozzá a stroncium lángszínéhez?', 'Was kann zur Strontium-Flammenfarbe beitragen?','What may contribute to strontium flame colour?'],
 ['SrOH molekuláris emisszió','SrOH-Molekülemission','SrOH molecular emission'],['Kizárólag neutronok','Nur Neutronen','Only neutrons'],['Csak feketesugárzás','Nur Schwarzkörperstrahlung','Only blackbody radiation']);
addQ('upper','model',3,
 ['A közel infravörös káliumvonalak láthatók-e a 380–780 nm-es ábrán?', 'Sind Kaliumlinien im nahen Infrarot im 380–780-nm-Diagramm sichtbar?','Are near-infrared potassium lines shown on a 380–780 nm plot?'],
 ['Csak a tartományba esők; a többi kimarad','Nur Linien innerhalb des Bereichs','Only lines within the plotted range'],['Igen, minden UV-vonal is','Ja, auch alle UV-Linien','Yes, including all UV lines'],['Egyáltalán nincsenek vonalak','Es gibt überhaupt keine Linien','No lines exist at all']);
addQ('upper','model',3,
 ['Mi hiányzik az RGB-lángból a teljes spektrummodellhez?', 'Was fehlt dem RGB-Flammenmodell?','What is absent from the RGB flame model?'],
 ['Mért vonal- és sáverősségek','Gemessene Linien- und Bandenintensitäten','Measured line and band intensities'],['A kémiai elemek neve','Die Elementnamen','Element names'],['A számítógép kijelzője','Der Bildschirm','Computer display']);
addQ('upper','safety',4,
 ['Miért nem elég a virtuális gyújtás oktatása?', 'Warum genügt virtuelle Zündung nicht?', 'Why is virtual ignition instruction insufficient?'],
 ['Nem gyakoroltat valódi biztonsági készségeket','Sie trainiert keine echten Sicherheitsfertigkeiten','It does not train real-world safety skills'],['Nem tartalmaz fotonokat','Sie enthält keine Photonen','It contains no photons'],['Mert a fénysebesség változó','Weil die Lichtgeschwindigkeit variabel ist','Because the speed of light varies']);
addQ('upper','spectra',5,
 ['Mi szükséges a két közeli Na-vonal felbontásához?', 'Was benötigt man zum Trennen der nahen Na-Linien?', 'What is needed to resolve two nearby Na lines?'],
 ['Megfelelő spektrális felbontás','Ausreichende spektrale Auflösung','Sufficient spectral resolution'],['Sokkal több korom','Deutlich mehr Ruß','Much more soot'],['Zárt gázcsap','Geschlossenes Gasventil','A closed gas valve']);
for(const level of levels){for(const q of bank[level])if(!Number.isInteger(q.lessonIndex))q.lessonIndex=topicMap[level][q.topic]??5}
for(const level of levels)lesson[level]=lessonExtra[level];
function shuffle(list,rng=Math.random){const arr=list.slice();for(let i=arr.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function questions(level,exam,rng=Math.random){
 const source=bank[levels.includes(level)?level:'basic'],count=exam?10:6;
 return shuffle(source,rng).slice(0,count).map(item=>{
  const order=shuffle([0,1,2],rng),choices={};
  for(const lang of ['hu','de','en'])choices[lang]=order.map(i=>item.choices[lang][i]);
  return {...item,choices,answer:order.indexOf(item.answer)};
 });
}
function grade(questions,answers){return {correct:questions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0),total:questions.length,percent:questions.length?Math.round(100*questions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0)/questions.length):0,errors:questions.filter((q,i)=>answers[i]!==q.answer).map(q=>q.topic)}}
return Object.freeze({levels,bank,lesson,questions,grade});
});
(function(){
'use strict';if(typeof document==='undefined'||!window.BunsenEducation)return;
const api=window.BunsenEducation, $=id=>document.getElementById(id);
if(!$('bunsenEducationPanel'))return;
let view='lab',level='basic',index=0,answers=[],checked=false,completed=false;
const langs=['hu','de','en'],lang=()=>langs.find(x=>$(x)?.classList.contains('active'))||'hu';
const ui={
 hu:{lab:'Labor',learn:'Tanulás',practice:'Gyakorlás',exam:'Vizsga',difficulty:'Nehézségi szint',check:'Ellenőrzés',next:'Következő',restart:'Újrakezdés',learnIntro:'Rövid, egymásra épülő leckék. Válassz szintet, majd olvasd el a kártyákat.',practiceIntro:'4 gyakorló kérdés. Minden válasz után magyarázatot kapsz.',examIntro:'6 kérdésből álló önellenőrző teszt. A helyes válaszok a végén jelennek meg.',correct:'Helyes válasz.',wrong:'Hibás válasz.',choose:'Válassz egy lehetőséget.',complete:'A feladatsor véget ért.',score:'Eredmény',weak:'Ismétlendő témák',excellent:'Biztos tudás.',review:'Ismételd át a jelzett témaköröket.',lesson:'Lecke',of:'/',hint:'Ez oktatási szemléltetés, nem helyettesíti a valódi laboratóriumi gyakorlást.',lessonNext:'Következő lecke'},
 de:{lab:'Labor',learn:'Lernen',practice:'Üben',exam:'Prüfung',difficulty:'Schwierigkeitsgrad',check:'Prüfen',next:'Weiter',restart:'Neustart',learnIntro:'Kurze aufeinander aufbauende Lektionen.',practiceIntro:'4 Übungsfragen mit Erklärung nach jeder Antwort.',examIntro:'Selbsttest mit 6 Fragen. Lösungen erscheinen am Ende.',correct:'Richtig.',wrong:'Nicht richtig.',choose:'Bitte wähle eine Antwort.',complete:'Aufgaben abgeschlossen.',score:'Ergebnis',weak:'Wiederholen',excellent:'Sicheres Wissen.',review:'Bitte die genannten Themen wiederholen.',lesson:'Lektion',of:'/',hint:'Didaktische Simulation, kein Ersatz für echte Laborpraxis.',lessonNext:'Nächste Lektion'},
 en:{lab:'Lab',learn:'Learn',practice:'Practice',exam:'Exam',difficulty:'Difficulty level',check:'Check answer',next:'Next',restart:'Restart',learnIntro:'Short progressive lessons. Select a level and read through the cards.',practiceIntro:'Four practice questions with feedback after each answer.',examIntro:'Six-question self-assessment. Correct answers appear at the end.',correct:'Correct answer.',wrong:'Incorrect answer.',choose:'Select an option.',complete:'You have finished.',score:'Result',weak:'Topics to review',excellent:'Strong understanding.',review:'Review the listed topics.',lesson:'Lesson',of:'/',hint:'Educational simulation; not a substitute for real laboratory practice.',lessonNext:'Next lesson'}
};
const t=x=>ui[lang()][x],current=()=>api.questions(level,view==='exam'),clear=node=>node.replaceChildren(),el=(tag,txt,cl)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cl)n.className=cl;return n};
function render(){
 for(const [name,id] of [['lab','bunsenViewLab'],['learn','bunsenViewLearn'],['practice','bunsenViewPractice'],['exam','bunsenViewExam']]){$(id).textContent=t(name);$(id).setAttribute('aria-pressed',String(view===name))}
 $('bunsenDifficultyLabel').textContent=t('difficulty');$('bunsenEducationPanel').hidden=view==='lab';$('bunsenLabWorkspace').hidden=view!=='lab';
 if(view==='lab')return;
 const content=$('bunsenLessonContent'),task=$('bunsenEducationTask'),feedback=$('bunsenEducationFeedback'),report=$('bunsenEducationReport');
 clear(content);clear(task);clear(report);feedback.textContent='';$('bunsenEduCheck').hidden=view==='learn'||completed;$('bunsenEduNext').hidden=false;$('bunsenEduRestart').textContent=t('restart');$('bunsenEduCheck').textContent=t('check');$('bunsenEduNext').textContent=t('next');
 $('bunsenEducationTitle').textContent=t(view);$('bunsenEducationIntro').textContent=t(view+'Intro');
 if(view==='learn'){
  const lessons=api.lesson[level];const p=el('p',t('lesson')+' '+(index+1)+' '+t('of')+' '+lessons.length,'bunsen-progress');content.append(p,el('p',lessons[index][lang()]),el('p',t('hint'),'hint'));
  $('bunsenEduNext').textContent=index===lessons.length-1?t('restart'):t('lessonNext');return;
 }
 const qs=current();if(completed){$('bunsenEduCheck').hidden=true;$('bunsenEduNext').hidden=true;
  const result=api.grade(qs,answers);report.append(el('h4',t('score')+': '+result.correct+'/'+result.total+' ('+result.percent+'%)'),el('p',result.percent>=80?t('excellent'):t('review')));
  if(result.errors.length)report.append(el('p',t('weak')+': '+[...new Set(result.errors)].join(', ')));
  const list=el('ol');qs.forEach((q,i)=>{const li=el('li',q.q[lang()]+' — '+(answers[i]===q.answer?t('correct'):t('wrong')+' '+q.choices[lang()][q.answer]));list.append(li)});report.append(list);feedback.textContent=t('complete');return;
 }
 const q=qs[index];content.append(el('p',(index+1)+' '+t('of')+' '+qs.length,'bunsen-progress'));
 const h=el('h4',q.q[lang()]);task.append(h);
 const group=el('div',undefined,'bunsen-choice-group');group.setAttribute('role','radiogroup');group.setAttribute('aria-label',q.q[lang()]);
 q.choices[lang()].forEach((choice,i)=>{const label=el('label');const input=document.createElement('input');input.type='radio';input.name='bunsenEduAnswer';input.value=String(i);input.checked=answers[index]===i;input.disabled=checked;input.addEventListener('change',()=>{answers[index]=i});label.append(input,document.createTextNode(' '+choice));group.append(label)});task.append(group);
 $('bunsenEduNext').hidden=!checked;
 if(checked){feedback.textContent=view==='exam'?'':(answers[index]===q.answer?t('correct'):t('wrong')+' '+(q.why?.[lang()]||q.choices[lang()][q.answer]));$('bunsenEduCheck').hidden=true}
}
function reset(){index=0;answers=[];checked=false;completed=false;render()}
for(const [name,id] of [['lab','bunsenViewLab'],['learn','bunsenViewLearn'],['practice','bunsenViewPractice'],['exam','bunsenViewExam']])$(id).addEventListener('click',()=>{view=name;reset()});
$('bunsenDifficulty').addEventListener('change',e=>{level=e.target.value;reset()});
$('bunsenEduCheck').addEventListener('click',()=>{if(!Number.isInteger(answers[index])){$('bunsenEducationFeedback').textContent=t('choose');return}checked=true;render()});
$('bunsenEduNext').addEventListener('click',()=>{if(view==='learn'){index=(index+1)%api.lesson[level].length;render();return}if(!checked)return;if(index+1>=current().length){completed=true}else{index++;checked=false}render()});
$('bunsenEduRestart').addEventListener('click',reset);
langs.forEach(id=>$(id)?.addEventListener('click',()=>render()));render();
})();
