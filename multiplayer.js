// Multiplayer WebRTC (PeerJS). O criador da sala é a autoridade da simulação.
const MP={peer:null,host:false,conns:{},hostConn:null,myId:'me',code:'',onMsg:null,
toast(t){const e=document.getElementById('toast');e.textContent=t;clearTimeout(MP.tt);MP.tt=setTimeout(()=>e.textContent='',3500)},
err(e){MP.toast('Servidor de sinalização indisponível ou código inválido: '+(e.type||e))},
create(info,cb){MP.host=true;MP.peer=new Peer();
 MP.peer.on('error',MP.err);
 MP.peer.on('open',id=>{MP.code=id;MP.myId=id;cb(id)});
 MP.peer.on('connection',c=>{
  if(Object.keys(MP.conns).length>=3){c.on('open',()=>{c.send({t:'full'});c.close()});return}
  c.on('open',()=>{MP.conns[c.peer]=c});
  c.on('data',m=>{m.from=c.peer;MP.onMsg(m)});
  c.on('close',()=>{delete MP.conns[c.peer];MP.onMsg({t:'left',from:c.peer})});
 })},
join(code,info,cb){MP.host=false;MP.peer=new Peer();MP.peer.on('error',MP.err);
 MP.peer.on('open',id=>{MP.myId=id;const c=MP.peer.connect(code.trim(),{reliable:false});MP.hostConn=c;
  c.on('open',()=>{c.send({t:'join',info});cb()});
  c.on('data',m=>MP.onMsg(m));
  c.on('close',()=>{MP.toast('Conexão com o anfitrião perdida');MP.onMsg({t:'hostlost'})})})},
toHost(m){if(MP.hostConn&&MP.hostConn.open)MP.hostConn.send(m)},
all(m){for(const k in MP.conns)if(MP.conns[k].open)MP.conns[k].send(m)}};
