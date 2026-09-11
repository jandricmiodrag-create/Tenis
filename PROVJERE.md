# Provjere i granice dokaza

Datum: 11.09.2026.

## Automatizovano — lokalno, 23 testa prošla

Pokretanje: `node --test tests/*.test.cjs`. Testovi rade bez mreže i bez trećih biblioteka. `engine.test.cjs` provjerava poslovna pravila; `server.test.cjs` izvršava stvarne funkcije iz `Code.gs`, uz simulirane Apps Script servise. Ovo nisu testovi na Google infrastrukturi.

| Scenarij | Rezultat i dokaz |
|---|---|
| Nova prijava | Status Na čekanju, normalizovan kontakt, upis reda kroz serverski handler |
| Ponovljen zahtjev | Isti ID i sadržaj vraćaju isti broj prijave, bez drugog reda; promijenjeni sadržaj se odbija |
| Dupli kontakt | Ponovljen e-mail ili telefon u istoj kategoriji odbijen |
| Zatvorene prijave | Odbijanje zatvorenog statusa, isteklog/praznog roka, neaktivne kategorije i nevažeće potvrde pravila |
| Popunjena kategorija | Na čekanju rezerviše kapacitet; opciona lista čekanja, inače odbijanje |
| Odobrenje | Kreira jednog učesnika; ponovljeno odobrenje ga ne duplira; odbijanje uklanja javnu podobnost |
| Osvježavanje poslije izmjene | Stvarni getPublicData handler čita izmijenjenu simuliranu tabelu nakon edited_ invalidacije |
| Žrijeb | Za svaki broj igrača od 2 do 256: jedinstvene pozicije, ispravan broj slobodnih prolaza, n−1 takmičarskih mečeva, nosioci 1 i 2 u suprotnim polovinama |
| Nepravilan žrijeb | Jedan učesnik i dupli nosioci odbijeni; već formiran žrijeb se ne prepisuje |
| Prolazak | Pobjednik popunjava sljedeću rundu; promjena pobjednika čisti zavisne termine |
| Ispravka konflikta | Naredni započeti meč blokira promjenu; poništavanje unazad omogućava ispravku |
| Setovi i ishodi | Regularan rezultat, predaja, bez igre, validni/nevalidni taj-brejk i višak setova |
| Raspored | Preklapanje terena i igrača odbijeno; uzastopni intervali dozvoljeni; isti kontakt u više kategorija prepoznat |
| Privatnost | Javni allowlist isključuje e-mail, telefon, napomene, prijava_id, zahtjev_id, otisak i nepoznata buduća polja |
| Ovlašćenja | Organizatorski mutate_ odbija web kontekst i kada je e-mail izvršavanja vlasnički |
| Javne funkcije | Samo doGet, getPublicData, getRegistrationChallenge, submitRegistration i bezopasni meni onOpen; organizatorske funkcije završavaju sa _ |
| Formula injection | Tekstualni prefiks za =, +, -, @, uključujući početni whitespace |
| Prekid baze | Javna greška bez internog teksta; lock se oslobađa |
| Prekinuti višelistni upis | PENDING journal vraća prethodno stanje prije javnog čitanja |
| Zaštita obrasca | Istekao/nedostajući token, honeypot i limit pokušaja odbijeni |

## Preglednik — lokalni DEMO

Potvrđeno kroz interakciju, uz isključivo izmišljene podatke:

- Učitavanje javnog pregleda na lokalnoj adresi i prikaz obavezne DEMO oznake.
- Vizuelni pregled desktop stranice i mobilnog prikaza 390 × 844.
- Mobilna prijava izmišljenog igrača: potvrda tek poslije odgovora servera, status Na čekanju i ID prijave; izričito označeno da nije stvarna prijava.
- Žrijeb: filtriranje na finale; prikaz slobodnih prolaza, rezultata po setovima i pobjednika.
- Pretraga učesnika vraća traženog DEMO igrača; filter statusa rasporeda vraća završene mečeve. Nisu zabilježene greške ni upozorenja u konzoli tokom provjere.
- Simulirani prekid veze: ostaje prethodni prikaz i pojavljuje se vrijeme posljednjih uspješnih podataka; obnovom veze osvježavanje ponovo radi.
- Mobilni žrijeb nema horizontalni overflow cijele stranice; navigacija i izbor runde imaju namjerno horizontalno pomjeranje unutar svojih traka.

Sintaksa svih .gs datoteka, Client JavaScripta i JSON manifesta provjerena je prilikom generisanja paketa. Paket nema npm zavisnosti.

## Obavezno završiti na Google nalogu

Nema dostavljene stvarne tabele niti instaliranog Apps Script projekta, pa nijednu stavku ispod ne predstavljamo kao završenu:

1. initialize_ stvarno kreira sve listove, bilješke, padajuće liste, zaštite i edit okidač.
2. Web app /exec radi anonimno uz Execute as Me, a Google Sheets nije javno dijeljen.
3. Upis sa jednog uređaja stiže u stvarni Prijave list; ponovljen klik ne dodaje drugi red.
4. Odobravanje iz menija pojavljuje se na drugom uređaju pri osvježavanju, bez nove objave.
5. Zatvaranje prijava i puna kategorija odbijaju upis i uz direktan poziv javnoj funkciji.
6. Nacrt žrijeba nije javan; objava ga otkriva. Nosioci, BYE i rezultati prelaze u sljedeću rundu.
7. Preklop termina se odbija bez djelimičnih izmjena; ispravka pobjednika blokira se nakon početka narednog meča.
8. U mrežnom odgovoru getPublicData nema privatnih kontakata. Poziv organizatorskoj funkciji preko google.script.run nije dostupan.
9. Prekid mreže i ponovni pristup pokazuju jasno stanje; prava Google greška ne otkriva privatne podatke.
10. U browseru na stvarnom telefonu provjeriti veličinu teksta, dodir, tastaturu formulara, štampu/PDF rasporeda i CSV preuzimanje iz Google dijaloga.

## Operativna ograničenja

Nema potvrđene produkcione objave, testa stvarnih Google kvota ni garancije rada sa maksimalnim dozvoljenim obimom. Simulacija ne dokazuje OAuth, pristup Sheets servisima, stvarnu primjenu zaštita ili pouzdanost Google okidača. Privatnost i administracija su provjerene u kodu i lokalnim testovima; produkciona provjera javnog deploymenta ostaje obavezna.

Puna Google transakcija ne postoji: journal i ScriptLock štite tok aplikacije, ali ne sprečavaju vlasnika da istovremeno direktno prepisuje zaštićene ćelije. V1 zato zahtijeva da se sistemski listovi mijenjaju isključivo kroz meni. Nema otpornosti na ozbiljan DoS niti verifikacije e-mail vlasništva. Objavljivanje promjena koda i davanje Google dozvola rade se odvojeno od dnevnog unosa podataka.
