# Régua de dificuldade (Onda 2)

Padrão único para todo jogo de `choice` e `order`. Objetivo: profundidade consistente e um teto que acompanha a criança conforme ela evolui.

## 5 níveis, sempre

| Nível | Papel | Como fica mais difícil |
|---|---|---|
| 1 | Fácil, familiar | Vocabulário/números que a criança já domina. 3 opções. Dica visual presente (figura, contagem). |
| 2 | Amplia | Mesma ideia, itens novos. 3 opções. |
| 3 | Consolida | Mistura o que veio nos níveis 1 e 2. 3 opções. |
| 4 | Estica | **Conteúdo novo de verdade:** palavras mais longas ou menos comuns, dígrafos (lh, nh, ch, rr), números maiores, subtração, comparação apertada. 3 opções. |
| 5 | Desafio | **4 opções** (`"grid": true`), distratores mais próximos da resposta, menos andaime (quando dá, sem a figura), mais rodadas. Mistura tudo. |

`memory` (`rimas`, `sombras`) escala pelo número de pares e mantém 6 níveis.

## Regras de conteúdo dos níveis 4 e 5

- **Alfabetização:** nível 4 traz palavras com sílaba complexa e menos frequentes (GIRAFA, CHUVA, JACARÉ, ESQUILO, ZEBRA). Nível 5 tira a figura quando o som permite e usa distratores de letra parecida (P/B, F/V, M/N).
- **Matemática:** nível 4 vai a ~16 na contagem e ~12 na soma, inclui subtração. Nível 5 mistura soma e subtração, 4 opções, e sequências de 2 em 2, de 5 em 5 e de trás pra frente.
- **Conceito (cores, formas, opostos, emoções):** nível 4 amplia o repertório (cores compostas, formas menos óbvias, emoções sutis). Nível 5 é 4 opções e casos ambíguos ("qual está quase igual").

## Empurrão adaptativo (leve, no cliente)

O motor conta os erros dentro do nível. Na tela de vitória:

- **Zero erro:** o botão "Próximo nível" pulsa, convidando a subir.
- **3 erros ou mais:** sem pulso. O nível fica à mão pra repetir.

Nada disso trava o jogo nem guarda perfil. É só um empurrão visual, calculado na hora, sem back-end.

## Estado

- **Todos os 24 jogos do v2 em 5+ níveis** (`rimas` tem 6). Os níveis 4 e 5 são **rascunho, para o Thiago revisar**: o conteúdo de matemática (`soma-facil`, `contar`, `maior-grupo`, `sequencia`, `tracar-numeros`) é objetivo; o de conceito e o vocabulário de alfabetização pedem um olhar e podem ter palavra trocada.
- Empurrão adaptativo ativo no motor.
- Motores especiais: `tracar-numeros` (trace) vai a 5 com números 6-9 e letras; `guarda-as-coisas` (drag) vai a 5 com "voa/não voa" e três cestos; `sombras` (memory) vai a 5 com um nível de 8 pares sem dica falada. `copa` é à parte (v1).
