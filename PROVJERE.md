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

## Google produkcijska provjera

Potvrđeno je: inicijalizacija listova, meni, OAuth, javni `/exec` uz Execute as Me i pristup Anyone, privatna tabela sa ograničenim saradnicima, čitanje stvarnih Sheets podataka, prikaz označenog DEMO turnira, uklanjanje DEMO podataka i završno prazno stanje sa zatvorenim prijavama.

Sljedeće provjere zavise od stvarnih postavki turnira i nisu simulirane kao produkcijske činjenice:

1. Upis sa javnog uređaja stiže u stvarni Prijave list; ponovljen klik ne dodaje drugi red.
2. Odobravanje iz menija pojavljuje se na drugom uređaju pri osvježavanju, bez nove objave.
3. Nacrt stvarnog žrijeba nije javan; objava ga otkriva. Nosioci, BYE i rezultati prelaze u sljedeću rundu.
4. Preklop stvarnih termina se odbija bez djelimičnih izmjena; ispravka pobjednika blokira se nakon početka narednog meča.
5. Na stvarnom telefonu provjeriti dodir, tastaturu formulara, štampu/PDF rasporeda i CSV preuzimanje iz Google dijaloga.

## Operativna ograničenja

Produkcijska objava, OAuth i čitanje Sheets baze su potvrđeni. Nisu izvršeni testovi stvarnih Google kvota niti maksimalnog dozvoljenog obima.

Puna Google transakcija ne postoji: journal i ScriptLock štite tok aplikacije, ali ne sprečavaju vlasnika da istovremeno direktno prepisuje zaštićene ćelije. V1 zato zahtijeva da se sistemski listovi mijenjaju isključivo kroz meni. Nema otpornosti na ozbiljan DoS niti verifikacije e-mail vlasništva. Objavljivanje promjena koda i davanje Google dozvola rade se odvojeno od dnevnog unosa podataka.
