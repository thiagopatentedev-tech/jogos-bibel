# Jogos da Bibel — v2

Trilha paralela à v1. Os 23 jogos originais na raiz do repositório **não foram tocados**. Aqui vive a versão com mais acabamento.

Abrir: sirva a raiz do repositório (`python -m http.server`) e vá em `/v2/`.

## O que a v2 tem a mais

| Área | v1 | v2 |
|---|---|---|
| Figuras | emoji do sistema (varia por aparelho) | SVG Twemoji local e consistente (`assets/emoji/`, via `assets/glyph.js`), com fallback pro emoji de texto |
| Movimento | básico | entrada escalonada das opções, pop no acerto, cascata no tabuleiro, card de vitória em mola, tudo desligável por `prefers-reduced-motion` |
| Instrução | falada | falada **e escrita**, num botão que repete a fala ao toque (Playlearning) |
| Mascote | só na vitória | na home e reagindo a acerto e erro dentro do jogo |
| Tempo de tela | não tinha | ajuste opcional no hub (livre / 10 / 15 / 20 min), guardado em `localStorage`; ao estourar, tela gentil de "hora de descansar" com liberação por adulto |
| Recompensa | estrela por nível | + figurinha por jogo concluído, numa prateleira no hub (`localStorage["bibel_stickers"]`) |
| Hub | lista + filtro de turma | + "jogo de hoje" (escolha fixa por data) + prateleira de figurinhas + controle de tempo |
| Motores | choice, memory, order | + **trace** e **drag** |

Nenhuma mudança no formato do dado dos jogos que já existiam. Todo o resto é `assets/engine.js` + `assets/style.css` (cópias da v1 com as adições) e o `assets/glyph.js` novo.

## Motor novo: `trace`

Ligar os pontos na ordem para traçar um número, letra ou forma por cima de um guia claro.

```json
{
  "slug": "tracar-numeros", "turma": "p2", "engine": "trace", "hero": "🔢",
  "unit": { "pt": "traçados", "en": "traced" },
  "i18n": { "pt": { "...": "..." }, "en": { "...": "..." } },
  "levels": [
    { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"números 1 a 3","en":"1 to 3"}, "rounds": [
      { "say": {"pt":"Trace o número um","en":"Trace the number one"},
        "guide": "1",
        "dots": [[40,28],[52,15],[52,50],[52,85]] }
    ]}
  ]
}
```

- `guide`: o caractere desenhado em cinza claro atrás, como referência.
- `dots`: lista de pontos `[x, y]` num quadro `0..100`, **na ordem em que a criança deve ligar**. O motor embaralha nada aqui: a ordem é a resposta. A linha cresce a cada ponto tocado; ao fechar o último, solta confete e vai pro próximo.
- Serve para número, letra e forma. É só trocar `guide` e `dots`.

Jogo piloto: [`tracar-numeros/`](tracar-numeros/).

## Motor novo: `drag`

Arrastar cada figura pro cesto que a aceita. Bom para classificar (fruta x brinquedo, comida x roupa, fazenda x mar).

```json
{
  "engine": "drag",
  "levels": [
    { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"fruta ou brinquedo","en":"fruit or toy"}, "rounds": [
      { "say": {"pt":"Fruta na cesta, brinquedo na caixa","en":"Fruit in the basket, toy in the box"},
        "buckets": [ {"emoji":"🧺","accept":"fruta"}, {"emoji":"🧸","accept":"brinquedo"} ],
        "items":   [ {"emoji":"🍎","kind":"fruta"}, {"emoji":"🚗","kind":"brinquedo"} ] }
    ]}
  ]
}
```

- `buckets`: os alvos. `accept` é a etiqueta que aquele cesto aceita.
- `items`: as figuras arrastáveis. `kind` casa com o `accept` de um cesto.
- A rodada termina quando todas as figuras estão nos cestos certos. Solta no lugar errado, a figura volta.
- Funciona com toque e com mouse.

Jogo piloto: [`guarda-as-coisas/`](guarda-as-coisas/).

## Onda 1 do redesign "estado da arte"

- **Marca própria da Bibel.** Paleta e sombras separadas da Patente: creme quente, tangerina de marca, cinco cores de brinquedo em harmonia. Tokens no topo do bloco "sistema de design" em `assets/style.css`.
- **Linguagem de clay.** Superfícies com borda quente, canto gordo e sombra macia (`--clay`), no lugar da sombra dura deslocada.
- **Modo calmo** (baixo estímulo). Botão no hub, guardado em `bibel_calm`. Liga: sem confete, sem partícula, sem movimento, cor mais sóbria, alvo de toque maior. Some do `<html>` como `data-calm` e vale em todos os jogos.
- **Interação assinatura: o carimbo.** No acerto, a carinha da mascote é "carimbada" no botão com um baque de mola. Desligada no modo calmo.

## Chaves de `localStorage` usadas

Compartilhadas com a v1 onde faz sentido (idioma, turma, perfil de idade, progresso por jogo). Novas da v2:

- `bibel_screentime` — `""` | `"10"` | `"15"` | `"20"` (minutos de tela por dia)
- `bibel_playlog` — `{ "date": "AAAA-M-D", "secs": N }`, zera sozinho a cada dia
- `bibel_stickers` — `["cores","rimas",...]`, um slug por jogo concluído
- `bibel_calm` — `"1"` quando o modo calmo está ligado

Tudo por aparelho, nada sai do navegador, nenhuma conta.
