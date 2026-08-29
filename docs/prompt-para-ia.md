# Prompt pronto para gerar um jogo com IA

Cole o texto abaixo numa conversa com uma IA (Claude, ChatGPT ou similar). Depois do prompt, escreva em uma frase o jogo que você quer. A IA devolve o objeto `window.__G__` completo, pronto para colar no `index.html` de uma pasta nova.

---

```
Você vai gerar o conteúdo de um joguinho educativo para crianças de 3 a 6 anos.
A saída deve ser APENAS um objeto JavaScript atribuído a window.__G__, sem
explicação em volta, pronto para colar dentro de <script>...</script>.

REGRAS DO FORMATO

- Todo texto que a criança lê ou ouve é um objeto { "pt": "...", "en": "..." }.
- Campos obrigatórios do objeto:
  slug   : string curta em kebab-case (ex.: "frutas-tropicais")
  turma  : "m2" para 3-4 anos, "p2" para 5-6 anos
  engine : "choice", "memory" ou "order"
  hero   : um emoji
  unit   : { "pt": "acertos", "en": "correct" }   (ou "pares"/"pairs" no memory)
  i18n   : { "pt": {...}, "en": {...} } com as chaves
           title, kicker, tag, hint, about   (kicker pode ser "Jogos da Bibel")
  levels : array de níveis; cada nível tem
           nome { pt, en }, sub { pt, en } e o conteúdo do motor.

- Motor "choice": cada nível tem "rounds". Cada round:
    say  { pt, en }                       -> pergunta falada
    show { k, v, n? }  (opcional)         -> k = "letter" | "emoji" | "word" | "count"
                                             ("count" repete o emoji v, n vezes)
    opts [ { emoji|letter|t, correct } ]  -> uma ou mais com correct:true
    multi true (opcional) se houver mais de uma resposta certa
    grid  true (opcional) para 4+ opções

- Motor "memory": cada nível tem "cards" (número par). Cada carta:
    key  string    -> duas cartas com a mesma key formam par
    html string    -> emoji ou HTML curto
    say  { pt, en } (opcional)

- Motor "order": cada nível tem "rounds". Cada round:
    say   { pt, en }
    items [ ... ]   -> array NA ORDEM CORRETA (números ou strings curtas)
    emoji string    (opcional)
    word  { pt, en } (opcional) -> falado ao completar

DIRETRIZES DE CONTEÚDO

- 3 níveis, dificuldade crescente. 3 a 5 rounds por nível (4 a 8 cartas no memory).
- Linguagem simples, frases curtas, uma instrução por vez.
- Use emojis que existam tanto no iOS quanto no Android.
- Em "choice", as opções erradas devem ser plausíveis mas claramente distintas.
- Tradução natural, não literal.

Confirme que entendeu e peça o tema do jogo.
```

---

## Depois que a IA responder

1. Copie a pasta de um jogo do mesmo motor: `cp -r cores meu-jogo` (ou `rimas` para `memory`, `sequencia` para `order`).
2. No `meu-jogo/index.html`, troque o bloco `<script>window.__G__ = {...}</script>` pelo que a IA gerou.
3. Confira que o `slug` bate com o nome da pasta.
4. Registre no array `TILES` do `index.html` da raiz.
5. Rode `python -m http.server 8000`, teste nas duas línguas até a tela de vitória.
6. Teste com a criança. Corte o nível que travar, troque o emoji que ela não reconhecer.
7. `git add`, `git commit`, `git push`.
