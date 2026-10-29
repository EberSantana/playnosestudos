// Testes do motor do jogo. Rode com: node --test testes/
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const J = require("../jogo/jogo.js");

const linha = (material, feitas, total) => ({ material, feitas, total, pontos: feitas * 10 });

test("XP de um material: 10 por atividade, +50 na metade, +100 ao concluir", () => {
  assert.equal(J.xpMaterial(linha("subnetting-v1", 0, 20)), 0);
  assert.equal(J.xpMaterial(linha("subnetting-v1", 9, 20)), 90);
  assert.equal(J.xpMaterial(linha("subnetting-v1", 10, 20)), 150);
  assert.equal(J.xpMaterial(linha("subnetting-v1", 20, 20)), 350);
});

test("XP corta feitas acima do total e ignora linhas sem total", () => {
  assert.equal(J.xpMaterial(linha("subnetting-v1", 999, 20)), 350);
  assert.equal(J.xpMaterial(linha("portal", 0, 0)), 0);
  assert.equal(J.xpMaterial({ material: "x", feitas: "abc", total: 10 }), 0);
  assert.equal(J.xpMaterial({ material: "x", feitas: -5, total: 10 }), 0);
});

test("Nível: 50 × (N−1) × N de XP para chegar ao nível N", () => {
  assert.equal(J.nivelDe(0).nivel, 1);
  assert.equal(J.nivelDe(99).nivel, 1);
  assert.equal(J.nivelDe(100).nivel, 2);
  assert.equal(J.nivelDe(299).nivel, 2);
  assert.equal(J.nivelDe(300).nivel, 3);
  assert.equal(J.nivelDe(19000).nivel, 20);
  const n = J.nivelDe(150);
  assert.equal(n.inicio, 100);
  assert.equal(n.proximo, 300);
  assert.equal(n.fracao, 0.25);
});

test("Cargo e forma do Bit seguem o nível", () => {
  assert.deepEqual([1, 2, 3, 5, 6, 9, 10, 14, 15, 19, 20, 40].map(n => J.cargoDe(n).forma), [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  assert.equal(J.cargoDe(1).nome, "Estagiário");
  assert.equal(J.cargoDe(20).nome, "Lenda");
});

test("calcular soma XP por atributo e manda material desconhecido para Geral", () => {
  const e = J.calcular([
    linha("redes-console-v1", 10, 100),
    linha("subnetting-v1", 20, 20),
    linha("bd-console-v1", 5, 50),
    linha("material-novo", 3, 10),
    linha("portal", 0, 0)
  ]);
  assert.equal(e.atributos.conexao, 100 + 350);
  assert.equal(e.atributos.memoria, 50);
  assert.equal(e.atributos.geral, 30);
  assert.equal(e.xp, 100 + 350 + 50 + 30);
  assert.equal(e.materiais.length, 4);
  assert.equal(e.nivel, J.nivelDe(e.xp).nivel);
});

test("calcular aceita lista vazia ou inválida", () => {
  for (const v of [[], null, undefined, "x"]) {
    const e = J.calcular(v);
    assert.equal(e.xp, 0);
    assert.equal(e.nivel, 1);
    assert.equal(e.conquistas.length, 0);
  }
});

test("Conquistas", () => {
  const ids = rows => J.calcular(rows).conquistas;
  assert.deepEqual(ids([linha("subnetting-v1", 1, 20)]), ["primeiro-passo"]);
  assert.ok(ids([linha("subnetting-v1", 10, 20)]).includes("meio-caminho"));
  assert.ok(ids([linha("subnetting-v1", 20, 20)]).includes("missao-cumprida"));
  assert.ok(ids([linha("a", 1, 9), linha("b", 1, 9), linha("c", 1, 9)]).includes("explorador"));
  assert.ok(ids([linha("redes-console-v1", 1, 9), linha("bd-console-v1", 1, 9), linha("windows11-v1", 1, 9)]).includes("polivalente"));
  assert.ok(ids([linha("redes-console-v1", 200, 520)]).includes("mestre-conexao"));
  assert.ok(!ids([linha("redes-console-v1", 199, 520)]).includes("mestre-conexao"));
  assert.ok(ids([linha("esp32-lab-v1", 50, 60)]).includes("maker"));
});

test("Desbloqueios: cores por nível e acessórios por conquista", () => {
  const novo = J.calcular([]);
  const d0 = J.desbloqueados(novo);
  assert.ok(d0.cores.includes("verde") && d0.cores.includes("azul") && d0.cores.includes("laranja") && d0.cores.includes("rosa"));
  assert.ok(!d0.cores.includes("dourado") && !d0.cores.includes("holografico"));
  assert.deepEqual(d0.acessorios, []);
  const e = J.calcular([linha("subnetting-v1", 20, 20), linha("redes-console-v1", 30, 520)]);
  const d = J.desbloqueados(e);
  assert.ok(e.nivel >= 3);
  assert.ok(d.cores.includes("laranja"));
  assert.ok(d.acessorios.includes("oculos") && d.acessorios.includes("medalha"));
});

test("validarEscolhas troca itens bloqueados ou inválidos pelo padrão", () => {
  const e = J.calcular([linha("subnetting-v1", 1, 20)]);
  const v = J.validarEscolhas({ cor: "dourado", cabeca: "oculos", peito: "medalha", extra: "<script>", expressao: "feliz", nome: "  Robozão <b>do</b> Pedro muito longo " }, e);
  assert.equal(v.cor, "verde");
  assert.equal(v.cabeca, "oculos");
  assert.equal(v.peito, "");
  assert.equal(v.extra, "");
  assert.equal(v.expressao, "feliz");
  assert.ok(v.nome.length <= 16);
  assert.ok(!/[<>]/.test(v.nome));
  assert.deepEqual(J.validarEscolhas(null, e), J.ESCOLHAS_PADRAO);
});

test("Acessório só entra no lugar certo (óculos não vai no peito)", () => {
  const e = J.calcular([linha("subnetting-v1", 20, 20)]);
  assert.equal(J.validarEscolhas({ peito: "oculos" }, e).peito, "");
});

test("desenhar devolve SVG acessível com descrição, para todas as formas", () => {
  for (let f = 1; f <= 6; f++) {
    const s = J.desenhar({ forma: f, cor: "roxo", cabeca: "coroa", peito: "chip", extra: "escudo", expressao: "piscando" }, { titulo: "Bit" });
    assert.match(s, /^<svg[^>]+role="img"/);
    assert.match(s, /<title[^>]*>Bit<\/title>/);
    assert.match(s, /<desc[^>]*>Bit, o robô, etapa /);
    assert.ok(!/(\s[a-z-]+="[^"]*")[^>]*\1/.test(s.replace(/"[^"]*"/g, '""')) || true);
    for (const tag of s.match(/<[a-z]+\s[^>]*>/g)) {
      const nomes = (tag.match(/\s([a-z-]+)=/g) || []).map(x => x.trim());
      assert.equal(new Set(nomes).size, nomes.length, "atributo repetido em " + tag);
    }
    assert.ok(!s.includes("undefined") && !s.includes("NaN"), "forma " + f);
  }
});

test("desenhar escapa o título", () => {
  assert.ok(!J.desenhar({}, { titulo: "<img onerror=x>" }).includes("<img"));
});

test("novidades detecta subida de nível e conquistas novas", () => {
  const antes = J.calcular([linha("subnetting-v1", 1, 20)]);
  const depois = J.calcular([linha("subnetting-v1", 20, 20)]);
  const n = J.novidades(antes, depois);
  assert.equal(n.subiu, true);
  assert.ok(n.conquistas.includes("missao-cumprida"));
  assert.deepEqual(J.novidades(depois, depois), { subiu: false, conquistas: [], cargoNovo: false });
  assert.deepEqual(J.novidades(null, depois), { subiu: false, conquistas: [], cargoNovo: false });
});

test("O XP do Apps Script é igual ao do motor", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "apps-script", "Codigo.gs"), "utf8");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const rows = [linha("subnetting-v1", 20, 20), linha("redes-console-v1", 77, 520), linha("bd-console-v1", 999, 50), linha("portal", 0, 0), linha("x", 4, 9)];
  const e = J.calcular(rows);
  const g = ctx.xpENivel_(rows.map(r => ({ feitas: r.feitas, total: r.total })));
  assert.equal(g.xp, e.xp);
  assert.equal(g.nivel, e.nivel);
});

test("Modelos: 10 avatares, cada um com 6 etapas", () => {
  assert.deepEqual(J.MODELOS.map(m => m.id), ["bit", "pixel", "tatu", "sonda", "arvore", "cidade", "girassol", "gotinha", "borboleta", "gata"]);
  for (const m of J.MODELOS) assert.equal(m.etapas.length, 6, m.id);
  assert.equal(J.etapaDe("pixel", 6), "Dragão de código");
  assert.equal(J.etapaDe("inexistente", 1), "Robô sobre rodas");
});

test("validarEscolhas aceita só modelos conhecidos (padrão: bit)", () => {
  const e = J.calcular([]);
  assert.equal(J.validarEscolhas({ modelo: "tatu" }, e).modelo, "tatu");
  assert.equal(J.validarEscolhas({ modelo: "dragao<script>" }, e).modelo, "bit");
  assert.equal(J.validarEscolhas({}, e).modelo, "bit");
});

test("Todos os modelos desenham as 6 etapas, com e sem acessórios, sem atributo repetido", () => {
  const combos = [{}, { cabeca: "oculos", peito: "chip", extra: "jetpack" }, { cabeca: "coroa", peito: "medalha", extra: "escudo" }, { cabeca: "fone", extra: "chave" }, { cabeca: "bone" }, { cabeca: "antena-wifi" }];
  for (const m of J.MODELOS) for (let f = 1; f <= 6; f++) for (const c of combos) for (const cor of ["verde", "holografico"]) {
    const s = J.desenhar(Object.assign({ modelo: m.id, forma: f, cor, expressao: "piscando" }, c));
    assert.match(s, /^<svg[^>]+role="img"/);
    assert.ok(!/undefined|NaN|d=""/.test(s), m.id + " " + f);
    assert.match(s, new RegExp("<desc[^>]*>" + m.nome.split(",")[0]));
    for (const tag of s.match(/<[a-z]+\s[^>]*>/g)) {
      const nomes = (tag.match(/\s([a-z-]+)=/g) || []).map(x => x.trim());
      assert.equal(new Set(nomes).size, nomes.length, m.id + " " + f + ": " + tag);
    }
  }
});

test("O Apps Script guarda o modelo e recusa modelo inválido", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "apps-script", "Codigo.gs"), "utf8");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src + ";this.L = limparEscolhas_;", ctx);
  assert.equal(ctx.L({ modelo: "cidade" }, 1).modelo, "cidade");
  assert.equal(ctx.L({ modelo: "x" }, 1).modelo, "bit");
});

test("ritmo: sequência de dias, XP do dia e da semana, metas", () => {
  const at = { dias: ["2026-10-27", "2026-10-28"], historico: { "2026-10-25": 400, "2026-10-27": 700, "2026-10-28": 850 } };
  const r = J.ritmo(at, 1000, "2026-10-29");
  assert.equal(r.xpHoje, 150);
  assert.equal(r.sequencia, 3);
  assert.equal(r.xpSemana, 600);
  assert.equal(r.diasSemana, 3);
  assert.equal(r.metaDia, true);
  assert.equal(r.metaSemana, true);
  assert.equal(r.metaDias, true);
  // sem estudar hoje a sequência de ontem ainda vale; pulando um dia ela zera
  assert.equal(J.ritmo(at, 850, "2026-10-29").sequencia, 2);
  assert.equal(J.ritmo(at, 850, "2026-10-30").sequencia, 0);
  // semana nova (segunda-feira) recomeça a contagem
  const nova = J.ritmo(at, 850, "2026-11-02");
  assert.equal(nova.xpSemana, 0);
  assert.equal(nova.diasSemana, 0);
});

test("ritmo aceita dados vazios ou inválidos", () => {
  for (const v of [null, undefined, "x", {}, { dias: "a", historico: [] }]) {
    const r = J.ritmo(v, 0, "2026-10-29");
    assert.equal(r.sequencia, 0);
    assert.equal(r.xpHoje, 0);
  }
});
