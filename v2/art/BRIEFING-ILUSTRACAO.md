# Briefing — set de ilustração da Bibel (v2)

Substituir o Twemoji por um set de figuras autoral, no espírito das mascotes Bia e Bel. Este arquivo é a especificação e a lista de trabalho.

## Como o set entra no jogo

`assets/glyph.js` procura a figura nesta ordem:

1. `assets/art/<codepoint>.svg`  ← o set autoral (esta pasta)
2. `assets/emoji/<codepoint>.svg`  ← Twemoji, o que está no ar hoje
3. o próprio emoji como texto

Ou seja: **cada arquivo que você colocar em `assets/art/` sobe automaticamente em todos os jogos que usam aquela figura.** Não precisa mexer em código. Dá pra entregar aos poucos.

Nome do arquivo = codepoint em hexa minúsculo, sem o seletor de variação `fe0f`, partes unidas por hífen. Exemplos: `🍎` → `1f34e.svg`, `1️⃣` → `31-20e3.svg`, `☀️` → `2600.svg`. A lista abaixo já traz o nome certo de cada um.

## Especificação de estilo

Referência viva: as mascotes em `assets/mascotes.js` (Bia e Bel).

- **Vetor plano, sem contorno preto.** Formas cheias, cantos orgânicos e arredondados. Nada de linha de contorno grossa (o Twemoji tem, a Bibel não).
- **2 a 3 tons chapados por objeto**, no máximo. Um tom base, um mais claro pra luz, um mais escuro pra sombra. Sem gradiente.
- **Sombrinha e brilho** ficam dentro da figura como manchas chapadas, não como blur. A sombra de apoio (a "pastilha" embaixo) é feita no CSS, não no SVG.
- **`viewBox="0 0 100 100"`**, figura centrada, respiro de ~10 unidades nas bordas. Fundo transparente, sem retângulo.
- **Traço fino só onde a mascote usa**: boca, um detalhe pontual. Cor do traço `#7c2410`.
- **Otimização**: SVG limpo, sem metadados de editor, sem `<style>`, cores em hexa direto no atributo `fill`.

### Paleta

Âncora nos tokens da marca Bibel:

| Uso | Hex |
|---|---|
| papel / fundo de cena | `#fdf4e8` |
| tinta / detalhes escuros | `#33291f` |
| coral (marca) | `#f2683c` |
| terra (coral escuro) | `#c14a24` |
| verde folha | `#38b676` |
| azul céu | `#37a0f4` |
| amarelo sol | `#ffb12e` |
| framboesa | `#ff5d8f` |
| uva (roxo) | `#7c5cd6` |
| marrom (cabelo/madeira) | `#6b4527` |
| pele | `#e8b088` |
| bochecha | `#ff9d8a` (opacity .55) |

Cores fora da paleta são permitidas quando a figura exige (verde da melancia, preto do pinguim), mas puxadas pro tom quente da marca, nunca saturadas demais.

## Prompt para gerar com IA (por figura ou em lote)

```
Ilustração vetorial plana de [OBJETO], para um app infantil de alfabetização.
Estilo: formas cheias e arredondadas, SEM contorno preto, 2 a 3 tons chapados,
sem gradiente, sem textura. Paleta quente: papel #fdf4e8, coral #f2683c,
verde #38b676, azul #37a0f4, amarelo #ffb12e, marrom #6b4527.
Figura única centrada, fundo transparente, enquadrada num quadrado com respiro
nas bordas. Amigável, simples, legível em tamanho pequeno. Mesmo espírito de um
personagem de desenho animado suave (referência: Pocoyó, Sago Mini), mas com a
paleta acima. Entregar como SVG limpo, viewBox 0 0 100 100.
```

Depois de gerar: salvar como `assets/art/<codepoint>.svg` usando o nome da lista abaixo, e conferir no jogo (é só recarregar).

## Semente

`assets/art/` já traz 3 arquivos de exemplo grosseiros (`1f534` círculo vermelho, `2b50` estrela, `1f34e` maçã), só pra provar o encaixe e servir de rascunho de estilo. Substitua por versões boas.

## Escopo

253 figuras no total. Priorizadas pela quantidade de jogos em que aparecem. Fazer na ordem: Fase 1 cobre o que a criança mais vê.

---

## Fase 1 — 56 figuras (aparecem em 3+ jogos, prioridade alta)

- [ ] `26bd.svg`  ⚽  — soccer ball  _(em: caca-letra, contar, cores, diferente, emocoes)_
- [ ] `1f34e.svg`  🍎  — red apple  _(em: contar, diferente, formas, guarda-as-coisas, ingles-pra-figura)_
- [ ] `1f431.svg`  🐱  — cat face  _(em: contar, diferente, ingles-pra-figura, padroes, primeira-letra)_
- [ ] `2b50.svg`  ⭐  — white medium star  _(em: contar, cores, diferente, formas, ingles-pra-figura)_
- [ ] `1f319.svg`  🌙  — crescent moon  _(em: diferente, ingles-pra-figura, opostos, padroes, primeira-letra)_
- [ ] `1f436.svg`  🐶  — dog face  _(em: contar, diferente, ingles-pra-figura, maior-grupo, padroes)_
- [ ] `1f41f.svg`  🐟  — fish  _(em: contar, guarda-as-coisas, ingles-pra-figura, maior-grupo, qual-palavra)_
- [ ] `2600.svg`  ☀️  — black sun with rays  _(em: diferente, ingles-pra-figura, opostos, padroes, primeira-letra)_
- [ ] `1f338.svg`  🌸  — cherry blossom  _(em: contar, ingles-pra-figura, primeira-letra, qual-palavra, rimas)_
- [ ] `1f34c.svg`  🍌  — banana  _(em: diferente, formas, guarda-as-coisas, ingles-pra-figura, padroes)_
- [ ] `1f418.svg`  🐘  — elephant  _(em: contar, ingles-pra-figura, opostos, qual-palavra, silabas)_
- [ ] `1f422.svg`  🐢  — turtle  _(em: diferente, opostos, primeira-letra, qual-palavra, silabas)_
- [ ] `1f986.svg`  🦆  — duck  _(em: primeira-letra, qual-palavra, rimas, silabas, som-da-letra)_
- [ ] `1f353.svg`  🍓  — strawberry  _(em: contar, guarda-as-coisas, maior-grupo, padroes, silabas)_
- [ ] `1f388.svg`  🎈  — balloon  _(em: contar, formas, maior-grupo, som-da-letra, soma-facil)_
- [ ] `1f3e0.svg`  🏠  — house building  _(em: ingles-pra-figura, primeira-letra, qual-palavra, rimas, silabas)_
- [ ] `1f40a.svg`  🐊  — crocodile  _(em: diferente, primeira-letra, qual-palavra, rimas, silabas)_
- [ ] `1f535.svg`  🔵  — large blue circle  _(em: cores, diferente, formas, maior-grupo, padroes)_
- [ ] `270b.svg`  ✋  — raised hand  _(em: guarda-as-coisas, ingles-pra-figura, opostos, partes-do-corpo, rimas)_
- [ ] `1f333.svg`  🌳  — deciduous tree  _(em: ingles-pra-figura, primeira-letra, rimas, som-da-letra, sombras)_
- [ ] `1f41d.svg`  🐝  — honeybee  _(em: ingles-pra-figura, primeira-letra, rimas, som-da-letra, sons-dos-bichos)_
- [ ] `1f434.svg`  🐴  — horse face  _(em: ingles-pra-figura, rimas, silabas, som-da-letra, sons-dos-bichos)_
- [ ] `1f697.svg`  🚗  — automobile  _(em: guarda-as-coisas, ingles-pra-figura, rimas, sombras, tamanhos)_
- [ ] `1f98b.svg`  🦋  — butterfly  _(em: ingles-pra-figura, qual-palavra, silabas, sons-dos-bichos, tamanhos)_
- [ ] `1f308.svg`  🌈  — rainbow  _(em: ingles-pra-figura, primeira-letra, qual-palavra, silabas)_
- [ ] `1f347.svg`  🍇  — grapes  _(em: guarda-as-coisas, padroes, primeira-letra, som-da-letra)_
- [ ] `1f404.svg`  🐄  — cow  _(em: guarda-as-coisas, primeira-letra, som-da-letra, sons-dos-bichos)_
- [ ] `1f42d.svg`  🐭  — mouse face  _(em: opostos, primeira-letra, rimas, som-da-letra)_
- [ ] `1f430.svg`  🐰  — rabbit face  _(em: padroes, rimas, som-da-letra, sons-dos-bichos)_
- [ ] `1f435.svg`  🐵  — monkey face  _(em: ingles-pra-figura, silabas, som-da-letra, sons-dos-bichos)_
- [ ] `1f438.svg`  🐸  — frog face  _(em: rimas, som-da-letra, sons-dos-bichos, tamanhos)_
- [ ] `1f7e2.svg`  🟢  — large green circle  _(em: cores, formas, maior-grupo, padroes)_
- [ ] `1f995.svg`  🦕  — sauropod  _(em: primeira-letra, qual-palavra, silabas, som-da-letra)_
- [ ] `1f327.svg`  🌧️  — cloud with rain  _(em: opostos, primeira-letra, qual-palavra)_
- [ ] `1f35e.svg`  🍞  — bread  _(em: guarda-as-coisas, ingles-pra-figura, rimas)_
- [ ] `1f37d.svg`  🍽️  — fork and knife with plate  _(em: guarda-as-coisas, rimas, rotina)_
- [ ] `1f3b2.svg`  🎲  — game die  _(em: primeira-letra, rimas, som-da-letra)_
- [ ] `1f40b.svg`  🐋  — whale  _(em: opostos, primeira-letra, rimas)_
- [ ] `1f414.svg`  🐔  — chicken  _(em: guarda-as-coisas, som-da-letra, sons-dos-bichos)_
- [ ] `1f419.svg`  🐙  — octopus  _(em: guarda-as-coisas, primeira-letra, qual-palavra)_
- [ ] `1f437.svg`  🐷  — pig face  _(em: guarda-as-coisas, som-da-letra, sons-dos-bichos)_
- [ ] `1f451.svg`  👑  — crown  _(em: primeira-letra, rimas, som-da-letra)_
- [ ] `1f522.svg`  🔢  — input symbol for numbers  _(em: contar, maior-grupo, tracar-numeros)_
- [ ] `1f524.svg`  🔤  — input symbol for latin letters  _(em: ingles-pra-figura, qual-palavra, som-da-letra)_
- [ ] `1f534.svg`  🔴  — large red circle  _(em: cores, diferente, padroes)_
- [ ] `1f537.svg`  🔷  — large blue diamond  _(em: cores, diferente, formas)_
- [ ] `1f681.svg`  🚁  — helicopter  _(em: primeira-letra, qual-palavra, silabas)_
- [ ] `1f7e1.svg`  🟡  — large yellow circle  _(em: cores, maior-grupo, padroes)_
- [ ] `1f7e5.svg`  🟥  — large red square  _(em: cores, formas, padroes)_
- [ ] `1f981.svg`  🦁  — lion face  _(em: ingles-pra-figura, som-da-letra, sons-dos-bichos)_
- [ ] `1f987.svg`  🦇  — bat  _(em: qual-palavra, rotina, sons-dos-bichos)_
- [ ] `1f992.svg`  🦒  — giraffe face  _(em: opostos, primeira-letra, qual-palavra)_
- [ ] `1f9b6.svg`  🦶  — foot  _(em: ingles-pra-figura, partes-do-corpo, rimas)_
- [ ] `1f9c0.svg`  🧀  — cheese wedge  _(em: guarda-as-coisas, primeira-letra, som-da-letra)_
- [ ] `2601.svg`  ☁️  — cloud  _(em: padroes, primeira-letra, som-da-letra)_
- [ ] `27a1.svg`  ➡️  — black rightwards arrow  _(em: formas, opostos, padroes)_

## Fase 2 — 47 figuras (2 jogos)

- [ ] `1f30a.svg`  🌊  — water wave  _(em: guarda-as-coisas, opostos)_
- [ ] `1f311.svg`  🌑  — new moon symbol  _(em: opostos, sombras)_
- [ ] `1f34d.svg`  🍍  — pineapple  _(em: primeira-letra, silabas)_
- [ ] `1f355.svg`  🍕  — slice of pizza  _(em: formas, guarda-as-coisas)_
- [ ] `1f3a9.svg`  🎩  — top hat  _(em: rimas, som-da-letra)_
- [ ] `1f40c.svg`  🐌  — snail  _(em: ingles-pra-figura, rimas)_
- [ ] `1f40d.svg`  🐍  — snake  _(em: rimas, sons-dos-bichos)_
- [ ] `1f410.svg`  🐐  — goat  _(em: rimas, sons-dos-bichos)_
- [ ] `1f411.svg`  🐑  — sheep  _(em: rimas, sons-dos-bichos)_
- [ ] `1f413.svg`  🐓  — rooster  _(em: rimas, rotina)_
- [ ] `1f41c.svg`  🐜  — ant  _(em: silabas, sons-dos-bichos)_
- [ ] `1f41e.svg`  🐞  — lady beetle  _(em: ingles-pra-figura, sons-dos-bichos)_
- [ ] `1f420.svg`  🐠  — tropical fish  _(em: contar, sombras)_
- [ ] `1f426.svg`  🐦  — bird  _(em: ingles-pra-figura, sons-dos-bichos)_
- [ ] `1f43b.svg`  🐻  — bear face  _(em: rimas, som-da-letra)_
- [ ] `1f441.svg`  👁️  — eye  _(em: ingles-pra-figura, partes-do-corpo)_
- [ ] `1f4a7.svg`  💧  — droplet  _(em: opostos, silabas)_
- [ ] `1f536.svg`  🔶  — large orange diamond  _(em: cores, formas)_
- [ ] `1f53a.svg`  🔺  — up-pointing red triangle  _(em: cores, formas)_
- [ ] `1f600.svg`  😀  — grinning face  _(em: diferente, emocoes)_
- [ ] `1f604.svg`  😄  — smiling face with open mouth and smiling eyes  _(em: emocoes, opostos)_
- [ ] `1f622.svg`  😢  — crying face  _(em: emocoes, opostos)_
- [ ] `1f634.svg`  😴  — sleeping face  _(em: emocoes, opostos)_
- [ ] `1f690.svg`  🚐  — minibus  _(em: primeira-letra, som-da-letra)_
- [ ] `1f6b2.svg`  🚲  — bicycle  _(em: qual-palavra, silabas)_
- [ ] `1f7e3.svg`  🟣  — large purple circle  _(em: cores, diferente)_
- [ ] `1f7e8.svg`  🟨  — large yellow square  _(em: cores, padroes)_
- [ ] `1f7e9.svg`  🟩  — large green square  _(em: cores, padroes)_
- [ ] `1f921.svg`  🤡  — clown face  _(em: qual-palavra, silabas)_
- [ ] `1f941.svg`  🥁  — drum with drumsticks  _(em: rimas, som-da-letra)_
- [ ] `1f95b.svg`  🥛  — glass of milk  _(em: ingles-pra-figura, opostos)_
- [ ] `1f993.svg`  🦓  — zebra face  _(em: primeira-letra, som-da-letra)_
- [ ] `1f9e6.svg`  🧦  — socks  _(em: guarda-as-coisas, ingles-pra-figura)_
- [ ] `1f9f8.svg`  🧸  — teddy bear  _(em: guarda-as-coisas, rotina)_
- [ ] `1faba.svg`  🪺  — nest with eggs  _(em: primeira-letra, som-da-letra)_
- [ ] `2614.svg`  ☔  — umbrella with rain drops  _(em: ingles-pra-figura, opostos)_
- [ ] `26ab.svg`  ⚫  — medium black circle  _(em: cores, padroes)_
- [ ] `270f.svg`  ✏️  — pencil  _(em: formas, tracar-numeros)_
- [ ] `2744.svg`  ❄️  — snowflake  _(em: ingles-pra-figura, opostos)_
- [ ] `2764.svg`  ❤️  — heavy black heart  _(em: cores, formas)_
- [ ] `2b06.svg`  ⬆️  — upwards black arrow  _(em: opostos, padroes)_
- [ ] `2b07.svg`  ⬇️  — downwards black arrow  _(em: opostos, padroes)_
- [ ] `2b1b.svg`  ⬛  — black large square  _(em: diferente, formas)_
- [ ] `2b1c.svg`  ⬜  — white large square  _(em: diferente, formas)_
- [ ] `31-20e3.svg`  1️⃣  — digit one  _(em: padroes, sequencia)_
- [ ] `32-20e3.svg`  2️⃣  — digit two  _(em: padroes, sequencia)_
- [ ] `33-20e3.svg`  3️⃣  — digit three  _(em: padroes, sequencia)_

## Fase 3 — 150 figuras (1 jogo, cauda longa)

- [ ] `1f170.svg`  🅰️  — negative squared latin capital letter a  _(em: primeira-letra)_
- [ ] `1f304.svg`  🌄  — sunrise over mountains  _(em: rotina)_
- [ ] `1f305.svg`  🌅  — sunrise  _(em: rotina)_
- [ ] `1f306.svg`  🌆  — cityscape at dusk  _(em: rotina)_
- [ ] `1f31f.svg`  🌟  — glowing star  _(em: diferente)_
- [ ] `1f324.svg`  🌤️  — white sun with small cloud  _(em: rotina)_
- [ ] `1f32c.svg`  🌬️  — wind blowing face  _(em: opostos)_
- [ ] `1f33b.svg`  🌻  — sunflower  _(em: diferente)_
- [ ] `1f33c.svg`  🌼  — blossom  _(em: diferente)_
- [ ] `1f349.svg`  🍉  — watermelon  _(em: silabas)_
- [ ] `1f34a.svg`  🍊  — tangerine  _(em: diferente)_
- [ ] `1f34b.svg`  🍋  — lemon  _(em: diferente)_
- [ ] `1f34f.svg`  🍏  — green apple  _(em: diferente)_
- [ ] `1f350.svg`  🍐  — pear  _(em: rimas)_
- [ ] `1f35d.svg`  🍝  — spaghetti  _(em: rotina)_
- [ ] `1f369.svg`  🍩  — doughnut  _(em: formas)_
- [ ] `1f36b.svg`  🍫  — chocolate bar  _(em: silabas)_
- [ ] `1f370.svg`  🍰  — shortcake  _(em: rimas)_
- [ ] `1f373.svg`  🍳  — cooking  _(em: rimas)_
- [ ] `1f37f.svg`  🍿  — popcorn  _(em: som-da-letra)_
- [ ] `1f381.svg`  🎁  — wrapped present  _(em: tamanhos)_
- [ ] `1f392.svg`  🎒  — school satchel  _(em: rotina)_
- [ ] `1f3a8.svg`  🎨  — artist palette  _(em: cores)_
- [ ] `1f3b5.svg`  🎵  — musical note  _(em: opostos)_
- [ ] `1f3c1.svg`  🏁  — chequered flag  _(em: opostos)_
- [ ] `1f3c3.svg`  🏃  — runner  _(em: opostos)_
- [ ] `1f3ca.svg`  🏊  — swimmer  _(em: rotina)_
- [ ] `1f3dc.svg`  🏜️  — desert  _(em: opostos)_
- [ ] `1f407.svg`  🐇  — rabbit  _(em: opostos)_
- [ ] `1f41b.svg`  🐛  — bug  _(em: silabas)_
- [ ] `1f424.svg`  🐤  — baby chick  _(em: contar)_
- [ ] `1f428.svg`  🐨  — koala  _(em: sons-dos-bichos)_
- [ ] `1f42b.svg`  🐫  — bactrian camel  _(em: rimas)_
- [ ] `1f42c.svg`  🐬  — dolphin  _(em: tamanhos)_
- [ ] `1f42e.svg`  🐮  — cow face  _(em: sons-dos-bichos)_
- [ ] `1f433.svg`  🐳  — spouting whale  _(em: som-da-letra)_
- [ ] `1f43a.svg`  🐺  — wolf face  _(em: diferente)_
- [ ] `1f43f.svg`  🐿️  — chipmunk  _(em: opostos)_
- [ ] `1f442.svg`  👂  — ear  _(em: partes-do-corpo)_
- [ ] `1f443.svg`  👃  — nose  _(em: partes-do-corpo)_
- [ ] `1f444.svg`  👄  — mouth  _(em: partes-do-corpo)_
- [ ] `1f445.svg`  👅  — tongue  _(em: partes-do-corpo)_
- [ ] `1f44b.svg`  👋  — waving hand sign  _(em: opostos)_
- [ ] `1f44d.svg`  👍  — thumbs up sign  _(em: opostos)_
- [ ] `1f44f.svg`  👏  — clapping hands sign  _(em: opostos)_
- [ ] `1f452.svg`  👒  — womans hat  _(em: ingles-pra-figura)_
- [ ] `1f455.svg`  👕  — t-shirt  _(em: guarda-as-coisas)_
- [ ] `1f457.svg`  👗  — dress  _(em: guarda-as-coisas)_
- [ ] `1f45c.svg`  👜  — handbag  _(em: rimas)_
- [ ] `1f45e.svg`  👞  — mans shoe  _(em: silabas)_
- [ ] `1f487.svg`  💇  — haircut  _(em: partes-do-corpo)_
- [ ] `1f499.svg`  💙  — blue heart  _(em: cores)_
- [ ] `1f49a.svg`  💚  — green heart  _(em: cores)_
- [ ] `1f4a1.svg`  💡  — electric light bulb  _(em: opostos)_
- [ ] `1f4a6.svg`  💦  — splashing sweat symbol  _(em: opostos)_
- [ ] `1f4aa.svg`  💪  — flexed biceps  _(em: partes-do-corpo)_
- [ ] `1f4bb.svg`  💻  — personal computer  _(em: silabas)_
- [ ] `1f4c0.svg`  📀  — dvd  _(em: formas)_
- [ ] `1f4c4.svg`  📄  — page facing up  _(em: silabas)_
- [ ] `1f4cf.svg`  📏  — straight ruler  _(em: tamanhos)_
- [ ] `1f4d0.svg`  📐  — triangular ruler  _(em: formas)_
- [ ] `1f4d7.svg`  📗  — green book  _(em: formas)_
- [ ] `1f4e2.svg`  📢  — public address loudspeaker  _(em: opostos)_
- [ ] `1f4e6.svg`  📦  — package  _(em: opostos)_
- [ ] `1f4fa.svg`  📺  — television  _(em: formas)_
- [ ] `1f504.svg`  🔄  — anticlockwise downwards and upwards open circle arrows  _(em: opostos)_
- [ ] `1f50e.svg`  🔎  — right-pointing magnifying glass  _(em: caca-letra)_
- [ ] `1f512.svg`  🔒  — lock  _(em: rimas)_
- [ ] `1f514.svg`  🔔  — bell  _(em: formas)_
- [ ] `1f525.svg`  🔥  — fire  _(em: opostos)_
- [ ] `1f526.svg`  🔦  — electric torch  _(em: opostos)_
- [ ] `1f528.svg`  🔨  — hammer  _(em: rimas)_
- [ ] `1f53b.svg`  🔻  — down-pointing red triangle  _(em: formas)_
- [ ] `1f5bc.svg`  🖼️  — frame with picture  _(em: formas)_
- [ ] `1f60c.svg`  😌  — relieved face  _(em: emocoes)_
- [ ] `1f611.svg`  😑  — expressionless face  _(em: emocoes)_
- [ ] `1f615.svg`  😕  — confused face  _(em: emocoes)_
- [ ] `1f61f.svg`  😟  — worried face  _(em: emocoes)_
- [ ] `1f620.svg`  😠  — angry face  _(em: emocoes)_
- [ ] `1f628.svg`  😨  — fearful face  _(em: emocoes)_
- [ ] `1f62d.svg`  😭  — loudly crying face  _(em: emocoes)_
- [ ] `1f62e.svg`  😮  — face with open mouth  _(em: opostos)_
- [ ] `1f630.svg`  😰  — face with open mouth and cold sweat  _(em: emocoes)_
- [ ] `1f632.svg`  😲  — astonished face  _(em: emocoes)_
- [ ] `1f633.svg`  😳  — flushed face  _(em: emocoes)_
- [ ] `1f642.svg`  🙂  — slightly smiling face  _(em: diferente)_
- [ ] `1f680.svg`  🚀  — rocket  _(em: primeira-letra)_
- [ ] `1f699.svg`  🚙  — recreational vehicle  _(em: rimas)_
- [ ] `1f69c.svg`  🚜  — tractor  _(em: guarda-as-coisas)_
- [ ] `1f6aa.svg`  🚪  — door  _(em: formas)_
- [ ] `1f6bf.svg`  🚿  — shower  _(em: silabas)_
- [ ] `1f6c1.svg`  🛁  — bathtub  _(em: rotina)_
- [ ] `1f6cc.svg`  🛌  — sleeping accommodation  _(em: rotina)_
- [ ] `1f6dd.svg`  🛝  — playground slide  _(em: rotina)_
- [ ] `1f6f6.svg`  🛶  — canoe  _(em: rimas)_
- [ ] `1f7e0.svg`  🟠  — large orange circle  _(em: cores)_
- [ ] `1f7e4.svg`  🟤  — large brown circle  _(em: cores)_
- [ ] `1f7e6.svg`  🟦  — large blue square  _(em: cores)_
- [ ] `1f7e7.svg`  🟧  — large orange square  _(em: cores)_
- [ ] `1f7ea.svg`  🟪  — large purple square  _(em: cores)_
- [ ] `1f929.svg`  🤩  — grinning face with star eyes  _(em: emocoes)_
- [ ] `1f92b.svg`  🤫  — face with finger covering closed lips  _(em: opostos)_
- [ ] `1f944.svg`  🥄  — spoon  _(em: rimas)_
- [ ] `1f947.svg`  🥇  — first place medal  _(em: opostos)_
- [ ] `1f948.svg`  🥈  — second place medal  _(em: opostos)_
- [ ] `1f951.svg`  🥑  — avocado  _(em: silabas)_
- [ ] `1f955.svg`  🥕  — carrot  _(em: guarda-as-coisas)_
- [ ] `1f963.svg`  🥣  — bowl with spoon  _(em: rotina)_
- [ ] `1f96a.svg`  🥪  — sandwich  _(em: rotina)_
- [ ] `1f970.svg`  🥰  — smiling face with smiling eyes and three hearts  _(em: emocoes)_
- [ ] `1f975.svg`  🥵  — overheated face  _(em: rotina)_
- [ ] `1f980.svg`  🦀  — crab  _(em: guarda-as-coisas)_
- [ ] `1f989.svg`  🦉  — owl  _(em: sons-dos-bichos)_
- [ ] `1f98a.svg`  🦊  — fox face  _(em: som-da-letra)_
- [ ] `1f98d.svg`  🦍  — gorilla  _(em: sons-dos-bichos)_
- [ ] `1f9a5.svg`  🦥  — sloth  _(em: sons-dos-bichos)_
- [ ] `1f9ad.svg`  🦭  — seal  _(em: som-da-letra)_
- [ ] `1f9b5.svg`  🦵  — leg  _(em: partes-do-corpo)_
- [ ] `1f9ca.svg`  🧊  — ice cube  _(em: opostos)_
- [ ] `1f9d1.svg`  🧑  — adult  _(em: partes-do-corpo)_
- [ ] `1f9dc.svg`  🧜  — merperson  _(em: rimas)_
- [ ] `1f9e2.svg`  🧢  — billed cap  _(em: guarda-as-coisas)_
- [ ] `1f9e4.svg`  🧤  — gloves  _(em: ingles-pra-figura)_
- [ ] `1f9e5.svg`  🧥  — coat  _(em: guarda-as-coisas)_
- [ ] `1f9e9.svg`  🧩  — jigsaw puzzle piece  _(em: guarda-as-coisas)_
- [ ] `1f9fa.svg`  🧺  — basket  _(em: guarda-as-coisas)_
- [ ] `1fa77.svg`  🩷  — pink heart  _(em: cores)_
- [ ] `1fa80.svg`  🪀  — yo-yo  _(em: guarda-as-coisas)_
- [ ] `1fa81.svg`  🪁  — kite  _(em: primeira-letra)_
- [ ] `1fa86.svg`  🪆  — nesting dolls  _(em: silabas)_
- [ ] `1fa91.svg`  🪑  — chair  _(em: silabas)_
- [ ] `1fa9e.svg`  🪞  — mirror  _(em: rimas)_
- [ ] `1fa9f.svg`  🪟  — window  _(em: formas)_
- [ ] `1faa5.svg`  🪥  — toothbrush  _(em: rotina)_
- [ ] `1faa8.svg`  🪨  — rock  _(em: opostos)_
- [ ] `1fab6.svg`  🪶  — feather  _(em: opostos)_
- [ ] `1fabc.svg`  🪼  — jellyfish  _(em: som-da-letra)_
- [ ] `1fad7.svg`  🫗  — pouring liquid  _(em: opostos)_
- [ ] `23f0.svg`  ⏰  — alarm clock  _(em: rotina)_
- [ ] `2602.svg`  ☂️  — umbrella  _(em: silabas)_
- [ ] `261d.svg`  ☝️  — white up pointing index  _(em: partes-do-corpo)_
- [ ] `2696.svg`  ⚖️  — scales  _(em: opostos)_
- [ ] `26aa.svg`  ⚪  — medium white circle  _(em: cores)_
- [ ] `26c5.svg`  ⛅  — sun behind cloud  _(em: ingles-pra-figura)_
- [ ] `26f5.svg`  ⛵  — sailboat  _(em: rimas)_
- [ ] `270a.svg`  ✊  — raised fist  _(em: opostos)_
- [ ] `2728.svg`  ✨  — sparkles  _(em: rotina)_
- [ ] `2795.svg`  ➕  — heavy plus sign  _(em: soma-facil)_
- [ ] `2b05.svg`  ⬅️  — leftwards black arrow  _(em: padroes)_
- [ ] `34-20e3.svg`  4️⃣  — digit four  _(em: padroes)_
