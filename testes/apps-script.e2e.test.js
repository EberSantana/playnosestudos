// Teste ponta a ponta do Apps Script com uma planilha simulada em memória.
// Cobre: criar PIN, entrar, bloqueio por erros, progresso, XP/nível na aba Avatar e salvar o avatar.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

function planilhaFalsa() {
  const abas = {};
  const mk = nome => {
    const dados = [];
    const sh = {
      nome, dados,
      getLastRow: () => dados.length,
      getLastColumn: () => dados.reduce((m, r) => Math.max(m, r.length), 0),
      getDataRange: () => ({ getValues: () => dados.map(r => r.slice()) }),
      appendRow: r => { dados.push(r.slice()); },
      setFrozenRows: () => {},
      clear: () => { dados.length = 0; },
      getName: () => sh.nome,
      getActiveRange: () => ({ getRow: () => 2 }),
      setName: n => { sh.nome = n; abas[n] = sh; },
      insertSheet: null,
      getRange: (l, c, nl = 1, nc = 1) => ({
        getValue: () => (dados[l - 1] || [])[c - 1],
        setValue(v) { (dados[l - 1] = dados[l - 1] || [])[c - 1] = v; return this; },
        setValues(m) { m.forEach((lin, i) => lin.forEach((v, j) => { (dados[l - 1 + i] = dados[l - 1 + i] || [])[c - 1 + j] = v; })); return this; },
        clearContent() { for (let i = 0; i < nl; i++) for (let j = 0; j < nc; j++) if (dados[l - 1 + i]) dados[l - 1 + i][c - 1 + j] = ""; return this; },
        getRow: () => l,
        setFontWeight() { return this; }, setBackground() { return this; }, setNote() { return this; }
      })
    };
    return sh;
  };
  const ss = {
    getSheetByName: n => abas[n] || null,
    getSheets: () => Object.values(abas),
    copy: n => ({ nome: n }),
    getName: () => "planilha",
    insertSheet: n => (abas[n] = mk(n)),
    getUi: () => ({ createMenu: () => ({ addItem() { return this; }, addSeparator() { return this; }, addToUi() {} }), alert() {}, prompt: () => ({ getSelectedButton: () => 0, getResponseText: () => "" }), ButtonSet: { OK: 0, YES_NO: 1 }, Button: { YES: 1, OK: 0 } }),
    getId: () => "planilha-falsa", getUrl: () => "https://exemplo"
  };
  return { ss, abas };
}

function carregar() {
  const { ss, abas } = planilhaFalsa();
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, getUi: ss.getUi, getActiveSheet: () => abas["Turmas"] },
    ContentService: { MimeType: { JSON: "json", CSV: "csv", TEXT: "text" }, createTextOutput: t => ({ conteudo: t, setMimeType() { return this; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: {
      DigestAlgorithm: { SHA_256: "sha256" },
      computeDigest: (alg, s) => Array.from(crypto.createHash("sha256").update(s).digest()).map(b => (b > 127 ? b - 256 : b)),
      formatDate: (d, tz, f) => (f === "yyyy-MM-dd" ? new Date(d).toISOString().slice(0, 10) : new Date(d).toISOString()),
      newBlob: () => ({})
    },
    Session: { getScriptTimeZone: () => "America/Bahia" },
    DriveApp: {}, PropertiesService: {}, ScriptApp: { getProjectTriggers: () => [], WeekDay: { MONDAY: 1 }, newTrigger: () => ({ timeBased() { return this; }, everyWeeks() { return this; }, onWeekDay() { return this; }, atHour() { return this; }, create() {} }) }, MailApp: {}, Logger: { log() {} }
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "apps-script", "Codigo.gs"), "utf8") + ";this.__api = { interpretarAcesso_, prepararAcesso, doGet, doPost, turmas_, idDe_, atualizarPainel, importarAlunos, importarLista_, lerTurmas_, liberarAlunoSelecionado, exportarPesquisa, montarPesquisa_, montarPainel_, backupAgora, ligarBackupSemanal };", ctx);
  return { ctx, api: ctx.__api, abas };
}

const get = (api, p) => JSON.parse(api.doGet({ parameter: p }).conteudo);
const post = (api, d) => JSON.parse(api.doPost({ postData: { contents: JSON.stringify(d) } }).conteudo);

function semear(api) {
  const t = api.turmas_();
  t.appendRow(["INFO1", "Informática", "Noturno", "2026001", "Maria da Silva Souza", "", "", "", ""]);
  t.appendRow(["INFO1", "Informática", "Noturno", "2026002", "Pedro Henrique Lima", "", "", "", ""]);
}

test("e2e: lista turmas e alunos sem expor matrícula nem nome completo", () => {
  const { api } = carregar(); semear(api);
  assert.deepEqual(get(api, { acao: "turmas" }).turmas.map(t => [t.turma, t.alunos]), [["INFO1", 2]]);
  const r = get(api, { acao: "alunos", turma: "info1" });
  assert.equal(r.alunos.length, 2);
  assert.deepEqual(r.alunos.map(a => a.nome), ["Maria S.", "Pedro L."]);
  const txt = JSON.stringify(r);
  assert.ok(!txt.includes("2026001") && !txt.includes("da Silva"));
  assert.ok(r.alunos.every(a => a.temPin === false));
});

test("e2e: criar PIN, entrar, errar o PIN e ser bloqueado", () => {
  const { api } = carregar(); semear(api);
  const id = get(api, { acao: "alunos", turma: "INFO1" }).alunos[0].id;
  assert.match(post(api, { acao: "entrar", turma: "INFO1", id, pin: "4821" }).erro, /não tem PIN/);
  const novo = post(api, { acao: "entrar", turma: "INFO1", id, pin: "4821", criarPin: true });
  assert.equal(novo.ok, true); assert.equal(novo.novo, true);
  assert.equal(post(api, { acao: "entrar", turma: "INFO1", id, pin: "4821" }).ok, true);
  assert.match(post(api, { acao: "entrar", turma: "INFO1", id, pin: "0000" }).erro, /PIN errado/);
  for (let i = 0; i < 4; i++) post(api, { acao: "entrar", turma: "INFO1", id, pin: "0000" });
  assert.equal(api.turmas_().getDataRange().getValues()[1][7], 5);
  assert.match(post(api, { acao: "entrar", turma: "INFO1", id, pin: "4821" }).erro, /tentativas|minuto/i);
  assert.equal(get(api, { acao: "alunos", turma: "INFO1" }).alunos[0].temPin, true);
});

test("e2e: progresso vira XP e nível na aba Avatar e o aluno salva o avatar", () => {
  const { api, abas } = carregar(); semear(api);
  const id = get(api, { acao: "alunos", turma: "INFO1" }).alunos[0].id;
  const base = { turma: "INFO1", id, pin: "7390" };
  assert.equal(post(api, { ...base, acao: "entrar", criarPin: true }).ok, true);
  assert.equal(post(api, { ...base, disciplina: "subnetting-v1", feitas: 20, total: 20, pontos: 200 }).ok, true);
  assert.equal(post(api, { ...base, disciplina: "bd-console-v1", feitas: 999, total: 50, pontos: 1 }).ok, true);
  const av = abas["Avatar"].dados;
  assert.equal(av[1][0], "2026001");
  assert.equal(av[1][10], 350 + 50 * 10 + 50 + 100);
  assert.equal(av[1][11], 5);
  const lido = post(api, { ...base, acao: "avatar" });
  assert.equal(lido.progresso.length, 2);
  assert.equal(lido.progresso.find(p => p.material === "bd-console-v1").feitas, 50);
  const salvo = post(api, { ...base, acao: "avatar-salvar", escolhas: { modelo: "gata", cor: "dourado", cabeca: "coroa", nome: "<b>Mia</b>", expressao: "piscando" } });
  assert.equal(salvo.escolhas.modelo, "gata");
  assert.equal(salvo.escolhas.cor, "verde");
  assert.ok(!/[<>]/.test(salvo.escolhas.nome));
  assert.equal(post(api, { ...base, acao: "avatar" }).escolhas.modelo, "gata");
  assert.equal(abas["Avatar"].dados.length, 2);
});

test("e2e: ranking do material mostra só nome curto", () => {
  const { api } = carregar(); semear(api);
  const id = get(api, { acao: "alunos", turma: "INFO1" }).alunos[1].id;
  post(api, { turma: "INFO1", id, pin: "5062", acao: "entrar", criarPin: true });
  post(api, { turma: "INFO1", id, pin: "5062", disciplina: "windows11-v1", feitas: 3, total: 12, pontos: 30 });
  const r = get(api, { disciplina: "windows11-v1", turma: "INFO1" });
  assert.equal(r.lista.length, 1);
  assert.equal(r.lista[0].apelido, "Pedro L.");
});

test("professor: importar lista sem duplicar e ignorando linhas incompletas", () => {
  const { api, abas } = carregar(); semear(api);
  const r = api.importarLista_([
    ["INFO1", "Informática", "Noturno", "2026001", "Maria da Silva Souza"],
    ["INFO2", "Informática", "Matutino", 2026010, "Ana Clara"],
    ["INFO2", "Informática", "Matutino", "", "Sem matrícula"],
    ["", "", "", "", ""]
  ], api.lerTurmas_());
  assert.equal(r.novos.length, 1);
  assert.equal(r.novos[0][3], "2026010");
  assert.equal(r.ignorados.length, 2);
  api.importarAlunos();
  assert.ok(abas["Importar"]);
  abas["Importar"].dados.push(["INFO2", "Informática", "Matutino", "2026010", "Ana Clara"]);
  api.importarAlunos();
  assert.equal(api.lerTurmas_().length, 3);
  assert.equal(abas["Importar"].dados[1].every(c => c === ""), true);
});

test("professor: painel, liberar PIN e exportação anonimizada", () => {
  const { api, abas } = carregar(); semear(api);
  const ids = get(api, { acao: "alunos", turma: "INFO1" }).alunos;
  const base = { turma: "INFO1", id: ids[0].id, pin: "4821" };
  post(api, { ...base, acao: "entrar", criarPin: true });
  post(api, { ...base, disciplina: "subnetting-v1", feitas: 20, total: 20, pontos: 200 });
  api.atualizarPainel();
  const painel = abas["Painel"].dados.map(r => r.join("|")).join("\n");
  assert.match(painel, /INFO1\|2\|1\|1\|0\|1/);
  assert.match(painel, /Pedro Henrique Lima/);
  api.liberarAlunoSelecionado();
  assert.equal(abas["Turmas"].dados[1][5], "");
  api.exportarPesquisa();
  const pesq = JSON.stringify(abas["Pesquisa"].dados);
  assert.ok(!pesq.includes("Maria") && !pesq.includes("2026001"));
  assert.equal(abas["Pesquisa"].dados.length, 3);
  assert.equal(abas["Pesquisa"].dados[1][8], 1);
  assert.doesNotThrow(() => { api.backupAgora(); api.ligarBackupSemanal(); });
});

test("disciplinas por turma: aba Acesso limita o que o aluno vê", () => {
  const { api, abas } = carregar(); semear(api);
  const ids = get(api, { acao: "alunos", turma: "INFO1" }).alunos;
  const base = { turma: "INFO1", id: ids[0].id, pin: "4821" };
  assert.equal(post(api, { ...base, acao: "entrar", criarPin: true }).perfil.disciplinas, null);
  api.prepararAcesso();
  assert.equal(JSON.stringify(abas["Acesso"].dados.slice(0, 2).map(r => r.slice(0, 2))), JSON.stringify([["turma", "disciplinas liberadas"], ["INFO1", "todas"]]));
  assert.equal(post(api, { ...base, acao: "entrar" }).perfil.disciplinas, null);
  abas["Acesso"].dados[1][1] = "Banco de Dados, redes de computadores; Segurança da Informação";
  assert.equal(JSON.stringify(post(api, { ...base, acao: "entrar" }).perfil.disciplinas), JSON.stringify(["banco-de-dados", "redes-de-computadores", "seguranca-da-informacao"]));
  assert.equal(JSON.stringify(api.interpretarAcesso_("banco-de-dados")), '["banco-de-dados"]');
  assert.equal(api.interpretarAcesso_("todas"), null);
  assert.equal(api.interpretarAcesso_("nome errado"), null);
  assert.equal(JSON.stringify(api.interpretarAcesso_("nenhuma")), "[]");
});
