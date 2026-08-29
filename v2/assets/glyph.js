/* glyph.js — troca o emoji do CONTEÚDO por um SVG Twemoji local, sem tocar no dado.
   O bloco window.__G__ continua com "🔴"; quem renderiza chama glyph("🔴").
   Usado pelo engine.js (jogos) e pelo index.html (hub).
   Se o SVG não existir, cai de volta para o emoji de texto (onerror). */
(function(){
  // base de assets, derivada da própria tag <script src=".../glyph.js">
  var base = (function(){
    var s = document.currentScript;
    if(!s){
      var all = document.getElementsByTagName('script');
      for(var i = all.length - 1; i >= 0; i--){
        if(/glyph\.js(\?|$)/.test(all[i].src)){ s = all[i]; break; }
      }
    }
    return s ? s.src.replace(/glyph\.js.*$/, '') : 'assets/';
  })();

  // sequência de emoji: keycap, bandeira, base + seletor/tom de pele + ZWJ
  var RE = /([0-9#*]️?⃣|[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F000}-\u{1FAFF}☀-➿⬀-⯿←-⇿⌀-⏿](?:️)?(?:[\u{1F3FB}-\u{1F3FF}])?(?:‍[\u{1F000}-\u{1FAFF}☀-➿][️\u{1F3FB}-\u{1F3FF}]?)*)/gu;

  function toName(str){
    return Array.from(str)
      .map(function(c){ return c.codePointAt(0).toString(16); })
      .filter(function(c){ return c !== 'fe0f'; })  // Twemoji remove o seletor de variação
      .join('-');
  }

  // troca cada emoji da string por <img>; texto comum passa intacto
  window.glyph = function(input, opts){
    if(input == null) return '';
    opts = opts || {};
    var cls = 'gly' + (opts.cls ? ' ' + opts.cls : '');
    return String(input).replace(RE, function(m){
      var src = base + 'emoji/' + toName(m) + '.svg';
      return '<img class="' + cls + '" draggable="false" alt="' + m + '" src="' + src + '" ' +
             'onerror="this.replaceWith(document.createTextNode(this.alt))">';
    });
  };
  window.glyph.base = base;
})();
