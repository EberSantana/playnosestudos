# Play nos Estudos · Prof. Eber Santana

> Portal de disciplinas gamificado: cada estudante escolhe um avatar (robô Bit, Pixel, Tatu-bola tech, Sonda, Árvore-circuito ou Minha Smart City) que ganha XP, sobe de nível, evolui em 6 etapas e libera acessórios conforme estuda. Regras completas em [SPEC.md](SPEC.md). Veja um exemplo em `meu-personagem/?demo`.

## Gamificação (avatares)

- **XP:** +10 por atividade feita, +50 na metade de um material, +100 ao concluir. Nunca diminui.
- **Nível:** 50 × (N−1) × N de XP para chegar ao nível N. Seis etapas de evolução por modelo, ligadas aos cargos Estagiário, Técnico, Analista, Especialista, Arquiteto e Lenda.
- **Atributos:** Conexão (Redes), Escudo (Segurança), Memória (Banco de Dados), Base (Informática Básica), Maker (Laboratório 3D), Criação e Processo.
- **Conquistas:** 10 conquistas, cada uma libera um acessório. Cores liberadas por nível. Tudo é só visual e não vale nota.
- **Professor:** a aba **Avatar** da planilha mostra XP, nível e as escolhas de cada estudante.
- **Testes:** `node --test testes/*.test.js` (inclui a conferência de que o Apps Script calcula o mesmo XP que o site).
- **Para atualizar o Apps Script:** cole o novo `apps-script/Codigo.gs` na planilha e faça uma **nova implantação** do App da Web (mesmo endereço, versão nova).

# Ambientes de Estudo · Prof. Eber Santana

Portal de materiais didáticos interativos das disciplinas de Informática do **Instituto Federal de Sergipe (IFS), Campus Tobias Barreto**.

**Acesse:** [ebersantana.github.io/disciplinas](https://ebersantana.github.io/disciplinas/)

Cada disciplina reúne laboratórios visuais, atividades de caderno, flashcards, questões de verdadeiro ou falso com justificativa e problemas de PBL (Aprendizagem Baseada em Problemas). As respostas só aparecem depois que o estudante tenta resolver. O portal funciona no computador, no tablet e no celular, sem instalar nada.

---

## Disciplinas

| Curso | Disciplina | Materiais |
|---|---|---|
| Técnico em Informática | [Redes de Computadores](https://ebersantana.github.io/disciplinas/redes-de-computadores/) | Console de estudo, atividades com ranking, Subnetting na Prática, Mapa do Chamado (TCP/IP na prática) |
| Técnico em Informática | [Projeto de Redes](https://ebersantana.github.io/disciplinas/projeto-de-redes/) | Atividades com ranking (metodologia Top-Down) |
| Técnico em Informática | [Segurança da Informação](https://ebersantana.github.io/disciplinas/seguranca-da-informacao/) | Console de estudo, Detetives Digitais (desinformação, checagem de fatos, deepfakes e algoritmos) |
| Subsequente em Informática | [Informática Básica](https://ebersantana.github.io/disciplinas/informatica-basica/) | Ambiente interativo, apostila, Método Office Visual, Trilha Windows 11 (12 aulas, com laboratório visual em cada uma, caderno, flashcards, V ou F e PBL) |
| Subsequente em Informática | [Engenharia de Software](https://ebersantana.github.io/disciplinas/engenharia-de-software/) | Apostilas, roteiro de processo, dicionário de dados, estante |
| Integrado em Desenvolvimento de Sistemas · 1º ano | [Construção de Sites 1](https://ebersantana.github.io/disciplinas/construcao-de-sites-1/) | Apostila de HTML e CSS |
| Integrado em Desenvolvimento de Sistemas · 2º ano | [Banco de Dados](https://ebersantana.github.io/disciplinas/banco-de-dados/) | Console de estudo, apostila de SQL |

Também estão disponíveis [recursos de aula](https://ebersantana.github.io/disciplinas/recursos-de-aula/) para qualquer disciplina: cronômetro com ranking de equipes, a Linha do Tempo Tecnológica e o guia 14 Códigos para Aprender com IA.

Há ainda o [Laboratório 3D](https://ebersantana.github.io/disciplinas/laboratorio-3d/) (Vamos praticar?): ESP32, micro:bit e Arduino em 3D, com montagem de circuitos e programação direto no navegador.

---

## Como acessar e usar o portal

### 1. Acessar
Abra **[ebersantana.github.io/disciplinas](https://ebersantana.github.io/disciplinas/)** no navegador do computador, tablet ou celular. Não precisa instalar nada. Dica: salve o endereço nos favoritos ou adicione à tela inicial do celular.

### 2. Entrar (primeiro acesso)
1. Escolha a **sua turma**.
2. Toque no **seu nome** na lista.
3. **Crie um PIN de 4 números** e digite duas vezes para confirmar. Anote o PIN: ele é a sua senha.

Nos próximos acessos, escolha a turma, toque no seu nome e digite o PIN. Não precisa digitar nome, e-mail ou matrícula. Depois de 5 erros de PIN a conta fica bloqueada por 15 minutos. Se esquecer o PIN, fale com o professor.

### 3. Escolher a disciplina
O portal mostra primeiro as disciplinas do seu curso. Toque em uma para abrir os materiais. O botão **Minhas disciplinas**, no canto da tela, leva de volta a elas a partir de qualquer página.

### 4. Estudar
- Cada disciplina tem **módulos**. Em cada um você encontra atividades de caderno, flashcards, verdadeiro ou falso com justificativa, quiz e problemas de PBL.
- **Tente responder antes**: o gabarito e a explicação só aparecem depois da sua tentativa.
- Os **laboratórios visuais** (como a Trilha Windows 11 e o Subnetting na Prática) mostram o conceito funcionando. Mexa à vontade.

### 5. Acompanhar o progresso e o ranking
O progresso fica salvo no seu aparelho e é enviado ao professor. Abra o botão do canto da tela para ver a sua pontuação e o **ranking da turma** (aparece só o primeiro nome e a inicial do sobrenome). Se sair do aparelho ou trocar de computador, entre de novo com o mesmo PIN.

### 6. Deixar o portal do seu jeito
Toque em **Aparência** (canto inferior esquerdo) para escolher:
- **cores**: 8 paletas, entre elas Rosa Aurora, Lilás Sonho, Azul, Verde e Alto contraste;
- **claro, escuro ou automático**;
- **tamanho da letra** (até 150%), espaçamento, fonte de leitura fácil, menos animação e links sublinhados.

A escolha fica salva para você. O botão **Restaurar padrão** volta ao visual original.

### 7. Acessibilidade e ajuda
- **Libras:** o ícone do **VLibras** aparece nas páginas e traduz o texto para a Língua Brasileira de Sinais (precisa de internet).
- **Teclado:** use Tab para navegar, Enter ou Espaço para ativar e Esc para fechar janelas. O primeiro Tab mostra o link **Pular para o conteúdo**.
- Algum problema ou barreira de acesso? Avise o professor.

## Proposta pedagógica

- **Tentar antes de ver a resposta:** o gabarito e a explicação só aparecem depois da tentativa.
- **Várias formas de praticar:** caderno, flashcards com repetição, V ou F com justificativa escrita, quiz e PBL em equipe.
- **Laboratórios visuais:** simuladores que mostram o conceito funcionando (como cálculo de sub-redes e camadas de rede).
- **Gamificação:** pontos por atividade e ranking por turma, para motivar e acompanhar, sem substituir a avaliação formal.

## Acessibilidade

O portal segue as diretrizes WCAG 2.1 nível AA (base do e-MAG) e foi verificado com o axe-core nos temas claro e escuro, sem falhas automáticas nas 36 páginas.

- **Meu visual:** botão **Aparência** em todas as páginas. Cada estudante escolhe entre 8 paletas (Padrão IFS, Verde Comunidade, Azul Institucional, Terracota Editorial, Rosa Aurora, Lilás Sonho, Creme Leitura e Alto contraste), claro/escuro/automático, tamanho da letra (até 150%), espaçamento, fonte de leitura fácil, menos animação e links sublinhados. A escolha fica salva por aluno no aparelho. Todas as paletas têm contraste mínimo de 4,5:1 (Alto contraste, acima de 7:1).
- **VLibras** em todas as páginas (tradutor para Libras do governo federal; exige internet).
- Link **"Pular para o conteúdo"** (aparece ao apertar Tab) e foco de teclado visível.
- Navegação completa por **teclado**; elementos que só respondiam ao mouse passaram a aceitar Tab, Enter e Espaço.
- **Contraste** de cores de pelo menos 4,5:1 nos textos, em ambos os temas.
- Respeita **"reduzir movimento"** do sistema e o **zoom** do navegador (sem rolagem lateral em 320 px).
- Páginas com idioma (`pt-BR`), região principal e títulos em ordem.

O `acessibilidade.js` é carregado em todas as páginas. Em uma página nova, acrescente `<script src="../acessibilidade.js" defer></script>` antes de `</body>`. Para conferir, use WAVE, ASES (e-MAG) e AccessMonitor sobre o endereço publicado, e teste com um leitor de tela (NVDA).

### Base legal e normas

O portal busca atender às regras de acessibilidade digital do Brasil:

| Norma | O que estabelece | Como o portal responde |
|---|---|---|
| [Lei nº 13.146/2015](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm) (Lei Brasileira de Inclusão, art. 63) | Torna obrigatória a acessibilidade nos sítios da internet mantidos por empresas e órgãos públicos | Páginas com navegação por teclado, contraste, estrutura e leitura por leitor de tela |
| [Lei nº 10.098/2000](https://www.planalto.gov.br/ccivil_03/leis/l10098.htm) | Normas gerais para a promoção da acessibilidade, inclusive nos meios de comunicação e informação | Uso do portal com segurança e autonomia, sem depender do mouse ou de um tipo de tela |
| [Decreto nº 5.296/2004](https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/decreto/d5296.htm) | Regulamenta a Lei 10.098 e trata da acessibilidade nos sítios da administração pública | Seguimos o modelo e-MAG |
| [Lei nº 10.436/2002](https://www.planalto.gov.br/ccivil_03/leis/2002/l10436.htm) e [Decreto nº 5.626/2005](https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/decreto/d5626.htm) | Reconhecem a Língua Brasileira de Sinais (Libras) | VLibras em todas as páginas |
| [e-MAG](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital) (Modelo de Acessibilidade em Governo Eletrônico) | Recomendações de acessibilidade para sítios do governo federal | Verificação com ASES e AccessMonitor |
| [WCAG 2.1](https://www.w3.org/TR/WCAG21/) nível AA (W3C) | Padrão internacional em que o e-MAG se baseia | Verificação automática com axe-core, sem falhas |

O portal também respeita a [Lei nº 13.709/2018 (LGPD)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) no tratamento dos dados dos estudantes (veja Privacidade).

A verificação automática não substitui o teste com pessoas. Se você encontrar uma barreira de acesso, avise o professor para que ela seja corrigida.

---

## Como é feito

| Parte | Tecnologia |
|---|---|
| Páginas | HTML, CSS e JavaScript, sem dependências de instalação |
| Hospedagem | GitHub Pages |
| Login e progresso | Google Apps Script ligado a uma planilha do professor |
| Desenvolvimento | Engenharia de prompt e criação assistida por IA |

```
disciplinas/
├── index.html              página inicial do portal
├── config.js               endereço do serviço de progresso
├── progresso-turma.js      login, menu de disciplinas e envio do progresso
├── aparencia.js            seletor de cores e leitura "Meu visual" (todas as páginas)
├── acessibilidade.js       VLibras, pular conteúdo, foco e teclado (todas as páginas)
├── apps-script/Codigo.gs   código da planilha (login, progresso e ranking)
└── <disciplina>/           uma pasta por disciplina, com index.html e os materiais
```

As instruções de manutenção (incluir materiais, ligar a planilha, atualizar o portal) estão no [LEIA-ME.md](LEIA-ME.md).

## Privacidade

- A lista de alunos (nome completo e matrícula) fica somente na planilha do professor, que não é pública. Nenhum dado pessoal é gravado neste repositório.
- O ranking mostra apenas o primeiro nome e a inicial do sobrenome.
- A lista pública mostra só o primeiro nome e a inicial do sobrenome. O PIN impede que um colega entre no lugar do outro, e 5 erros bloqueiam a conta por 15 minutos.
- Os dados servem apenas para acompanhar a aprendizagem na disciplina, em linha com a LGPD (Lei nº 13.709/2018).

---

## Autor

**Prof. MSc. Eber da Silva de Santana**
Professor EBTT do Instituto Federal de Sergipe, Campus Tobias Barreto. Pesquisador em tecnologia educacional, gamificação e segurança da informação.

[Lattes](http://lattes.cnpq.br/8888622742399905) · [ORCID](https://orcid.org/0000-0002-1236-6312) · Instagram [@prof.ebersantana](https://www.instagram.com/prof.ebersantana/)

## Uso dos materiais

Os materiais são de uso educacional. Para reutilizar ou adaptar em outra instituição, entre em contato com o autor.
