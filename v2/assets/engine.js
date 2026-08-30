/* Motor dos Jogos da Bibel — v2.1. Le window.__G__ (dados do jogo) e desenha home + jogo.
   Sobre a v1:
   - emoji do conteudo vira SVG Twemoji (glyph.js)
   - entrada animada das opcoes, pop no acerto, cascata no tabuleiro
   - Playlearning: a instrucao aparece escrita, sempre, e da pra tocar pra ouvir de novo
   - mascote (Bia/Bel) na home e reagindo a acerto/erro
   - guarda de tempo de tela opcional (localStorage "bibel_screentime", em minutos)
   - figurinha por jogo concluido (localStorage "bibel_stickers")
   - motor novo "trace": tracar numero/letra/forma ligando os pontos
   Nenhuma mudanca no formato do dado. Idioma BR/EN via "bibel_lang", compartilhado com a v1. */
(function(){
var UI={
 pt:{falar:'Falar',somOff:'Som desligado',vamosJogar:'Vamos jogar!',achePares:'Ache os pares!',compartilhar:'↗ Compartilhar',linkCopiado:'✓ Link copiado',vocêConseguiu:'Você conseguiu!',muitoBem:'Muito bem!',terminouTudo:'Você terminou o jogo todo!',parabens:'Parabéns!',proximoNivel:'Próximo nível ➜',escolherNivel:'Escolher nível',tentaDeNovo:'Tenta de novo!',menu:'Menu',deNovo:'De novo',sobre:'Sobre',ouvir:'ouvir de novo',ganhouFig:'Ganhou uma figurinha!',descansar:'Hora de descansar os olhos',descansarSub:'A gente brinca mais depois. Chama um adulto.',souAdulto:'sou adulto, liberar',shareTxt:function(t){return t+', um joguinho de alfabetização da Bibel.';}},
 en:{falar:'Speak',somOff:'Sound off',vamosJogar:"Let's play!",achePares:'Find the pairs!',compartilhar:'↗ Share',linkCopiado:'✓ Link copied',vocêConseguiu:'You did it!',muitoBem:'Great job!',terminouTudo:'You finished the whole game!',parabens:'Congrats!',proximoNivel:'Next level ➜',escolherNivel:'Choose level',tentaDeNovo:'Try again!',menu:'Menu',deNovo:'Again',sobre:'About',ouvir:'hear it again',ganhouFig:'You earned a sticker!',descansar:'Time to rest your eyes',descansarSub:"We'll play more later. Ask a grown-up.",souAdulto:"I'm a grown-up, unlock",shareTxt:function(t){return t+", a learning game from Jogos da Bibel.";}}
};
function getLang(){try{return localStorage.getItem('bibel_lang')||'pt';}catch(e){return 'pt';}}
function setLang(l){try{localStorage.setItem('bibel_lang',l);}catch(e){}}
function getProfile(){try{return localStorage.getItem('bibel_profile')||'';}catch(e){return '';}}
function setProfile(p){try{if(p)localStorage.setItem('bibel_profile',p);else localStorage.removeItem('bibel_profile');}catch(e){}}
function applyProfile(){document.documentElement.setAttribute('data-profile', getProfile());}
applyProfile();
function T(v){if(v&&typeof v==='object'&&('pt' in v))return v[state.lang]||v.pt;return v;}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v==null?d:v;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}

var G=window.__G__;
var state={level:0,voice:true,completed:new Set(),lock:false,lang:getLang()};
function $(id){return document.getElementById(id);}
function G_(x){return window.glyph?window.glyph(x):x;}  // emoji do conteudo -> SVG Twemoji
function calm(){return document.documentElement.hasAttribute('data-calm');}  // modo baixo estimulo
var stageEl,paresEl,tempoEl,lvlNameEl,homeEl,gameEl,winEl,voiceBtn,langBtn;

function pt_(k){return UI[state.lang][k];}

/* --- voz --- */
var voices={pt:null,en:null};
function pickVoices(){
 if(!('speechSynthesis'in window))return;
 var vs=speechSynthesis.getVoices()||[];
 var pt=vs.filter(function(v){return /pt[-_ ]?BR|portugu/i.test((v.lang||'')+' '+(v.name||''));});
 var ptFem=pt.find(function(v){return /maria|luciana|francisca|fem|google|hel|vit|ana|julia|liv/i.test(v.name||'');});
 voices.pt=ptFem||pt[0]||null;
 var en=vs.filter(function(v){return /^en/i.test(v.lang||'');});
 var enFem=en.find(function(v){return /samantha|zira|female|google us|karen|victoria|susan/i.test(v.name||'');});
 voices.en=enFem||en[0]||null;
}
if('speechSynthesis'in window){pickVoices();speechSynthesis.onvoiceschanged=pickVoices;}
function say(t){
 if(!state.voice||!('speechSynthesis'in window)||!t)return;
 try{
  var u=new SpeechSynthesisUtterance(t);
  if(state.lang==='en'){u.lang='en-US';if(voices.en)u.voice=voices.en;u.rate=.98;u.pitch=1.35;}
  else{u.lang='pt-BR';if(voices.pt)u.voice=voices.pt;u.rate=.96;u.pitch=1.5;}
  speechSynthesis.cancel();speechSynthesis.speak(u);
 }catch(e){}
}

/* --- Playlearning: instrucao escrita + tocar pra repetir --- */
function promptCaption(txt){
 if(!txt)return '';
 return '<button class="prompt-say" type="button" aria-label="'+pt_('ouvir')+'">'
      + '<span class="spk">🔊</span><span class="txt">'+txt+'</span></button>';
}
function wireRepeat(txt){
 var b=stageEl.querySelector('.prompt-say');
 if(b)b.onclick=function(){say(txt);};
}

/* --- mascote reativa --- */
function mascotFor(){return window.mascoteHtml?window.mascoteHtml(G.turma,64,window.mascoteNome&&window.mascoteNome(G.turma)):'';}
function homeMascot(){
 if(!homeEl||homeEl.querySelector('.homemascote')||!window.mascoteHtml)return;
 var d=document.createElement('div');d.className='homemascote';d.innerHTML=mascotFor();
 var hero=$('hero');if(hero&&hero.parentNode)hero.parentNode.insertBefore(d,hero.nextSibling);
}
var reaxEl=null;
function ensureReax(){
 if(reaxEl||!gameEl||!window.mascoteHtml)return;
 reaxEl=document.createElement('div');reaxEl.className='mascote-reax';
 reaxEl.innerHTML='<span class="bolha"></span>'+mascotFor();
 gameEl.appendChild(reaxEl);
}
function reax(kind){
 ensureReax();if(!reaxEl)return;
 var bolha=reaxEl.querySelector('.bolha');
 if(bolha)bolha.textContent=kind==='ok'?'🎉':'🤔';
 reaxEl.classList.remove('ok','no');void reaxEl.offsetWidth;
 reaxEl.classList.add(kind==='ok'?'ok':'no');
}

/* --- guarda de tempo de tela --- */
var RG={
 key:'bibel_playlog',
 today:function(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();},
 limit:function(){var m=parseInt(lsGet('bibel_screentime','')||'0',10);return m>0?m:0;},
 read:function(){try{var o=JSON.parse(lsGet(this.key,'{}'));if(o.date!==this.today())o={date:this.today(),secs:0};return o;}catch(e){return {date:this.today(),secs:0};}},
 add:function(s){var o=this.read();o.secs+=s;lsSet(this.key,JSON.stringify(o));},
 over:function(){var l=this.limit();return l>0&&this.read().secs>=l*60;},
 unlock:function(){lsSet(this.key,JSON.stringify({date:this.today(),secs:0}));},
 tid:null,
 start:function(){var self=this;this.stop();if(!this.limit())return;this.tid=setInterval(function(){self.add(5);if(self.over()){self.stop();self.overlay();}},5000);},
 stop:function(){if(this.tid){clearInterval(this.tid);this.tid=null;}},
 overlay:function(){
  var el=$('restsheet');
  if(!el){el=document.createElement('div');el.id='restsheet';el.className='restsheet';document.body.appendChild(el);}
  el.innerHTML='<div class="restcard"><div class="reste">😴</div><h2>'+pt_('descansar')+'</h2><p>'+pt_('descansarSub')+'</p>'
    +'<button class="restadult" type="button">'+pt_('souAdulto')+'</button></div>';
  el.classList.add('show');
  try{speechSynthesis.cancel();}catch(e){}
  el.querySelector('.restadult').onclick=function(){RG.unlock();el.classList.remove('show');RG.start();};
 }
};

/* --- figurinhas --- */
function awardSticker(){
 try{
  var arr=JSON.parse(lsGet('bibel_stickers','[]'));
  if(arr.indexOf(G.slug)<0){arr.push(G.slug);lsSet('bibel_stickers',JSON.stringify(arr));return true;}
 }catch(e){}
 return false;
}

/* --- utilitarios --- */
var timer={sec:0,id:null};
function fmt(s){var m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x;}
function startTimer(){stopTimer();timer.sec=0;tempoEl.textContent='⏱ 00:00';timer.id=setInterval(function(){timer.sec++;tempoEl.textContent='⏱ '+fmt(timer.sec);},1000);}
function stopTimer(){if(timer.id){clearInterval(timer.id);timer.id=null;}}
function setStats(done,total){paresEl.textContent=done+'/'+total+' '+T(G.unit);}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function shake(el){el.classList.add('shake');setTimeout(function(){el.classList.remove('shake');},420);}

/* --- chrome (home, topbar, textos fixos) --- */
function renderChrome(){
 $('kicker').textContent=T(G.i18n).kicker;
 $('h1').textContent=T(G.i18n).title;
 $('tag').textContent=T(G.i18n).tag;
 $('hero').innerHTML=G_(G.hero);
 $('hint').textContent=T(G.i18n).hint;
 $('aboutTitle').textContent=T(G.i18n).title;
 $('aboutEmoji').innerHTML=G_(G.hero);
 $('aboutTxt').innerHTML=T(G.i18n).about;
 document.title=T(G.i18n).title+' · Jogos da Bibel';
 if($('infoBtn'))$('infoBtn').setAttribute('aria-label',pt_('sobre'));
 if($('againBtn'))$('againBtn').title=pt_('deNovo');
 var menuLinks=document.querySelectorAll('[data-menu]');menuLinks.forEach(function(a){a.title=pt_('menu');a.setAttribute('aria-label',pt_('menu'));});
 homeMascot();
 refreshVoice();
 refreshShareLabel();
 refreshLangBtn();
}
function refreshVoice(){if(!voiceBtn)return;voiceBtn.classList.toggle('off',!state.voice);voiceBtn.innerHTML='<span class="sw"></span> '+(state.voice?pt_('falar'):pt_('somOff'));}
function refreshShareLabel(){var b=$('shareBtn');if(b)b.textContent=pt_('compartilhar');}
function refreshLangBtn(){if(!langBtn)return;langBtn.querySelector('.pt').classList.toggle('on',state.lang==='pt');langBtn.querySelector('.en').classList.toggle('on',state.lang==='en');}

function renderHome(){
 var L=$('levels');L.innerHTML='';
 curLevels().forEach(function(lv,i){
  var done=state.completed.has(i);
  var b=document.createElement('button');
  b.className='lvl'+(done?' done':'');
  b.innerHTML='<span class="num">'+(i+1)+'</span><span class="meta"><b>'+T(lv.nome)+'</b><span>'+T(lv.sub)+'</span></span><span class="star">'+(done?'⭐':'')+'</span>';
  b.onclick=function(){startLevel(i);};
  L.appendChild(b);
 });
}
function curLevels(){return G.levels||T(G.i18n).levels;}
function startLevel(i){
 if(RG.over()){RG.overlay();return;}
 state.level=i;state.err=0;lvlNameEl.textContent=T(curLevels()[i].nome);homeEl.style.display='none';gameEl.classList.add('active');window.scrollTo(0,0);
 RG.start();engineStart(i);
}
function finishLevel(){
 stopTimer();RG.stop();state.completed.add(state.level);
 try{localStorage.setItem('bibel_'+G.slug,JSON.stringify(Array.from(state.completed)));}catch(e){}
 var last=state.level===curLevels().length-1;
 var gotFig=last?awardSticker():false;
 $('winEmoji').innerHTML=G_(last?'🏆':'🎉');
 if($('winMascote'))$('winMascote').innerHTML=window.mascoteHtml?window.mascoteHtml(G.turma,64,window.mascoteNome(G.turma)):'';
 $('winH').textContent=pt_('vocêConseguiu');
 $('winMsg').innerHTML=(last?pt_('terminouTudo'):pt_('muitoBem'))+'   ⏱ '+fmt(timer.sec)
   +(gotFig?'<span class="figline">'+G_(G.hero)+' '+pt_('ganhouFig')+'</span>':'');
 $('nextBtn').textContent=pt_('proximoNivel');
 $('nextBtn').style.display=last?'none':'block';
 $('nextBtn').classList.toggle('nudge', !last && (state.err||0)===0);  // empurrao adaptativo: acertou tudo, sobe
 $('homeBtn').textContent=pt_('escolherNivel');
 winEl.classList.add('show');confetti();say(last?pt_('parabens'):pt_('muitoBem'));
}
function goHome(){stopTimer();RG.stop();gameEl.classList.remove('active');homeEl.style.display='flex';renderHome();window.scrollTo(0,0);}

function burst(x,y){if(calm())return;var box=$('confetti');var c=['#ffc23f','#3aa7ff','#ff6f9c','#2bb673','#d97757'];for(var i=0;i<14;i++){var p=document.createElement('div');p.className='spark';var a=Math.random()*6.28,d=36+Math.random()*54;p.style.left=x+'px';p.style.top=y+'px';p.style.background=c[i%c.length];p.style.setProperty('--dx',(Math.cos(a)*d).toFixed(0)+'px');p.style.setProperty('--dy',(Math.sin(a)*d).toFixed(0)+'px');box.appendChild(p);setTimeout(function(){p.remove();},720);}}
function confetti(){if(calm())return;var box=$('confetti');var c=['#ffc23f','#3aa7ff','#ff6f9c','#2bb673','#d97757'];for(var i=0;i<70;i++){var d=document.createElement('div');d.className='conf';d.style.left=Math.random()*100+'vw';d.style.background=c[i%c.length];d.style.animationDuration=(2+Math.random()*1.5)+'s';d.style.animationDelay=(Math.random()*.4)+'s';box.appendChild(d);setTimeout(function(){d.remove();},4000);}}

/* --- engines --- */
function promptHtml(r){var s=r.show;if(!s)return '';
 if(s.k==='letter')return '<div class="big-letter">'+T(s.v)+'</div>';
 if(s.k==='emoji')return '<div class="emoji-xl">'+G_(T(s.v))+'</div>'+(s.w?'<div class="promptword">'+T(s.w)+'</div>':'');
 if(s.k==='word')return '<div class="bigword">'+T(s.v)+'</div>';
 if(s.k==='count'){var h='<div class="countrow">';var v=G_(T(s.v));for(var i=0;i<s.n;i++)h+='<span>'+v+'</span>';return h+'</div>';}
 return '';}
function optHtml(o){if(o.emoji)return '<span class="oe"'+(o.scale?' style="display:inline-block;transform:scale('+o.scale+')"':'')+'>'+G_(T(o.emoji))+'</span>'+(o.t?'<span class="ol">'+T(o.t)+'</span>':'');if(o.letter)return '<span class="big-letter">'+T(o.letter)+'</span>';return '<span class="ol" style="font-size:30px">'+T(o.t)+'</span>';}

function engineChoice(i){
 var lv=curLevels()[i];var rounds=shuffle(lv.rounds.slice());var ri=0;startTimer();
 function show(){
  if(ri>=rounds.length){finishLevel();return;}
  setStats(ri,rounds.length);var r=rounds[ri];var sayTxt=T(r.say);
  var h='<div class="prompt">'+promptHtml(r)+promptCaption(sayTxt)+'</div><div class="options'+(r.grid?' grid':'')+'">';
  var opts=r.shuffle===false?r.opts:shuffle(r.opts.slice());
  opts.forEach(function(o,k){h+='<button class="opt" style="--i:'+k+'" data-k="'+k+'">'+optHtml(o)+'</button>';});
  h+='</div>';stageEl.innerHTML=h;say(sayTxt);wireRepeat(sayTxt);
  var need=r.multi?opts.filter(function(o){return o.correct;}).length:1;var got=0;
  stageEl.querySelectorAll('.opt').forEach(function(btn){
   btn.onclick=function(){
    if(btn.classList.contains('done'))return;var o=opts[+btn.dataset.k];
    if(o.correct){
     btn.classList.add('ok','done','pop');var rc=btn.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);reax('ok');
     if(!calm()&&window.mascoteHtml){var st=document.createElement('span');st.className='stamp';st.innerHTML=window.mascoteHtml(G.turma,34);btn.appendChild(st);}
     if(o.say)say(T(o.say));else if(o.t)say(String(T(o.t)));
     got++;
     if(got>=need){ri++;setStats(ri,rounds.length);setTimeout(show,850);}
    }else{
     state.err++;btn.classList.add('bad');shake(btn);reax('no');say(pt_('tentaDeNovo'));setTimeout(function(){btn.classList.remove('bad');},500);
    }
   };
  });
 }
 show();
}

function engineMemory(i){
 var lv=curLevels()[i];var cards=lv.cards.slice();var pairs=cards.length/2;var matched=0;var first=null;state.lock=true;setStats(0,pairs);
 var deck=shuffle(cards.slice());var sayTxt=T(lv.say)||pt_('achePares');
 var h='<div class="prompt slim">'+promptCaption(sayTxt)+'</div><div class="board'+(deck.length>9?' c4':'')+'">';
 deck.forEach(function(c,ci){h+='<div class="card flipped" style="--i:'+ci+'" data-key="'+T(c.key)+'" data-say="'+(T(c.say)||'')+'"><div class="face back"></div><div class="face front">'+G_(T(c.html))+'</div></div>';});
 h+='</div>';stageEl.innerHTML=h;say(sayTxt);wireRepeat(sayTxt);
 var els=stageEl.querySelectorAll('.card');
 els.forEach(function(card){card.addEventListener('click',function(){onPick(card);});});
 setTimeout(function(){els.forEach(function(c){if(!c.classList.contains('matched'))c.classList.remove('flipped');});state.lock=false;startTimer();},2200);
 function onPick(card){
  if(state.lock)return;if(card.classList.contains('flipped')||card.classList.contains('matched'))return;
  card.classList.add('flipped');if(card.dataset.say)say(card.dataset.say);
  if(!first){first=card;return;}var a=first,b=card;first=null;
  if(a.dataset.key===b.dataset.key&&a!==b){
   state.lock=true;
   setTimeout(function(){a.classList.add('matched');b.classList.add('matched');var rc=b.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);reax('ok');matched++;setStats(matched,pairs);state.lock=false;if(matched===pairs)setTimeout(finishLevel,700);},420);
  }else{
   state.lock=true;setTimeout(function(){a.classList.remove('flipped');b.classList.remove('flipped');state.lock=false;},950);
  }
 }
}

function engineOrder(i){
 var lv=curLevels()[i];var rounds=shuffle(lv.rounds.slice());var ri=0;startTimer();
 function show(){
  if(ri>=rounds.length){finishLevel();return;}
  setStats(ri,rounds.length);var r=rounds[ri];var placed=0;var items=T(r.items);var pool=shuffle(items.slice());var sayTxt=T(r.say);
  var h='<div class="prompt">'+(r.emoji?'<div class="emoji-xl">'+G_(r.emoji)+'</div>':'')+'<div class="slots">';
  items.forEach(function(_,k){h+='<span class="slot" data-i="'+k+'"></span>';});h+='</div>'+promptCaption(sayTxt)+'</div><div class="options">';
  pool.forEach(function(it){h+='<button class="opt" data-v="'+it+'"><span class="ol" style="font-size:26px">'+it+'</span></button>';});
  h+='</div>';stageEl.innerHTML=h;say(sayTxt);wireRepeat(sayTxt);
  stageEl.querySelectorAll('.opt').forEach(function(btn){
   btn.onclick=function(){
    if(btn.classList.contains('done'))return;
    if(btn.dataset.v===String(items[placed])){
     var sl=stageEl.querySelector('.slot[data-i="'+placed+'"]');sl.textContent=btn.dataset.v;sl.classList.add('filled');btn.classList.add('ok','done');
     var rc=btn.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);reax('ok');say(String(btn.dataset.v));placed++;
     if(placed>=items.length){
      if(r.word)setTimeout(function(){say(T(r.word)+'!');},350);
      ri++;setStats(ri,rounds.length);setTimeout(show,1100);
     }
    }else{state.err++;btn.classList.add('bad');shake(btn);reax('no');setTimeout(function(){btn.classList.remove('bad');},500);}
   };
  });
 }
 show();
}

/* motor "trace": ligar os pontos na ordem, tracando o glifo por cima do guia.
   dado do round: { say, guide:"1", dots:[[x,y],...] }  coords em viewBox 0..100 */
function engineTrace(i){
 var lv=curLevels()[i];var rounds=shuffle(lv.rounds.slice());var ri=0;startTimer();
 function show(){
  if(ri>=rounds.length){finishLevel();return;}
  setStats(ri,rounds.length);var r=rounds[ri];var dots=r.dots||[];var next=0;var sayTxt=T(r.say);
  var pts='';for(var d=0;d<dots.length;d++){
   pts+='<circle class="tdot" data-i="'+d+'" cx="'+dots[d][0]+'" cy="'+dots[d][1]+'" r="7"></circle>'
      + '<text class="tnum" x="'+dots[d][0]+'" y="'+(dots[d][1]+3.2)+'">'+(d+1)+'</text>';
  }
  var h='<div class="prompt slim">'+promptCaption(sayTxt)+'</div>'
   +'<div class="tracewrap"><svg viewBox="0 0 100 100" aria-hidden="true">'
   +'<text class="tguide" x="50" y="72">'+(r.guide||'')+'</text>'
   +'<polyline class="tline" points=""></polyline>'+pts+'</svg></div>';
  stageEl.innerHTML=h;say(sayTxt);wireRepeat(sayTxt);
  var svg=stageEl.querySelector('svg');var line=svg.querySelector('.tline');var got=[];
  function pt(evt){var rc=svg.getBoundingClientRect();var t=evt.touches&&evt.touches[0]||evt;
   return {x:(t.clientX-rc.left)/rc.width*100,y:(t.clientY-rc.top)/rc.height*100};}
  function tryHit(p){
   if(next>=dots.length)return;
   var dx=p.x-dots[next][0],dy=p.y-dots[next][1];
   if(dx*dx+dy*dy<=90){
    var c=svg.querySelector('.tdot[data-i="'+next+'"]');if(c)c.classList.add('hit');
    got.push(dots[next][0]+','+dots[next][1]);line.setAttribute('points',got.join(' '));
    var rc=(c||svg).getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);
    next++;
    if(next>=dots.length){
     line.classList.add('done');reax('ok');say(String(r.guide||''));
     ri++;setStats(ri,rounds.length);setTimeout(show,900);
    }
   }
  }
  function move(e){tryHit(pt(e));if(e.cancelable)e.preventDefault();}
  svg.addEventListener('mousedown',move);svg.addEventListener('mousemove',function(e){if(e.buttons)move(e);});
  svg.addEventListener('touchstart',move,{passive:false});svg.addEventListener('touchmove',move,{passive:false});
  svg.addEventListener('click',move);
 }
 show();
}

function engineStart(i){
 if(G.engine==='memory')engineMemory(i);
 else if(G.engine==='order')engineOrder(i);
 else if(G.engine==='trace')engineTrace(i);
 else engineChoice(i);
}

/* --- boot --- */
function boot(){
 stageEl=$('stage');paresEl=$('paresInfo');tempoEl=$('tempoInfo');lvlNameEl=$('lvlName');homeEl=$('home');gameEl=$('game');winEl=$('win');voiceBtn=$('voiceBtn');langBtn=$('langBtn');
 try{var sv=JSON.parse(localStorage.getItem('bibel_'+G.slug)||'[]');state.completed=new Set(sv);}catch(e){}
 if(lsGet('bibel_calm','')==='1')document.documentElement.setAttribute('data-calm','');
 renderChrome();renderHome();
 if(RG.over())RG.overlay();

 if(voiceBtn)voiceBtn.onclick=function(){state.voice=!state.voice;refreshVoice();if(state.voice)say(pt_('vamosJogar'));};
 var shareBtn=$('shareBtn');
 if(shareBtn)shareBtn.onclick=async function(){
  var url=location.href.split('#')[0];var txt=pt_('shareTxt')(T(G.i18n).title);
  try{
   if(navigator.share){await navigator.share({title:T(G.i18n).title+' · Jogos da Bibel',text:txt,url:url});}
   else{await navigator.clipboard.writeText(url);this.textContent=pt_('linkCopiado');}
  }catch(e){}
 };
 var nextBtn=$('nextBtn');if(nextBtn)nextBtn.onclick=function(){winEl.classList.remove('show');startLevel(Math.min(state.level+1,curLevels().length-1));};
 var homeBtn=$('homeBtn');if(homeBtn)homeBtn.onclick=function(){winEl.classList.remove('show');goHome();};
 var againBtn=$('againBtn');if(againBtn)againBtn.onclick=function(){startLevel(state.level);};
 var aboutEl=$('about'),infoBtn=$('infoBtn'),aboutClose=$('aboutClose');
 if(infoBtn)infoBtn.onclick=function(){aboutEl.classList.add('show');};
 if(aboutClose)aboutClose.onclick=function(){aboutEl.classList.remove('show');};
 if(aboutEl)aboutEl.onclick=function(e){if(e.target===aboutEl)aboutEl.classList.remove('show');};
 if(langBtn)langBtn.onclick=function(){
  state.lang=state.lang==='pt'?'en':'pt';setLang(state.lang);
  renderChrome();
  if(gameEl.classList.contains('active'))engineStart(state.level);else renderHome();
 };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.__bibelEngine__={getLang:getLang,setLang:setLang};
})();
