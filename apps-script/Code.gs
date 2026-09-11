// ===== Schema.gs =====
/* Column definition: name, type, required, owner, example, validation / reference. */
var SCHEMA = {
 Turnir: [
 ['id','ID',true,'sistem','TURNIR','Jedan red'],['naziv','tekst',true,'ručno','Naziv turnira','Do 160 znakova'],['opis','tekst',false,'ručno','','Opis'],['lokacija','tekst',false,'ručno','','Javna lokacija'],['datum_od','datum',false,'ručno','2027-06-10','ISO YYYY-MM-DD'],['datum_do','datum',false,'ručno','2027-06-12','ISO YYYY-MM-DD'],['rok_prijave','datum-vrijeme',true,'ručno','2027-06-09T20:00:00+02:00','ISO sa vremenskom zonom'],['status_prijava','izbor',true,'ručno','Zatvorene',['Zatvorene','Otvorene']],['kontakt_javni','tekst',false,'ručno','','Samo kontakt namijenjen objavi'],['pravila','tekst',true,'ručno','','Obavezno prije otvaranja prijava'],['obrada_podataka','tekst',true,'ručno','','Organizator, svrha, podaci, javna polja, rok čuvanja i kontakt za zahtjeve'],['verzija_pravila','tekst',true,'ručno','1','Promijeniti nakon izmjene pravila ili obavještenja'],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Kategorije: [
 ['id','ID',true,'sistem','CAT-uuid','Prijave/Ucesnici/Zrijeb/Mecevi.kategorija_id'],['naziv','tekst',true,'ručno','Singl','Naziv kategorije'],['format','izbor',true,'ručno','Singl eliminacija',['Singl eliminacija']],['limit_ucesnika','broj',true,'ručno',32,'Cijeli broj 2–256'],['kotizacija','broj',true,'ručno',0,'Broj >= 0; 0 bez kotizacije'],['valuta','tekst',true,'ručno','KM','Oznaka valute'],['aktivna','boolean',true,'ručno',false,'TRUE/FALSE'],['lista_cekanja','boolean',true,'ručno',false,'TRUE/FALSE'],['setovi_za_pobjedu','broj',true,'ručno',2,'1–3'],['gemovi_u_setu','broj',true,'ručno',6,'1–12'],['tajbrejk_na','broj',true,'ručno',6,'Mora biti jednako gemovi_u_setu u v1'],['tajbrejk_poeni','broj',true,'ručno',7,'5–15; razlika dva'],['trajanje_min','broj',true,'ručno',90,'15–600'],['pravila','tekst',false,'ručno','','Dodatna pravila; bez superseta ili odlučujućeg match taj-brejka u v1'],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Prijave: [
 ['id','ID',true,'sistem','uuid','Ucesnici.prijava_id'],['zahtjev_id','ID',true,'sistem','uuid','Jedinstven ključ ponovljenog zahtjeva'],['otisak','tekst',true,'sistem','SHA-256','Provjera istog sadržaja pri ponovljenom zahtjevu'],['ime_prezime','tekst',true,'sistem','DEMO Igrač 1','Do 100 znakova; privatno do odobrenja'],['email','tekst',true,'sistem','demo@example.invalid','Privatno; normalizovano'],['telefon','tekst',true,'sistem','+38760000001','Privatno; 7–15 cifara'],['kategorija_id','ID',true,'sistem','CAT-uuid','Kategorije.id'],['klub_grad','tekst',false,'sistem','','Javno nakon odobrenja'],['napomena','tekst',false,'sistem','','Privatno; do 1000 znakova'],['vrijeme_prijave','datum-vrijeme',true,'sistem','','ISO UTC'],['status','izbor',true,'meni','Na čekanju',['Na čekanju','Odobrena','Odbijena','Lista čekanja']],['verzija_pravila','tekst',true,'sistem','1','Verzija prihvaćenog teksta'],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Ucesnici: [
 ['id','ID',true,'sistem','uuid','Zrijeb.ucesnik_id; Mecevi.igrac1_id/igrac2_id/pobjednik_id'],['prijava_id','ID',true,'sistem','uuid','Prijave.id; nije javno'],['javno_ime','tekst',true,'meni','DEMO Igrač 1','Do 100 znakova'],['kategorija_id','ID',true,'sistem','CAT-uuid','Kategorije.id'],['klub_grad','tekst',false,'meni','','Javno; do 100 znakova'],['nosilac','broj',false,'meni',1,'Uzastopni brojevi 1..N; bez duplikata'],['status','izbor',true,'meni','Aktivan',['Aktivan','Povučen']],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Tereni: [
 ['id','ID',true,'sistem','uuid','Mecevi.teren_id'],['naziv','tekst',true,'ručno','Teren 1','Naziv'],['lokacija','tekst',false,'ručno','','Lokacija'],['aktivan','boolean',true,'ručno',false,'TRUE/FALSE'],['dostupan_od','datum-vrijeme',false,'ručno','','ISO sa vremenskom zonom; prazno bez donje granice'],['dostupan_do','datum-vrijeme',false,'ručno','','ISO sa vremenskom zonom; prazno bez gornje granice'],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Zrijeb: [
 ['id','ID',true,'sistem','uuid','ID pozicije'],['zrijeb_id','ID',true,'sistem','uuid','Mecevi.zrijeb_id'],['kategorija_id','ID',true,'sistem','CAT-uuid','Kategorije.id'],['pozicija','broj',true,'sistem',1,'Jedinstvena u žrijebu'],['ucesnik_id','ID',false,'sistem','uuid','Ucesnici.id; prazno BYE'],['nosilac','broj',false,'sistem',1,'Snimak nosioca pri žrijebu'],['slobodan_prolaz','boolean',true,'sistem',false,'Prazna pozicija'],['objavljen','boolean',true,'meni',false,'Meni objavljuje cijeli žrijeb'],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Mecevi: [
 ['id','ID',true,'sistem','uuid','Veze narednih rundi'],['zrijeb_id','ID',true,'sistem','uuid','Zrijeb.zrijeb_id'],['kategorija_id','ID',true,'sistem','CAT-uuid','Kategorije.id'],['runda','broj',true,'sistem',1,'1 je prva runda'],['pozicija','broj',true,'sistem',1,'Pozicija unutar runde'],['igrac1_id','ID',false,'sistem','uuid','Ucesnici.id'],['igrac2_id','ID',false,'sistem','uuid','Ucesnici.id'],['izvor1_id','ID',false,'sistem','uuid','Mecevi.id prethodne runde'],['izvor2_id','ID',false,'sistem','uuid','Mecevi.id prethodne runde'],['teren_id','ID',false,'meni','uuid','Tereni.id'],['pocetak','datum-vrijeme',false,'meni','2027-06-10T10:00:00+02:00','ISO sa vremenskom zonom'],['trajanje_min','broj',true,'meni',90,'15–600; procjena'],['status','izbor',true,'meni','Zakazan',['Zakazan','U toku','Završen','Odgođen','Otkazan']],['setovi','tekst',false,'meni','6-4 7-6(7-5)','Setovi orijentisani igrač1–igrač2; taj-brejk oba poena'],['ishod','izbor',false,'meni','Regularno',['Regularno','Predaja','Bez igre','Slobodan prolaz']],['pobjednik_id','ID',false,'sistem','uuid','Jedan od protivnika; automatski prolazak'],['demo','boolean',true,'sistem',false,'DEMO oznaka']],
 Obavjestenja: [
 ['id','ID',true,'sistem','uuid','Stabilan ID'],['naslov','tekst',true,'ručno','','Naslov'],['tekst','tekst',true,'ručno','','Običan tekst; bez HTML-a'],['datum','datum-vrijeme',true,'ručno','','ISO sa vremenskom zonom'],['prioritet','broj',true,'ručno',1,'1 obična, 2 važna, 3 hitna'],['status','izbor',true,'ručno','Nacrt',['Nacrt','Objavljeno']],['demo','boolean',true,'sistem',false,'DEMO oznaka']]
};
SCHEMA.Mecevi.push(['pravila_json','tekst',true,'sistem','{"setovi_za_pobjedu":2,"gemovi_u_setu":6,"tajbrejk_na":6,"tajbrejk_poeni":7}','Snimak pravila prilikom žrijeba; ne mijenjati']);


// ===== Engine.gs =====
/* Pure tournament rules. No browser-callable top-level functions. */
var Engine = (function () {
  function fail(message) { throw new Error(message); }
  function yes(v) { return v === true || v === 'TRUE' || v === 'DA'; }
  function integer(v, min, max, label) { var n = Number(v); if (!Number.isInteger(n) || n < min || n > max) fail(label + ': neispravna vrijednost.'); return n; }
  function text(v, max, required) { v = String(v == null ? '' : v).trim(); if ((required && !v) || v.length > max) fail('Provjerite obavezna polja i dužinu unosa.'); return v; }
  function safeCell(v) { return typeof v === 'string' && /^[\s]*[=+@\-]/.test(v) ? "'" + v : v; }
  function rules(c) {integer(c.setovi_za_pobjedu,1,3,'Setovi za pobjedu');var games=integer(c.gemovi_u_setu,1,12,'Gemovi u setu');if(integer(c.tajbrejk_na,1,12,'Taj-brejk na')!==games)fail('Taj-brejk mora biti podešen na broju gemova za set.');integer(c.tajbrejk_poeni,5,15,'Poeni taj-brejka');integer(c.trajanje_min,15,600,'Trajanje');if(!Number.isFinite(Number(c.kotizacija))||Number(c.kotizacija)<0)fail('Kotizacija nije ispravno podešena.');}
  function activeApplications(db, category) { return db.Prijave.filter(function (r) { return r.kategorija_id === category && ['Na čekanju','Odobrena'].indexOf(r.status) >= 0; }); }
  function validateRegistration(db, input, now) {
    var t = db.Turnir[0] || {}, c = db.Kategorije.find(function (r) { return r.id === input.kategorija_id; });
    if (t.status_prijava !== 'Otvorene') fail('Prijave su zatvorene.');
    if (!t.rok_prijave || !Number.isFinite(Date.parse(t.rok_prijave))) fail('Organizator još nije podesio rok prijave.');
    if (now > Date.parse(t.rok_prijave)) fail('Rok za prijavu je istekao.');
    if (!t.pravila || !t.obrada_podataka || !t.verzija_pravila) fail('Organizator još nije objavio pravila i obavještenje o obradi podataka.');
    if (!c || !yes(c.aktivna)) fail('Kategorija nije dostupna.');
    rules(c);
    if (db.Zrijeb.some(function (z) { return z.kategorija_id === c.id; })) fail('Žrijeb je formiran. Prijave za ovu kategoriju su zaključane.');
    var r = {ime_prezime:text(input.ime_prezime,100,true),email:text(input.email,160,true).toLowerCase(),telefon:text(input.telefon,32,true),kategorija_id:c.id,klub_grad:text(input.klub_grad,100,false),napomena:text(input.napomena,1000,false)};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) fail('Unesite ispravnu e-mail adresu.');
    r.telefon = r.telefon.replace(/[\s()\-.]/g,'');
    if (!/^\+?[0-9]{7,15}$/.test(r.telefon)) fail('Unesite ispravan broj telefona.');
    if (input.saglasnost !== true || input.verzija_pravila !== t.verzija_pravila) fail('Pročitajte važeća pravila i obavještenje, pa potvrdite prihvatanje.');
    if (db.Prijave.some(function (p) { return p.kategorija_id === c.id && p.status !== 'Odbijena' && (p.email.toLowerCase() === r.email || p.telefon === r.telefon); })) fail('Prijava sa ovim kontaktom već postoji u kategoriji. Obratite se organizatoru.');
    var full = activeApplications(db,c.id).length >= integer(c.limit_ucesnika,2,256,'Limit učesnika');
    if (full && !yes(c.lista_cekanja)) fail('Kategorija je popunjena. Lista čekanja nije uključena.');
    r.status = full ? 'Lista čekanja' : 'Na čekanju'; r.verzija_pravila = t.verzija_pravila;
    return r;
  }
  function approve(db, id, status, uid) {
    var p = db.Prijave.find(function (r) { return r.id === id; }); if (!p) fail('Prijava ne postoji.');
    if (['Odobrena','Odbijena','Lista čekanja','Na čekanju'].indexOf(status) < 0) fail('Nepoznat status.');
    var u = db.Ucesnici.find(function (r) { return r.prijava_id === id; });
    if (db.Zrijeb.some(function (z) { return z.kategorija_id === p.kategorija_id; })) fail('Žrijeb je zaključao sastav kategorije.');
    var c = db.Kategorije.find(function (r) { return r.id === p.kategorija_id; }); if (!c) fail('Kategorija ne postoji.');
    if (status === 'Odobrena') {
      if (db.Ucesnici.filter(function (r) { return r.kategorija_id === c.id && r.status === 'Aktivan' && (!u || r.id !== u.id); }).length >= Number(c.limit_ucesnika)) fail('Nema slobodnih mjesta.');
      if (!u) { u = {id:uid(),prijava_id:p.id,javno_ime:p.ime_prezime,kategorija_id:p.kategorija_id,klub_grad:p.klub_grad,nosilac:'',demo:p.demo || false}; db.Ucesnici.push(u); }
      u.status = 'Aktivan';
    } else if (u) u.status = 'Povučen';
    p.status = status;
  }
  function shuffle(a, random) { for (var i=a.length-1;i>0;i--) { var j=Math.floor(random()*(i+1)),v=a[i]; a[i]=a[j];a[j]=v; } return a; }
  function seedOrder(size) { var a=[1,2]; while(a.length<size) { var n=a.length*2+1; a=a.reduce(function(out,v){return out.concat([v,n-v]);},[]); } return a; }
  function generateDraw(db, categoryId, uid, random) {
    if (db.Zrijeb.some(function(z){return z.kategorija_id===categoryId;})) fail('Žrijeb već postoji. Prepisivanje nije dozvoljeno.');
    var c=db.Kategorije.find(function(x){return x.id===categoryId;}); if(!c || c.format!=='Singl eliminacija') fail('Podržan je samo singl eliminacioni sistem.');
    rules(c);
    var players=db.Ucesnici.filter(function(p){return p.kategorija_id===categoryId && p.status==='Aktivan' && db.Prijave.some(function(a){return a.id===p.prijava_id && a.status==='Odobrena';});});
    if(players.length<2 || players.length>256) fail('Potrebno je od 2 do 256 odobrenih učesnika.');
    var seeds={}, unseeded=[]; players.forEach(function(p){if(p.nosilac!=='' && p.nosilac!=null){var n=integer(p.nosilac,1,players.length,'Nosilac');if(seeds[n])fail('Dupliran broj nosioca.');seeds[n]=p;}else unseeded.push(p);});
    var count=Object.keys(seeds).length;for(var s=1;s<=count;s++)if(!seeds[s])fail('Nosioci moraju biti uzastopni: 1, 2, 3…');
    shuffle(unseeded,random); var ranked=[];for(var k=1;k<=players.length;k++) ranked.push(seeds[k] || unseeded.shift());
    var size=Math.pow(2,Math.ceil(Math.log2(players.length))), order=seedOrder(size), drawId=uid(), rounds=Math.log2(size), previous=[];
    for(var round=1;round<=rounds;round++) {
      var current=[];
      for(var j=0;j<size/Math.pow(2,round);j++) {
        var m={id:uid(),zrijeb_id:drawId,kategorija_id:categoryId,runda:round,pozicija:j+1,igrac1_id:'',igrac2_id:'',izvor1_id:'',izvor2_id:'',teren_id:'',pocetak:'',trajanje_min:Number(c.trajanje_min)||90,status:'Zakazan',setovi:'',ishod:'',pobjednik_id:'',demo:yes(c.demo)};
        if(round===1){ m.igrac1_id=ranked[order[j*2]-1]?.id || '';m.igrac2_id=ranked[order[j*2+1]-1]?.id || ''; if(!m.igrac1_id || !m.igrac2_id){m.status='Završen';m.ishod='Slobodan prolaz';m.pobjednik_id=m.igrac1_id||m.igrac2_id;} }
        else {m.izvor1_id=previous[j*2].id;m.izvor2_id=previous[j*2+1].id;m.igrac1_id=previous[j*2].pobjednik_id;m.igrac2_id=previous[j*2+1].pobjednik_id;}
        m.pravila_json=JSON.stringify({setovi_za_pobjedu:c.setovi_za_pobjedu,gemovi_u_setu:c.gemovi_u_setu,tajbrejk_na:c.tajbrejk_na,tajbrejk_poeni:c.tajbrejk_poeni});
        db.Mecevi.push(m);current.push(m);
      } previous=current;
    }
    order.forEach(function(rank,i){var p=ranked[rank-1];db.Zrijeb.push({id:uid(),zrijeb_id:drawId,kategorija_id:categoryId,pozicija:i+1,ucesnik_id:p?p.id:'',nosilac:p?p.nosilac:'',slobodan_prolaz:!p,objavljen:false,demo:yes(c.demo)});});
    return drawId;
  }
  function validateScore(m,c,score,outcome,winner) {
    if(!m.igrac1_id || !m.igrac2_id) fail('Oba protivnika moraju biti poznata.');
    if([m.igrac1_id,m.igrac2_id].indexOf(winner)<0) fail('Pobjednik mora biti protivnik u meču.');
    if(['Regularno','Predaja','Bez igre'].indexOf(outcome)<0) fail('Nepoznat ishod.');
    if(outcome==='Bez igre') {if(String(score).trim())fail('Pobjeda bez igre nema setove.');return;}
    var target=integer(c.setovi_za_pobjedu,1,3,'Setovi za pobjedu'),games=integer(c.gemovi_u_setu,1,12,'Gemovi u setu'),tb=integer(c.tajbrejk_na,1,12,'Taj-brejk na');
    if(tb!==games) fail('Prva verzija podržava taj-brejk na broju gemova za set.');
    integer(c.tajbrejk_poeni,5,15,'Poeni taj-brejka');
    var sets=String(score).trim()?String(score).trim().split(/\s+/):[], wins=[0,0];
    if(outcome==='Regularno'&&!sets.length)fail('Unesite rezultat po setovima.');
    if(sets.length>target*2-1)fail('Previše setova.');
    sets.forEach(function(set,index){
      if(wins.some(function(w){return w>=target;}))fail('Meč je završen prije posljednjeg seta.');
      var parts=/^(\d{1,2})-(\d{1,2})(?:\((\d{1,3})-(\d{1,3})\))?$/.exec(set);if(!parts)fail('Format: 6-4 7-6(7-5). Taj-brejk upisati sa poenima oba igrača.');
      var a=+parts[1],b=+parts[2],high=Math.max(a,b),low=Math.min(a,b), side=a>b?0:1;
      var complete=(high===games&&low<=games-2)||(high===games+1&&low===games-1);
      if(high===tb+1&&low===tb){var x=+parts[3],y=+parts[4],h=Math.max(x,y),l=Math.min(x,y),points=+c.tajbrejk_poeni;
        if(!parts[3] || ((a>b)!==(x>y)) || !(h===points&&l<=points-2 || h>points&&h-l===2))fail('Neispravni poeni taj-brejka.');complete=true;
      }else if(parts[3])fail('Poeni taj-brejka pripadaju samo setu dobijenom taj-brejkom.');
      if(complete)wins[side]++;
      else if(!(outcome==='Predaja' && index===sets.length-1 && high<=games && !(high===games&&low<=games-2)))fail('Neispravan ili nezavršen set.');
    });
    if(outcome==='Regularno' && (wins[winner===m.igrac1_id?0:1]!==target || wins[winner===m.igrac1_id?1:0]>=target))fail('Rezultat ne odgovara pobjedniku.');
    if(outcome==='Predaja'&&wins.some(function(w){return w===target;}))fail('Meč je već završen regularno.');
  }
  function descendants(db,id) {var out=[];function visit(x){db.Mecevi.filter(function(m){return m.izvor1_id===x||m.izvor2_id===x;}).forEach(function(m){out.push(m);visit(m.id);});}visit(id);return out;}
  function result(db,id,score,outcome,winner) {
    var m=db.Mecevi.find(function(x){return x.id===id;});if(!m)fail('Meč ne postoji.');
    if(m.ishod==='Slobodan prolaz')fail('Slobodan prolaz nije rezultat za ručni unos.');
    var c=m.pravila_json?JSON.parse(m.pravila_json):db.Kategorije.find(function(x){return x.id===m.kategorija_id;});validateScore(m,c,score,outcome,winner);
    if(m.pobjednik_id!==winner){
      var next=descendants(db,id);
      if(next.some(function(x){return x.status==='U toku'||x.status==='Završen';}))fail('Konflikt: naredni meč je počeo ili završen. Prvo poništite zavisne rezultate od posljednje runde unazad kroz meni.');
      next.forEach(function(x){x.setovi='';x.ishod='';x.pobjednik_id='';x.pocetak='';x.teren_id='';x.status='Zakazan';});
      db.Mecevi.filter(function(x){return x.izvor1_id===id||x.izvor2_id===id;}).forEach(function(x){if(x.izvor1_id===id)x.igrac1_id=winner;else x.igrac2_id=winner;});
    }
    m.setovi=String(score).trim();m.ishod=outcome;m.pobjednik_id=winner;m.status='Završen';
  }
  function resetResult(db,id) {
    var m=db.Mecevi.find(function(x){return x.id===id;});if(!m||m.ishod==='Slobodan prolaz')fail('Meč nije moguće poništiti.');
    if(descendants(db,id).some(function(x){return x.status==='U toku'||x.status==='Završen';}))fail('Prvo poništite kasnije runde.');
    descendants(db,id).forEach(function(x){x.pocetak='';x.teren_id='';if(x.izvor1_id===id)x.igrac1_id='';if(x.izvor2_id===id)x.igrac2_id='';});
    m.setovi='';m.pobjednik_id='';m.ishod='';m.status='Zakazan';
  }
  function contacts(db,id) {var p=db.Ucesnici.find(function(x){return x.id===id;}),a=p&&db.Prijave.find(function(x){return x.id===p.prijava_id;});return a?[a.email.toLowerCase(),a.telefon]:[id];}
  function conflicts(db) {
    var issues=[],matches=db.Mecevi.filter(function(m){return m.pocetak&&m.status!=='Otkazan'&&m.status!=='Odgođen';});
    matches.forEach(function(m,i){var start=Date.parse(m.pocetak),duration=Number(m.trajanje_min),court=db.Tereni.find(function(t){return t.id===m.teren_id;});
      if(!Number.isFinite(start)||!Number.isFinite(duration)||duration<15||duration>600){issues.push(m.id+': neispravan termin ili trajanje.');return;}
      if(!m.igrac1_id||!m.igrac2_id)issues.push(m.id+': protivnici nisu poznati.');
      if(!court||!yes(court.aktivan)||court.dostupan_od&&start<Date.parse(court.dostupan_od)||court.dostupan_do&&start+duration*60000>Date.parse(court.dostupan_do))issues.push(m.id+': teren nije dostupan.');
      [m.izvor1_id,m.izvor2_id].filter(Boolean).forEach(function(id){var before=db.Mecevi.find(function(x){return x.id===id;});if(before&&before.pocetak&&Date.parse(before.pocetak)+Number(before.trajanje_min)*60000>start)issues.push(m.id+': prethodna runda se preklapa.');});
      matches.slice(i+1).forEach(function(n){if(start<Date.parse(n.pocetak)+Number(n.trajanje_min)*60000&&Date.parse(n.pocetak)<start+duration*60000){
        if(m.teren_id&&m.teren_id===n.teren_id)issues.push(m.id+' / '+n.id+': preklapanje terena.');
        var a=[m.igrac1_id,m.igrac2_id].filter(Boolean).flatMap(function(id){return contacts(db,id);}),b=[n.igrac1_id,n.igrac2_id].filter(Boolean).flatMap(function(id){return contacts(db,id);});
        if(a.some(function(v){return b.indexOf(v)>=0;}))issues.push(m.id+' / '+n.id+': igrač je u dva meča.');
      }});
    });return issues;
  }
  function schedule(db,id,start,court,duration,status) {
    var m=db.Mecevi.find(function(x){return x.id===id;});if(!m)fail('Meč ne postoji.');
    if(m.status==='Završen')fail('Završen meč prvo poništite kroz meni za rezultate.');
    if(['Zakazan','U toku','Odgođen','Otkazan'].indexOf(status)<0)fail('Nepoznat status.');
    if(start&&!/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d)?(?:Z|[+-]\d\d:\d\d)$/.test(start))fail('Termin mora imati vremensku zonu, npr. 2027-06-10T10:00:00+02:00.');
    if(status==='U toku' && (!start || !m.igrac1_id || !m.igrac2_id))fail('Za početak meča unesite termin i oba protivnika.');
    m.pocetak=start;m.teren_id=court;m.trajanje_min=integer(duration,15,600,'Trajanje');m.status=status;
    var errors=conflicts(db);if(errors.length)fail(errors.join('\n'));
  }
  function pick(row,keys) {var out={};keys.forEach(function(k){out[k]=row[k]===undefined?'':row[k];});return out;}
  function publicData(db,now) {
    var t=db.Turnir[0]||{},published=db.Zrijeb.filter(function(z){return yes(z.objavljen);}),ids=new Set(published.map(function(z){return z.zrijeb_id;}));
    return {readAt:new Date(now).toISOString(),turnir:pick(t,['id','naziv','opis','lokacija','datum_od','datum_do','rok_prijave','status_prijava','kontakt_javni','pravila','obrada_podataka','verzija_pravila','demo']),
      kategorije:db.Kategorije.filter(function(c){return yes(c.aktivna);}).map(function(c){var out=pick(c,['id','naziv','format','limit_ucesnika','kotizacija','valuta','setovi_za_pobjedu','gemovi_u_setu','tajbrejk_na','tajbrejk_poeni','trajanje_min','pravila','lista_cekanja']);out.zauzeto=activeApplications(db,c.id).length;out.zrijeb_formiran=db.Zrijeb.some(function(z){return z.kategorija_id===c.id;});return out;}),
      ucesnici:db.Ucesnici.filter(function(p){return p.status==='Aktivan'&&db.Prijave.some(function(a){return a.id===p.prijava_id&&a.status==='Odobrena';});}).map(function(p){return pick(p,['id','javno_ime','kategorija_id','klub_grad','nosilac','status','demo']);}),
      tereni:db.Tereni.filter(function(t){return yes(t.aktivan);}).map(function(t){return pick(t,['id','naziv','lokacija']);}),
      zrijeb:published.map(function(z){return pick(z,['id','zrijeb_id','kategorija_id','pozicija','ucesnik_id','nosilac','slobodan_prolaz']);}),
      mecevi:db.Mecevi.filter(function(m){return ids.has(m.zrijeb_id);}).map(function(m){return pick(m,['id','zrijeb_id','kategorija_id','runda','pozicija','igrac1_id','igrac2_id','izvor1_id','izvor2_id','teren_id','pocetak','trajanje_min','status','setovi','ishod','pobjednik_id']);}),
      obavjestenja:db.Obavjestenja.filter(function(n){return n.status==='Objavljeno'&&(!n.datum||Date.parse(n.datum)<=now);}).map(function(n){return pick(n,['id','naslov','tekst','datum','prioritet']);}).sort(function(a,b){return Number(b.prioritet)-Number(a.prioritet)||String(b.datum).localeCompare(String(a.datum));})};
  }
  return {yes:yes,integer:integer,safeCell:safeCell,validateRegistration:validateRegistration,approve:approve,generateDraw:generateDraw,result:result,resetResult:resetResult,schedule:schedule,conflicts:conflicts,publicData:publicData};
})();


// ===== Demo.gs =====
var Demo = { create: function(now,uid) {
  var db={};Object.keys(SCHEMA).forEach(function(n){db[n]=[];});
  var day=new Date(now);day.setUTCHours(8,0,0,0);var later=new Date(now+14*86400000).toISOString();
  db.Turnir=[{id:'DEMO-TURNIR',naziv:'DEMO · Teniski turnir',opis:'Prijave, žrijeb i rezultati na jednom mjestu. Ovo je probni turnir za upoznavanje sa aplikacijom.',lokacija:'DEMO · Lokacija turnira',datum_od:day.toISOString().slice(0,10),datum_do:new Date(now+2*86400000).toISOString().slice(0,10),rok_prijave:later,status_prijava:'Otvorene',kontakt_javni:'DEMO · Unesite javni kontakt organizatora.',pravila:'DEMO PRAVILA — isključivo za testiranje.\nSingl, eliminacioni sistem. Meč se igra na dva dobijena seta. Taj-brejk na 6:6 do sedam poena, uz dva razlike.\nStvarna pravila određuje organizator prije otvaranja prijava.',obrada_podataka:'DEMO OBAVJEŠTENJE — nije namijenjeno stvarnim prijavama. Koristite isključivo izmišljene podatke.\nU stvarnom turniru kontakt podatke vidi organizator. Javno se prikazuju odobreno ime, kategorija i uneseni klub ili grad. Organizator prije objave dopunjava svrhu i rok čuvanja podataka, svoj identitet i kontakt za zahtjeve.',verzija_pravila:'DEMO-1',demo:true}];
  db.Kategorije=[{id:'DEMO-C1',naziv:'DEMO · Singl A',format:'Singl eliminacija',limit_ucesnika:16,kotizacija:0,valuta:'KM',aktivna:true,lista_cekanja:false,setovi_za_pobjedu:2,gemovi_u_setu:6,tajbrejk_na:6,tajbrejk_poeni:7,trajanje_min:90,pravila:'DEMO · Pojedinačna konkurencija.',demo:true},{id:'DEMO-C2',naziv:'DEMO · Singl B',format:'Singl eliminacija',limit_ucesnika:8,kotizacija:0,valuta:'KM',aktivna:true,lista_cekanja:true,setovi_za_pobjedu:2,gemovi_u_setu:6,tajbrejk_na:6,tajbrejk_poeni:7,trajanje_min:90,pravila:'DEMO · Otvorena za probne prijave.',demo:true}];
  db.Tereni=[{id:'DEMO-T1',naziv:'DEMO · Teren 1',lokacija:'DEMO',aktivan:true,demo:true},{id:'DEMO-T2',naziv:'DEMO · Teren 2',lokacija:'DEMO',aktivan:true,demo:true}];
  for(var i=1;i<=6;i++){var id='DEMO-P'+i;db.Prijave.push({id:id,zahtjev_id:uid(),ime_prezime:'DEMO Igrač '+i,email:'demo'+i+'@example.invalid',telefon:'+3876000000'+i,kategorija_id:'DEMO-C1',klub_grad:'DEMO Klub '+(i%2+1),napomena:'DEMO privatna napomena',vrijeme_prijave:new Date(now).toISOString(),status:'Odobrena',verzija_pravila:'DEMO-1',demo:true});db.Ucesnici.push({id:'DEMO-U'+i,prijava_id:id,javno_ime:'DEMO Igrač '+i,kategorija_id:'DEMO-C1',klub_grad:'DEMO Klub '+(i%2+1),nosilac:i<=2?i:'',status:'Aktivan',demo:true});}
  Engine.generateDraw(db,'DEMO-C1',uid,function(){return .42;});db.Zrijeb.forEach(function(z){z.objavljen=true;});
  var played=db.Mecevi.find(function(m){return m.runda===1&&!m.ishod;});Engine.result(db,played.id,'6-4 7-6(7-5)','Regularno',played.igrac1_id);
  db.Mecevi.filter(function(m){return m.igrac1_id&&m.igrac2_id&&!m.ishod;}).forEach(function(m,i){m.pocetak=new Date(day.getTime()+(i+2)*90*60000).toISOString();m.teren_id='DEMO-T'+(i%2+1);});
  db.Obavjestenja=[{id:'DEMO-N1',naslov:'DEMO · Dobro došli na turnir',tekst:'Ovaj prikaz služi za testiranje. Stvarne datume, pravila i podatke o turniru podešavate u Google Sheets.',datum:new Date(now).toISOString(),prioritet:2,status:'Objavljeno',demo:true}];return db;
}};
function loadDemo_(){mutate_(Object.keys(SCHEMA),function(db){if(Object.keys(db).some(function(n){return n!=='Turnir'&&db[n].length;}))throw new Error('DEMO se učitava samo u praznu bazu.');var d=Demo.create(Date.now(),uid_);Object.keys(d).forEach(function(n){db[n]=d[n];});});}
function removeDemo_(){var choice=prompt_('Uklanjanje DEMO podataka','Upišite UKLONI DEMO. Struktura ostaje. Prvo provjerite da nema stvarnih prijava vezanih za DEMO kategorije.');if(choice!=='UKLONI DEMO')return;mutate_(Object.keys(SCHEMA),function(db){var cats=db.Kategorije.filter(function(c){return Engine.yes(c.demo);}).map(function(c){return c.id;});if(db.Prijave.some(function(p){return !Engine.yes(p.demo)&&cats.includes(p.kategorija_id);}))throw new Error('Postoje nedemonstracione prijave u DEMO kategoriji. Napravite novu praznu tabelu za stvarni turnir.');Object.keys(db).forEach(function(n){db[n]=db[n].filter(function(r){return !Engine.yes(r.demo);});});if(!db.Turnir.length)db.Turnir=[{id:'TURNIR',naziv:'Naziv turnira nije podešen',status_prijava:'Zatvorene',verzija_pravila:'1',demo:false}];});}


// ===== Code.gs =====
function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Teniski turnir').addMetaTag('viewport','width=device-width, initial-scale=1');
}
function include_(name) { return HtmlService.createHtmlOutputFromFile(name).getContent(); }
function properties_() {return PropertiesService.getScriptProperties();}
function uid_(){return Utilities.getUuid();}
function database_(){var id=properties_().getProperty('SPREADSHEET_ID');if(!id)throw new Error('Baza još nije povezana.');return SpreadsheetApp.openById(id);}
function lock_(fn){var l=LockService.getScriptLock();if(!l.tryLock(20000))throw new Error('Sistem je zauzet. Pokušajte ponovo.');try{return fn();}finally{l.releaseLock();}}
function assertOrganizer_(){
  var active=SpreadsheetApp.getActiveSpreadsheet(),mail=Session.getActiveUser().getEmail(),allowed=JSON.parse(properties_().getProperty('ORGANIZATORI')||'[]');
  if(!active||active.getId()!==properties_().getProperty('SPREADSHEET_ID')||!mail||allowed.indexOf(mail.toLowerCase())<0)throw new Error('Nemate ovlašćenje za organizatorsku radnju.');
}
function read_(ss){var db={};Object.keys(SCHEMA).forEach(function(name){var sh=ss.getSheetByName(name);if(!sh)throw new Error('Nedostaje list '+name);if(sh.getLastRow()>10000)throw new Error('Baza je prevelika za ovu verziju.');var values=sh.getDataRange().getValues(),headers=SCHEMA[name].map(function(c){return c[0];});if(headers.join('|')!==values[0].join('|'))throw new Error('Promijenjena struktura lista '+name);db[name]=values.slice(1).filter(function(row){return row[0]!=='';}).map(function(row){var r={};headers.forEach(function(h,i){r[h]=row[i] instanceof Date?row[i].toISOString():row[i];});return r;});});return db;}
function writeTables_(ss,db,names){names.forEach(function(name){var sh=ss.getSheetByName(name),headers=SCHEMA[name].map(function(c){return c[0];});var old=Math.max(sh.getLastRow()-1,0),rows=db[name].map(function(row){return headers.map(function(h){return Engine.safeCell(row[h]==null?'':row[h]);});});var count=Math.max(old,rows.length);if(count){while(rows.length<count)rows.push(headers.map(function(){return '';}));if(sh.getMaxRows()<count+1)sh.insertRowsAfter(sh.getMaxRows(),count+1-sh.getMaxRows());sh.getRange(2,1,count,headers.length).setValues(rows);}});SpreadsheetApp.flush();}
/* Write-ahead recovery: no partially written state is served. Journal is private. */
function recover_(ss){var j=ss.getSheetByName('_Transakcija');if(j&&j.getRange('A1').getValue()==='PENDING'){var chunks=j.getRange(2,1,j.getLastRow()-1,1).getValues().map(function(r){if(String(r[0])[0]!=='J')throw new Error('Neispravan dnevnik oporavka.');return String(r[0]).slice(1);}).join(''),backup=JSON.parse(chunks);writeTables_(ss,backup,Object.keys(backup));j.getRange('A1').setValue('RECOVERED');SpreadsheetApp.flush();CacheService.getScriptCache().remove('public-v1');}}
function save_(ss,before,after,names){var j=ss.getSheetByName('_Transakcija'),snapshot={};names.forEach(function(n){snapshot[n]=before[n];});var data=JSON.stringify(snapshot),chunks=data.match(/[\s\S]{1,40000}/g)||['{}'];j.clearContents();j.getRange(2,1,chunks.length,1).setValues(chunks.map(function(c){return['J'+c];}));SpreadsheetApp.flush();j.getRange('A1').setValue('PENDING');SpreadsheetApp.flush();try{writeTables_(ss,after,names);j.getRange('A1').setValue('COMMITTED');SpreadsheetApp.flush();j.clearContents();CacheService.getScriptCache().remove('public-v1');}catch(e){recover_(ss);throw e;}}
function mutate_(names,fn){assertOrganizer_();return lock_(function(){var ss=database_();recover_(ss);var before=read_(ss),after=JSON.parse(JSON.stringify(before));var result=fn(after);save_(ss,before,after,names);return result;});}
function getPublicData(){
  try{return lock_(function(){var ss=database_();recover_(ss);var cache=CacheService.getScriptCache(),hit=cache.get('public-v1');if(hit)return JSON.parse(hit);var data=Engine.publicData(read_(ss),Date.now()),serialized=JSON.stringify(data);if(Utilities.newBlob(serialized).getBytes().length<95000)cache.put('public-v1',serialized,25);return data;});}
  catch(e){throw new Error('Podaci trenutno nisu dostupni. Pokušajte ponovo kasnije.');}
}
function digest_(text){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8).map(function(b){return('0'+((b+256)%256).toString(16)).slice(-2);}).join('');}
function getRegistrationChallenge(){return lock_(function(){var cache=CacheService.getScriptCache(),key='challenge-minute-'+Math.floor(Date.now()/60000),count=+(cache.get(key)||0);if(count>=120)throw new Error('Previše zahtjeva. Pokušajte za minut.');cache.put(key,String(count+1),70);var token=uid_();cache.put('challenge-'+token,String(Date.now()),900);return {token:token,expiresIn:900};});}
function submitRegistration(input){
  if(!input||typeof input!=='object'||JSON.stringify(input).length>5000)throw new Error('Neispravan zahtjev.');
  return lock_(function(){
    var ss=database_();recover_(ss);var before=read_(ss),key=String(input.zahtjev_id||'');if(!/^[a-zA-Z0-9-]{20,80}$/.test(key))throw new Error('Osvježite obrazac i pokušajte ponovo.');
    var fields=['ime_prezime','email','telefon','kategorija_id','klub_grad','napomena','saglasnost','verzija_pravila'],fingerprint=digest_(JSON.stringify(fields.map(function(f){return input[f];}))),prior=before.Prijave.find(function(p){return p.zahtjev_id===key;});
    if(prior){if(prior.otisak!==fingerprint)throw new Error('Zahtjev je već iskorišćen sa drugim podacima.');return {ok:true,id:prior.id,status:prior.status};}
    var cache=CacheService.getScriptCache(),issued=Number(cache.get('challenge-'+String(input.token||''))),now=Date.now();
    if(input.website || !issued || now-issued<2500 || now-issued>900000)throw new Error('Provjera obrasca je istekla. Osvježite provjeru i pokušajte ponovo nakon nekoliko sekundi.');
    var minute='submit-minute-'+Math.floor(now/60000),count=Number(cache.get(minute)||0);if(count>=30)throw new Error('Veliki broj prijava. Pokušajte za minut.');cache.put(minute,String(count+1),70);
    var row=Engine.validateRegistration(before,input,now);row.id=uid_();row.zahtjev_id=key;row.otisak=fingerprint;row.vrijeme_prijave=new Date(now).toISOString();row.demo=Engine.yes(before.Turnir[0].demo);
    var after=JSON.parse(JSON.stringify(before));after.Prijave.push(row);save_(ss,before,after,['Prijave']);cache.remove('challenge-'+input.token);return {ok:true,id:row.id,status:row.status};
  });
}
function onOpen(){var ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)return;SpreadsheetApp.getUi().createMenu('Tenis').addItem('Inicijalno podešavanje','initialize_').addSeparator().addItem('Dodaj kategoriju','addCategory_').addItem('Dodaj teren','addCourt_').addItem('Dodaj obavještenje','addNotice_').addSeparator().addItem('Status odabrane prijave','approveSelected_').addItem('Javno ime / klub / nosilac','editParticipant_').addItem('Generiši žrijeb odabrane kategorije','drawSelected_').addItem('Objavi žrijeb odabrane kategorije','publishDraw_').addSeparator().addItem('Termin / status odabranog meča','scheduleSelected_').addItem('Rezultat odabranog meča','resultSelected_').addItem('Poništi rezultat odabranog meča','resetSelected_').addItem('Provjeri raspored','checkSchedule_').addItem('Izvezi učesnike (CSV)','exportParticipants_').addSeparator().addItem('Učitaj DEMO u praznu bazu','loadDemo_').addItem('Ukloni DEMO podatke','removeDemo_').addToUi();}
function initialize_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),email=Session.getActiveUser().getEmail();if(!ss||!email)throw new Error('Pokrenite iz Apps Script projekta vezanog za vašu tabelu.');
  if(properties_().getProperty('SPREADSHEET_ID'))assertOrganizer_();
  lock_(function(){
    Object.keys(SCHEMA).forEach(function(name){var sh=ss.getSheetByName(name);if(sh&&sh.getLastRow()>0&&sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].join('|')!==SCHEMA[name].map(function(c){return c[0];}).join('|'))throw new Error('Postojeći list '+name+' ima drugu strukturu. Koristite praznu tabelu.');});
    properties_().setProperty('SPREADSHEET_ID',ss.getId());if(!properties_().getProperty('ORGANIZATORI'))properties_().setProperty('ORGANIZATORI',JSON.stringify([email.toLowerCase()]));
    Object.keys(SCHEMA).forEach(function(name){
      var sh=ss.getSheetByName(name)||ss.insertSheet(name),columns=SCHEMA[name];if(sh.getMaxColumns()<columns.length)sh.insertColumnsAfter(sh.getMaxColumns(),columns.length-sh.getMaxColumns());
      sh.getRange(1,1,1,columns.length).setValues([columns.map(function(c){return c[0];})]).setBackground('#123f32').setFontColor('#ffffff').setFontWeight('bold');sh.setFrozenRows(1);sh.setRowHeight(1,36);
      columns.forEach(function(c,i){sh.setColumnWidth(i+1,c[1]==='tekst'?220:170);sh.getRange(1,i+1).setNote(c[1]+' | '+(c[2]?'Obavezno':'Opciono')+' | '+c[3]+'\n'+String(c[5])+'\nPrimjer: '+c[4]);var range=sh.getRange(2,i+1,sh.getMaxRows()-1,1);if(['ID','tekst','datum','datum-vrijeme'].indexOf(c[1])>=0)range.setNumberFormat('@');if(Array.isArray(c[5]))range.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(c[5],true).setAllowInvalid(false).build());if(c[1]==='boolean')range.setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().setAllowInvalid(false).build());if(c[1]==='broj'){var bounds={limit_ucesnika:[2,256],setovi_za_pobjedu:[1,3],gemovi_u_setu:[1,12],tajbrejk_na:[1,12],tajbrejk_poeni:[5,15],trajanje_min:[15,600],prioritet:[1,3],kotizacija:[0,100000]};if(bounds[c[0]])range.setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(bounds[c[0]][0],bounds[c[0]][1]).setAllowInvalid(false).build());}
      });
      var existing=sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).find(function(p){return p.getDescription()==='TENIS_SYSTEM';}),protection=existing||sh.protect().setDescription('TENIS_SYSTEM');protection.setWarningOnly(false);protection.addEditor(email);protection.getEditors().forEach(function(u){if(u.getEmail()!==email)protection.removeEditor(u);});if(protection.canDomainEdit())protection.setDomainEdit(false);protection.setUnprotectedRanges(columns.map(function(c,i){return c[3]==='ručno'?sh.getRange(2,i+1,sh.getMaxRows()-1,1):null;}).filter(Boolean));
    });
    var journal=ss.getSheetByName('_Transakcija')||ss.insertSheet('_Transakcija');journal.hideSheet();if(!journal.getProtections(SpreadsheetApp.ProtectionType.SHEET).length){var p=journal.protect().setDescription('TENIS_SYSTEM');p.addEditor(email);p.getEditors().forEach(function(u){if(u.getEmail()!==email)p.removeEditor(u);});if(p.canDomainEdit())p.setDomainEdit(false);}
    if(ss.getSheetByName('Turnir').getLastRow()<2)writeTables_(ss,{Turnir:[{id:'TURNIR',naziv:'Naziv turnira nije podešen',status_prijava:'Zatvorene',verzija_pravila:'1',demo:false}]},['Turnir']);
    var triggers=ScriptApp.getProjectTriggers();if(!triggers.some(function(t){return t.getHandlerFunction()==='edited_';}))ScriptApp.newTrigger('edited_').forSpreadsheet(ss).onEdit().create();
    CacheService.getScriptCache().remove('public-v1');
  });onOpen();SpreadsheetApp.getUi().alert('Baza je spremna. Popunite Turnir, dodajte kategorije i terene kroz meni. Prijave ostaju zatvorene do unosa pravila i roka.');
}
function edited_(e){if(e&&e.source&&e.source.getId()===properties_().getProperty('SPREADSHEET_ID'))CacheService.getScriptCache().remove('public-v1');}
function prompt_(title,help){var ui=SpreadsheetApp.getUi(),r=ui.prompt(title,help,ui.ButtonSet.OK_CANCEL);return r.getSelectedButton()===ui.Button.OK?r.getResponseText().trim():null;}
function selected_(sheet){assertOrganizer_();var sh=SpreadsheetApp.getActiveSheet();if(sh.getName()!==sheet||sh.getActiveRange().getRow()<2)throw new Error('Odaberite red u listu '+sheet+'.');return String(sh.getRange(sh.getActiveRange().getRow(),1).getValue());}
function addCategory_(){var name=prompt_('Nova kategorija','Naziv kategorije');if(!name)return;mutate_(['Kategorije'],function(db){if(db.Kategorije.length>=32)throw new Error('Najviše 32 kategorije.');db.Kategorije.push({id:uid_(),naziv:name,format:'Singl eliminacija',limit_ucesnika:32,kotizacija:0,valuta:'KM',aktivna:false,lista_cekanja:false,setovi_za_pobjedu:2,gemovi_u_setu:6,tajbrejk_na:6,tajbrejk_poeni:7,trajanje_min:90,pravila:'',demo:false});});}
function addCourt_(){var name=prompt_('Novi teren','Naziv terena');if(!name)return;mutate_(['Tereni'],function(db){db.Tereni.push({id:uid_(),naziv:name,aktivan:false,demo:false});});}
function addNotice_(){var title=prompt_('Novo obavještenje','Naslov');if(!title)return;mutate_(['Obavjestenja'],function(db){db.Obavjestenja.push({id:uid_(),naslov:title,tekst:'',datum:new Date().toISOString(),prioritet:1,status:'Nacrt',demo:false});});}
function approveSelected_(){var id=selected_('Prijave'),s=prompt_('Status prijave','Odobrena / Odbijena / Lista čekanja / Na čekanju');if(s===null)return;mutate_(['Prijave','Ucesnici'],function(db){Engine.approve(db,id,s,uid_);});}
function editParticipant_(){var id=selected_('Ucesnici'),v=prompt_('Javni podaci učesnika','Javno ime | klub ili grad | broj nosioca (prazno za nenosioca)');if(v===null)return;var parts=v.split('|').map(function(x){return x.trim();});mutate_(['Ucesnici'],function(db){var p=db.Ucesnici.find(function(x){return x.id===id;});if(!p||!parts[0]||parts[0].length>100||(parts[1]||'').length>100)throw new Error('Provjerite unos.');if(db.Zrijeb.some(function(z){return z.kategorija_id===p.kategorija_id;}))throw new Error('Nosioci i sastav su zaključani nakon generisanja žrijeba.');p.javno_ime=parts[0];p.klub_grad=parts[1]||'';p.nosilac=parts[2]?Engine.integer(parts[2],1,256,'Nosilac'):'';});}
function drawSelected_(){var id=selected_('Kategorije');mutate_(['Zrijeb','Mecevi'],function(db){Engine.generateDraw(db,id,uid_,Math.random);});SpreadsheetApp.getUi().alert('Žrijeb je sačuvan kao nacrt. Provjerite ga i objavite kroz meni. Sastav kategorije je zaključan.');}
function publishDraw_(){var id=selected_('Kategorije');mutate_(['Zrijeb'],function(db){var rows=db.Zrijeb.filter(function(z){return z.kategorija_id===id;});if(!rows.length)throw new Error('Prvo generišite žrijeb.');rows.forEach(function(z){z.objavljen=true;});});}
function scheduleSelected_(){var id=selected_('Mecevi'),v=prompt_('Termin i status','ISO termin sa zonom | teren ID | trajanje u minutama | status. Primjer formata: 2027-06-10T10:00:00+02:00 | ID | 90 | Zakazan');if(v===null)return;var p=v.split('|').map(function(s){return s.trim();});mutate_(['Mecevi'],function(db){Engine.schedule(db,id,p[0]||'',p[1]||'',p[2],p[3]);});}
function resultSelected_(){var id=selected_('Mecevi'),v=prompt_('Rezultat','Pobjednik 1 ili 2 | Regularno / Predaja / Bez igre | setovi. Primjer: 1 | Regularno | 6-4 7-6(7-5)');if(v===null)return;var p=v.split('|').map(function(s){return s.trim();});mutate_(['Mecevi'],function(db){var m=db.Mecevi.find(function(x){return x.id===id;});if(!m||!['1','2'].includes(p[0]))throw new Error('Pobjednik mora biti 1 ili 2.');Engine.result(db,id,p[2]||'',p[1],m['igrac'+p[0]+'_id']);});}
function resetSelected_(){var id=selected_('Mecevi'),v=prompt_('Poništavanje rezultata','Upišite PONIŠTI. Time uklanjate rezultat i oslobađate mjesto u sljedećoj rundi; termine zavisnih mečeva treba ponovo zakazati.');if(v!=='PONIŠTI')return;mutate_(['Mecevi'],function(db){Engine.resetResult(db,id);});}
function checkSchedule_(){assertOrganizer_();var errors=lock_(function(){var ss=database_();recover_(ss);return Engine.conflicts(read_(ss));});SpreadsheetApp.getUi().alert(errors.length?errors.join('\n'):'Nema konflikata prema upisanim terminima i procijenjenom trajanju.');}
function exportParticipants_(){assertOrganizer_();var data=lock_(function(){var ss=database_();recover_(ss);return Engine.publicData(read_(ss),Date.now());}),rows=[['Javno ime','Kategorija','Klub ili grad']].concat(data.ucesnici.map(function(p){return[p.javno_ime,(data.kategorije.find(function(c){return c.id===p.kategorija_id;})||{}).naziv||p.kategorija_id,p.klub_grad];})),csv='\uFEFF'+rows.map(function(row){return row.map(function(v){return '"'+String(Engine.safeCell(v||'')).replace(/"/g,'""')+'"';}).join(';');}).join('\r\n'),url='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput('<p>Izvoz sadrži samo javne podatke.</p><a download="ucesnici.csv" href="'+url+'">Preuzmi CSV</a>'),'Izvoz učesnika');}

