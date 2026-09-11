const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),ctx={};vm.createContext(ctx);['Schema.gs','Engine.gs','Demo.gs'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx));
let db=ctx.Demo.create(Date.now(),crypto.randomUUID),challenges=new Map();
const html=fs.readFileSync(path.join(root,'Index.html'),'utf8').replace(/<\?!= include_\('([^']+)'\); \?>/g,(_,f)=>fs.readFileSync(path.join(root,f+'.html'),'utf8'));
const server=http.createServer(async(req,res)=>{res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(html);}
if(req.method!=='POST'||!['/api/getPublicData','/api/getRegistrationChallenge','/api/submitRegistration'].includes(req.url)){res.writeHead(404);return res.end('Not found');}
let body='';for await(const c of req){body+=c;if(body.length>6000){res.writeHead(413);return res.end();}}
try{let input=JSON.parse(body||'{}'),value;if(req.url.endsWith('getPublicData'))value=ctx.Engine.publicData(db,Date.now());
else if(req.url.endsWith('getRegistrationChallenge')){let token=crypto.randomUUID();challenges.set(token,Date.now());value={token};}
else{const fingerprint=crypto.createHash('sha256').update(JSON.stringify(['ime_prezime','email','telefon','kategorija_id','klub_grad','napomena','saglasnost','verzija_pravila'].map(k=>input[k]))).digest('hex'),prior=db.Prijave.find(p=>p.zahtjev_id===input.zahtjev_id);if(prior){if(prior.otisak!==fingerprint)throw Error('Zahtjev je već iskorišćen.');value={ok:true,id:prior.id,status:prior.status};}else{let issued=challenges.get(input.token);if(input.website||!issued||Date.now()-issued<2500||Date.now()-issued>900000)throw Error('Osvježite provjeru obrasca i sačekajte nekoliko sekundi.');let p=ctx.Engine.validateRegistration(db,input,Date.now());Object.assign(p,{id:crypto.randomUUID(),zahtjev_id:input.zahtjev_id,otisak:fingerprint,demo:true});db.Prijave.push(p);challenges.delete(input.token);value={ok:true,id:p.id,status:p.status};}}
res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));}catch(e){res.writeHead(400,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({error:e.message}));}});
server.listen(4173,'127.0.0.1',()=>console.log('DEMO preview: http://127.0.0.1:4173 · memory only, no Google connection'));
