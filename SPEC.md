# Especificação · Play nos Estudos

Gamificação com avatares sobre o portal de disciplinas do Prof. Eber Santana (IFS Campus Tobias Barreto).
O estudante escolhe um avatar entre 10 modelos (o padrão é o robô **Bit**) que evolui conforme ele estuda. O avatar compara o estudante com ele mesmo; o ranking da turma continua existindo, mas não é o centro.

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

### Modelos de avatar (o aluno escolhe)

O aluno escolhe o modelo na aba **Avatar** de "Meu personagem" e pode trocar quando quiser: XP, nível e conquistas não mudam.

| Modelo | Etapas 1 → 6 | Rosto |
|---|---|---|
| Bit, o robô (padrão) | Robô sobre rodas → Braços e antena → Visor e painel → Pernas e ombreiras → Propulsores → Aura de lenda | sim |
| Pixel, a criatura digital | Ovo de dados → Ovo rachando → Filhote → Pixel jovem → Asas de cabo → Dragão de código | sim |
| Tatu-bola tech | Filhote → Capacete de minerador → Casco com circuitos → Carapaça placa-mãe → Rolando → Bola de energia | sim |
| Sonda | Drone → Drone de patrulha → Satélite → Sonda espacial → Sonda com anel → Estação orbital | não |
| Árvore-circuito | Semente-chip → Broto → Muda → Árvore jovem → Copa de circuitos → Frutos de LED | não |
| Minha Smart City | Vila → Vila com escola → Bairro conectado → Cidade → Cidade grande → Metrópole inteligente | não |
| Girassol | Semente → Brotinho → Muda com laço → Botão de flor → Girassol → Girassol solar | sim |
| Gotinha | Gotinha → Gota → Gota com laço → Gota com ondas → Nuvenzinha → Nuvem arco-íris | sim |
| Borboleta | Ovinho → Lagarta → Lagarta crescida → Crisálida → Borboleta → Borboleta de luz | sim |
| Gata (Mia) | Gatinha → Gata com laço → Gata de coleira → Gata programadora → Gata de capa → Gata mística | sim |

- Modelos com rosto vestem os acessórios e têm expressões. Nos outros, os acessórios aparecem como selos ao redor e a aba Expressão some.
- A cor escolhida pinta a parte principal do modelo (corpo, casco, copa, prédio principal).
- O nome padrão acompanha o modelo (Bit, Pixel, Tatu, Sonda, Raiz, Cidade, Girassol, Gotinha, Borboleta, Mia); um nome personalizado é mantido.

### Forma do avatar (cargo)

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

Cores liberadas por nível: Verde IFS, Azul, Laranja, Roxo e Rosa (1), Grafite (5), Dourado (10), Holográfico (16).
Expressões (feliz, focado, surpreso, piscando) e o nome do robô (até 16 caracteres) são livres.

### Disciplinas por turma

A aba **Acesso** da planilha (turma | disciplinas liberadas) define o que cada turma vê. O servidor devolve `perfil.disciplinas` no login e a cada envio de progresso. Sem linha ou vazio: só as disciplinas do curso da turma. `todas`: tudo liberado. `nenhuma`: nada. Nome que não existe é ignorado (nunca deixa a turma sem acesso por engano). No site, a página inicial e o menu mostram só as liberadas e uma disciplina não liberada abre um aviso no lugar do conteúdo. Recursos de aula, Laboratório 3D e Meu personagem são sempre livres. É controle de navegação, não de segurança.

### Ritmo de estudo (metas e sequência)

Só visual e sem punição. O servidor guarda na aba Avatar os dias em que o XP cresceu (`dias`) e o XP ao fim de cada dia (`historico xp`, últimos 40 dias).
- **Sequência:** dias seguidos com XP novo. Se hoje ainda não estudou, a sequência de ontem continua valendo.
- **Metas:** 50 XP no dia, 200 XP na semana (segunda a domingo) e estudar em 3 dias diferentes na semana.
- Ao mudar de etapa o avatar mostra uma tela de comemoração (fecha com Esc ou botão; sem animação se o aluno reduzir movimento).
- O estudante pode esconder o ranking da turma no painel do canto.

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

- Nenhum dado novo do estudante: só as escolhas do avatar (modelo, cor, acessórios, expressão, nome).
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
- [ ] `node --test testes/*.test.js` passa (motor, Apps Script ponta a ponta com planilha simulada).
- [ ] axe-core sem falhas em "Meu personagem" nos temas claro e escuro.
