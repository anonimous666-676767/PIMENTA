const $=id=>document.getElementById(id),cv=$('c'),X=cv.getContext('2d');
const W=3800,H=700,CL={K:{n:'Cavaleiro',hp:150,dmg:14,sp:2.6,s:['Corte Poderoso','Investida']},M:{n:'Mago',hp:80,dmg:13,sp:2.8,s:['Explosão Arcana','Teletransporte']},S:{n:'Soldado de Tributos',hp:110,dmg:11,sp:2.7,s:['Auditoria Relâmpago','Multa por Atraso']}};
const ET={rat:{hp:20,sp:1.7,d:5,r:10,c:'#8a8a7a',xp:8,g:3,n:'Rato'},slime:{hp:30,sp:1.1,d:6,r:13,c:'#5c5',xp:10,g:4,n:'Gosma'},bat:{hp:18,sp:2.4,d:5,r:9,c:'#639',xp:9,g:4,n:'Morcego'},gob:{hp:45,sp:1.6,d:9,r:13,c:'#7a3',xp:18,g:8,n:'Goblin'},spid:{hp:60,sp:1.9,d:11,r:15,c:'#222',xp:22,g:10,n:'Aranha'},shr:{hp:70,sp:1,d:12,r:16,c:'#d44',xp:24,g:12,n:'Cogumelo'},golem:{hp:350,sp:.9,d:22,r:34,c:'#889',xp:150,g:80,n:'Guardião de Pedra'},elite:{hp:140,sp:1.7,d:16,r:18,c:'#a2a',xp:50,g:30,n:'Elite Maldito'},boss:{hp:900,sp:1.1,d:28,r:48,c:'#215',xp:500,g:300,n:'Auditor do Abismo'}};
const REG=[[700,1500,['rat','slime','bat','gob'],10],[1500,2300,['spid','shr','gob','slime'],12],[2300,3000,['gob','spid','shr'],8],[3000,3500,['elite','elite','shr'],7]];
const EV=[[60,['MESTRE ORELHA: Finalmente! Um aventureiro! Já achava que teria de resolver com minhas próprias patas.','JOGADOR: ESPERA... VOCÊ É UM CACHORRO?','MESTRE ORELHA: CACHORRO?! Sou o arquimago das sete dimensões! ...Vamos ignorar essa parte. Algo despertou na caverna. E meus biscoitos mágicos acabaram.']],
[690,['DAVY: EI! ALGUÉM AÍ?! EU! DAVY JONESES, FUTURO MAIOR CAMPEÃO DE TODOS OS TEMPOS!','DAVY: Estou preso nas pedras. DETALHES TÉCNICOS! Entrei num portal achando que era evento especial.','MESTRE ORELHA: Eu avisei que portais não eram brinquedos. DAVY: Calado, cachorro.','DAVY: Libertado! Vou junto. Não estou gordo, é armadura de resistência máxima!']],
[1500,['MESTRE ORELHA: Salão dos Cogumelos. Não coma nada. DAVY: ...Tarde demais.']],
[2300,['MESTRE ORELHA: As Ruínas dos Antigos. Um Guardião de Pedra vigia o tesouro. DAVY: Posso ser o apoio emocional?']],
[3000,['MESTRE ORELHA: O Cofre das Maldições. Sinto uma presença maligna. DAVY: O chefe? MESTRE ORELHA: Não, um rato. DAVY: ENTÃO MANDA PAGAR ALUGUEL!']],
[3520,['AUDITOR: VOCÊS NÃO PAGARAM OS TRIBUTOS DA ESCURIDÃO!']]];
let G={pl:{},en:[],pr:[],ev:0,win:false,run:false,t:0},me={},inp={dx:0,dy:0,ax:1,ay:0,atk:false,s1:false,s2:false,buy:false},keys={},cam=0,mouse={x:0,y:0},nid=1,parts=[],snap=null,paused=false;
const info=()=>({name:$('nome').value||'Herói',cls:$('cls').value,col:$('col').value});
const save=p=>localStorage.setItem('mo_save',JSON.stringify({name:p.name,cls:p.cls,col:p.col,coins:p.coins,lv:p.lv,xp:p.xp,dmg:p.dmg,pot:p.pot}));
function mk(id,i){const c=CL[i.cls],s=JSON.parse(localStorage.getItem('mo_save')||'null'),o=s&&s.name==i.name&&s.cls==i.cls?s:{};
 const lv=o.lv||1;return{id,name:i.name,cls:i.cls,col:i.col,x:80+Math.random()*60,y:350+Math.random()*80,hp:c.hp+(lv-1)*12,mhp:c.hp+(lv-1)*12,mp:60,lv,xp:o.xp||0,coins:o.coins||0,dmg:o.dmg||c.dmg,pot:o.pot||1,cd:[0,0,0],dead:0,fx:1,fy:0,inv:0}}
function spawn(t,x,y){const d=ET[t];G.en.push({id:nid++,t,x,y,hp:d.hp,mhp:d.hp,cd:0,ph:1})}
function startWorld(){G.en=[];REG.forEach(([a,b,ts,n])=>{for(let i=0;i<n;i++)spawn(ts[i%ts.length],a+80+Math.random()*(b-a-160),80+Math.random()*540)});spawn('golem',2900,350);spawn('boss',3600,350);G.run=true}
function dlg(l){let i=0;const e=$('dlg');e.hidden=false;(function n(){if(i>=l.length){e.hidden=true;return}e.textContent=l[i++];setTimeout(n,3600)})()}
function dmgE(e,d,p){e.hp-=d;parts.push({x:e.x,y:e.y-20,t:d|0,l:40});if(e.hp<=0&&!e.dead){e.dead=1;const D=ET[e.t],b=p&&p.cls=='S'?1.5:1;
  Object.values(G.pl).forEach(q=>{q.xp+=D.xp;q.coins+=Math.round(D.g*(q==p?b:1));while(q.xp>=q.lv*40){q.xp-=q.lv*40;q.lv++;q.mhp+=12;q.hp=q.mhp;q.dmg+=2}});
  if(e.t=='boss'){G.win=true;MP.all({t:'dlg',l:['MESTRE ORELHA: O Coração de Eldoria é nosso! VITÓRIA!']});dlg(['MESTRE ORELHA: O Coração de Eldoria é nosso! VITÓRIA!'])}}}
function area(p,r,d){G.en.forEach(e=>{if(!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<r+ET[e.t].r)dmgE(e,d,p)});parts.push({x:p.x,y:p.y,t:'✦',l:20})}
function step(){const dead=G.win;G.t++;
 Object.values(G.pl).forEach(p=>{const i=p.in||{},c=CL[p.cls];if(p.dead){if(--p.dead<=0){p.hp=p.mhp;p.x=Math.max(60,(Math.floor(G.ev>1?[0,0,700,1500,2300,3000,3000][G.ev]:0)));p.y=350}return}
  p.cd=p.cd.map(v=>Math.max(0,v-1));p.mp=Math.min(60,p.mp+.05);const a=Math.hypot(i.ax||1,i.ay||0)||1;p.fx=(i.ax||1)/a;p.fy=(i.ay||0)/a;
  const m=Math.hypot(i.dx||0,i.dy||0)||1;p.x=Math.min(W-20,Math.max(20,p.x+(i.dx||0)/m*c.sp));p.y=Math.min(H-20,Math.max(20,p.y+(i.dy||0)/m*c.sp));
  if(i.atk&&!p.cd[0]){p.cd[0]=22;p.sw=8;if(p.cls=='M')G.pr.push({x:p.x,y:p.y,vx:p.fx*7,vy:p.fy*7,d:p.dmg,o:p.id,l:70});else area({x:p.x+p.fx*38,y:p.y+p.fy*38,cls:p.cls,id:p.id},34,p.dmg)}
  if(i.s1&&!p.cd[1]&&p.mp>=20){p.cd[1]=150;p.mp-=20;area(p,p.cls=='M'?120:90,p.dmg*(p.cls=='K'?2.5:2))}
  if(i.s2&&!p.cd[2]){p.cd[2]=100;const d=p.cls=='M'?140:110;p.x=Math.min(W-20,Math.max(20,p.x+p.fx*d));p.y=Math.min(H-20,Math.max(20,p.y+p.fy*d));p.inv=25;if(p.cls!='M')area(p,40,p.dmg)}
  if(i.buy&&p.x<700){if(p.coins>=30&&!i.up){p.coins-=30;p.pot++}else if(i.up&&p.coins>=50*p.lv){p.coins-=50*p.lv;p.dmg+=4}}
  if(i.pot&&p.pot>0){p.pot--;p.hp=Math.min(p.mhp,p.hp+60)}
  p.in=null;p.inv=Math.max(0,p.inv-1)});
 const ps=Object.values(G.pl).filter(p=>!p.dead);
 EV.forEach((v,k)=>{if(G.ev<=k&&ps.some(p=>p.x>=v[0])){G.ev=k+1;MP.all({t:'dlg',l:v[1]});dlg(v[1])}});
 G.en.forEach(e=>{if(e.dead)return;const D=ET[e.t];let n=null,bd=1e9;ps.forEach(p=>{const d=Math.hypot(p.x-e.x,p.y-e.y);if(d<bd){bd=d;n=p}});e.cd=Math.max(0,e.cd-1);
  if(n&&bd<(e.t=='boss'?600:260)){const s=D.sp*(e.t=='boss'&&e.hp<e.mhp/2?1.6:1);e.x+=(n.x-e.x)/bd*s;e.y+=(n.y-e.y)/bd*s;
   if(bd<D.r+16&&!e.cd){e.cd=45;if(!n.inv){n.hp-=D.d;parts.push({x:n.x,y:n.y-20,t:D.d,l:40,r:1});if(n.hp<=0)n.dead=300}}
   if(e.t=='boss'&&G.t%240==0){ps.forEach(p=>{if(Math.hypot(p.x-e.x,p.y-e.y)<200&&!p.inv){p.hp-=25;if(p.hp<=0)p.dead=300}});if(e.hp<e.mhp/2)spawn('rat',e.x-60,e.y)}}});
 G.en=G.en.filter(e=>!e.dead);
 G.pr.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.l--;G.en.forEach(e=>{if(b.l>0&&Math.hypot(e.x-b.x,e.y-b.y)<ET[e.t].r+6){b.l=0;dmgE(e,b.d,G.pl[b.o])}})});G.pr=G.pr.filter(b=>b.l>0);
 if(G.ev>=2&&G.t%50==0){const d=G.en.find(e=>ps[0]&&Math.hypot(e.x-ps[0].x,e.y-ps[0].y)<90);if(d)dmgE(d,6)}
 if(G.t%600==0)Object.values(G.pl).forEach(save);
 if(G.t%3==0&&MP.host)MP.all({t:'snap',p:Object.values(G.pl).map(p=>({...p,in:0})),e:G.en,pr:G.pr,ev:G.ev,win:G.win})}
function applyIn(id,i){const p=G.pl[id];if(p)p.in=i}
function drawP(p){X.save();X.translate(p.x,p.y);X.globalAlpha=p.dead?.3:1;X.fillStyle='#0004';X.beginPath();X.ellipse(0,14,14,6,0,0,7);X.fill();
 X.fillStyle=p.col;X.beginPath();X.arc(0,0,14,0,7);X.fill();X.fillStyle='#f1c9a0';X.beginPath();X.arc(0,-12,8,0,7);X.fill();
 X.strokeStyle=p.cls=='K'?'#ccd':p.cls=='M'?'#a6f':'#da4';X.lineWidth=4;X.beginPath();X.moveTo(0,0);X.lineTo(p.fx*(p.sw?34:24),p.fy*(p.sw?34:24));X.stroke();
 X.fillStyle='#fff';X.font='11px sans-serif';X.textAlign='center';X.fillText(p.name,0,-26);X.restore()}
function drawOrelha(x,y){X.save();X.translate(x,y);X.fillStyle='#c98b4e';X.fillRect(-14,-6,26,12);[-12,-4,6,12].forEach(l=>X.fillRect(l,6,4,8));X.beginPath();X.arc(16,-6,9,0,7);X.fill();X.fillRect(8,-16,5,10);X.beginPath();X.moveTo(-14,-4);X.lineTo(-22,-14);X.lineTo(-12,-8);X.fill();
 X.fillStyle='#427';X.beginPath();X.moveTo(8,-17);X.lineTo(18,-17);X.lineTo(14,-34);X.fill();X.fillStyle='#fff';X.font='10px sans-serif';X.fillText('Mestre Orelha',-20,-24);X.restore()}
function drawDavy(x,y){X.save();X.translate(x,y);X.fillStyle='#e8b07f';X.beginPath();X.arc(0,-20,9,0,7);X.fill();X.fillStyle='#d33';X.beginPath();X.ellipse(0,0,22,19,0,0,7);X.fill();X.fillStyle='#fff';X.font='10px sans-serif';X.fillText('Davy',-10,-34);X.fillStyle='#223';X.fillRect(-12,16,8,8);X.fillRect(4,16,8,8);X.restore()}
function draw(S){const t=Date.now();X.fillStyle='#120e1a';X.fillRect(0,0,cv.width,cv.height);const m=S.pl[MP.myId],ps=Object.values(S.pl);if(m)cam+=((m.x-cv.width/2)-cam)*.12;cam=Math.max(0,Math.min(W-cv.width,cam));
 X.save();X.translate(-cam,(cv.height-H)/2);
 [['#3d6b34',0,700],['#2b2a3a',700,1500],['#2f3a2a',1500,2300],['#3a3430',2300,3000],['#2a1222',3000,3800]].forEach(([c,a,b])=>{X.fillStyle=c;X.fillRect(a,0,b-a,H)});
 X.fillStyle='#8b5a2b';for(let i=0;i<4;i++){X.fillRect(120+i*150,90+(i%2)*400,90,60);X.fillStyle='#a33';X.fillRect(115+i*150,80+(i%2)*400,100,15);X.fillStyle='#8b5a2b'}
 X.fillStyle='#fc4';X.font='14px sans-serif';X.fillText('⚒ LOJA (B poção · E+B... use B / N melhora arma)',140,60);
 S.pr.forEach(b=>{X.fillStyle='#f84';X.beginPath();X.arc(b.x,b.y,6,0,7);X.fill()});
 S.en.forEach(e=>{const D=ET[e.t];X.fillStyle='#0004';X.beginPath();X.ellipse(e.x,e.y+D.r,D.r,5,0,0,7);X.fill();X.fillStyle=D.c;X.beginPath();X.arc(e.x,e.y,D.r,0,7);X.fill();X.fillStyle='#f33';X.fillRect(e.x-D.r,e.y-D.r-8,D.r*2*e.hp/e.mhp,4);if(e.t=='boss'||e.t=='golem'){X.fillStyle='#fff';X.font='12px sans-serif';X.fillText(D.n,e.x-30,e.y-D.r-14)}});
 const lead=ps.find(p=>p.id==MP.myId)||ps[0];if(lead){drawOrelha(lead.x-50,lead.y+30+Math.sin(t/200)*3);if(S.ev>=2)drawDavy(lead.x-90,lead.y-30)}
 ps.forEach(drawP);parts=parts.filter(p=>--p.l>0);parts.forEach(p=>{X.fillStyle=p.r?'#f66':'#ff6';X.font='bold 16px sans-serif';X.fillText(p.t,p.x,p.y-(40-p.l))});X.restore();
 if(m){$('hud').innerHTML=`<b>${m.name}</b> Nv${m.lv} ${CL[m.cls].n}<br>❤ ${m.hp|0}/${m.mhp} · ✦ ${m.mp|0}/60 · XP ${m.xp}/${m.lv*40}<br>🪙 ${m.coins} · 🧪 ${m.pot} (F bebe) · ⚔ ${m.dmg}<br>Q/1 ${CL[m.cls].s[0]} · R/2 ${CL[m.cls].s[1]}<br>Objetivo: ${S.win?'VITÓRIA!':['Fale com o cachorro','Libertar Davy','Explorar a caverna','Salão dos Cogumelos','Ruínas: vença o Guardião','Cofre: derrote o Auditor','Derrote o Auditor'][Math.min(S.ev,6)]}<br>Jogadores: ${ps.length}`;if(m.dead)$('hud').innerHTML+='<br>☠ Caído... voltando'}}
function loop(){if(G.run||snap){if(MP.host||!MP.hostConn){if(!paused)step();draw(G)}else if(snap)draw({pl:Object.fromEntries(snap.p.map(p=>[p.id,p])),en:snap.e,pr:snap.pr,ev:snap.ev,win:snap.win})}
 requestAnimationFrame(loop)}
function rs(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',rs);rs();
function begin(){$('menu').hidden=true;$('hud').hidden=false;if(MP.host||!MP.hostConn){startWorld();MP.all({t:'start'})}}
function sendIn(){const i={...inp};inp.s1=inp.s2=inp.buy=inp.up=inp.pot=inp.atk&&false;i.atk=inp.atk=inp.mdown;if(MP.hostConn)MP.toHost({t:'in',i});else applyIn(MP.myId,i)}
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;const k=e.key.toLowerCase();if(k=='q'||k=='1')inp.s1=1;if(k=='r'||k=='2')inp.s2=1;if(k=='b')inp.buy=1;if(k=='n'){inp.buy=1;inp.up=1}if(k=='f')inp.pot=1;if(k=='j')inp.mdown=1;if(k=='p')paused=!paused});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=0;if(e.key=='j')inp.mdown=0});
cv.addEventListener('mousedown',()=>inp.mdown=1);addEventListener('mouseup',()=>inp.mdown=0);addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
setInterval(()=>{if(!G.run&&!snap)return;inp.dx=(keys.d?1:0)-(keys.a?1:0);inp.dy=(keys.s?1:0)-(keys.w?1:0);const m=(MP.hostConn?(snap&&snap.p.find(p=>p.id==MP.myId)):G.pl[MP.myId]);if(m){inp.ax=mouse.x+cam-m.x;inp.ay=mouse.y-(cv.height-H)/2-m.y}sendIn()},33);
MP.onMsg=m=>{if(m.t=='join'){G.pl[m.from]=mk(m.from,m.info);MP.toast(m.info.name+' entrou');lob()}
 else if(m.t=='in')applyIn(m.from,m.i);else if(m.t=='left'){MP.toast((G.pl[m.from]||{}).name+' saiu');delete G.pl[m.from];lob()}
 else if(m.t=='snap'){snap=m;if(!$('menu').hidden)begin()}else if(m.t=='dlg')dlg(m.l);else if(m.t=='start')begin();else if(m.t=='full')MP.toast('Sala cheia (máx. 4)')}
function lob(){$('lobby').innerHTML='Sala: <b>'+MP.code+'</b> ('+Object.keys(G.pl).length+'/4)<br>'+Object.values(G.pl).map(p=>p.name+' — '+CL[p.cls].n).join('<br>')}
$('solo').onclick=()=>{MP.myId='me';G.pl.me=mk('me',info());begin()};
$('criar').onclick=()=>MP.create(info(),id=>{G.pl[id]=mk(id,info());lob();$('start').hidden=false;navigator.clipboard&&navigator.clipboard.writeText(id);MP.toast('Código copiado!')});
$('entrar').onclick=()=>MP.join($('cod').value,info(),()=>{$('lobby').textContent='Conectado! Aguardando o anfitrião iniciar...'});
$('start').onclick=begin;
(function pv(){const c=$('prev').getContext('2d');c.clearRect(0,0,80,80);c.fillStyle=$('col').value;c.beginPath();c.arc(40,45,20,0,7);c.fill();c.fillStyle='#f1c9a0';c.beginPath();c.arc(40,22,11,0,7);c.fill();setTimeout(pv,300)})();
loop();
