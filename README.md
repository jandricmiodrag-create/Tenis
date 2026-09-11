# Tenis — organizacija turnira

Prva verzija javnog sajta i Google Sheets baze za singl turnir sa eliminacionim žrijebom.

**Status: kod i lokalni DEMO pregled su izrađeni. Produkciona Google Sheets datoteka i Apps Script objava još nisu povezane ni testirane na Google nalogu.**

## Arhitektura

Google Sheets je centralna i trajna baza. Google Apps Script vezan za tu datoteku servira javni HTML interfejs i čita/upisuje podatke u ime vlasnika. Posjetioci komuniciraju preko `google.script.run`; nema odvojenog frontend domena, preusmjeravanja API poziva ili CORS posrednika. To je Googleov predviđeni komunikacioni put za HTML Service. [Google: komunikacija sa serverom](https://developers.google.com/apps-script/guides/html/communication).

GitHub služi za verzionisanje koda. Produkcioni sajt se objavljuje kao Apps Script web aplikacija. Sites/Cloudflare objava nije izabrana: dodala bi drugi backend i dodatnu autentifikaciju bez koristi za ovaj zahtjev. Nije kreiran drugi sajt koji bi se lažno predstavljao kao povezan s tabelom.

Javni odgovor se sastavlja iz eksplicitne liste dozvoljenih polja. `Prijave`, privatni kontakti, identifikator prijave, otisak zahtjeva i napomene nikad ne ulaze u taj odgovor. Javni kontakt u `Turnir.kontakt_javni` organizator unosi namjerno za objavu. Pravila objave obuhvataju javno ime, kategoriju i opcioni klub/grad odobrenog učesnika.

Javna stranica čita podatke na otvaranju, svakih 60 sekundi dok je aktivna, pri povratku u karticu i na dugme Osvježi. Serverski javni odgovor ima keš do 25 sekundi; meni i instalirani edit okidač ga poništavaju. To je **periodično osvježavanje**, ne trenutna sinhronizacija. Pri grešci ostaje posljednji uspješan prikaz u memoriji otvorene stranice, uz upozorenje i vrijeme. Zatvaranje/reload kartice gubi taj privremeni prikaz; podaci turnira ostaju u Sheets.

## Brzo povezivanje i objavljivanje

1. Na svom Google nalogu napravite **novu praznu Google Sheets datoteku**. Ne uključujte Publish to web. Ne dijelite je sa igračima ni javno.
2. Iz te datoteke otvorite **Extensions → Apps Script**. Bitno: projekat mora biti vezan za baš tu tabelu.
3. Iz isporučenog foldera `apps-script` prekopirajte sadržaj `Code.gs` u editorov `Code.gs`. Dodajte HTML datoteke **Index**, **Styles** i **Client** i prekopirajte njihove sadržaje. Nemojte istovremeno dodavati zasebne originalne `Engine.gs`, `Schema.gs` i `Demo.gs`: objedinjeni `Code.gs` ih već sadrži.
4. U **Project Settings** uključite prikaz `appsscript.json`, pa prekopirajte isporučeni manifest. Vremenska zona je `Europe/Belgrade`.
5. U izboru funkcija pokrenite **initialize_**. Google će tražiti dozvole vlasnika za pristup tabelama, njenom meniju, instaliranje okidača i identifikaciju korisnika. Taj korak radi vlasnik na svom nalogu. Provjerite tražene dozvole; kod ne traži Gmail, kontakte ili slanje e-maila.
6. Vratite se u Sheets i osvježite tab. Pojaviće se meni **Tenis**. Inicijalizacija kreira osam listova i skriveni tehnički list `_Transakcija`, zaglavlja, validacije, padajuće liste i zaštite. Postojeći list sa drugačijim kolonama izaziva prekid, ne prepisivanje.
7. Najprije testirajte: **Tenis → Učitaj DEMO u praznu bazu**. Koristite isključivo izmišljene podatke. Za produkciju je najčistije napraviti zasebnu praznu datoteku; DEMO se može ukloniti i kroz meni uz očuvanje strukture. Uklanjanje se blokira ako postoje stvarne prijave povezane s DEMO kategorijama.
8. Popunite `Turnir`: naziv, opis, lokaciju, datume, rok, javni kontakt, stvarna pravila i stvarno obavještenje o obradi podataka. DEMO tekst nije završeno obavještenje za stvarni turnir. Nepoznati stvarni podaci nisu izmišljeni u početnoj bazi.
9. **Tenis → Dodaj kategoriju / Dodaj teren**. Dovršite podešavanja u novim redovima i aktivirajte ih. Prije prijava provjerite format, limit, kotizaciju, pravila setova i taj-brejka. Status prijava promijenite u `Otvorene` tek kada ste spremni.
10. U Apps Script editoru izaberite **Deploy → New deployment → Web app**, **Execute as: Me** i pristup **Anyone** ako Google nalog/Workspace politika to dopušta. Dijelite dobijeni `/exec` URL. `/dev` URL je samo za razvojne provjere korisnika sa pristupom kodu. [Google: objavljivanje web aplikacije](https://developers.google.com/apps-script/guides/web).
11. Provjerite `/exec` u privatnom prozoru bez prijave na vlasnički nalog. Google Sheets datoteka i dalje ostaje privatna. Ako politika organizacije zabranjuje anonimni pristup, javna prijava nije dostupna dok administrator naloga ne riješi taj uslov; kod ne zaobilazi tu politiku.
12. Izvršite produkcionu kontrolnu listu iz `PROVJERE.md` prije prihvatanja stvarnih igrača. Naknadne promjene podataka u tabeli ne traže novu objavu. Promjene koda zahtijevaju **Manage deployments → Edit → New version → Deploy** uz očuvanje postojećeg deploymenta i URL-a.

**Korak koji vlasnik još mora obaviti:** otvoriti svoju novu tabelu, dodati isporučeni Apps Script kod, dati Google dozvole i napraviti web app objavu. U ovom zadatku nije dostavljen ID tabele niti ovlašćen Apps Script projekat. Dostupni Drive alati ne nude instaliranje i objavljivanje ovog vezanog Apps Script projekta. Zbog toga nema potvrđenog produkcionog URL-a ni tvrdnje o uspješnom povezivanju.

## Rad organizatora

### Podaci i prijave

- Ručno unosite promjenjiva polja u `Turnir`, `Kategorije`, `Tereni` i `Obavjestenja`. Svaka kolona ima bilješku u zaglavlju. Redove kategorija, terena i obavještenja dodajte kroz meni, da ID bude automatski formiran.
- U `Prijave` odaberite red i **Tenis → Status odabrane prijave**. Upišite tačno `Odobrena`, `Odbijena`, `Lista čekanja` ili `Na čekanju`. Odobrenje kreira samo jednog učesnika čak i ako radnju ponovite. Na čekanju rezerviše mjesto u kategoriji; lista čekanja ne rezerviše mjesto. Mjesto se oslobađa odbijanjem ili prebacivanjem na listu čekanja. Odobravanje liste čekanja je ručno, nikad automatsko.
- Odobrenom učesniku javno ime, klub/grad i nosioca mijenjate izborom njegovog reda i menijem **Javno ime / klub / nosilac**. Unos: `Javno ime | klub ili grad | broj nosioca`. Posljednje polje ostavite prazno za nenosioca.
- Ne unosite privatne kontakte u javna polja. Ne mijenjajte zaglavlja, ID-jeve, sistemske kolone ili rezultate direktnim lijepljenjem. Vlasnik Google datoteke može tehnički zaobići zaštitu; takve izmjene zaobilaze aplikacione provjere.

### Žrijeb

1. Odobrite sve igrače kategorije. Brojevi nosilaca moraju biti jedinstveni i uzastopni od 1; ostali igrači imaju prazno polje.
2. Odaberite kategoriju u `Kategorije`, pa **Generiši žrijeb odabrane kategorije**. Potrebno je 2–256 učesnika. Kostur je naredni stepen dvojke; prazne pozicije daju slobodan prolaz. Nosioci 1 i 2 su u suprotnim polovinama; nenosioci se miješaju samo pri generisanju.
3. Pregledajte `Zrijeb` i `Mecevi`. Ovo je sačuvan nacrt i još nije javno vidljiv. Sastav i nova odobrenja kategorije su zaključani već nakon generisanja, radi konzistentnosti.
4. Odaberite kategoriju i **Objavi žrijeb odabrane kategorije**. Tek tada sajt prikazuje njen kostur i mečeve. Ne postoji tiho ponovno generisanje niti prepisivanje. Za pogrešan nacrt u ovoj verziji koristite zasebnu kategoriju/datoteku ili stručnu intervenciju; ne brišite sistemske redove tokom turnira.

### Raspored

U `Mecevi` odaberite red, pa **Termin / status odabranog meča**. Format:

`2027-06-10T10:00:00+02:00 | ID terena | 90 | Zakazan`

Ovo je samo primjer formata, ne datum vašeg turnira. ID terena kopirajte iz `Tereni`. Ljetnje lokalno vrijeme ima `+02:00`, zimsko `+01:00`; ili unesite UTC sa `Z`. Sajt prikazuje Europe/Belgrade. Ne unosite vrijeme bez zone.

Statusi dostupni kroz raspored su `Zakazan`, `U toku`, `Odgođen`, `Otkazan`. `Završen` nastaje kroz unos rezultata. Odgođeni/otkazani mečevi oslobađaju rezervaciju; ponovno zakazivanje ponovo provjerava konflikte. Termin zahtijeva oba poznata protivnika. Raspored se provjerava po planiranom trajanju: isti teren i isti igrač ne smiju se preklapati. Igrač u više kategorija povezuje se preko podudarnog privatnog e-maila ili telefona. Nedosljedni kontakti istog igrača mogu izbjeći to povezivanje — organizator ih mora provjeriti.

`Tereni.dostupan_od` i `dostupan_do` su jedan interval raspoloživosti. Prazna granica znači bez ograničenja na toj strani. Ne predstavlja kalendar pauza po danima. Trajanje je procjena; pri kašnjenju pomjerite naredne termine kroz isti meni. **Provjeri raspored** prikazuje sve otkrivene konflikte.

### Rezultati i ispravke

Odaberite meč i **Rezultat odabranog meča**. Unos:

- `1 | Regularno | 6-4 7-6(7-5)` — pobjeđuje prvi navedeni igrač; setovi i poeni taj-brejka uvijek se pišu redom igrač 1 – igrač 2.
- `2 | Predaja | 6-4 1-2` — pobjednik je drugi igrač, posljednji set smije biti nedovršen.
- `1 | Bez igre |` — pobjeda bez igre nema setove.

Broj setova za pobjedu, gemovi i taj-brejk uzimaju se iz snimka postavki nastalog pri žrijebu. Prva verzija podržava redovan set sa taj-brejkom na broju gemova za set, cilj taj-brejka 5–15 i razliku dva. Nema odlučujućeg match taj-brejka/superseta niti seta sa neograničenom prednošću. Nemojte naknadno mijenjati pravila kategorije da javni opis ne odstupi od sačuvanog pravila žrijeba.

Pobjednik automatski prelazi u sljedeću rundu. Promjena pobjednika uklanja termine zavisnih mečeva da se ponovo provjere tereni i igrači. Ako je naredni meč počeo ili završen, promjena je blokirana. Razriješite incident sa organizatorom, zatim kroz **Poništi rezultat odabranog meča** poništavajte kasnije runde unazad, uz potvrdu `PONIŠTI`. Tek potom ispravite raniji rezultat i ponovo unesite kasnije termine/rezultate. To je namjerna kontrolna tačka.

### Obavještenja i izvoz

Za obavještenje dodajte red kroz meni, unesite tekst, datum sa zonom i prioritet 1–3, pa status `Objavljeno`. Budući datum odlaže prikaz do tog trenutka. Najviši prioritet je istaknut na pregledu; prioritet 3 koristite za hitna pomjeranja i vrijeme.

**Izvezi učesnike (CSV)** daje samo javne podatke. U javnom rasporedu filterima odaberite obuhvat i kliknite **Štampaj raspored**. Štampa koristi trenutno filtrirane mečeve.

## Sigurnost i pouzdanost

Serverske organizatorske funkcije završavaju donjom crtom i nisu dostupne preko `google.script.run`. Dodatno provjeravaju aktivnu vezanu tabelu i vlasnički e-mail iz Script Properties. Web app koji radi kao vlasnik ne dobija organizatorska ovlašćenja samo na osnovu effective-user identiteta. [Google: privatne funkcije](https://developers.google.com/apps-script/guides/html/communication).

V1 je podešena za vlasnika kao organizatora. Proširenje na dodatne organizatore traži usklađivanje liste `ORGANIZATORI`, dijeljenja tabele i zaštita; nemojte samo dodati e-mail u kod i očekivati da sve zaštite to prate. Svi editori vezanog Apps Script projekta mogu pristupiti kodu i privatnim podacima: to mora biti uski krug povjerenja.

Upisi koriste `ScriptLock`. Validacije i izmjene računaju se na kopiji podataka prije upisa. Privatni `_Transakcija` čuva prethodno stanje tokom višelistnog upisa; ako je prethodni upis prekinut, naredna operacija ga vraća prije javnog čitanja. To nije puna ACID baza i ne zaključava paralelno ručno uređivanje ćelija u Sheets. Tokom generisanja žrijeba i unosa rezultata ne radite paralelne direktne izmjene sistemskih listova. [Google: LockService](https://developers.google.com/apps-script/reference/lock/lock-service).

Formular ima serversku provjeru polja, roka, kapaciteta, duplog kontakta po kategoriji, potvrde verzije pravila, jednokratni token, minimalno vrijeme 2,5 sekunde, rok tokena 15 minuta, skriveno bot polje, limit 30 novih pokušaja prijave/minut i 120 tokena/minut za aplikaciju. Idempotentni ključ i otisak sadržaja sprečavaju dvostruki upis nakon ponovljenog klika ili izgubljenog odgovora. Cache ograničenja su osnovna zaštita, ne odbrana od ozbiljnog DDoS-a. Nema provjere vlasništva e-maila, SMS-a ili CAPTCHA servisa u v1.

Tekst se prikazuje escaped ili kroz `textContent`. Vrijednosti koje liče na formule u ćelijama i CSV-u dobijaju tekstualni prefiks. Javne API greške baze su generičke; privatni server detalji se ne prikazuju. `_Transakcija` je privatna, skrivena i zaštićena; skrivanje samo po sebi nije zaštita. [Google: zaštita opsega](https://developers.google.com/apps-script/reference/spreadsheet/protection).

## Granice prve verzije

- Singl eliminacija; grupna faza, dubl, match taj-brejk i automatski raspored su zasebna proširenja.
- Do 32 kategorije kroz meni, 256 učesnika po žrijebu i 10.000 redova po listu. To su zaštitne granice koda, ne dokaz performansi na tim maksimumima u Google okruženju. Praktičan kapacitet zavisi od Google kvota i obima baze. Čitanje je grupno po listu (`getValues` jednom po listu), ne po ćeliji.
- Nema e-mail potvrda, naplate, SMS-a, transfera uplata, administratorskog web panela ili obećanja trenutne sinhronizacije.
- Lokalni DEMO server čuva samo probne podatke u memoriji dok radi. Nije produkcija, ne koristiti stvarne kontakte niti ga izlagati internetu.
- Produkciona autorizacija, instaliranje okidača, zaštita ćelija, stvarni Google upis i anonimni pristup zahtijevaju završni test na vlasničkom nalogu.

## Razvoj

Potrebno je Node.js 20+ samo za lokalni pregled i testove; produkciji nije potreban Node ni lokalni računar.

```text
npm test
npm run preview
npm run package
```

Pregled: `http://127.0.0.1:4173`. Server sluša samo lokalni interfejs. Nema npm zavisnosti. Izvorne datoteke su `Schema.gs`, `Engine.gs`, `Code.gs`, `Demo.gs`, `Index.html`, `Styles.html`, `Client.html`, `appsscript.json`. Skripta za pakovanje generiše `apps-script/Code.gs` iz izvora i dokumentaciju strukture baze.

## Referenca: šta je provjereno

Dana 11.09.2026. u pregledniku je otvoren [referentni turnir](https://tenistim.ba/tournaments/d648cb84-a57d-4891-83c4-9608508528f3). Potvrđene su kartice Obavijesti, Žrijeb, Rezultati, Raspored i Pravila; žrijeb ima izbor kategorije/starosnog raspona i navigaciju po rundama. Rezultati prikazuju setove i predaje, a raspored ima pretragu i filtere kategorije, starosti, terena i dana. Kartica Pravila sadrži posebna pravila formata, uključujući dubl i odlučujući taj-brejk. Zatvorene prijave nisu omogućile provjeru aktivnog formulara.

Nisu provjereni administracija, čuvanje, autentifikacija, obrada prijava, privatnost API-ja ili pouzdanost te reference. To nisu tvrdnje o njenom backendu. Naša baza, odobravanje, zaštite, osvježavanje i organizatorski meni su implementacija dostavljene specifikacije. Nijedan stvarni igrač, fotografija, lokacija ili sponzor reference nije kopiran kao podatak ovog turnira.
