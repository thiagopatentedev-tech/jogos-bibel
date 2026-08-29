# Anatomia de um jogo — referência completa

Todo jogo (menos o `copa/`, que tem código próprio) é um `index.html` com este formato:

```html
<!-- casca: botões de idioma, modal "sobre", seções home/game, tela de vitória -->
<script>window.__G__ = { ... };</script>
<script src="../assets/mascotes.js"></script>
<script src="../assets/engine.js"></script>
```

A casca é igual em todos. Copie de um jogo existente e mexa só no `window.__G__`.

---

## Campos comuns a todos os motores

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `slug` | string | sim | Nome curto, igual ao da pasta. Chave do `localStorage` para salvar progresso (`bibel_<slug>`). |
| `turma` | `"m2"` \| `"p2"` | sim | Define a mascote da tela de vitória: `m2` → Bel, `p2` → Bia. Não afeta a jogabilidade. |
| `engine` | `"choice"` \| `"memory"` \| `"order"` | sim | Motor. Ausente ou desconhecido cai em `choice`. |
| `hero` | string (emoji) | sim | Emoji grande da tela inicial e do modal "sobre". |
| `unit` | `{pt,en}` | sim | Rótulo do contador no topo da partida. Ex.: `{"pt":"acertos","en":"correct"}`. |
| `i18n` | `{pt:{...}, en:{...}}` | sim | Textos da casca. Ver abaixo. |
| `levels` | array | sim | Lista de níveis. Formato do conteúdo depende do motor. |

### `i18n.pt` / `i18n.en`

| Chave | Descrição |
|---|---|
| `title` | Nome do jogo. Vira `<h1>` e `<title>`. |
| `kicker` | Linha pequena acima do título ("Jogos da Bibel"). |
| `tag` | Subtítulo curto na tela inicial. |
| `hint` | Dica logo acima da lista de níveis ("escolha um nível"). |
| `about` | Texto do modal de informação. Aceita HTML (`<b>`, `<br>`). |

### Cada item de `levels`

| Chave | Descrição |
|---|---|
| `nome` | `{pt,en}` — nome do nível ("Nível 1"). |
| `sub` | `{pt,en}` — legenda curta ("cores básicas", "até 5"). |
| `rounds` **ou** `cards` | O conteúdo. `choice` e `order` usam `rounds`; `memory` usa `cards`. |

**Padrão de texto bilíngue:** qualquer campo que a criança lê ou ouve é `{ "pt": "...", "en": "..." }`. O motor resolve pelo idioma ativo (botão de bandeira, guardado em `localStorage` como `bibel_lang`, compartilhado entre todos os jogos e o hub). Se faltar a chave do idioma ativo, cai no `pt`.

---

## Motor `choice`

Enunciado + opções. A criança toca na certa; erro treme e pede de novo; acerto solta um estouro de partículas e avança.

### Cada item de `rounds`

| Chave | Tipo | Descrição |
|---|---|---|
| `say` | `{pt,en}` | Lido em voz alta e mostrado como pergunta. |
| `show` | objeto | Opcional. O estímulo visual. Ver tabela abaixo. |
| `opts` | array | Os botões de resposta. |
| `multi` | bool | Se `true`, há mais de uma resposta certa; o round só avança quando todas forem tocadas. |
| `grid` | bool | Se `true`, as opções vão para uma grade (bom para 4+ opções ou imagens). |
| `shuffle` | bool | `false` mantém a ordem de `opts` como está no arquivo. O padrão é embaralhar. |

### `show`

| `show.k` | Efeito |
|---|---|
| `"letter"` | Mostra `show.v` como letra gigante. |
| `"emoji"` | Mostra `show.v` grande. Opcional `show.w` = palavra abaixo. |
| `"word"` | Mostra `show.v` como palavra grande. |
| `"count"` | Repete o emoji `show.v` um total de `show.n` vezes (para contar). |

`show.v` e `show.w` também podem ser `{pt,en}`.

### Cada item de `opts`

| Chave | Descrição |
|---|---|
| `emoji` | Emoji da opção. |
| `letter` | Alternativa: letra grande. |
| `t` | Alternativa: texto puro (número, sílaba, palavra). Pode acompanhar `emoji` como legenda. |
| `correct` | `true` na(s) opção(ões) certa(s). |
| `say` | Opcional. Falado quando essa opção certa é tocada (ex.: dizer o nome do que foi acertado). |
| `scale` | Opcional. Fator de escala visual do emoji (ex.: `1.4`). |

---

## Motor `memory`

Jogo da memória. Todas as cartas aparecem viradas por ~2 s, depois escondem. Pares = cartas com a mesma `key`.

### Cada nível usa `cards` (não `rounds`)

| Chave da carta | Descrição |
|---|---|
| `key` | Identificador do par. Duas cartas com a mesma `key` casam. |
| `html` | Conteúdo da face: emoji ou HTML curto. |
| `say` | Opcional. `{pt,en}` falado ao virar a carta. |

Opcional no nível: `say` (`{pt,en}`) — frase dita ao começar ("Ache os pares dos bichos").

O número de cartas deve ser par. Acima de ~9 cartas o tabuleiro passa para 4 colunas automaticamente.

---

## Motor `order`

Sequência. Aparecem espaços vazios e peças embaralhadas; a criança toca nas peças na ordem certa. Peça fora de ordem treme e não encaixa.

### Cada item de `rounds`

| Chave | Descrição |
|---|---|
| `say` | `{pt,en}` — instrução falada e escrita. |
| `items` | Array na **ordem correta**. Números ou strings curtas. O motor embaralha para exibir e cobra a ordem original. |
| `emoji` | Opcional. Emoji grande acima dos espaços. |
| `word` | Opcional. `{pt,en}` — falado ao completar o round (ex.: a palavra formada pelas sílabas). |

---

## Progresso e reinício

- O motor guarda os níveis concluídos em `localStorage["bibel_<slug>"]` como um array de índices.
- Para zerar o progresso de um jogo durante os testes, apague essa chave no DevTools (Application → Local Storage) ou rode `localStorage.clear()`.
- O idioma (`bibel_lang`), a turma escolhida no hub (`bibel_turma`) e o modo "botões grandes" (`bibel_profile`) também vivem no `localStorage` e valem para o site todo.

---

## Checklist ao criar um jogo

- [ ] `slug` igual ao nome da pasta.
- [ ] `<script src="../assets/mascotes.js">` e `../assets/engine.js` no fim do arquivo.
- [ ] Todo texto lido pela criança é `{pt,en}`.
- [ ] Pelo menos um nível com pelo menos um round (ou 2 pares, no `memory`).
- [ ] Emojis renderizam no celular alvo (iOS e Android desenham conjuntos diferentes; teste no aparelho real).
- [ ] Entrada nova no array `TILES` do `index.html` da raiz.
- [ ] Testado nas duas línguas, com voz ligada, até a tela de vitória do último nível.
