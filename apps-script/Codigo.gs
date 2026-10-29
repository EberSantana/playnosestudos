/**
 * Portal das disciplinas — Prof. Eber Santana
 * Login por turma, nome e PIN, e registro do progresso de cada aluno.
 * Cole este código em Extensões > Apps Script da planilha e implante como "App da Web".
 *
 * Aba "Turmas" (você preenche, importando o Turmas.csv): um aluno por linha.
 *   turma | curso | turno | matricula | nome | pin | ultimo acesso | tentativas | bloqueado ate
 *   A coluna "pin" começa vazia: o aluno cria o PIN no primeiro acesso.
 *   Para o aluno criar um PIN novo (esqueceu), apague a célula do PIN dele.
 * Aba "Progresso" (criada sozinha): uma linha por aluno e por material.
 *
 * Aba "Avatar" (criada sozinha): uma linha por aluno com o robô Bit (Play nos Estudos),
 *   o XP e o nível. Serve para o professor acompanhar a evolução da turma.
 *
 * Nada de nome completo, matrícula ou PIN sai da planilha para o site público:
 * a lista de nomes mostra só o primeiro nome e a inicial do sobrenome.
 */
const ABA_TURMAS = "Turmas";
const ABA_PROG = "Progresso";
const CAB_TURMAS = ["turma", "curso", "turno", "matricula", "nome", "pin", "ultimo acesso", "tentativas", "bloqueado ate"];
const CAB_PROG = ["material", "nome", "matricula", "curso", "turno", "turma", "feitas", "total", "pontos", "atualizado", "detalhe"];
const ABA_AVATAR = "Avatar";
const CAB_AVATAR = ["matricula", "nome", "turma", "curso", "nome do robo", "cor", "cabeca", "peito", "extra", "expressao", "xp", "nivel", "atualizado", "modelo", "dias", "historico xp"];
const ABA_ACESSO = "Acesso", CAB_ACESSO = ["turma", "disciplinas liberadas"];
// Pastas do site e nomes aceitos na aba Acesso (com ou sem acento, maiúsculas ou minúsculas).
const DISCIPLINAS_ = [
  ["informatica-basica", "Informática Básica"], ["engenharia-de-software", "Engenharia de Software"],
  ["construcao-de-sites-1", "Construção de Sites 1"], ["banco-de-dados", "Banco de Dados"],
  ["redes-de-computadores", "Redes de Computadores"], ["projeto-de-redes", "Projeto de Redes"],
  ["seguranca-da-informacao", "Segurança da Informação"]
];
const MAX_TENTATIVAS = 5, BLOQUEIO_MIN = 15;

function aba_(nome, cab) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nome);
  if (!sh) {
    // Aceita a lista importada com outro nome de aba: procura uma aba cujo cabeçalho começa igual.
    sh = ss.getSheets().find(s => s.getLastRow() > 0 && String(s.getRange(1, 1).getValue()).trim().toLowerCase() === cab[0]
      && String(s.getRange(1, 2).getValue()).trim().toLowerCase() === cab[1]) || null;
    if (sh) { sh.setName(nome); return sh; }
  }
  if (!sh) {
    sh = ss.insertSheet(nome);
    sh.appendRow(cab);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, cab.length).setFontWeight("bold");
  }
  return sh;
}
const turmas_ = () => aba_(ABA_TURMAS, CAB_TURMAS);
const prog_ = () => aba_(ABA_PROG, CAB_PROG);
const avatar_ = () => aba_(ABA_AVATAR, CAB_AVATAR);

/* ---------- Play nos Estudos: XP e nível (mesma regra de jogo/jogo.js; um teste confere) ---------- */
function xpENivel_(linhas) {
  const n = v => { v = Number(v); return isFinite(v) && v > 0 ? Math.floor(v) : 0; };
  let xp = 0;
  linhas.forEach(r => {
    const total = n(r.total), feitas = Math.min(n(r.feitas), total);
    if (total) xp += feitas * 10 + (feitas * 2 >= total ? 50 : 0) + (feitas >= total ? 100 : 0);
  });
  let nivel = 1;
  while (50 * nivel * (nivel + 1) <= xp) nivel++;
  return { xp: xp, nivel: nivel };
}
const CORES_NIVEL_ = { verde: 1, azul: 1, laranja: 1, roxo: 1, rosa: 1, grafite: 5, dourado: 10, holografico: 16 };
const ACESS_ = { cabeca: ["oculos", "fone", "bone", "antena-wifi", "coroa"], peito: ["medalha", "chip"], extra: ["jetpack", "escudo", "chave"] };
const EXPR_ = ["feliz", "focado", "surpreso", "piscando"];
const MODELOS_ = ["bit", "pixel", "tatu", "sonda", "arvore", "cidade", "girassol", "gotinha", "borboleta", "gata"];

function progressoDe_(matricula, lp) {
  return lp.slice(1).filter(r => String(r[2]).trim() === matricula && r[0] !== "portal")
    .map(r => ({ material: String(r[0]), feitas: Number(r[6]) || 0, total: Number(r[7]) || 0, atualizado: r[9] }));
}
function linhaAvatar_(sh, matricula) {
  const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (String(v[i][0]).trim() === matricula) return { linha: i + 1, valores: v[i] };
  return null;
}
function escolhasDe_(valores) {
  if (!valores) return {};
  return { modelo: valores[13] || "bit", nome: valores[4], cor: valores[5], cabeca: valores[6], peito: valores[7], extra: valores[8], expressao: valores[9] };
}
// Confere o formato e a lista de itens. A cor também é conferida pelo nível; os acessórios, pelo navegador.
function limparEscolhas_(e, nivel) {
  e = e && typeof e === "object" ? e : {};
  const cor = CORES_NIVEL_[e.cor] && CORES_NIVEL_[e.cor] <= nivel ? e.cor : "verde";
  const lugar = k => ACESS_[k].indexOf(e[k]) >= 0 ? e[k] : "";
  const nome = txt_(String(e.nome || "").replace(/<[^>]*>/g, "").replace(/[<>"'`&\\]/g, ""), 16) || "Bit";
  return { modelo: MODELOS_.indexOf(e.modelo) >= 0 ? e.modelo : "bit", nome: nome, cor: cor, cabeca: lugar("cabeca"), peito: lugar("peito"), extra: lugar("extra"), expressao: EXPR_.indexOf(e.expressao) >= 0 ? e.expressao : "feliz" };
}
function hojeBahia_() { return Utilities.formatDate(new Date(), "America/Bahia", "yyyy-MM-dd"); }
function atividadeDe_(valores) {
  const le = (v, vazio) => { try { const o = JSON.parse(v || ""); return o && typeof o === "object" ? o : vazio; } catch (e) { return vazio; } };
  const dias = valores ? le(valores[14], []) : [], hist = valores ? le(valores[15], {}) : {};
  return { dias: Array.isArray(dias) ? dias.map(String) : [], historico: hist && !Array.isArray(hist) ? hist : {} };
}
function gravarAvatar_(a, lp, escolhas) {
  const sh = avatar_(), atual = linhaAvatar_(sh, a.matricula);
  const xn = xpENivel_(progressoDe_(a.matricula, lp));
  const esc = escolhas ? limparEscolhas_(escolhas, xn.nivel) : (atual ? escolhasDe_(atual.valores) : limparEscolhas_({}, 1));
  // Dias em que o estudante ganhou XP e o XP ao fim de cada dia (para sequência e metas)
  const at = atividadeDe_(atual ? atual.valores : null), hoje = hojeBahia_();
  const xpAntes = atual ? Number(atual.valores[10]) || 0 : 0;
  if (xn.xp > xpAntes && at.dias.indexOf(hoje) < 0) at.dias.push(hoje);
  at.historico[hoje] = xn.xp;
  const dias = at.dias.sort().slice(-60);
  const chaves = Object.keys(at.historico).sort().slice(-40), hist = {};
  chaves.forEach(k => { hist[k] = at.historico[k]; });
  const linha = [a.matricula, a.nome, a.turma, a.curso, esc.nome, esc.cor, esc.cabeca, esc.peito, esc.extra, esc.expressao, xn.xp, xn.nivel, new Date(), esc.modelo, JSON.stringify(dias), JSON.stringify(hist)];
  for (let c = sh.getLastColumn(); c < CAB_AVATAR.length; c++) sh.getRange(1, c + 1).setValue(CAB_AVATAR[c]).setFontWeight("bold");
  if (atual) sh.getRange(atual.linha, 1, 1, linha.length).setValues([linha]);
  else sh.appendRow(linha);
  return esc;
}

const norm_ = s => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

// Disciplinas liberadas para uma turma, lidas da aba Acesso. "todas" = tudo liberado; null = sem regra (o site mostra s\u00f3 as disciplinas do curso da turma).
function interpretarAcesso_(texto) {
  const t = norm_(texto);
  if (!t) return null;
  if (t === "todas" || t === "todos" || t === "*") return "todas";
  if (t === "nenhuma" || t === "nenhum") return [];
  const achadas = [];
  t.split(/[,;\n]/).map(x => x.trim()).filter(Boolean).forEach(tok => {
    const d = DISCIPLINAS_.find(x => norm_(x[0]) === tok || norm_(x[1]) === tok);
    if (d && achadas.indexOf(d[0]) < 0) achadas.push(d[0]);
  });
  return achadas.length ? achadas : null; // nome errado nunca deixa o aluno sem nada
}
function liberadasDe_(turma) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_ACESSO);
  if (!sh) return null;
  const linha = sh.getDataRange().getValues().slice(1).find(r => chave_(r[0]) === chave_(turma));
  return linha ? interpretarAcesso_(linha[1]) : null;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
const txt_ = (v, n) => String(v == null ? "" : v).trim().replace(/\s+/g, " ").slice(0, n);
const chave_ = s => txt_(s, 80).toLowerCase();

// Identificador público do aluno: não revela a matrícula.
function idDe_(matricula) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "portal-eber:" + String(matricula).trim());
  return b.slice(0, 6).map(x => ((x + 256) % 256).toString(16).padStart(2, "0")).join("");
}

// "Pedro Henrique Lima" -> "Pedro L."; se houver outro "Pedro L." na turma, usa mais partes do nome.
function nomesCurtos_(nomes) {
  const part = n => String(n).trim().split(/\s+/).filter(w => !/^(de|da|do|das|dos|e)$/i.test(w));
  const forma = (p, k) => k === 0 ? p[0] + (p.length > 1 ? " " + p[p.length - 1].charAt(0).toUpperCase() + "." : "")
    : p.slice(0, Math.min(k + 1, p.length - 1)).join(" ") + (p.length > 1 ? " " + p[p.length - 1].charAt(0).toUpperCase() + "." : "");
  const ps = nomes.map(part), nivel = nomes.map(() => 0);
  for (let volta = 0; volta < 4; volta++) {
    const out = ps.map((p, i) => forma(p, nivel[i]));
    let mudou = false;
    out.forEach((o, i) => { if (out.filter(x => x === o).length > 1 && nivel[i] < ps[i].length - 1) { nivel[i]++; mudou = true; } });
    if (!mudou) return out;
  }
  return ps.map((p, i) => forma(p, nivel[i]));
}

function lerTurmas_() {
  const v = turmas_().getDataRange().getValues();
  return v.slice(1).map((r, i) => ({ linha: i + 2, turma: txt_(r[0], 60), curso: txt_(r[1], 80), turno: txt_(r[2], 20),
    matricula: String(r[3]).trim(), nome: txt_(r[4], 100), pin: String(r[5] || ""), tentativas: Number(r[7]) || 0,
    bloqueio: r[8] ? new Date(r[8]) : null })).filter(a => a.turma && a.nome && a.matricula);
}

function doGet(e) {
  const p = e.parameter || {};
  const acao = String(p.acao || "");
  if (acao === "turmas") {
    const m = {};
    lerTurmas_().forEach(a => { if (!m[a.turma]) m[a.turma] = { turma: a.turma, curso: a.curso, turno: a.turno, alunos: 0 }; m[a.turma].alunos++; });
    return json_({ ok: true, turmas: Object.keys(m).sort().map(k => m[k]) });
  }
  if (acao === "alunos") {
    const t = chave_(p.turma);
    const lista = lerTurmas_().filter(a => chave_(a.turma) === t).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    const curtos = nomesCurtos_(lista.map(a => a.nome));
    return json_({ ok: true, alunos: lista.map((a, i) => ({ id: idDe_(a.matricula), nome: curtos[i], temPin: !!a.pin })) });
  }
  // Ranking de um material numa turma
  const material = String(p.disciplina || "");
  const turma = chave_(p.turma);
  const linhas = prog_().getDataRange().getValues().slice(1).filter(r => r[0] === material && (!turma || chave_(r[5]) === turma));
  const curtos = nomesCurtos_(linhas.map(r => r[1]));
  const lista = linhas.map((r, i) => ({ turma: r[5], apelido: curtos[i], pontos: r[8], feitas: r[6], total: r[7] }))
    .sort((a, b) => b.pontos - a.pontos).slice(0, 200);
  return json_({ ok: true, lista: lista });
}

// Confere turma + id + PIN. No primeiro acesso (sem PIN na planilha), grava o PIN novo.
function bloqueioMin_(erros) { return erros >= 10 ? 1440 : erros >= 8 ? 60 : erros >= MAX_TENTATIVAS ? BLOQUEIO_MIN : 0; }
// PIN óbvio: todos iguais ou sequência (1234, 4321, 0123...).
function pinFraco_(pin) {
  return /^(\d)\1{3}$/.test(pin) || "01234567890".indexOf(pin) >= 0 || "09876543210".indexOf(pin) >= 0;
}
function autenticar_(d, sh) {
  const t = chave_(d.turma), id = String(d.id || "");
  const a = lerTurmas_().find(x => chave_(x.turma) === t && idDe_(x.matricula) === id);
  if (!a) return { erro: "Aluno não encontrado nesta turma. Fale com o professor." };
  const agora = new Date();
  if (a.bloqueio && a.bloqueio > agora) {
    const min = Math.ceil((a.bloqueio - agora) / 60000);
    return { erro: "Muitas tentativas erradas. Tente de novo em " + min + " minuto(s)." };
  }
  const pin = txt_(d.pin, 4);
  if (!/^\d{4}$/.test(pin)) return { erro: "O PIN precisa ter 4 números." };
  if (!a.pin) {
    if (!d.criarPin) return { erro: "Você ainda não tem PIN. Volte e crie o seu." };
    if (pinFraco_(pin)) return { erro: "Esse PIN é fácil de adivinhar. Escolha outro (evite 1234, 0000 e repetições)." };
    sh.getRange(a.linha, 6, 1, 4).setValues([["p" + pin, agora, 0, ""]]);
    return { aluno: a, novo: true };
  }
  if (a.pin !== "p" + pin) {
    // Erros seguidos: o bloqueio cresce (15 min, 1 h, 24 h) e só zera com um acerto ou quando o professor libera.
    const n = a.tentativas + 1, min = bloqueioMin_(n);
    sh.getRange(a.linha, 8, 1, 2).setValues([[n, min ? new Date(agora.getTime() + min * 60000) : ""]]);
    return { erro: min ? "PIN errado. Por segurança, espere " + (min >= 60 ? min / 60 + " hora(s)" : min + " minutos") + " para tentar de novo." : "PIN errado. Confira e tente de novo." };
  }
  sh.getRange(a.linha, 7, 1, 3).setValues([[agora, 0, ""]]);
  return { aluno: a };
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = turmas_();
    const r = autenticar_(d, sh);
    if (r.erro) return json_({ ok: false, erro: r.erro });
    const a = r.aluno;
    const curto = nomesCurtos_([a.nome])[0];
    const perfil = { id: idDe_(a.matricula), nome: a.nome, apelido: curto, curso: a.curso, turno: a.turno, turma: a.turma, disciplinas: liberadasDe_(a.turma) };

    if (d.acao === "avatar") {
      const lp = prog_().getDataRange().getValues();
      const atual = linhaAvatar_(avatar_(), a.matricula);
      return json_({ ok: true, perfil: perfil, progresso: progressoDe_(a.matricula, lp), escolhas: atual ? escolhasDe_(atual.valores) : {}, atividade: atividadeDe_(atual ? atual.valores : null) });
    }
    if (d.acao === "avatar-salvar") {
      const esc = gravarAvatar_(a, prog_().getDataRange().getValues(), d.escolhas);
      return json_({ ok: true, perfil: perfil, escolhas: esc });
    }

    const material = txt_(d.disciplina, 40);
    if (d.acao === "entrar" || !material || material === "portal") return json_({ ok: true, perfil: perfil, novo: !!r.novo });

    const total = Math.max(0, Number(d.total) || 0), feitas = Math.min(total, Math.max(0, Number(d.feitas) || 0));
    const pontos = Math.max(0, Math.min(100000, Number(d.pontos) || 0));
    const detalhe = JSON.stringify(d.detalhe || {}).slice(0, 2000);
    const sp = prog_();
    const lp = sp.getDataRange().getValues();
    const linha = [a.nome, a.matricula, a.curso, a.turno, a.turma, feitas, total, pontos, new Date(), detalhe];
    let achou = false;
    for (let i = 1; i < lp.length; i++) {
      if (lp[i][0] === material && String(lp[i][2]).trim() === a.matricula) {
        sp.getRange(i + 1, 2, 1, 10).setValues([linha]);
        lp[i] = [material].concat(linha);
        achou = true;
        break;
      }
    }
    if (!achou) { sp.appendRow([material].concat(linha)); lp.push([material].concat(linha)); }
    try { gravarAvatar_(a, lp, null); } catch (errAv) {}
    return json_({ ok: true, perfil: perfil });
  } catch (err) {
    return json_({ ok: false, erro: "Erro no servidor do portal." });
  } finally {
    lock.releaseLock();
  }
}

/* ================= Ferramentas do professor (menu "Play nos Estudos" na planilha) ================= */

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Play nos Estudos")
    .addItem("Atualizar painel da turma", "atualizarPainel")
    .addItem("Importar lista de alunos (aba Importar)", "importarAlunos")
    .addItem("Disciplinas por turma (preparar aba Acesso)", "prepararAcesso")
    .addSeparator()
    .addItem("Liberar bloqueio e apagar PIN do aluno selecionado", "liberarAlunoSelecionado")
    .addSeparator()
    .addItem("Exportar dados anonimizados para pesquisa", "exportarPesquisa")
    .addItem("Fazer backup agora", "backupAgora")
    .addItem("Ligar backup semanal", "ligarBackupSemanal")
    .addToUi();
}

function avisar_(msg) { try { SpreadsheetApp.getUi().alert(msg); } catch (e) {} }

function abaLimpa_(nome) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(nome) || ss.insertSheet(nome);
  sh.clear();
  return sh;
}
function escreve_(sh, linha, matriz) {
  if (!matriz.length) return linha;
  const n = matriz.reduce((m, r) => Math.max(m, r.length), 1);
  sh.getRange(linha, 1, matriz.length, n).setValues(matriz.map(r => r.concat(new Array(n - r.length).fill(""))));
  return linha + matriz.length;
}

// Resumo por turma: quem já criou PIN, bloqueios, XP e nível.
function montarPainel_(agora) {
  agora = agora || new Date();
  const alunos = lerTurmas_();
  const av = {};
  avatar_().getDataRange().getValues().slice(1).forEach(r => { av[String(r[0]).trim()] = { xp: Number(r[10]) || 0, nivel: Number(r[11]) || 1 }; });
  const turmas = {};
  alunos.forEach(a => {
    const t = turmas[a.turma] = turmas[a.turma] || { turma: a.turma, n: 0, comPin: 0, bloq: 0, xp: 0, nivelMax: 0, ativos: 0 };
    t.n++; if (a.pin) t.comPin++;
    if (a.bloqueio && a.bloqueio > agora) t.bloq++;
    const x = av[a.matricula];
    if (x) { t.xp += x.xp; t.nivelMax = Math.max(t.nivelMax, x.nivel); if (x.xp > 0) t.ativos++; }
  });
  const resumo = [["Turma", "Alunos", "Com PIN", "Sem PIN", "Bloqueados", "Com XP", "XP médio", "Maior nível"]]
    .concat(Object.keys(turmas).sort().map(k => { const t = turmas[k];
      return [t.turma, t.n, t.comPin, t.n - t.comPin, t.bloq, t.ativos, t.n ? Math.round(t.xp / t.n) : 0, t.nivelMax || 1]; }));
  const semPin = [["Ainda sem PIN", "Turma"]].concat(alunos.filter(a => !a.pin).map(a => [a.nome, a.turma]));
  const bloq = [["Bloqueados agora", "Turma", "Até"]].concat(alunos.filter(a => a.bloqueio && a.bloqueio > agora).map(a => [a.nome, a.turma, a.bloqueio]));
  const paradosSemXp = [["Sem nenhuma atividade ainda", "Turma"]].concat(alunos.filter(a => a.pin && !(av[a.matricula] && av[a.matricula].xp > 0)).map(a => [a.nome, a.turma]));
  return { resumo: resumo, semPin: semPin, bloq: bloq, semXp: paradosSemXp };
}
function atualizarPainel() {
  const p = montarPainel_(new Date());
  const sh = abaLimpa_("Painel");
  let l = escreve_(sh, 1, [["Painel do professor · Play nos Estudos", "", "", "", "", "", "", "Atualizado em " + new Date().toLocaleString("pt-BR")]]);
  l = escreve_(sh, l + 1, p.resumo);
  [p.semPin, p.bloq, p.semXp].forEach(t => { l = escreve_(sh, l + 1, t); });
  try { sh.getRange(1, 1, 1, 1).setFontWeight("bold"); } catch (e) {}
  avisar_("Painel atualizado na aba Painel.");
}

// Importa a aba "Importar" (turma | curso | turno | matricula | nome) sem duplicar matrículas.
function importarLista_(linhas, existentes) {
  const vistos = {};
  existentes.forEach(a => { vistos[chave_(a.turma) + "|" + a.matricula] = true; });
  const novos = [], ignorados = [];
  linhas.forEach(r => {
    const t = txt_(r[0], 60), c = txt_(r[1], 80), tu = txt_(r[2], 20), m = String(r[3] == null ? "" : r[3]).trim(), n = txt_(r[4], 100);
    if (!t && !m && !n) return;
    if (!t || !m || !n) { ignorados.push(n || m || "(linha vazia)"); return; }
    const k = chave_(t) + "|" + m;
    if (vistos[k]) { ignorados.push(n + " (já cadastrado)"); return; }
    vistos[k] = true;
    novos.push([t, c, tu, m, n, "", "", "", ""]);
  });
  return { novos: novos, ignorados: ignorados };
}
function importarAlunos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("Importar");
  if (!sh) {
    sh = ss.insertSheet("Importar");
    sh.appendRow(["turma", "curso", "turno", "matricula", "nome"]);
    sh.appendRow(["EXEMPLO", "Informática", "Noturno", "0000", "Apague esta linha e cole a sua lista a partir daqui"]);
    avisar_("Criei a aba Importar. Cole a lista (turma, curso, turno, matricula, nome) a partir da linha 2 e rode este menu de novo.");
    return;
  }
  const v = sh.getDataRange().getValues().slice(1).filter(r => String(r[0]).trim().toUpperCase() !== "EXEMPLO");
  const r = importarLista_(v, lerTurmas_());
  const tu = turmas_();
  r.novos.forEach(x => tu.appendRow(x));
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 5).clearContent();
  avisar_(r.novos.length + " aluno(s) importado(s)." + (r.ignorados.length ? " Ignorados: " + r.ignorados.slice(0, 10).join("; ") : ""));
}

// Apaga PIN, tentativas e bloqueio da linha selecionada na aba Turmas. O aluno cria outro PIN no próximo acesso.
function liberarLinha_(sh, linha) {
  sh.getRange(linha, 6, 1, 4).setValues([["", "", 0, ""]]);
}
function liberarAlunoSelecionado() {
  const sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== "Turmas") { avisar_("Abra a aba Turmas e clique em uma célula da linha do aluno."); return; }
  const l = sh.getActiveRange().getRow();
  if (l < 2) { avisar_("Selecione a linha de um aluno, não o cabeçalho."); return; }
  liberarLinha_(sh, l);
  avisar_("PIN e bloqueio apagados para " + sh.getRange(l, 5).getValue() + ". Ele cria um PIN novo no próximo acesso.");
}

// Dados para pesquisa sem nome nem matrícula (código anônimo gerado por hash).
function montarPesquisa_() {
  const alunos = lerTurmas_();
  const lp = prog_().getDataRange().getValues().slice(1).filter(r => r[0] !== "portal");
  const av = {};
  avatar_().getDataRange().getValues().slice(1).forEach(r => { av[String(r[0]).trim()] = r; });
  const cab = ["codigo anonimo", "turma", "curso", "turno", "modelo", "xp", "nivel", "materiais iniciados", "materiais concluidos", "ultima atividade"];
  const linhas = alunos.map(a => {
    const mine = lp.filter(r => String(r[2]).trim() === a.matricula && Number(r[6]) > 0);
    const conc = mine.filter(r => Number(r[7]) > 0 && Number(r[6]) >= Number(r[7])).length;
    const ult = mine.reduce((m, r) => r[9] && (!m || new Date(r[9]) > m) ? new Date(r[9]) : m, null);
    const x = av[a.matricula] || [];
    return [idDe_(a.matricula), a.turma, a.curso, a.turno, x[13] || "", Number(x[10]) || 0, Number(x[11]) || 1, mine.length, conc, ult || ""];
  });
  return [cab].concat(linhas);
}
function exportarPesquisa() {
  const sh = abaLimpa_("Pesquisa");
  const m = montarPesquisa_();
  escreve_(sh, 1, m);
  avisar_("Aba Pesquisa gerada com " + (m.length - 1) + " aluno(s), sem nome e sem matrícula. Para publicar dados, siga o seu termo de consentimento e o parecer do comitê de ética.");
}

function backupAgora() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nome = "Backup Play nos Estudos " + Utilities.formatDate(new Date(), "America/Bahia", "yyyy-MM-dd HH:mm");
  const c = ss.copy(nome);
  avisar_("Backup criado no seu Google Drive: " + nome);
  return c;
}
function ligarBackupSemanal() {
  const ja = ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === "backupAgora");
  if (!ja) ScriptApp.newTrigger("backupAgora").timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(3).create();
  avisar_(ja ? "O backup semanal já estava ligado." : "Backup semanal ligado: toda segunda-feira, de madrugada.");
}

// Cria a aba Acesso com uma linha por turma (vazio = só as disciplinas do curso da turma). O professor edita a segunda coluna.
function prepararAcesso() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABA_ACESSO) || ss.insertSheet(ABA_ACESSO);
  const atuais = {};
  sh.getDataRange().getValues().slice(1).forEach(r => { if (r[0]) atuais[chave_(r[0])] = true; });
  if (sh.getLastRow() === 0) sh.appendRow(CAB_ACESSO);
  const turmas = {};
  lerTurmas_().forEach(a => { turmas[a.turma] = true; });
  Object.keys(turmas).sort().forEach(tu => { if (!atuais[chave_(tu)]) sh.appendRow([tu, ""]); });
  sh.getRange(1, 4, 1, 1).setValue("Nomes aceitos (separe por vírgula; ou escreva todas / nenhuma)");
  DISCIPLINAS_.forEach((d, i) => sh.getRange(2 + i, 4, 1, 1).setValue(d[1]));
  avisar_("Aba Acesso pronta. Em cada turma, escreva as disciplinas liberadas separadas por vírgula (ex.: Banco de Dados, Redes de Computadores). Deixe vazio para mostrar s\u00f3 as disciplinas do curso da turma; escreva todas para liberar tudo.");
}
