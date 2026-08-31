/* Motor compartilhado dos Jogos da Bibel. Le window.__G__ (dados do jogo) e desenha home + jogo.
   Suporta idioma BR/EN via chave localStorage "bibel_lang", compartilhada entre todos os jogos e o hub. */
(function(){
var UI={
 pt:{falar:'Falar',somOff:'Som desligado',vamosJogar:'Vamos jogar!',achePares:'Ache os pares!',compartilhar:'↗ Compartilhar',linkCopiado:'✓ Link copiado',vocêConseguiu:'Você conseguiu!',muitoBem:'Muito bem!',terminouTudo:'Você terminou o jogo todo!',parabens:'Parabéns!',proximoNivel:'Próximo nível ➜',escolherNivel:'Escolher nível',tentaDeNovo:'Tenta de novo!',menu:'Menu',deNovo:'De novo',sobre:'Sobre',shareTxt:function(t){return t+', um joguinho de alfabetização da Bibel.';}},
 en:{falar:'Speak',somOff:'Sound off',vamosJogar:"Let's play!",achePares:'Find the pairs!',compartilhar:'↗ Share',linkCopiado:'✓ Link copied',vocêConseguiu:'You did it!',muitoBem:'Great job!',terminouTudo:'You finished the whole game!',parabens:'Congrats!',proximoNivel:'Next level ➜',escolherNivel:'Choose level',tentaDeNovo:'Try again!',menu:'Menu',deNovo:'Again',sobre:'About',shareTxt:function(t){return t+", a learning game from Jogos da Bibel.";}}
};
function getLang(){try{return localStorage.getItem('bibel_lang')||'pt';}catch(e){return 'pt';}}
function setLang(l){try{localStorage.setItem('bibel_lang',l);}catch(e){}}
function getProfile(){try{return localStorage.getItem('bibel_profile')||'';}catch(e){return '';}}
function setProfile(p){try{if(p)localStorage.setItem('bibel_profile',p);else localStorage.removeItem('bibel_profile');}catch(e){}}
function applyProfile(){document.documentElement.setAttribute('data-profile', getProfile());}
applyProfile();
function T(v){if(v&&typeof v==='object'&&('pt' in v))return v[state.lang]||v.pt;return v;}

var G=window.__G__;
var state={level:0,voice:true,completed:new Set(),lock:false,lang:getLang()};
function $(id){return document.getElementById(id);}
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
 $('hero').textContent=G.hero;
 $('hint').textContent=T(G.i18n).hint;
 $('aboutTitle').textContent=T(G.i18n).title;
 $('aboutEmoji').textContent=G.hero;
 $('aboutTxt').innerHTML=T(G.i18n).about;
 document.title=T(G.i18n).title+' · Jogos da Bibel';
 if($('infoBtn'))$('infoBtn').setAttribute('aria-label',pt_('sobre'));
 if($('againBtn'))$('againBtn').title=pt_('deNovo');
 var menuLinks=document.querySelectorAll('[data-menu]');menuLinks.forEach(function(a){a.title=pt_('menu');a.setAttribute('aria-label',pt_('menu'));});
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
function startLevel(i){state.level=i;lvlNameEl.textContent=T(curLevels()[i].nome);homeEl.style.display='none';gameEl.classList.add('active');window.scrollTo(0,0);engineStart(i);}
function finishLevel(){
 stopTimer();state.completed.add(state.level);
 try{localStorage.setItem('bibel_'+G.slug,JSON.stringify(Array.from(state.completed)));}catch(e){}
 var last=state.level===curLevels().length-1;
 $('winEmoji').textContent=last?'🏆':'🎉';
 if($('winMascote'))$('winMascote').innerHTML=window.mascoteHtml?window.mascoteHtml(G.turma,64,window.mascoteNome(G.turma)):'';
 $('winH').textContent=pt_('vocêConseguiu');
 $('winMsg').textContent=(last?pt_('terminouTudo'):pt_('muitoBem'))+'   ⏱ '+fmt(timer.sec);
 $('nextBtn').textContent=pt_('proximoNivel');
 $('nextBtn').style.display=last?'none':'block';
 $('homeBtn').textContent=pt_('escolherNivel');
 winEl.classList.add('show');confetti();say(last?pt_('parabens'):pt_('muitoBem'));
}
function goHome(){stopTimer();gameEl.classList.remove('active');homeEl.style.display='flex';renderHome();window.scrollTo(0,0);}

function burst(x,y){var box=$('confetti');var c=['#ffc23f','#3aa7ff','#ff6f9c','#2bb673','#d97757'];for(var i=0;i<14;i++){var p=document.createElement('div');p.className='spark';var a=Math.random()*6.28,d=36+Math.random()*54;p.style.left=x+'px';p.style.top=y+'px';p.style.background=c[i%c.length];p.style.setProperty('--dx',(Math.cos(a)*d).toFixed(0)+'px');p.style.setProperty('--dy',(Math.sin(a)*d).toFixed(0)+'px');box.appendChild(p);setTimeout(function(){p.remove();},720);}}
function confetti(){var box=$('confetti');var c=['#ffc23f','#3aa7ff','#ff6f9c','#2bb673','#d97757'];for(var i=0;i<70;i++){var d=document.createElement('div');d.className='conf';d.style.left=Math.random()*100+'vw';d.style.background=c[i%c.length];d.style.animationDuration=(2+Math.random()*1.5)+'s';d.style.animationDelay=(Math.random()*.4)+'s';box.appendChild(d);setTimeout(function(){d.remove();},4000);}}

/* --- engines --- */
function promptHtml(r){var s=r.show;if(!s)return '';
 if(s.k==='letter')return '<div class="big-letter">'+T(s.v)+'</div>';
 if(s.k==='emoji')return '<div class="emoji-xl">'+T(s.v)+'</div>'+(s.w?'<div class="promptword">'+T(s.w)+'</div>':'');
 if(s.k==='word')return '<div class="bigword">'+T(s.v)+'</div>';
 if(s.k==='count'){var h='<div class="countrow">';var v=T(s.v);for(var i=0;i<s.n;i++)h+='<span>'+v+'</span>';return h+'</div>';}
 return '';}
function optHtml(o){if(o.emoji)return '<span class="oe"'+(o.scale?' style="display:inline-block;transform:scale('+o.scale+')"':'')+'>'+T(o.emoji)+'</span>'+(o.t?'<span class="ol">'+T(o.t)+'</span>':'');if(o.letter)return '<span class="big-letter">'+T(o.letter)+'</span>';return '<span class="ol" style="font-size:30px">'+T(o.t)+'</span>';}

function engineChoice(i){
 var lv=curLevels()[i];var rounds=shuffle(lv.rounds.slice());var ri=0;startTimer();
 function show(){
  if(ri>=rounds.length){finishLevel();return;}
  setStats(ri,rounds.length);var r=rounds[ri];
  var h='<div class="prompt">'+promptHtml(r)+'</div><div class="options'+(r.grid?' grid':'')+'">';
  var opts=r.shuffle===false?r.opts:shuffle(r.opts.slice());
  opts.forEach(function(o,k){h+='<button class="opt" data-k="'+k+'">'+optHtml(o)+'</button>';});
  h+='</div>';stageEl.innerHTML=h;say(T(r.say));
  var need=r.multi?opts.filter(function(o){return o.correct;}).length:1;var got=0;
  stageEl.querySelectorAll('.opt').forEach(function(btn){
   btn.onclick=function(){
    if(btn.classList.contains('done'))return;var o=opts[+btn.dataset.k];
    if(o.correct){
     btn.classList.add('ok','done');var rc=btn.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);
     if(o.say)say(T(o.say));got++;
     if(got>=need){ri++;setStats(ri,rounds.length);setTimeout(show,850);}
    }else{
     btn.classList.add('bad');shake(btn);say(pt_('tentaDeNovo'));setTimeout(function(){btn.classList.remove('bad');},500);
    }
   };
  });
 }
 show();
}

function engineMemory(i){
 var lv=curLevels()[i];var cards=lv.cards.slice();var pairs=cards.length/2;var matched=0;var first=null;state.lock=true;setStats(0,pairs);
 var deck=shuffle(cards.slice());
 var h='<div class="board'+(deck.length>9?' c4':'')+'">';
 deck.forEach(function(c){h+='<div class="card flipped" data-key="'+T(c.key)+'" data-say="'+(T(c.say)||'')+'"><div class="face back"></div><div class="face front">'+T(c.html)+'</div></div>';});
 h+='</div>';stageEl.innerHTML=h;say(T(lv.say)||pt_('achePares'));
 var els=stageEl.querySelectorAll('.card');
 els.forEach(function(card){card.addEventListener('click',function(){onPick(card);});});
 setTimeout(function(){els.forEach(function(c){if(!c.classList.contains('matched'))c.classList.remove('flipped');});state.lock=false;startTimer();},2200);
 function onPick(card){
  if(state.lock)return;if(card.classList.contains('flipped')||card.classList.contains('matched'))return;
  card.classList.add('flipped');if(card.dataset.say)say(card.dataset.say);
  if(!first){first=card;return;}var a=first,b=card;first=null;
  if(a.dataset.key===b.dataset.key&&a!==b){
   state.lock=true;
   setTimeout(function(){a.classList.add('matched');b.classList.add('matched');var rc=b.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);matched++;setStats(matched,pairs);state.lock=false;if(matched===pairs)setTimeout(finishLevel,700);},420);
  }else{
   state.lock=true;setTimeout(function(){a.classList.remove('flipped');b.classList.remove('flipped');state.lock=false;},950);
  }
 }
}

function engineOrder(i){
 var lv=curLevels()[i];var rounds=shuffle(lv.rounds.slice());var ri=0;startTimer();
 function show(){
  if(ri>=rounds.length){finishLevel();return;}
  setStats(ri,rounds.length);var r=rounds[ri];var placed=0;var items=T(r.items);var pool=shuffle(items.slice());
  var h='<div class="prompt">'+(r.emoji?'<div class="emoji-xl">'+r.emoji+'</div>':'')+'<div class="slots">';
  items.forEach(function(_,k){h+='<span class="slot" data-i="'+k+'"></span>';});h+='</div></div><div class="options">';
  pool.forEach(function(it){h+='<button class="opt" data-v="'+it+'"><span class="ol" style="font-size:26px">'+it+'</span></button>';});
  h+='</div>';stageEl.innerHTML=h;say(T(r.say));
  stageEl.querySelectorAll('.opt').forEach(function(btn){
   btn.onclick=function(){
    if(btn.classList.contains('done'))return;
    if(btn.dataset.v===String(items[placed])){
     var sl=stageEl.querySelector('.slot[data-i="'+placed+'"]');sl.textContent=btn.dataset.v;sl.classList.add('filled');btn.classList.add('ok','done');
     var rc=btn.getBoundingClientRect();burst(rc.left+rc.width/2,rc.top+rc.height/2);say(String(btn.dataset.v));placed++;
     if(placed>=items.length){
      if(r.word)setTimeout(function(){say(T(r.word)+'!');},350);
      ri++;setStats(ri,rounds.length);setTimeout(show,1100);
     }
    }else{btn.classList.add('bad');shake(btn);setTimeout(function(){btn.classList.remove('bad');},500);}
   };
  });
 }
 show();
}

function engineStart(i){
 if(G.engine==='memory')engineMemory(i);
 else if(G.engine==='order')engineOrder(i);
 else engineChoice(i);
}

/* --- boot --- */
function boot(){
 stageEl=$('stage');paresEl=$('paresInfo');tempoEl=$('tempoInfo');lvlNameEl=$('lvlName');homeEl=$('home');gameEl=$('game');winEl=$('win');voiceBtn=$('voiceBtn');langBtn=$('langBtn');
 try{var sv=JSON.parse(localStorage.getItem('bibel_'+G.slug)||'[]');state.completed=new Set(sv);}catch(e){}
 renderChrome();renderHome();

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
