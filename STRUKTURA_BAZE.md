# Struktura Google Sheets baze

Generisano iz iste SCHEMA definicije koju koristi inicijalizacija. Primjeri datuma i imena služe samo da pokažu format, nisu stvarni podaci turnira.

ID je trajni UUID (izuzetak: jedini red Turnir ima ID TURNIR). Broj reda nije identitet. Ručno = izmjena ćelije; meni = kroz Tenis meni uz serverske provjere; sistem = automatski zaštićeno. Obaveznost važi za potpune zapise; početna baza namjerno ima prazne poslovne postavke i zatvorene prijave.

## Turnir

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | TURNIR | Jedan red |
| naziv | tekst | Da | ručno | Naziv turnira | Do 160 znakova |
| opis | tekst | Ne | ručno | — | Opis |
| lokacija | tekst | Ne | ručno | — | Javna lokacija |
| datum_od | datum | Ne | ručno | 2027-06-10 | ISO YYYY-MM-DD |
| datum_do | datum | Ne | ručno | 2027-06-12 | ISO YYYY-MM-DD |
| rok_prijave | datum-vrijeme | Da | ručno | 2027-06-09T20:00:00+02:00 | ISO sa vremenskom zonom |
| status_prijava | izbor | Da | ručno | Zatvorene | Zatvorene, Otvorene |
| kontakt_javni | tekst | Ne | ručno | — | Samo kontakt namijenjen objavi |
| pravila | tekst | Da | ručno | — | Obavezno prije otvaranja prijava |
| obrada_podataka | tekst | Da | ručno | — | Organizator, svrha, podaci, javna polja, rok čuvanja i kontakt za zahtjeve |
| verzija_pravila | tekst | Da | ručno | 1 | Promijeniti nakon izmjene pravila ili obavještenja |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Kategorije

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | CAT-uuid | Prijave/Ucesnici/Zrijeb/Mecevi.kategorija_id |
| naziv | tekst | Da | ručno | Singl | Naziv kategorije |
| format | izbor | Da | ručno | Singl eliminacija | Singl eliminacija |
| limit_ucesnika | broj | Da | ručno | 32 | Cijeli broj 2–256 |
| kotizacija | broj | Da | ručno | 0 | Broj >= 0; 0 bez kotizacije |
| valuta | tekst | Da | ručno | KM | Oznaka valute |
| aktivna | boolean | Da | ručno | false | TRUE/FALSE |
| lista_cekanja | boolean | Da | ručno | false | TRUE/FALSE |
| setovi_za_pobjedu | broj | Da | ručno | 2 | 1–3 |
| gemovi_u_setu | broj | Da | ručno | 6 | 1–12 |
| tajbrejk_na | broj | Da | ručno | 6 | Mora biti jednako gemovi_u_setu u v1 |
| tajbrejk_poeni | broj | Da | ručno | 7 | 5–15; razlika dva |
| trajanje_min | broj | Da | ručno | 90 | 15–600 |
| pravila | tekst | Ne | ručno | — | Dodatna pravila; bez superseta ili odlučujućeg match taj-brejka u v1 |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Prijave

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | uuid | Ucesnici.prijava_id |
| zahtjev_id | ID | Da | sistem | uuid | Jedinstven ključ ponovljenog zahtjeva |
| otisak | tekst | Da | sistem | SHA-256 | Provjera istog sadržaja pri ponovljenom zahtjevu |
| ime_prezime | tekst | Da | sistem | DEMO Igrač 1 | Do 100 znakova; privatno do odobrenja |
| email | tekst | Da | sistem | demo@example.invalid | Privatno; normalizovano |
| telefon | tekst | Da | sistem | +38760000001 | Privatno; 7–15 cifara |
| kategorija_id | ID | Da | sistem | CAT-uuid | Kategorije.id |
| klub_grad | tekst | Ne | sistem | — | Javno nakon odobrenja |
| napomena | tekst | Ne | sistem | — | Privatno; do 1000 znakova |
| vrijeme_prijave | datum-vrijeme | Da | sistem | — | ISO UTC |
| status | izbor | Da | meni | Na čekanju | Na čekanju, Odobrena, Odbijena, Lista čekanja |
| verzija_pravila | tekst | Da | sistem | 1 | Verzija prihvaćenog teksta |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Ucesnici

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | uuid | Zrijeb.ucesnik_id; Mecevi.igrac1_id/igrac2_id/pobjednik_id |
| prijava_id | ID | Da | sistem | uuid | Prijave.id; nije javno |
| javno_ime | tekst | Da | meni | DEMO Igrač 1 | Do 100 znakova |
| kategorija_id | ID | Da | sistem | CAT-uuid | Kategorije.id |
| klub_grad | tekst | Ne | meni | — | Javno; do 100 znakova |
| nosilac | broj | Ne | meni | 1 | Uzastopni brojevi 1..N; bez duplikata |
| status | izbor | Da | meni | Aktivan | Aktivan, Povučen |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Tereni

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | uuid | Mecevi.teren_id |
| naziv | tekst | Da | ručno | Teren 1 | Naziv |
| lokacija | tekst | Ne | ručno | — | Lokacija |
| aktivan | boolean | Da | ručno | false | TRUE/FALSE |
| dostupan_od | datum-vrijeme | Ne | ručno | — | ISO sa vremenskom zonom; prazno bez donje granice |
| dostupan_do | datum-vrijeme | Ne | ručno | — | ISO sa vremenskom zonom; prazno bez gornje granice |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Zrijeb

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | uuid | ID pozicije |
| zrijeb_id | ID | Da | sistem | uuid | Mecevi.zrijeb_id |
| kategorija_id | ID | Da | sistem | CAT-uuid | Kategorije.id |
| pozicija | broj | Da | sistem | 1 | Jedinstvena u žrijebu |
| ucesnik_id | ID | Ne | sistem | uuid | Ucesnici.id; prazno BYE |
| nosilac | broj | Ne | sistem | 1 | Snimak nosioca pri žrijebu |
| slobodan_prolaz | boolean | Da | sistem | false | Prazna pozicija |
| objavljen | boolean | Da | meni | false | Meni objavljuje cijeli žrijeb |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Mecevi

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | uuid | Veze narednih rundi |
| zrijeb_id | ID | Da | sistem | uuid | Zrijeb.zrijeb_id |
| kategorija_id | ID | Da | sistem | CAT-uuid | Kategorije.id |
| runda | broj | Da | sistem | 1 | 1 je prva runda |
| pozicija | broj | Da | sistem | 1 | Pozicija unutar runde |
| igrac1_id | ID | Ne | sistem | uuid | Ucesnici.id |
| igrac2_id | ID | Ne | sistem | uuid | Ucesnici.id |
| izvor1_id | ID | Ne | sistem | uuid | Mecevi.id prethodne runde |
| izvor2_id | ID | Ne | sistem | uuid | Mecevi.id prethodne runde |
| teren_id | ID | Ne | meni | uuid | Tereni.id |
| pocetak | datum-vrijeme | Ne | meni | 2027-06-10T10:00:00+02:00 | ISO sa vremenskom zonom |
| trajanje_min | broj | Da | meni | 90 | 15–600; procjena |
| status | izbor | Da | meni | Zakazan | Zakazan, U toku, Završen, Odgođen, Otkazan |
| setovi | tekst | Ne | meni | 6-4 7-6(7-5) | Setovi orijentisani igrač1–igrač2; taj-brejk oba poena |
| ishod | izbor | Ne | meni | Regularno | Regularno, Predaja, Bez igre, Slobodan prolaz |
| pobjednik_id | ID | Ne | sistem | uuid | Jedan od protivnika; automatski prolazak |
| demo | boolean | Da | sistem | false | DEMO oznaka |
| pravila_json | tekst | Da | sistem | {"setovi_za_pobjedu":2,"gemovi_u_setu":6,"tajbrejk_na":6,"tajbrejk_poeni":7} | Snimak pravila prilikom žrijeba; ne mijenjati |

## Obavjestenja

| Kolona | Tip | Obavezno | Unos | Primjer | Validacija / veza |
|---|---|---|---|---|---|
| id | ID | Da | sistem | uuid | Stabilan ID |
| naslov | tekst | Da | ručno | — | Naslov |
| tekst | tekst | Da | ručno | — | Običan tekst; bez HTML-a |
| datum | datum-vrijeme | Da | ručno | — | ISO sa vremenskom zonom |
| prioritet | broj | Da | ručno | 1 | 1 obična, 2 važna, 3 hitna |
| status | izbor | Da | ručno | Nacrt | Nacrt, Objavljeno |
| demo | boolean | Da | sistem | false | DEMO oznaka |

## Veze i dodatne kontrole

- Turnir: tačno jedan red; verzija pravila se mijenja uz novu saglasnost igrača.
- Kategorije: stabilan roditelj prijava, učesnika i žrijeba. U v1 jedna generacija žrijeba po kategoriji.
- Prijave.id → Ucesnici.prijava_id je veza najviše jedan-na-jedan; ponovljeno odobrenje ne dodaje duplikat.
- Ucesnici.id → Zrijeb.ucesnik_id i Mecevi.igrac1_id / igrac2_id / pobjednik_id.
- Mecevi.izvor1_id / izvor2_id upućuju na prethodnu rundu; pobjednik se prenosi serverski.
- Tereni.id → Mecevi.teren_id. Preklapanje intervala se odbija prije upisa.
- Zrijeb.zrijeb_id → Mecevi.zrijeb_id grupiše objavljivanje; bez objavljenog žrijeba mečevi nisu javni.
- Padajuće liste i boolean validacije postavlja initialize_. ID veze provjeravaju generisanje i meniji; ne dodavati redove ručno. Brojčani rasponi imaju Sheets validaciju, dodatne cjelobrojne i poslovne kontrole su na serveru.
- Datumi su običan tekst u ISO formatu. Datumi i rok u Turnir imaju primjere u napomeni kolone; server prijave odbija nepodešen/neispravan rok. Početak meča mora imati eksplicitnu zonu.
- Setovi su tekst u redoslijedu igrač1–igrač2, poeni taj-brejka npr. 7-6(7-5). Sačuvani JSON pravila meča sprečava naknadnu promjenu pravila provjere rezultata.
- Skriveni _Transakcija nije poslovni list i nema javni API. A1 je marker stanja; naredni redovi privremeno sadrže JSON djelove prethodnog stanja. Ne uređivati.
- Grupe nisu uključene jer v1 ne podržava grupnu fazu.
