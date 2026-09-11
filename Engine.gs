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
