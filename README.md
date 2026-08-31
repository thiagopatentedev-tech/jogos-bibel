# Jogos da Bibel

Uma coleção de **23 joguinhos de alfabetização e matemática** para crianças de 3 a 6 anos, feitos por um pai com ajuda de IA, para as duas filhas praticarem no celular.

- Sem cadastro, sem anúncio, sem back-end. É só HTML, CSS e JavaScript puro.
- Português e inglês na mesma tela, com um botão de bandeira.
- Voz: o jogo lê o comando em voz alta (Web Speech API do próprio navegador).
- Dois mascotes, Bia e Bel, uma para cada turma (Maternal II e Pré II).
- Cada jogo é um arquivo. Você **descreve** o jogo num bloco de dados, não programa a lógica.

**Demo ao vivo:** https://www.thiagopatente.com.br/jogo/

Este repositório existe para você **clonar, trocar o conteúdo pelos nomes e temas dos seus filhos, e publicar a sua própria versão** em minutos. O passo a passo está abaixo.

> **Estrutura.** A versão atual (26 jogos, visual "Blocos de Brinquedo", motores `choice`, `memory`, `order`, `trace`, `drag`, `read`, `math`) fica na **raiz** do repositório. A primeira versão (23 jogos, visual anterior) está arquivada em [`v1/`](v1/), sem receber mudanças. `LEIA-ME.md` descreve o que a linha atual tem a mais.

---

## Índice

1. [Rodar na sua máquina](#1-rodar-na-sua-máquina)
2. [A ideia central: um jogo é um bloco de dados](#2-a-ideia-central-um-jogo-é-um-bloco-de-dados)
3. [Anatomia de um jogo](#3-anatomia-de-um-jogo)
4. [Os três motores](#4-os-três-motores)
5. [Passo a passo: criar um jogo novo](#5-passo-a-passo-criar-um-jogo-novo)
6. [Deixar com a cara dos seus filhos](#6-deixar-com-a-cara-dos-seus-filhos)
7. [Publicar de graça](#7-publicar-de-graça)
8. [Usar IA para gerar jogos](#8-usar-ia-para-gerar-jogos)
9. [Ideias de jogos para fazer](#9-ideias-de-jogos-para-fazer)
10. [Licença](#10-licença)

---

## 1. Rodar na sua máquina

Não precisa instalar nada. Clone e abra:

```bash
git clone https://github.com/SEU-USUARIO/jogos-bibel.git
cd jogos-bibel
```

Abrir direto: dê dois cliques no `index.html`. Funciona, mas alguns navegadores bloqueiam a voz e o `localStorage` em `file://`. O jeito recomendado é subir um servidor local de uma linha:

```bash
# Python 3 (já vem no macOS e na maioria das distros Linux)
python -m http.server 8000

# ou, se tiver Node
npx serve .
```

Abra `http://localhost:8000` e você vê o hub com os 23 jogos.

**Estrutura do projeto:**

```
jogos-bibel/
├── index.html            hub: lista todos os jogos, filtra por turma e idade
├── assets/
│   ├── engine.js         o motor: desenha a home do jogo e roda a partida
│   ├── style.css         todo o visual, um arquivo só
│   └── mascotes.js       as mascotes Bia e Bel, em SVG inline
├── cores/index.html      um jogo (motor "choice")
├── contar/index.html     um jogo (motor "choice")
├── rimas/index.html      um jogo (motor "memory")
├── sequencia/index.html  um jogo (motor "order")
├── copa/index.html       o único jogo com código próprio, fora do motor
└── ... mais 18 pastas de jogo
```

Regra de ouro: **`assets/` tem 3 arquivos e você quase nunca mexe neles.** O que muda de jogo para jogo é só o `index.html` de cada pasta.

---

## 2. A ideia central: um jogo é um bloco de dados

Abra `cores/index.html`. O arquivo inteiro tem menos de 60 linhas, e a maior parte é casca compartilhada (os mesmos botões de idioma, o mesmo modal "sobre"). O coração é isto:

```html
<script>window.__G__ = {
  "slug": "cores",
  "turma": "m2",
  "engine": "choice",
  "hero": "🎨",
  "unit": { "pt": "acertos", "en": "correct" },
  "i18n": {
    "pt": { "title": "As Cores", "kicker": "Jogos da Bibel", "tag": "toque na cor que eu falar", "hint": "⚽ escolha um nível", "about": "Feito por <b>Thiago Patente</b>, para as duas filhas." },
    "en": { "title": "Colors", "kicker": "Jogos da Bibel", "tag": "touch the color I say", "hint": "⚽ choose a level", "about": "Made by <b>Thiago Patente</b> for his two daughters." }
  },
  "levels": [
    { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"cores básicas","en":"basic colors"}, "rounds": [
      { "say": {"pt":"Toque no vermelho","en":"Touch the red one"}, "opts": [
        {"emoji":"🔴","correct":true}, {"emoji":"🔵","correct":false}, {"emoji":"🟢","correct":false}
      ]}
    ]}
  ]
};</script>
<script src="../assets/mascotes.js"></script>
<script src="../assets/engine.js"></script>
```

É só isso. `engine.js` lê `window.__G__`, desenha a tela inicial, monta os níveis e cuida de pontuação, cronômetro, voz, confete e tela de vitória. **Para criar um jogo novo você edita esse objeto e mais nada.**

---

## 3. Anatomia de um jogo

Campos do objeto `window.__G__`:

| Campo | O que é |
|---|---|
| `slug` | Identificador curto, igual ao nome da pasta. Usado para salvar o progresso no `localStorage`. |
| `turma` | `"m2"` (Maternal II, mascote Bel) ou `"p2"` (Pré II, mascote Bia). Só muda qual mascote aparece na vitória. |
| `engine` | `"choice"`, `"memory"` ou `"order"`. Veja a próxima seção. |
| `hero` | Emoji grande da tela inicial. |
| `unit` | Rótulo do contador, por idioma. Ex: `acertos`, `pares`, `correct`. |
| `i18n.pt` / `i18n.en` | Textos da casca: `title`, `kicker`, `tag` (subtítulo), `hint` (dica na home), `about` (texto do modal, aceita HTML). |
| `levels[]` | A lista de níveis. Cada nível tem `nome`, `sub` (as duas por idioma) e o conteúdo, que muda conforme o motor. |

Todo texto que a criança vê ou ouve é um objeto `{ "pt": "...", "en": "..." }`. O motor escolhe o idioma sozinho a partir do botão de bandeira.

A referência completa de cada campo de cada motor está em [`docs/anatomia-de-um-jogo.md`](docs/anatomia-de-um-jogo.md).

---

## 4. Os três motores

Um motor só, `engine.js`, sabe rodar três formatos de jogo. Você escolhe pelo campo `engine`.

### `choice` — toque na opção certa
O mais usado (18 dos 23 jogos). Mostra um enunciado e algumas opções; a criança toca na certa.

```json
"levels": [
  { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"até 5","en":"up to 5"}, "rounds": [
    {
      "say":  {"pt":"Quantos são?","en":"How many are there?"},
      "show": {"k":"count","v":"🐶","n":3},
      "opts": [ {"t":"2","correct":false}, {"t":"3","correct":true}, {"t":"4","correct":false} ]
    }
  ]}
]
```

- `say` é lido em voz alta e mostrado como pergunta.
- `show` (opcional) desenha o estímulo: `k` é `"letter"`, `"emoji"`, `"word"` ou `"count"` (repete o emoji `v` vezes `n`).
- `opts` são os botões. Cada um traz `emoji`, `letter` ou `t` (texto), e `correct`.
- `"multi": true` no round permite mais de uma resposta certa (toque em todas).

### `memory` — jogo da memória
Vira todas as cartas, mostra por 2 segundos e esconde. A criança acha os pares. Cartas com a mesma `key` formam par.

```json
"levels": [
  { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"4 pares","en":"4 pairs"}, "cards": [
    {"key":"pato", "html":"🦆", "say":{"pt":"pato","en":"duck"}},
    {"key":"pato", "html":"🥚"},
    {"key":"gato", "html":"🐱", "say":{"pt":"gato","en":"cat"}},
    {"key":"gato", "html":"🐾"}
  ]}
]
```

### `order` — coloque em ordem
Mostra lugares vazios e peças embaralhadas. A criança toca nas peças na ordem de `items`.

```json
"levels": [
  { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"1 a 5","en":"1 to 5"}, "rounds": [
    { "say": {"pt":"Coloque em ordem","en":"Put in order"}, "items": [1,2,3,4,5] }
  ]}
]
```

Para trocar de motor, você troca o valor de `engine` e a forma do `levels`. Nada mais.

---

## 5. Passo a passo: criar um jogo novo

Exemplo: um jogo **"Os Animais da Fazenda"**, motor `choice`, onde a criança ouve o nome e toca no bicho certo.

### Passo 1 — copie uma pasta parecida

```bash
cp -r cores animais-fazenda
```

Escolha a fonte pelo motor que você quer: `cores` ou `contar` para `choice`, `rimas` para `memory`, `sequencia` para `order`.

### Passo 2 — edite o bloco `__G__`

Abra `animais-fazenda/index.html` e mude só o `<script>window.__G__ = {...}</script>`:

```js
window.__G__ = {
  "slug": "animais-fazenda",
  "turma": "m2",
  "engine": "choice",
  "hero": "🐄",
  "unit": { "pt": "acertos", "en": "correct" },
  "i18n": {
    "pt": { "title": "Animais da Fazenda", "kicker": "Jogos da Bibel", "tag": "toque no bicho que eu falar", "hint": "🐔 escolha um nível", "about": "Feito com carinho, para os pequenos." },
    "en": { "title": "Farm Animals", "kicker": "Jogos da Bibel", "tag": "touch the animal I say", "hint": "🐔 choose a level", "about": "Made with love, for the little ones." }
  },
  "levels": [
    { "nome": {"pt":"Nível 1","en":"Level 1"}, "sub": {"pt":"quatro bichos","en":"four animals"}, "rounds": [
      { "say": {"pt":"Cadê a vaca?","en":"Where is the cow?"},   "opts": [ {"emoji":"🐄","correct":true}, {"emoji":"🐖","correct":false}, {"emoji":"🐔","correct":false} ] },
      { "say": {"pt":"Cadê o porco?","en":"Where is the pig?"},  "opts": [ {"emoji":"🐖","correct":true}, {"emoji":"🐄","correct":false}, {"emoji":"🐑","correct":false} ] },
      { "say": {"pt":"Cadê a galinha?","en":"Where is the hen?"},"opts": [ {"emoji":"🐔","correct":true}, {"emoji":"🐴","correct":false}, {"emoji":"🐖","correct":false} ] }
    ]}
  ]
};
```

Não esqueça de conferir, no topo do arquivo, se as duas últimas linhas de `<script src=...>` apontam para `../assets/mascotes.js` e `../assets/engine.js`. Se você copiou de outra pasta, já estão certas.

### Passo 3 — registre o jogo no hub

Abra o `index.html` da raiz e adicione uma linha ao array `TILES` (por volta da linha 47):

```js
{turma:"m2", href:"animais-fazenda/", e:"🐄",
 pt:["Animais da Fazenda","toque no bicho que eu falar"],
 en:["Farm Animals","touch the animal I say"]},
```

`turma` controla em qual filtro o jogo aparece. `e` é o emoji do card. `pt` e `en` são `[título, descrição curta]`.

### Passo 4 — teste

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`, veja o card novo, entre, jogue os três rounds, confira a voz nas duas línguas e a tela de vitória.

### Passo 5 — publique

```bash
git add animais-fazenda/ index.html
git commit -m "novo jogo: Animais da Fazenda"
git push
```

Se o GitHub Pages estiver ligado (seção 7), em um ou dois minutos está no ar.

---

## 6. Deixar com a cara dos seus filhos

- **Nome da coleção:** troque "Jogos da Bibel" no `kicker` de cada jogo e no `index.html` da raiz (procure por `Jogos da Bibel` e por `Bibel`).
- **Assinatura:** o texto `about` de cada jogo e o rodapé do hub trazem "Feito por Thiago Patente, para as duas filhas". Ponha o seu.
- **Mascotes:** `assets/mascotes.js` tem dois bonecos em SVG (`bia` e `bel`) e as cores de destaque em `ACCENT`. Troque os desenhos ou as cores. Se não quiser mascote, faça `window.mascoteHtml` devolver `''`.
- **Cores e fontes:** tudo em `assets/style.css`. A paleta base está nas variáveis `--papel`, `--tinta`, `--coral` etc. no `:root`.
- **Turmas / faixas etárias:** os rótulos "Maternal II" e "Pré II" e o filtro de idade ficam no `index.html` da raiz, no objeto `HEAD`.
- **Só um idioma:** o motor sempre lê `objeto.pt` como padrão. Se você deixar só textos em português, o botão de bandeira ainda aparece mas não faz diferença; para escondê-lo, remova o `<button class="lang-btn">` do HTML de cada jogo e do hub.
- **Voz:** a leitura usa a Web Speech API do navegador, sem custo e sem chave. A escolha de voz (feminina, mais aguda para criança) está no início do `engine.js`, função `pickVoices` e função `say`.
- **Meta tags:** os `index.html` trazem `og:image`, `og:url` e `canonical` apontando para `thiagopatente.com.br`. Troque pelo seu domínio antes de divulgar, ou remova.

---

## 7. Publicar de graça

**GitHub Pages**, sem build, sem servidor:

1. Suba o repositório para o GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Salve. Em um ou dois minutos o site está em `https://SEU-USUARIO.github.io/jogos-bibel/`.

Como todos os caminhos internos são **relativos** (`../assets/...`, `cores/...`), funciona igual num subdiretório do GitHub Pages, num domínio próprio ou aberto do disco. Alternativas equivalentes: Netlify, Cloudflare Pages, Vercel (todas com o modo "site estático", sem configuração).

---

## 8. Usar IA para gerar jogos

O formato foi desenhado para uma IA conseguir preencher sozinha. O fluxo que funciona:

1. Abra uma conversa com uma IA (Claude, ChatGPT, etc.).
2. Cole o prompt pronto em [`docs/prompt-para-ia.md`](docs/prompt-para-ia.md). Ele explica o schema e os três motores.
3. Peça o jogo que você quer: *"Um jogo `choice` de três níveis sobre frutas, em português e inglês, para uma criança de 4 anos."*
4. A IA devolve o objeto `window.__G__` inteiro. Cole no `index.html` da pasta nova.
5. Rode local, ajuste o que estiver estranho (emoji errado, nível difícil demais), registre no hub, publique.

O trabalho humano é: escolher o tema, testar com a criança de verdade e cortar o que não funciona. A IA cuida da digitação.

---

## 9. Ideias de jogos para fazer

Rápidas, no motor `choice`, a não ser onde indicado:

- **Letra inicial do nome dele:** "Toque na letra que começa o seu nome."
- **Membros da família:** fotos ou emojis, "Cadê a vovó?".
- **Cores da casa:** peça para a criança buscar um objeto daquela cor entre uma rodada e outra.
- **Contar brinquedos** (motor `choice` com `show.k = "count"`).
- **Dias da semana em ordem** (motor `order`).
- **Rimas com o nome dos bichos de pelúcia** (motor `memory`).
- **Formas na rua:** placa é círculo, janela é quadrado.
- **Português ↔ inglês:** ouça a palavra em inglês, toque na figura (é o jogo `ingles-pra-figura`, copie e troque o vocabulário).

Comece com três rounds e um nível. Se a criança pedir "de novo", você acertou o tema.

---

## 10. Licença

Código sob licença [MIT](LICENSE). Use, altere e republique à vontade, inclusive para os seus próprios filhos ou para uma escola. Se puder, mantenha um crédito ao projeto original e conte o que você fez com ele.

Criado por Thiago Patente. Original em https://www.thiagopatente.com.br/jogo/
