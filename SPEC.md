# Especificação · Play nos Estudos

Gamificação com avatar sobre o portal de disciplinas do Prof. Eber Santana (IFS Campus Tobias Barreto).
O estudante tem um robô, o **Bit**, que evolui conforme ele estuda. O avatar compara o estudante com ele mesmo; o ranking da turma continua existindo, mas não é o centro.

## Objetivos

1. Dar a cada estudante um retorno visual e individual do quanto ele estudou, em todas as disciplinas.
2. Reforçar a proposta pedagógica do portal (tentar antes de ver a resposta) sem substituir a avaliação formal.
3. Reaproveitar o que já existe: login por turma e PIN, envio de progresso por material e a planilha do professor.
4. Gerar dados para pesquisa (engajamento antes e depois do avatar), sem coletar nenhum dado pessoal novo.

## Fora do escopo (por enquanto)

- Ranking por nível ou comparação de avatares entre colegas.
- Recompensas que valham nota.
- Foto, rosto ou qualquer imagem real do estudante.

## Regras do jogo

### XP (experiência)

Calculado a partir das linhas da aba **Progresso** (uma por estudante e por material):

| Evento | XP |
|---|---|
| Cada atividade feita (`feitas`) | 10 |
| Chegar a 50% de um material | +50 |
| Concluir 100% de um material | +100 |

- `feitas` nunca passa de `total` (o servidor corta).
- Linhas sem `total` (ex.: o registro "portal" do login) não dão XP.
- O XP nunca diminui por falta de estudo. Não há punição.

### Nível

XP para chegar ao nível N = `50 × (N − 1) × N` (100, 300, 600, 1000, 1500…). Não há nível máximo.

### Forma do Bit (cargo)

| Níveis | Cargo | O que muda no robô |
|---|---|---|
| 1–2 | Estagiário | Robô pequeno sobre rodas |
| 3–5 | Técnico | Ganha braços e antena |
| 6–9 | Analista | Corpo maior, visor e painel no peito |
| 10–14 | Especialista | Ombreiras e pernas |
| 15–19 | Arquiteto | Propulsores e anel de energia |
| 20+ | Lenda | Aura e partículas em órbita |

### Atributos (um por área)

| Atributo | Disciplina(s) | Materiais |
|---|---|---|
| Conexão | Redes / Projeto de Redes | redes-comp-v1, projeto-redes-v1, subnetting-v1, mapa-do-chamado-v1, redes-console-v1 |
| Escudo | Segurança da Informação | seginfo-console-v1, detetives-digitais-v1 |
| Memória | Banco de Dados | bd-console-v1 |
| Base | Informática Básica | windows11-v1, office-visual-v1 |
| Maker | Laboratório 3D | esp32-lab-v1, microbit-lab-v1 |
| Criação | Construção de Sites | (a ligar) |
| Processo | Engenharia de Software | (a ligar) |

Material desconhecido soma em **Geral**. Um material novo entra no jogo acrescentando o id na tabela `MATERIAIS` de `jogo/jogo.js` e em `Codigo.gs`.

### Conquistas e recompensas

Todas as recompensas são só visuais.

| Conquista | Condição | Desbloqueia |
|---|---|---|
| Primeiro passo | Qualquer XP | Óculos |
| Explorador | 3 materiais iniciados | Fone |
| Meio caminho | Um material em 50% | Boné |
| Missão cumprida | Um material em 100% | Medalha |
| Polivalente | XP em 3 atributos | Mochila a jato |
| Mestre da Conexão | Conexão ≥ 2000 | Antena Wi-Fi |
| Mestre do Escudo | Escudo ≥ 2000 | Escudo |
| Mestre da Memória | Memória ≥ 2000 | Chip no peito |
| Mão na massa | Maker ≥ 500 | Chave inglesa |
| Lenda | Nível 20 | Coroa |

Cores do Bit liberadas por nível: Verde IFS e Azul (1), Laranja (3), Roxo (5), Rosa (8), Grafite (10), Dourado (12), Holográfico (16).
Expressões (feliz, focado, surpreso, piscando) e o nome do robô (até 16 caracteres) são livres.

## Arquitetura

```
jogo/jogo.js            motor (XP, nível, atributos, conquistas, desbloqueios), desenho SVG do Bit,
                        selo no botão do canto, bloco no painel e aviso de "subiu de nível".
                        Funciona no navegador e no Node (para os testes).
meu-personagem/         página "Meu personagem": editor, atributos, conquistas, XP por material.
apps-script/Codigo.gs   + ação "avatar" (devolve o progresso do estudante e as escolhas salvas)
                        + ação "avatar-salvar" (grava as escolhas na aba Avatar)
                        + corte feitas ≤ total
testes/jogo.test.js     node --test testes/
```

- O cálculo de XP acontece no navegador (motor) e é repetido no Apps Script para preencher as colunas `xp` e `nivel` da aba Avatar, que o professor acompanha. Um teste garante que os dois dão o mesmo resultado.
- O estado é guardado em cache no aparelho por 2 minutos e atualizado depois de cada envio de progresso.
- Escolhas bloqueadas (ex.: uma cor de nível maior) voltam para o padrão, no navegador e no servidor.

## Privacidade (LGPD / ECA Digital)

- Nenhum dado novo do estudante: só as escolhas do avatar (cor, acessórios, expressão, nome do robô).
- Nada de foto ou imagem real. O avatar é um robô desenhado no próprio site, sem serviço externo.
- A aba Avatar fica só na planilha do professor.

## Acessibilidade

- O SVG do Bit tem `role="img"` e descrição textual (cargo, nível, cor, acessórios).
- Animações respeitam "reduzir movimento" do sistema e a opção "Menos animação" do portal.
- Avisos de nível usam `aria-live="polite"`. Todo o editor funciona por teclado.
- Cores seguem as variáveis do `aparencia.js`, então as 8 paletas e o alto contraste continuam valendo.

## Critérios de aceite

- [ ] Estudante logado vê o Bit no botão do canto e no painel, com nível e barra de XP.
- [ ] Ao subir de nível ou ganhar conquista, aparece um aviso uma única vez.
- [ ] Página "Meu personagem" permite trocar cor, acessórios, expressão e nome; itens bloqueados mostram como desbloquear.
- [ ] Os três consoles de estudo (Redes, Segurança, Banco de Dados) passam a enviar progresso.
- [ ] `node --test testes/` passa.
- [ ] axe-core sem falhas em "Meu personagem" nos temas claro e escuro.
