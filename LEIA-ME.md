# Ambientes de estudo · Prof. Eber Santana

Site: `https://ebersantana.github.io/playnosestudos/`

## Como está organizado

Cada disciplina tem a sua pasta. Dentro dela, o `index.html` é a página de entrada da disciplina, com a lista dos materiais.

```
disciplinas/
├── index.html                      ← página inicial (todas as disciplinas)
├── config.js                       ← endereço da planilha (vale para todas)
├── progresso-turma.js              ← login do aluno e envio do progresso
├── acessibilidade.js               ← VLibras, pular conteúdo, foco e teclado (vale para todas as páginas)
├── redes-de-computadores/
│   ├── index.html                  ← entrada da disciplina
│   ├── console-de-estudo.html
│   ├── atividades.html             ← atividades com ranking
│   └── subnetting-na-pratica.html  ← envia progresso
├── projeto-de-redes/
│   ├── index.html
│   └── atividades.html             ← atividades com ranking
├── informatica-basica/
│   ├── index.html
│   ├── ambiente-interativo.html
│   ├── apostila.html
│   ├── metodo-office-visual.html   ← envia progresso
│   └── trilha-windows-11.html      ← envia progresso
├── engenharia-de-software/
│   ├── index.html
│   ├── apostila-engenharia-de-software.html
│   ├── apostila-engenharia-de-software-1.html
│   ├── apostila-engenharia-de-requisitos.html
│   ├── estante.html
│   ├── roteiro-processo-de-software.html
│   └── dicionario-de-dados.html
├── banco-de-dados/
│   ├── index.html
│   ├── console-de-estudo.html
│   └── apostila.html
├── construcao-de-sites-1/
│   ├── index.html
│   └── apostila.html
├── seguranca-da-informacao/
│   ├── index.html
│   └── console-de-estudo.html
├── recursos-de-aula/
│   ├── index.html
│   ├── cronometro-de-equipes.html
│   ├── linha-do-tempo-tecnologica.html
│   └── codigos-para-aprender-com-ia.html
└── apps-script/Codigo.gs           ← código da planilha (login, progresso e ranking)
```

Regras dos nomes: letras minúsculas, sem acento, sem espaço, palavras separadas por hífen. Nomes com acento ou espaço quebram os links no GitHub Pages.

## Endereços para mandar aos alunos

- Todas: `https://ebersantana.github.io/playnosestudos/`
- Uma disciplina: `https://ebersantana.github.io/playnosestudos/banco-de-dados/` (troque pelo nome da pasta)

## Para substituir tudo de uma vez

1. No repositório, apague as pastas antigas (ou crie o repositório de novo, vazio).
2. **Add file** › **Upload files** e arraste **tudo o que está dentro** desta pasta.
3. **Commit changes**.
4. **Settings** › **Pages** › Branch **main** › **/ (root)** › **Save**.

## Acessibilidade em páginas novas

Todo material novo precisa carregar o `acessibilidade.js` (VLibras, link de pular conteúdo, foco de teclado). Coloque antes do `</body>`: `<script src="../acessibilidade.js" defer></script>` (em páginas dentro de uma pasta de disciplina). Textos com contraste mínimo de 4,5:1 e uma região `<main>` na página completam o básico.

## Para acrescentar um material a uma disciplina

Peça ao Claude para incluir o material: ele devolve o arquivo com nome certo e o `index.html` da disciplina atualizado. Envie os dois para a pasta da disciplina.

## Login dos alunos e progresso

O aluno escolhe a **turma**, toca no **próprio nome** e digita um **PIN de 4 números** (no primeiro acesso ele cria o PIN). O login fica guardado no navegador e vale para todos os materiais. Em outro aparelho, é só repetir: turma, nome e PIN.

Depois do login:
- A página inicial mostra primeiro **Suas disciplinas** (as do curso do aluno) e, abaixo, as outras.
- O botão laranja **Minhas disciplinas**, no canto de todas as páginas, abre o menu com as disciplinas do curso dele.

### Quais disciplinas são de cada curso

A lista fica no começo do arquivo `progresso-turma.js`, na parte `CURSOS`. Para incluir uma disciplina num curso, acrescente uma linha `["Nome que aparece", "nome-da-pasta"]` dentro do curso. Uma disciplina pode estar em mais de um curso.

Enviam o progresso para a planilha: Subnetting na Prática, Mapa do Chamado, Método Office Visual, Trilha Windows 11, Detetives Digitais e as atividades com ranking de Redes e de Projeto de Redes.

Na planilha ficam duas abas:
- **Turmas**: você importa o `Turmas.csv` guardado no seu computador, fora do repositório (uma linha por aluno: turma, curso, turno, matrícula, nome). A coluna `pin` começa vazia e é preenchida quando o aluno cria o PIN (aparece como `p1234`).
- **Progresso**: criada sozinha; uma linha por aluno e por material, com atividades feitas, total, pontos e data.

**Aluno esqueceu o PIN?** Apague a célula do PIN dele na aba **Turmas**; no próximo acesso ele cria outro. **Conta bloqueada** (5 erros)? Apague as células `tentativas` e `bloqueado ate` dele.

**Aluno novo ou outra turma?** Acrescente linhas na aba **Turmas** com o mesmo texto de turma/curso das outras. O nome do curso precisa ser exatamente um destes: Subsequente em Informática · Integrado em Desenvolvimento de Sistemas · 1º ano · Integrado em Desenvolvimento de Sistemas · 2º ano · Técnico em Informática.

A lista que os alunos veem mostra só o primeiro nome e a inicial do sobrenome (nomes repetidos ganham mais uma parte). Nome completo e matrícula ficam apenas na planilha.

### Para ligar (uma vez só)

1. Crie uma planilha em sheets.google.com.
2. **Extensões** › **Apps Script**, apague o que houver, cole o conteúdo de `apps-script/Codigo.gs` e salve.
3. **Implantar** › **Nova implantação** › engrenagem › **App da Web**. *Executar como*: **Eu**. *Quem pode acessar*: **Qualquer pessoa**. **Implantar** e autorize.
4. Copie o endereço que termina em `/exec` e cole entre as aspas no `config.js` do repositório.

**Atenção:** depois de configurado, não substitua o `config.js` ao subir pacotes novos. Se ele voltar vazio, os alunos continuam entrando, mas nada chega à planilha. Quem entrar nesse período é enviado automaticamente para a planilha quando o endereço for colado de novo.

Se depois você alterar o código, use **Implantar** › **Gerenciar implantações** › lápis › *Versão*: **Nova versão**, para manter o mesmo endereço.

## Cuidados

- O repositório é público: não coloque dados pessoais de alunos nos arquivos. Os dados dos alunos ficam só na planilha.
- Não compartilhe a planilha: ela tem nome completo e matrícula dos alunos.
- **Nunca envie o `Turmas.csv` (nem outra lista de alunos) para o repositório**, nem pelo "Add files via upload": o GitHub ignora o `.gitignore` nesse envio. Guarde o arquivo só no seu computador e na planilha. Se subir por engano, apague e avise para limpar o histórico.
- Os pontos são calculados no navegador do aluno. Servem para acompanhar e motivar, não como nota oficial.

## Seletor de aparência ("Meu visual")

O `aparencia.js` entra no `<head>` de toda página nova: `<script src="../aparencia.js"></script>` (sem `../` na raiz). Para a página aceitar a troca de cores, acrescente `data-a11y-cores` na tag `<html>` e use as variáveis de cor padrão (`--bg`, `--panel`, `--ink`, `--muted`, `--accent` etc.). Páginas com cores fixas ficam sem o atributo e ainda recebem tamanho de letra, espaçamento, fonte e movimento. As paletas ficam no começo do `aparencia.js`; ao alterar uma, confira o contraste (mínimo 4,5:1).
