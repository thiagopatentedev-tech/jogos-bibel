/* Mascotes da Bibel: Bia (Pré II) e Bel (Maternal II). Independente do engine.js
   para poder ser usado tanto nos jogos quanto no hub (jogo/index.html). */
(function(){
var BUSTOS={
 bia:'<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice"><rect x="70" y="168" width="80" height="40" fill="#ff8fb3"/><path d="M58 92 Q37 105 35 130 Q34 150 40 160 Q46 166 56 160 Q62 154 62 138 Q60 115 60 96 Z" fill="#6b4527"/><path d="M162 92 Q183 105 185 130 Q186 150 180 160 Q174 166 164 160 Q158 154 158 138 Q160 115 160 96 Z" fill="#6b4527"/><circle cx="110" cy="102" r="58" fill="#6b4527"/><ellipse cx="110" cy="124" rx="46" ry="40" fill="#e8b088"/><path d="M66 106 Q80 84 110 82 Q140 84 154 106 Q140 118 110 114 Q80 118 66 106 Z" fill="#6b4527"/><circle cx="88" cy="120" r="6" fill="#3a2416"/><circle cx="132" cy="120" r="6" fill="#3a2416"/><ellipse cx="70" cy="133" rx="8" ry="5" fill="#ff9d8a" opacity=".55"/><ellipse cx="150" cy="133" rx="8" ry="5" fill="#ff9d8a" opacity=".55"/><path d="M92 146 Q110 160 128 146" stroke="#7c2410" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
 bel:'<svg viewBox="0 0 220 208" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin slice"><rect x="66" y="176" width="88" height="32" fill="#8fc7ff"/><path d="M50 128 q-16 22 -8 50 q11 7 16 -4 q-9 -22 -8 -46z" fill="#6b4527"/><path d="M170 128 q16 22 8 50 q-11 7 -16 -4 q9 -22 8 -46z" fill="#6b4527"/><circle cx="48" cy="120" r="8" fill="#7ec8e3"/><circle cx="172" cy="120" r="8" fill="#ff8fb3"/><circle cx="110" cy="106" r="60" fill="#6b4527"/><ellipse cx="110" cy="130" rx="48" ry="42" fill="#e8b088"/><path d="M64 110 Q80 86 110 84 Q140 86 156 110 Q142 122 110 118 Q78 122 64 110 Z" fill="#6b4527"/><circle cx="90" cy="126" r="6.5" fill="#3a2416"/><circle cx="130" cy="126" r="6.5" fill="#3a2416"/><ellipse cx="72" cy="139" rx="8" ry="5" fill="#ff9d8a" opacity=".55"/><ellipse cx="148" cy="139" rx="8" ry="5" fill="#ff9d8a" opacity=".55"/><path d="M92 152 Q110 164 128 152" stroke="#7c2410" stroke-width="4" fill="none" stroke-linecap="round"/></svg>'
};
var ACCENT={bia:'#ff8fb3',bel:'#8fc7ff'};
function nomeFor(turma){return turma==='p2'?'bia':turma==='m2'?'bel':null;}
window.mascoteHtml=function(turma,size,alt){
 var nome=nomeFor(turma);if(!nome)return '';
 size=size||64;
 return '<span class="mascote" role="img" aria-label="'+(alt||nome)+'" style="display:inline-flex;width:'+size+'px;height:'+size+'px;flex:0 0 '+size+'px;border-radius:50%;background:#fff;overflow:hidden;box-shadow:0 0 0 4px '+ACCENT[nome]+' inset,0 3px 0 rgba(124,36,16,.12)">'+BUSTOS[nome]+'</span>';
};
window.mascoteNome=function(turma){var n=nomeFor(turma);return n?(n==='bia'?'Bia':'Bel'):'';};
})();
