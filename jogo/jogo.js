/* Play nos Estudos · motor do jogo e avatar Bit — Prof. Eber Santana
 * Regras em SPEC.md. Este arquivo funciona no navegador e no Node (testes/jogo.test.js).
 *
 * No navegador, carregue depois de config.js e progresso-turma.js:
 *   <script src="../jogo/jogo.js"></script>
 * Ele coloca o Bit no botão do canto, no painel "Minhas disciplinas" e avisa quando o
 * estudante sobe de nível. A página meu-personagem/ usa window.JOGO para o editor.
 * Acrescente ?demo ao endereço para ver tudo com dados de exemplo, sem login.
 */
(function (raiz) {
  "use strict";

  /* ================= REGRAS ================= */

  // Material -> atributo. Material novo: acrescente aqui e em apps-script/Codigo.gs (se mudar a regra de XP).
  var MATERIAIS = {
    "redes-comp-v1": "conexao", "projeto-redes-v1": "conexao", "subnetting-v1": "conexao",
    "mapa-do-chamado-v1": "conexao", "redes-console-v1": "conexao",
    "seginfo-console-v1": "escudo", "detetives-digitais-v1": "escudo",
    "bd-console-v1": "memoria",
    "windows11-v1": "base", "office-visual-v1": "base",
    "esp32-lab-v1": "maker", "microbit-lab-v1": "maker"
  };
  var NOMES_MATERIAIS = {
    "redes-comp-v1": "Redes · Atividades", "projeto-redes-v1": "Projeto de Redes · Atividades",
    "subnetting-v1": "Subnetting na Prática", "mapa-do-chamado-v1": "Mapa do Chamado",
    "redes-console-v1": "Redes · Console de estudo", "seginfo-console-v1": "Segurança · Console de estudo",
    "detetives-digitais-v1": "Detetives Digitais", "bd-console-v1": "Banco de Dados · Console de estudo",
    "windows11-v1": "Trilha Windows 11", "office-visual-v1": "Método Office Visual",
    "esp32-lab-v1": "Laboratório ESP32", "microbit-lab-v1": "Laboratório micro:bit"
  };
  var ATRIBUTOS = [
    { id: "conexao", nome: "Conexão", area: "Redes", pastas: ["redes-de-computadores", "projeto-de-redes"], icone: "M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0M10 12a2 2 0 0 1 4 0" },
    { id: "escudo", nome: "Escudo", area: "Segurança da Informação", pastas: ["seguranca-da-informacao"], icone: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" },
    { id: "memoria", nome: "Memória", area: "Banco de Dados", pastas: ["banco-de-dados"], icone: "M5 6c0-2 14-2 14 0v12c0 2-14 2-14 0zM5 6c0 2 14 2 14 0M5 12c0 2 14 2 14 0" },
    { id: "base", nome: "Base", area: "Informática Básica", pastas: ["informatica-basica"], icone: "M3 5h18v11H3zM8 20h8M12 16v4" },
    { id: "maker", nome: "Maker", area: "Laboratório 3D", pastas: ["laboratorio-3d"], icone: "M14 4l6 6-3 3-6-6zM11 7l-7 7v4h4l7-7" },
    { id: "criacao", nome: "Criação", area: "Construção de Sites", pastas: ["construcao-de-sites-1"], icone: "M8 7l-5 5 5 5M16 7l5 5-5 5M13 5l-2 14" },
    { id: "processo", nome: "Processo", area: "Engenharia de Software", pastas: ["engenharia-de-software"], icone: "M4 6h6v5H4zM14 13h6v5h-6zM10 8h4v7" },
    { id: "geral", nome: "Geral", area: "Outros materiais", pastas: [], icone: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" }
  ];
  var CARGOS = [
    { de: 1, nome: "Estagiário", forma: 1 }, { de: 3, nome: "Técnico", forma: 2 }, { de: 6, nome: "Analista", forma: 3 },
    { de: 10, nome: "Especialista", forma: 4 }, { de: 15, nome: "Arquiteto", forma: 5 }, { de: 20, nome: "Lenda", forma: 6 }
  ];
  var CORES = [
    { id: "verde", nome: "Verde IFS", nivel: 1, c: ["#2E8B57", "#1B5236", "#8EDCAE"] },
    { id: "azul", nome: "Azul", nivel: 1, c: ["#2F6DB5", "#1B4478", "#9CC3F0"] },
    { id: "laranja", nome: "Laranja", nivel: 3, c: ["#E07A2E", "#97481A", "#F7BC8C"] },
    { id: "roxo", nome: "Roxo", nivel: 5, c: ["#7B4FC9", "#4B2B8A", "#C3AEF0"] },
    { id: "rosa", nome: "Rosa", nivel: 8, c: ["#D9468C", "#952A5D", "#F4AACD"] },
    { id: "grafite", nome: "Grafite", nivel: 10, c: ["#55616C", "#2A3138", "#A9B4BE"] },
    { id: "dourado", nome: "Dourado", nivel: 12, c: ["#D4A017", "#8A660C", "#F6DC80"] },
    { id: "holografico", nome: "Holográfico", nivel: 16, c: ["holo", "#3B3F8F", "#E9F7FF"] }
  ];
  var ACESSORIOS = [
    { id: "oculos", nome: "Óculos", lugar: "cabeca", conquista: "primeiro-passo" },
    { id: "fone", nome: "Fone", lugar: "cabeca", conquista: "explorador" },
    { id: "bone", nome: "Boné", lugar: "cabeca", conquista: "meio-caminho" },
    { id: "antena-wifi", nome: "Antena Wi-Fi", lugar: "cabeca", conquista: "mestre-conexao" },
    { id: "coroa", nome: "Coroa", lugar: "cabeca", conquista: "lenda" },
    { id: "medalha", nome: "Medalha", lugar: "peito", conquista: "missao-cumprida" },
    { id: "chip", nome: "Chip", lugar: "peito", conquista: "mestre-memoria" },
    { id: "jetpack", nome: "Mochila a jato", lugar: "extra", conquista: "polivalente" },
    { id: "escudo", nome: "Escudo", lugar: "extra", conquista: "mestre-escudo" },
    { id: "chave", nome: "Chave inglesa", lugar: "extra", conquista: "maker" }
  ];
  var EXPRESSOES = [
    { id: "feliz", nome: "Feliz" }, { id: "focado", nome: "Focado" },
    { id: "surpreso", nome: "Surpreso" }, { id: "piscando", nome: "Piscando" }
  ];
  var CONQUISTAS = [
    { id: "primeiro-passo", nome: "Primeiro passo", como: "Faça a primeira atividade em qualquer material.", t: function (e) { return e.xp > 0; } },
    { id: "explorador", nome: "Explorador", como: "Comece 3 materiais diferentes.", t: function (e) { return e.iniciados >= 3; } },
    { id: "meio-caminho", nome: "Meio caminho", como: "Chegue a 50% de um material.", t: function (e) { return e.materiais.some(function (m) { return m.fracao >= 0.5; }); } },
    { id: "missao-cumprida", nome: "Missão cumprida", como: "Conclua 100% de um material.", t: function (e) { return e.materiais.some(function (m) { return m.fracao >= 1; }); } },
    { id: "polivalente", nome: "Polivalente", como: "Ganhe XP em 3 áreas diferentes.", t: function (e) { return ATRIBUTOS.filter(function (a) { return a.id !== "geral" && e.atributos[a.id] > 0; }).length >= 3; } },
    { id: "mestre-conexao", nome: "Mestre da Conexão", como: "Junte 2.000 XP em Conexão (Redes).", t: function (e) { return e.atributos.conexao >= 2000; } },
    { id: "mestre-escudo", nome: "Mestre do Escudo", como: "Junte 2.000 XP em Escudo (Segurança).", t: function (e) { return e.atributos.escudo >= 2000; } },
    { id: "mestre-memoria", nome: "Mestre da Memória", como: "Junte 2.000 XP em Memória (Banco de Dados).", t: function (e) { return e.atributos.memoria >= 2000; } },
    { id: "maker", nome: "Mão na massa", como: "Junte 500 XP em Maker (Laboratório 3D).", t: function (e) { return e.atributos.maker >= 500; } },
    { id: "lenda", nome: "Lenda", como: "Chegue ao nível 20.", t: function (e) { return e.nivel >= 20; } }
  ];
  var MODELOS_IDS = ["bit", "pixel", "tatu", "sonda", "arvore", "cidade", "girassol", "gotinha", "borboleta", "gata"];
  var ESCOLHAS_PADRAO = { modelo: "bit", cor: "verde", cabeca: "", peito: "", extra: "", expressao: "feliz", nome: "Bit" };

  function num(v) { v = Number(v); return isFinite(v) && v > 0 ? Math.floor(v) : 0; }

  function xpMaterial(r) {
    var total = num(r && r.total), feitas = Math.min(num(r && r.feitas), total);
    if (!total) return 0;
    return feitas * 10 + (feitas * 2 >= total ? 50 : 0) + (feitas >= total ? 100 : 0);
  }
  function xpParaNivel(n) { return 50 * (n - 1) * n; }
  function nivelDe(xp) {
    xp = num(xp);
    var n = Math.max(1, Math.floor((1 + Math.sqrt(1 + 0.08 * xp)) / 2));
    while (xpParaNivel(n + 1) <= xp) n++;
    while (n > 1 && xpParaNivel(n) > xp) n--;
    var ini = xpParaNivel(n), prox = xpParaNivel(n + 1);
    return { nivel: n, inicio: ini, proximo: prox, fracao: (xp - ini) / (prox - ini) };
  }
  function cargoDe(nivel) {
    var c = CARGOS[0];
    CARGOS.forEach(function (x) { if (nivel >= x.de) c = x; });
    return c;
  }

  function calcular(linhas) {
    var atributos = {};
    ATRIBUTOS.forEach(function (a) { atributos[a.id] = 0; });
    var materiais = [];
    (Array.isArray(linhas) ? linhas : []).forEach(function (r) {
      if (!r || !num(r.total)) return;
      var id = String(r.material || ""), xp = xpMaterial(r), total = num(r.total), feitas = Math.min(num(r.feitas), total);
      var at = MATERIAIS[id] || "geral";
      atributos[at] += xp;
      materiais.push({ id: id, nome: NOMES_MATERIAIS[id] || id, atributo: at, feitas: feitas, total: total, fracao: feitas / total, xp: xp });
    });
    materiais.sort(function (a, b) { return b.xp - a.xp; });
    var xp = materiais.reduce(function (s, m) { return s + m.xp; }, 0);
    var nv = nivelDe(xp), cargo = cargoDe(nv.nivel);
    var e = { xp: xp, nivel: nv.nivel, inicio: nv.inicio, proximo: nv.proximo, fracao: nv.fracao,
      cargo: cargo.nome, forma: cargo.forma, atributos: atributos, materiais: materiais,
      iniciados: materiais.filter(function (m) { return m.feitas > 0; }).length };
    e.conquistas = CONQUISTAS.filter(function (c) { return c.t(e); }).map(function (c) { return c.id; });
    return e;
  }

  function desbloqueados(e) {
    return {
      cores: CORES.filter(function (c) { return e.nivel >= c.nivel; }).map(function (c) { return c.id; }),
      acessorios: ACESSORIOS.filter(function (a) { return e.conquistas.indexOf(a.conquista) >= 0; }).map(function (a) { return a.id; })
    };
  }

  function limparNome(s) {
    s = String(s == null ? "" : s).replace(/<[^>]*>/g, "").replace(/[<>"'`&\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 16).trim();
    return s || ESCOLHAS_PADRAO.nome;
  }
  function validarEscolhas(x, e) {
    var v = {}, d = desbloqueados(e || calcular([]));
    x = x && typeof x === "object" ? x : {};
    v.cor = d.cores.indexOf(x.cor) >= 0 ? x.cor : ESCOLHAS_PADRAO.cor;
    ["cabeca", "peito", "extra"].forEach(function (lugar) {
      var a = ACESSORIOS.filter(function (y) { return y.id === x[lugar] && y.lugar === lugar; })[0];
      v[lugar] = a && d.acessorios.indexOf(a.id) >= 0 ? a.id : "";
    });
    v.modelo = MODELOS_IDS.indexOf(x.modelo) >= 0 ? x.modelo : ESCOLHAS_PADRAO.modelo;
    v.expressao = EXPRESSOES.some(function (y) { return y.id === x.expressao; }) ? x.expressao : ESCOLHAS_PADRAO.expressao;
    v.nome = x.nome == null ? ESCOLHAS_PADRAO.nome : limparNome(x.nome);
    return v;
  }

  function novidades(antes, depois) {
    var vazio = { subiu: false, conquistas: [], cargoNovo: false };
    if (!antes || !depois) return vazio;
    return {
      subiu: depois.nivel > antes.nivel,
      conquistas: depois.conquistas.filter(function (c) { return (antes.conquistas || []).indexOf(c) < 0; }),
      cargoNovo: depois.forma > antes.forma
    };
  }

  /* ================= DESENHO DO BIT (SVG) ================= */

  var seq = 0;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function achar(lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; }
  function rr(x, y, w, h, r, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function circ(cx, cy, r, fill, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function path(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || "") + "/>"; }

  function geometria(forma) {
    var g;
    if (forma === 1) g = { head: [55, 54, 90, 68, 30], body: [72, 124, 56, 42, 16], base: "roda" };
    else if (forma === 2) g = { head: [54, 48, 92, 70, 28], body: [67, 120, 66, 50, 16], base: "roda" };
    else if (forma === 3) g = { head: [52, 40, 96, 72, 24], body: [60, 114, 80, 62, 18], base: "esteira" };
    else g = { head: [52, 32, 96, 72, 24], body: [58, 106, 84, 62, 18], base: "pernas" };
    var h = g.head;
    g.screen = [h[0] + 11, h[1] + 13, h[2] - 22, h[3] - 28, Math.max(10, h[4] - 12)];
    g.eyeY = g.screen[1] + g.screen[3] / 2;
    g.braços = forma >= 2;
    return g;
  }

  function olhos(exp, g) {
    var y = g.eyeY, l = Math.round(100 - g.screen[2] * 0.2), r = Math.round(100 + g.screen[2] * 0.2), c = "#A6F7CF", o = "";
    var st = ' stroke="' + c + '" stroke-width="5" stroke-linecap="round"';
    if (exp === "focado") {
      o = path("M" + (l - 8) + " " + (y - 1) + "h16M" + (r - 8) + " " + (y - 1) + "h16", "none", st) +
        path("M" + (l - 9) + " " + (y - 9) + "l16 4M" + (r + 9) + " " + (y - 9) + "l-16 4", "none", ' stroke="' + c + '" stroke-width="3" stroke-linecap="round"');
    } else if (exp === "surpreso") {
      o = circ(l, y - 2, 7, c) + circ(r, y - 2, 7, c) + circ(100, y + 11, 3.5, "none", ' stroke="' + c + '" stroke-width="2.5"');
    } else if (exp === "piscando") {
      o = circ(l, y - 1, 6, c) + path("M" + (r - 8) + " " + (y + 1) + "q8 -9 16 0", "none", st) +
        path("M" + (100 - 9) + " " + (y + 8) + "q9 7 18 0", "none", ' stroke="' + c + '" stroke-width="3" stroke-linecap="round"');
    } else {
      o = path("M" + (l - 8) + " " + (y + 2) + "q8 -10 16 0M" + (r - 8) + " " + (y + 2) + "q8 -10 16 0", "none", st) +
        path("M" + (100 - 9) + " " + (y + 9) + "q9 7 18 0", "none", ' stroke="' + c + '" stroke-width="3" stroke-linecap="round"');
    }
    return '<g class="bit-olhos">' + o + "</g>";
  }

  function desenhar(op, meta) {
    op = op || {};
    meta = meta || {};
    var forma = Math.min(6, Math.max(1, Math.floor(Number(op.forma) || 1)));
    var mod = achar(MODELOS, op.modelo);
    if (mod && mod.desenho) return desenharModelo(mod, op, meta, forma);
    var cor = achar(CORES, op.cor) || CORES[0], id = "bit" + (++seq);
    var corpo = cor.c[0] === "holo" ? "url(#" + id + "h)" : cor.c[0], sombra = cor.c[1], claro = cor.c[2];
    var g = geometria(forma), H = g.head, B = g.body, S = g.screen;
    var linha = ' stroke="' + sombra + '" stroke-width="3"';
    var tem = function (x) { return op.cabeca === x || op.peito === x || op.extra === x; };
    var defs = "<defs>" +
      (cor.c[0] === "holo" ? '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FE7F2"/><stop offset=".5" stop-color="#C79BF2"/><stop offset="1" stop-color="#F7D774"/></linearGradient>' : "") +
      '<radialGradient id="' + id + 'a"><stop offset="0" stop-color="#FFE58A" stop-opacity=".75"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>' +
      "</defs>";
    var fundo = "", tras = "", frente = "", base = "";

    // fundo: aura (Lenda) e anel (Arquiteto+)
    if (forma >= 6) fundo += circ(100, 112, 96, "url(#" + id + "a)");
    if (forma >= 5) fundo += '<ellipse cx="100" cy="140" rx="82" ry="22" fill="none" stroke="' + claro + '" stroke-width="3" stroke-dasharray="10 8" opacity=".8" class="bit-anel"/>';

    // costas: mochila a jato
    if (tem("jetpack")) {
      tras += rr(B[0] - 4, B[1] + 4, 18, 40, 8, "#8A96A3", ' stroke="#4C5763" stroke-width="3"') + rr(B[0] + B[2] - 14, B[1] + 4, 18, 40, 8, "#8A96A3", ' stroke="#4C5763" stroke-width="3"') +
        path("M" + (B[0] + 1) + " " + (B[1] + 46) + "l4 14 4 -14z", "#FF9F43") + path("M" + (B[0] + B[2] - 9) + " " + (B[1] + 46) + "l4 14 4 -14z", "#FF9F43");
    }

    // base: roda, esteira ou pernas
    var pe = B[1] + B[3];
    if (g.base === "roda") base = circ(100, pe + 15, 15, "#2B3138", ' stroke="#14181C" stroke-width="3"') + circ(100, pe + 15, 5, claro);
    else if (g.base === "esteira") base = rr(B[0] + 6, pe + 2, B[2] - 12, 20, 10, "#2B3138", ' stroke="#14181C" stroke-width="3"') +
      [0, 1, 2].map(function (i) { return circ(B[0] + 20 + i * (B[2] - 40) / 2, pe + 12, 4, claro); }).join("");
    else {
      base = rr(80, pe - 2, 15, 24, 6, sombra) + rr(105, pe - 2, 15, 24, 6, sombra) +
        rr(74, pe + 20, 25, 9, 4.5, "#2B3138") + rr(101, pe + 20, 25, 9, 4.5, "#2B3138");
      if (forma >= 5) base += '<g class="bit-jato">' + path("M80 " + (pe + 29) + "l6 14 6 -14z", "#FFB347") + path("M107 " + (pe + 29) + "l6 14 6 -14z", "#FFB347") + "</g>";
    }

    // braços
    var bracos = "";
    if (g.braços) {
      var bh = Math.round(B[3] * 0.72);
      bracos = rr(B[0] - 15, B[1] + 6, 14, bh, 7, corpo, linha) + rr(B[0] + B[2] + 1, B[1] + 6, 14, bh, 7, corpo, linha) +
        circ(B[0] - 8, B[1] + 8 + bh, 7, sombra) + circ(B[0] + B[2] + 8, B[1] + 8 + bh, 7, sombra);
    }
    var ombro = forma >= 4 ? '<ellipse cx="' + (B[0] + 4) + '" cy="' + (B[1] + 8) + '" rx="16" ry="11" fill="' + sombra + '"/><ellipse cx="' + (B[0] + B[2] - 4) + '" cy="' + (B[1] + 8) + '" rx="16" ry="11" fill="' + sombra + '"/>' : "";

    // corpo e painel
    var tronco = rr(B[0], B[1], B[2], B[3], B[4], corpo, linha) + rr(B[0] + 8, B[1] + 6, Math.round(B[2] * 0.35), 6, 3, "#fff", ' opacity=".28"');
    if (forma >= 3 && !op.peito) tronco += rr(100 - 18, B[1] + 18, 36, 22, 6, "#0E1B16") + [0, 1, 2].map(function (i) { return circ(88 + i * 12, B[1] + 29, 3.5, ["#7CF0B0", "#F7D774", "#7FB5F5"][i]); }).join("");
    if (forma >= 6 && !op.peito) tronco += path("M100 " + (B[1] + 44) + "l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z", "#FFE58A");

    // pescoço, cabeça, tela
    var cabeca = rr(92, H[1] + H[3] - 4, 16, B[1] - (H[1] + H[3]) + 8, 4, sombra) +
      rr(H[0], H[1], H[2], H[3], H[4], corpo, linha) +
      '<ellipse cx="' + Math.round(H[0] + H[2] * 0.28) + '" cy="' + (H[1] + 9) + '" rx="' + Math.round(H[2] * 0.16) + '" ry="4" fill="#fff" opacity=".35"/>' +
      rr(S[0], S[1], S[2], S[3], S[4], "#0E1B16") + olhos(op.expressao, g) +
      rr(H[0] - 6, H[1] + H[3] / 2 - 10, 8, 20, 4, sombra) + rr(H[0] + H[2] - 2, H[1] + H[3] / 2 - 10, 8, 20, 4, sombra);

    // antena (some com boné, coroa ou fone por cima; vira Wi-Fi com o acessório)
    var antena = "";
    if (op.cabeca === "antena-wifi") {
      antena = path("M100 " + H[1] + "v-14", "none", ' stroke="' + sombra + '" stroke-width="4"') + circ(100, H[1] - 16, 4, "#7CF0B0") +
        path("M90 " + (H[1] - 24) + "a14 14 0 0 1 20 0M84 " + (H[1] - 30) + "a22 22 0 0 1 32 0", "none", ' stroke="#7CF0B0" stroke-width="3.5" stroke-linecap="round"');
    } else if (["bone", "coroa"].indexOf(op.cabeca) < 0) {
      var alt = forma === 1 ? 8 : 16;
      antena = path("M100 " + H[1] + "v-" + alt, "none", ' stroke="' + sombra + '" stroke-width="4"') +
        circ(100, H[1] - alt - 3, forma === 1 ? 5 : 7, forma >= 2 ? "#FF6B6B" : claro, ' class="bit-luz"');
    }

    // acessórios
    var ac = "", hx = H[0], hy = H[1], hw = H[2];
    if (op.cabeca === "oculos") {
      var l = Math.round(100 - S[2] * 0.2), r = Math.round(100 + S[2] * 0.2);
      ac += circ(l, g.eyeY, 13, "#ffffff", ' fill-opacity=".14" stroke="#15181B" stroke-width="4"') + circ(r, g.eyeY, 13, "#ffffff", ' fill-opacity=".14" stroke="#15181B" stroke-width="4"') +
        path("M" + (l + 13) + " " + g.eyeY + "H" + (r - 13), "none", ' stroke="#15181B" stroke-width="4"');
    } else if (op.cabeca === "fone") {
      ac += path("M" + (hx + 2) + " " + (hy + 24) + "C" + (hx + 2) + " " + (hy - 22) + " " + (hx + hw - 2) + " " + (hy - 22) + " " + (hx + hw - 2) + " " + (hy + 24), "none", ' stroke="#22272C" stroke-width="7" stroke-linecap="round"') +
        rr(hx - 12, hy + 18, 16, 30, 8, "#22272C") + rr(hx + hw - 4, hy + 18, 16, 30, 8, "#22272C") +
        circ(hx - 4, hy + 33, 4, "#FF6B6B") + circ(hx + hw + 4, hy + 33, 4, "#FF6B6B");
    } else if (op.cabeca === "bone") {
      ac += path("M" + (hx + 8) + " " + (hy + 14) + "C" + (hx + 12) + " " + (hy - 18) + " " + (hx + hw - 12) + " " + (hy - 18) + " " + (hx + hw - 8) + " " + (hy + 14) + "Z", "#D63B3B", ' stroke="#8E2222" stroke-width="3"') +
        path("M" + (hx + hw - 14) + " " + (hy + 12) + "q30 -2 38 8q-20 4 -40 2z", "#B32D2D") + circ(100, hy - 9, 4, "#8E2222");
    } else if (op.cabeca === "coroa") {
      ac += path("M" + (100 - 30) + " " + (hy + 4) + "l-4 -26 16 12 18 -20 18 20 16 -12 -4 26z", "#F2C230", ' stroke="#A9820F" stroke-width="3" stroke-linejoin="round"') +
        circ(100, hy - 8, 4, "#E5484D") + circ(83, hy - 3, 3, "#4FA3F7") + circ(117, hy - 3, 3, "#4FA3F7");
    }
    if (op.peito === "medalha") {
      ac += path("M" + (100 - 10) + " " + (B[1] - 2) + "l10 20 10 -20", "none", ' stroke="#2F6DB5" stroke-width="7"') +
        circ(100, B[1] + 26, 11, "#F2C230", ' stroke="#A9820F" stroke-width="3"') + path("M100 " + (B[1] + 20) + "l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6z", "#A9820F");
    } else if (op.peito === "chip") {
      var cy = B[1] + 18;
      ac += rr(100 - 15, cy, 30, 26, 4, "#1E2A24", ' stroke="#7CF0B0" stroke-width="2"') + rr(100 - 7, cy + 7, 14, 12, 2, "#7CF0B0") +
        [0, 1, 2].map(function (i) { return path("M" + (100 - 20) + " " + (cy + 6 + i * 7) + "h5M" + (100 + 15) + " " + (cy + 6 + i * 7) + "h5", "none", ' stroke="#C9A227" stroke-width="2.5"'); }).join("");
    }
    if (op.extra === "escudo") {
      var sx = g.braços ? B[0] - 26 : B[0] - 18, sy = B[1] + 12;
      ac += path("M" + sx + " " + sy + "l18 -7 18 7v14c0 13 -8 21 -18 26 -10 -5 -18 -13 -18 -26z", "#3E7BC8", ' stroke="#1F4E86" stroke-width="3"') +
        path("M" + (sx + 18) + " " + (sy + 2) + "v32M" + (sx + 6) + " " + (sy + 14) + "h24", "none", ' stroke="#E9F2FF" stroke-width="3"');
    } else if (op.extra === "chave") {
      var kx = B[0] + B[2] + (g.braços ? 8 : 4), ky = B[1] + B[3] * 0.72 + 4;
      ac += '<g transform="rotate(-35 ' + kx + " " + ky + ')">' + rr(kx - 4, ky - 30, 8, 34, 4, "#AEB8C2", ' stroke="#5E6A75" stroke-width="2"') +
        path("M" + (kx - 10) + " " + (ky - 30) + "a10 10 0 1 1 20 0l-5 0 0 -6 -10 0 0 6z", "#AEB8C2", ' stroke="#5E6A75" stroke-width="2"') + "</g>";
    }

    // órbita (Lenda)
    var orbita = forma >= 6 ? '<g class="bit-orbita">' + circ(18, 112, 5, "#FFE58A") + circ(182, 112, 4, "#7FE7F2") + circ(100, 30, 3.5, "#C79BF2") + circ(100, 196, 3.5, "#7CF0B0") + "</g>" : "";

    var nome = esc(meta.titulo || ("Robô " + limparNome(op.nome)));
    var desc = esc(meta.desc || descrever(op, forma));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 224" role="img" aria-labelledby="' + id + "t " + id + 'd" class="bit bit-f' + forma + '">' +
      '<title id="' + id + 't">' + nome + '</title><desc id="' + id + 'd">' + desc + "</desc>" + defs + fundo + orbita +
      '<ellipse cx="100" cy="216" rx="' + (34 + forma * 4) + '" ry="6" fill="#000" opacity=".16"/>' +
      '<g class="bit-corpo">' + tras + base + bracos + tronco + ombro + cabeca + antena + ac + "</g>" + frente + "</svg>";
  }

  function descrever(op, forma) {
    var cargo = CARGOS.filter(function (c) { return c.forma === forma; })[0], mod = achar(MODELOS, op.modelo) || MODELOS[0];
    var cor = achar(CORES, op.cor) || CORES[0];
    var itens = ["cabeca", "peito", "extra"].map(function (l) { var a = achar(ACESSORIOS, op[l]); return a ? a.nome.toLowerCase() : ""; }).filter(Boolean);
    var ex = achar(EXPRESSOES, op.expressao) || EXPRESSOES[0];
    return mod.nome + ", etapa " + mod.etapas[forma - 1].toLowerCase() + " (" + cargo.nome + "), cor " + cor.nome + (mod.rosto ? ", expressão " + ex.nome.toLowerCase() : "") + (itens.length ? ", com " + itens.join(", ") : "") + ".";
  }

  /* ================= OUTROS MODELOS DE AVATAR ================= */
  // Cada modelo tem 6 etapas (uma por forma). O XP, os níveis e as conquistas são os mesmos para todos.
  // Modelos com rosto (Pixel, Tatu) vestem os acessórios; os demais mostram os acessórios como selos.

  function ell(cx, cy, rx, ry, fill, extra) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function tr(c, w) { return ' stroke="' + c + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"'; }
  function sombraChao(rx) { return ell(100, 214, rx, 6, "#000", ' opacity=".14"'); }
  function auraDe(id, cor, r) {
    return '<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="' + cor + '" stop-opacity=".55"/><stop offset="1" stop-color="' + cor + '" stop-opacity="0"/></radialGradient></defs>' + circ(100, 112, r || 94, "url(#" + id + ")");
  }

  // Acessórios desenhados em torno de (0,0); posicionados com translate/scale.
  function glifo(id) {
    var esc_ = ' stroke="#15181B" stroke-width="4"';
    switch (id) {
      case "oculos": return circ(-16, 0, 12, "#ffffff", ' fill-opacity=".16"' + esc_) + circ(16, 0, 12, "#ffffff", ' fill-opacity=".16"' + esc_) + path("M-4 0H4", "none", esc_);
      case "fone": return path("M-48 8C-48 -46 48 -46 48 8", "none", ' stroke="#22272C" stroke-width="7" stroke-linecap="round"') + rr(-58, 0, 16, 30, 8, "#22272C") + rr(42, 0, 16, 30, 8, "#22272C") + circ(-50, 15, 4, "#FF6B6B") + circ(50, 15, 4, "#FF6B6B");
      case "bone": return path("M-38 4C-34 -30 34 -30 38 4Z", "#D63B3B", ' stroke="#8E2222" stroke-width="3"') + path("M30 2q30 -2 38 8q-20 4 -40 2z", "#B32D2D") + circ(0, -21, 4, "#8E2222");
      case "coroa": return path("M-30 0l-4 -26 16 12 18 -20 18 20 16 -12 -4 26z", "#F2C230", ' stroke="#A9820F" stroke-width="3" stroke-linejoin="round"') + circ(0, -12, 4, "#E5484D") + circ(-17, -7, 3, "#4FA3F7") + circ(17, -7, 3, "#4FA3F7");
      case "antena-wifi": return path("M0 0v-14", "none", ' stroke="#55616C" stroke-width="4"') + circ(0, -16, 4, "#7CF0B0") + path("M-10 -24a14 14 0 0 1 20 0M-16 -30a22 22 0 0 1 32 0", "none", ' stroke="#2BB673" stroke-width="3.5" stroke-linecap="round"');
      case "medalha": return path("M-10 -26l10 20 10 -20", "none", ' stroke="#2F6DB5" stroke-width="7"') + circ(0, 0, 11, "#F2C230", ' stroke="#A9820F" stroke-width="3"') + path("M0 -6l2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6z", "#A9820F");
      case "chip": return rr(-15, -13, 30, 26, 4, "#1E2A24", ' stroke="#7CF0B0" stroke-width="2"') + rr(-7, -6, 14, 12, 2, "#7CF0B0") + path("M-20 -7h5M15 -7h5M-20 0h5M15 0h5M-20 7h5M15 7h5", "none", ' stroke="#C9A227" stroke-width="2.5"');
      case "escudo": return path("M-18 -20l18 -7 18 7v14c0 13 -8 21 -18 26 -10 -5 -18 -13 -18 -26z", "#3E7BC8", ' stroke="#1F4E86" stroke-width="3"') + path("M0 -18v32M-12 -6h24", "none", ' stroke="#E9F2FF" stroke-width="3"');
      case "chave": return '<g transform="rotate(-35)">' + rr(-4, -12, 8, 34, 4, "#AEB8C2", ' stroke="#5E6A75" stroke-width="2"') + path("M-10 -12a10 10 0 1 1 20 0l-5 0 0 -6 -10 0 0 6z", "#AEB8C2", ' stroke="#5E6A75" stroke-width="2"') + "</g>";
      case "jetpack": return rr(-49, -20, 18, 40, 8, "#8A96A3", ' stroke="#4C5763" stroke-width="3"') + rr(31, -20, 18, 40, 8, "#8A96A3", ' stroke="#4C5763" stroke-width="3"') + path("M-44 22l4 14 4 -14zM36 22l4 14 4 -14z", "#FF9F43");
    }
    return "";
  }
  function poe(id, x, y, s) { return '<g transform="translate(' + x + " " + y + ") scale(" + (s || 1) + ')">' + glifo(id) + "</g>"; }
  var ESCALA_SELO = { oculos: .5, fone: .3, bone: .38, coroa: .48, "antena-wifi": .5, medalha: .55, chip: .55, escudo: .52, chave: .5, jetpack: .3 };
  function selo(id, x, y) {
    return '<g transform="translate(' + x + " " + y + ')">' + circ(0, 0, 17, "#ffffff", ' stroke="#C9D3CF" stroke-width="2"') +
      '<g transform="scale(' + ESCALA_SELO[id] + ')' + (id === "medalha" ? " translate(0 6)" : id === "antena-wifi" ? " translate(0 14)" : id === "coroa" ? " translate(0 12)" : id === "bone" ? " translate(-8 10)" : id === "fone" ? " translate(0 12)" : "") + '">' + glifo(id) + "</g></g>";
  }

  // Olhos de bicho (Pixel e Tatu) conforme a expressão. xs: posições dos olhos; boca: [x, y] ou null.
  function olhosBicho(exp, xs, y, r, boca) {
    var k = "#16261C", o = "", tb = tr(k, Math.max(2.5, r * .45));
    xs.forEach(function (x, i) {
      if (exp === "focado") o += path("M" + (x - r) + " " + y + "h" + 2 * r, "none", tr(k, r * .9)) + path("M" + (x - r) + " " + (y - r * 1.3) + "l" + 2 * r + " " + (i === 0 && xs.length > 1 ? r * .6 : -r * .6), "none", tr(k, 2.5));
      else if (exp === "piscando" && (i === xs.length - 1)) o += path("M" + (x - r) + " " + (y + 1) + "q" + r + " " + (-r * 1.2) + " " + 2 * r + " 0", "none", tb);
      else { var rr_ = exp === "surpreso" ? r * 1.25 : r; o += circ(x, y, rr_, k) + circ(x + rr_ * .3, y - rr_ * .3, rr_ * .35, "#fff"); }
    });
    if (boca) {
      if (exp === "surpreso") o += circ(boca[0], boca[1] + 2, r * .5, "none", tr(k, 2.5));
      else if (exp === "focado") o += path("M" + (boca[0] - r) + " " + boca[1] + "h" + 2 * r, "none", tr(k, 3));
      else o += path("M" + (boca[0] - r * 1.2) + " " + boca[1] + "q" + r * 1.2 + " " + r + " " + r * 2.4 + " 0", "none", tr(k, 3));
    }
    return '<g class="bit-olhos">' + o + "</g>";
  }

  /* ---------- Pixel, a criatura digital ---------- */
  function pixel(f, K, op, id) {
    var ex = op.expressao, quad = function (pts) { return pts.map(function (p, i) { return rr(p[0], p[1], 10, 10, 1, [K.m, "#3FC5C9", "#F2A93B"][i % 3]); }).join(""); };
    if (f === 1) return { corpo: sombraChao(36) + ell(100, 142, 44, 58, K.l, tr(K.d)) + quad([[78, 112], [110, 100], [94, 142], [120, 152], [80, 170], [106, 178]]) + path("M62 130l12 8 10-10 12 10 10-8 12 8 10-6 12 6", "none", tr(K.d)),
      a: { olhos: [100, 130, .8], topo: [100, 86, .8], peito: [100, 166, .9], lado: [50, 160, .9], costas: [100, 142, .8] } };
    if (f === 2) return { corpo: sombraChao(38) + ell(100, 146, 44, 54, K.l, tr(K.d)) + quad([[80, 150], [108, 160], [92, 178]]) +
      ell(100, 126, 30, 10, "#16261C") + olhosBicho(ex, [90, 110], 126, 4, null) +
      '<g transform="rotate(-14 100 92)">' + path("M60 104c0-44 80-44 80 0l-13-7-13 9-14-9-13 9-14-9z", K.l, tr(K.d)) + rr(94, 78, 10, 10, 1, K.m) + "</g>",
      a: { olhos: [100, 126, .7], topo: [100, 72, .8], peito: [100, 170, .85], lado: [52, 160, .9], costas: [100, 146, .8] } };
    var corpo = "", fundo = "";
    if (f === 3) {
      corpo = sombraChao(42) + rr(70, 82, 12, 12, 2, K.m) + rr(118, 82, 12, 12, 2, K.m) + ell(100, 140, 50, 48, K.m, tr(K.d)) + ell(100, 158, 30, 22, K.l) +
        olhosBicho(ex, [84, 116], 130, 7, [100, 148]) + rr(76, 182, 14, 14, 3, K.d) + rr(110, 182, 14, 14, 3, K.d);
      return { corpo: corpo, a: { olhos: [100, 130, 1], topo: [100, 94, .95], peito: [100, 164, .95], lado: [48, 152, 1], costas: [100, 140, 1] } };
    }
    if (f === 5) corpo += path("M60 120C30 100 26 70 40 62M140 120c30-20 34-50 20-58", "none", tr("#3FC5C9", 6)) +
      rr(32, 54, 14, 12, 2, "#F2C230", tr("#9A7410", 2)) + rr(154, 54, 14, 12, 2, "#F2C230", tr("#9A7410", 2));
    if (f === 6) {
      fundo = auraDe(id + "p", "#3FC5C9", 96);
      corpo += path("M64 112L14 60l18 52-16 10 36 4M136 112l50-52-18 52 16 10-36 4", "#3FC5C9", tr("#1F7F84")) + path("M24 74l22 28M176 74l-22 28M30 104h18M170 104h-18", "none", tr("#E9FFFF", 2.5));
    }
    var cy = f === 6 ? 136 : 138, ry = f === 6 ? 60 : 54, olhoY = f === 6 ? 106 : 124;
    corpo = sombraChao(f === 6 ? 62 : 52) + corpo +
      path(f === 6 ? "M140 172q44 4 46-30l10-4-6 12" : "M142 170q32 6 38-14", "none", tr(K.d, f === 6 ? 9 : 8)) + (f < 6 ? circ(182, 154, 6, "#3FC5C9") : "") +
      ell(100, cy, f === 6 ? 52 : 50, ry, K.m, tr(K.d)) +
      (f === 6 ? [118, 134, 150, 166].map(function (y) { return rr(84, y, 32, 10, 4, "#F2C230", tr("#9A7410", 1.5)); }).join("") : ell(100, 158, 30, 26, K.l)) +
      path(f === 6 ? "M72 84l-14-30 26 18M128 84l14-30-26 18" : f === 5 ? "M74 92l-8-20 20 12M126 92l8-20-20 12" : "M78 94l-5-13 13 8M122 94l5-13-13 8", "#F2A93B", tr("#A86A14", 2)) +
      olhosBicho(ex, [82, 118], olhoY, f === 6 ? 8 : 7, [100, f === 6 ? 126 : 142]) +
      rr(f === 6 ? 70 : 74, f === 6 ? 188 : 186, f === 6 ? 22 : 18, 14, 5, K.d) + rr(108, f === 6 ? 188 : 186, f === 6 ? 22 : 18, 14, 5, K.d);
    return { fundo: fundo, corpo: corpo, a: f === 6 ? { olhos: [100, 106, 1.05], topo: [100, 72, 1], peito: [100, 148, 1], lado: [44, 150, 1.1], costas: [100, 130, 1.1] }
      : { olhos: [100, 124, 1], topo: [100, 86, 1], peito: [100, 166, .95], lado: [46, 150, 1], costas: [100, 138, 1] } };
  }

  /* ---------- Tatu-bola tech ---------- */
  function tatu(f, K, op, id) {
    var ex = op.expressao, couro = "#C99A6A", couroE = "#7A5532";
    var capacete = f >= 2 && f <= 4 && (!op.cabeca || op.cabeca === "oculos");
    var cabeca = function () {
      return path("M58 136c-14-4-30 0-22 12 10 8 26 8 34 0z", couro, tr(couroE)) + circ(30, 140, 3, couroE) + ell(56, 126, 6, 9, couro, tr(couroE, 2)) +
        olhosBicho(ex, [48], 138, 4, null) + (ex === "surpreso" ? "" : path("M36 147q5 3 10 0", "none", tr(couroE, 2)));
    };
    var cap = capacete ? path("M40 126c0-20 32-24 38-6z", "#F2C230", tr("#9A7410", 2.5)) + circ(42, 120, 6, "#FFF7C2", tr("#9A7410", 2)) + path("M36 118l-22-10v20z", "#FFF7C2", ' opacity=".6"') : "";
    var pernas = function (c) { return rr(60, 148, 12, 18, 5, c) + rr(128, 148, 12, 18, 5, c); };
    var rabo = path("M156 146q14 4 18 16", "none", tr(K.d, 5));
    var aBase = { olhos: [47, 138, .42], topo: [46, 121, .5], peito: [104, 128, .85], lado: [72, 162, .75], costas: [104, 108, .7] };
    var casco = function (fill, traco, faixas) {
      return path("M44 150C44 96 156 96 156 150Z", fill, tr(traco)) + (faixas ? [70, 88, 106, 124, 142].map(function (x) { return path("M" + x + " " + (x < 100 ? 112 : 108) + "q" + (x < 100 ? -4 : 4) + " 20 0 40", "none", tr(faixas, 3)); }).join("") : "");
    };
    if (f <= 2) return { corpo: sombraChao(54) + pernas("#9C7350") + casco(K.m, K.d, K.d) + rabo + cabeca() + cap, a: aBase };
    if (f === 3) return { corpo: sombraChao(54) + pernas("#9C7350") + casco(K.m, K.d, K.d) + path("M78 140v-14h14M112 140v-18h12", "none", tr("#F2C230", 2.5)) +
      rr(92, 118, 16, 12, 2, "#16261C", tr("#7CF0B0", 1.5)) + circ(124, 122, 3, "#7CF0B0") + rabo + cabeca() + cap, a: aBase };
    if (f === 4) return { corpo: sombraChao(56) + pernas("#3E5A4A") + casco(K.d, "#0F1F17") +
      path("M60 140h20v-18h16M104 140v-26h22M130 140v-12h14M76 116l10-8", "none", tr("#F2C230", 2.5)) + rr(84, 118, 22, 16, 2, "#16261C", tr("#7CF0B0", 1.5)) +
      rr(118, 126, 14, 10, 2, "#16261C") + [66, 96, 126].map(function (x) { return circ(x, 146, 3, "#7CF0B0"); }).join("") + rabo + cabeca() + cap, a: aBase };
    if (f === 5) return { corpo: sombraChao(52) + path("M168 112h20M172 132h22M168 152h18", "none", tr("#9AA6B1", 3)) +
      circ(112, 134, 50, K.m, tr(K.d)) + path("M78 106q34-16 68 0M66 132q46-10 92 0M72 160q40 12 80 0", "none", tr(K.d, 3)) +
      path("M96 120h16v-10M128 146v-12h10", "none", tr("#F2C230", 2.5)) +
      ell(64, 162, 18, 13, couro, tr(couroE)) + ell(72, 150, 5, 7, couro, tr(couroE, 2)) + circ(48, 166, 2.5, couroE) + olhosBicho(ex, [60], 158, 3.5, null),
      a: { olhos: [60, 158, .35], topo: [64, 148, .42], peito: [112, 134, .85], lado: [150, 178, .7], costas: [112, 88, .75] } };
    return { fundo: auraDe(id + "t", "#7CF0B0", 94) + ell(100, 120, 86, 22, "none", tr(K.l, 3) + ' stroke-dasharray="10 8" class="bit-anel"'),
      corpo: sombraChao(48) + circ(100, 128, 58, K.m, tr(K.d)) + path("M64 100q36-14 72 0M48 124q52-12 104 0M52 154q48 12 96 0", "none", tr(K.l, 4)) +
        rr(72, 120, 56, 22, 11, "#16261C") + olhosBicho(ex, [88, 112], 131, 5, null) + circ(70, 170, 4, "#F2C230") + circ(132, 100, 4, "#F2C230") +
        path("M84 184l6 16M116 184l-6 16", "none", tr("#FFE58A", 4)),
      a: { olhos: [100, 131, .75], topo: [100, 72, .95], peito: [100, 166, .85], lado: [38, 146, 1], costas: [100, 128, 1.25] } };
  }

  /* ---------- Sonda ---------- */
  function sonda(f, K, op, id) {
    var rotor = function (x, y) { return ell(x, y, 20, 4, "#9AA6B1", ' opacity=".75"') + rr(x - 2, y, 4, 8, 1, "#55616C"); };
    var painel = function (x, y, w, h) { return rr(x, y, w, h, 2, "#2F6DB5", tr("#1B4478", 2)) + path("M" + (x + w / 3) + " " + y + "v" + h + "M" + (x + 2 * w / 3) + " " + y + "v" + h + "M" + x + " " + (y + h / 2) + "h" + w, "none", tr("#9CC3F0", 1.2)); };
    var lente = function (x, y, r) { return circ(x, y, r, "#16261C") + circ(x, y, r / 2, "#7FE7F2"); };
    if (f === 1) return { corpo: sombraChao(40) + rr(62, 112, 76, 8, 4, "#55616C") + rotor(58, 106) + rotor(142, 106) + rr(76, 118, 48, 34, 12, K.m, tr(K.d)) + lente(100, 135, 10) + path("M84 152l-8 14M116 152l8 14", "none", tr("#55616C", 4)) };
    if (f === 2) return { corpo: sombraChao(48) + rr(36, 108, 128, 8, 4, "#55616C") + rotor(40, 102) + rotor(78, 98) + rotor(122, 98) + rotor(160, 102) +
      path("M100 116v-20", "none", tr("#55616C", 3)) + circ(100, 94, 4, "#E5484D") + rr(70, 114, 60, 40, 12, K.m, tr(K.d)) + lente(100, 134, 12) + circ(78, 124, 3, "#7CF0B0") +
      path("M78 154l-10 16h14M122 154l10 16h-14", "none", tr("#55616C", 4)) };
    if (f === 3) return { corpo: sombraChao(44) + path("M100 88v-16", "none", tr("#55616C", 3)) + circ(100, 70, 4, "#E5484D") + path("M66 100a34 34 0 0 1 68 0z", "#E9EEF2", tr("#55616C")) +
      circ(100, 96, 4, "#55616C") + rr(80, 104, 40, 46, 6, K.m, tr(K.d)) + painel(26, 114, 48, 24) + painel(126, 114, 48, 24) + rr(74, 124, 6, 4, 1, "#55616C") + rr(120, 124, 6, 4, 1, "#55616C") };
    var s4 = path("M100 70v-22", "none", tr("#55616C", 3)) + circ(100, 46, 5, "#E5484D") + path("M88 40a14 14 0 0 1 24 0", "none", tr("#7FE7F2", 3)) +
      path("M62 96a38 38 0 0 1 76 0z", "#E9EEF2", tr("#55616C")) + rr(76, 98, 48, 62, 8, K.m, tr(K.d)) + rr(88, 110, 24, 16, 3, "#16261C") + circ(100, 118, 5, "#7FE7F2") +
      painel(10, 106, 62, 30) + painel(128, 106, 62, 30) + '<g class="bit-jato">' + path("M86 160l-6 18h12zM114 160l6 18h-12z", "#FFB347") + "</g>";
    if (f === 4) return { corpo: sombraChao(52) + s4 };
    if (f === 5) return { fundo: ell(100, 132, 92, 24, "none", tr("#9AA6B1", 5) + ' class="bit-anel"'),
      corpo: sombraChao(56) + s4 + rr(86, 160, 28, 12, 4, "#E9EEF2", tr("#55616C", 2)) + path("M130 150a14 14 0 0 1 22 -12z", "#E9EEF2", tr("#55616C", 2)) + circ(141, 144, 2.5, "#55616C") };
    return { fundo: auraDe(id + "s", "#7FE7F2", 96) + ell(100, 118, 84, 26, "none", tr("#9AA6B1", 6)),
      corpo: sombraChao(60) + painel(4, 62, 52, 26) + painel(144, 62, 52, 26) + painel(4, 150, 52, 26) + painel(144, 150, 52, 26) +
        path("M56 75h20M124 75h20M56 163h20M124 163h20", "none", tr("#55616C", 4)) + rr(76, 72, 48, 32, 10, "#E9EEF2", tr("#55616C")) + rr(76, 138, 48, 32, 10, "#E9EEF2", tr("#55616C")) +
        circ(100, 120, 26, K.m, tr(K.d)) + lente(100, 120, 12) + [86, 100, 114].map(function (x) { return circ(x, 88, 3, "#7CF0B0"); }).join("") +
        path("M100 72v-20", "none", tr("#55616C", 3)) + circ(100, 50, 5, "#E5484D") };
  }

  /* ---------- Árvore-circuito ---------- */
  function arvore(f, K, op, id) {
    var solo = function (w) { return ell(100, 198, w, 14, "#8A6440") + ell(100, 194, w - 8, 9, "#A47B52"); };
    var folha = function (d) { return path(d, K.m, tr(K.d, 2.5)); };
    var led = function (x, y, c) { return circ(x, y, 12, c, ' opacity=".25"') + circ(x, y, 7, c, tr("#fff", 2)); };
    if (f === 1) return { corpo: sombraChao(50) + solo(48) + rr(84, 160, 32, 30, 4, "#16261C", tr("#7CF0B0", 2)) +
      [166, 176, 184].map(function (y) { return path("M78 " + y + "h6M116 " + y + "h6", "none", tr("#C9A227", 3)); }).join("") + circ(100, 174, 5, K.l) };
    if (f === 2) return { corpo: sombraChao(50) + solo(52) + path("M100 190V128", "none", tr(K.d, 6)) +
      folha("M100 150c-30-2-38-22-36-34 18 0 34 10 36 34zM100 136c24-4 34-20 32-32-16 0-30 10-32 32z") + circ(100, 128, 5, "#F2C230") + path("M100 190h-18v-6M100 190h18v-8", "none", tr("#C9A227", 3)) };
    if (f === 3) return { corpo: sombraChao(52) + solo(54) + path("M100 192V100M100 160H80v-12M100 140h20v-12", "none", tr(K.d, 6)) +
      folha("M80 148c-26 0-34-18-32-28 16 0 30 8 32 28zM120 128c26 0 34-18 32-28-16 0-30 8-32 28zM100 100c-14-14-6-32 0-36 6 4 14 22 0 36z") +
      circ(80, 148, 5, "#F2C230") + circ(120, 128, 5, "#F2C230") + path("M100 192h-20v-6M100 192h22v-8", "none", tr("#C9A227", 3)) };
    if (f === 4) return { corpo: sombraChao(56) + solo(58) + path("M100 192V100M100 150H70V122M100 130h30V98M70 122H52M130 98h18M100 100V78", "none", tr(K.d, 7)) +
      [[52, 122], [148, 98], [100, 78], [70, 122], [130, 98]].map(function (p) { return circ(p[0], p[1], 6, "#F2C230", tr("#9A7410", 2)); }).join("") +
      folha("M52 122c-20-8-18-28 0-30 10 10 8 22 0 30zM148 98c20-8 18-28 0-30-10 10-8 22 0 30zM100 78c-12-16 0-32 0-32s12 16 0 32z") };
    var copa = ell(100, 96, 84, 64, K.m, tr(K.d)) + ell(70, 80, 40, 34, K.l, ' opacity=".55"') + ell(132, 84, 42, 34, K.l, ' opacity=".45"') + ell(100, 62, 40, 28, K.l, ' opacity=".6"') +
      path("M100 194V112M100 150H76V128M100 136h26V116M76 128l-18-14M126 116l20-12M100 112l-14-24M100 112l14-26", "none", tr("#3B2A1A", 5)) +
      path("M100 194V112M100 150H76V128M100 136h26V116", "none", tr("#C9A227", 2));
    if (f === 5) return { corpo: sombraChao(60) + solo(62) + copa + [[58, 112], [146, 104], [86, 86], [116, 84]].map(function (p) { return circ(p[0], p[1], 5, "#F2C230", tr("#9A7410", 2)); }).join("") };
    return { fundo: auraDe(id + "r", "#F2C230", 98), corpo: sombraChao(64) + solo(64) + copa + led(58, 112, "#E5484D") + led(146, 104, "#4FA3F7") + led(86, 86, "#F2C230") +
      led(116, 84, "#C79BF2") + led(70, 140, "#7FE7F2") + led(132, 140, "#FF9F43") + led(100, 56, "#7CF0B0") };
  }

  /* ---------- Minha Smart City ---------- */
  function cidade(f, K, op, id) {
    var chao = function (w) { return rr(100 - w, 186, w * 2, 14, 6, "#55616C") + path("M" + (100 - w + 10) + " 193h" + (w * 2 - 20), "none", tr("#F2C230", 2) + ' stroke-dasharray="8 8"'); };
    var casa = function (x, c) { return rr(x, 156, 28, 30, 2, c, tr("#2A3138", 2)) + path("M" + (x - 3) + " 158l17-16 17 16z", "#C0392B", tr("#7A2318", 2)) + rr(x + 10, 170, 8, 16, 1, "#2A3138"); };
    var predio = function (x, y, w, c) {
      var j = "", n = Math.floor((186 - y - 10) / 14);
      for (var i = 0; i < n; i++) j += rr(x + 5, y + 6 + i * 14, w - 10, 6, 1, "#FFE58A", ' opacity=".85"');
      return rr(x, y, w, 186 - y, 3, c, tr("#2A3138", 2)) + j;
    };
    var torre = function (x, h) {
      return path("M" + (x - 12) + " 186L" + x + " " + (186 - h) + "L" + (x + 12) + " 186", "none", tr("#55616C", 3)) + path("M" + (x - 8) + " " + Math.round(186 - h * .4) + "h16M" + (x - 5) + " " + Math.round(186 - h * .7) + "h10", "none", tr("#55616C", 2)) +
        circ(x, 186 - h, 4, "#E5484D") + path("M" + (x - 10) + " " + (180 - h) + "a14 14 0 0 1 20 0M" + (x - 16) + " " + (174 - h) + "a22 22 0 0 1 32 0", "none", tr("#2BB673", 2.5));
    };
    var dc = function (x) { return rr(x, 150, 40, 36, 3, "#2A3138", tr("#16261C", 2)) + [0, 1, 2].map(function (i) { return rr(x + 6, 156 + i * 10, 28, 6, 1, "#3E4A55") + circ(x + 30, 159 + i * 10, 1.8, "#7CF0B0"); }).join(""); };
    var escola = function (x) { return rr(x, 146, 46, 40, 3, K.m, tr(K.d, 2)) + path("M" + (x - 4) + " 148l27-18 27 18z", "#C0392B", tr("#7A2318", 2)) + rr(x + 16, 164, 14, 22, 1, "#2A3138") + path("M" + (x + 23) + " 130v-10l10 4-10 4", "#2E8B57"); };
    var arv = function (x) { return rr(x - 2, 168, 4, 18, 1, "#7A5532") + circ(x, 164, 10, "#3DBA6F", tr("#1B5236", 2)); };
    var turbina = function (x) { return path("M" + x + " 186V120", "none", tr("#E9EEF2", 4)) + path("M" + x + " 120l-4-30 8 0zM" + x + " 120l24 16-4 6zM" + x + " 120l-24 16 4 6z", "#E9EEF2", tr("#9AA6B1", 1.5)); };
    var esc_ = function (x, y) { return poe("escudo", x, y, .8); };
    var drone = function (x, y) { return rr(x - 6, y, 12, 6, 3, "#2A3138") + ell(x - 8, y, 6, 1.5, "#9AA6B1") + ell(x + 8, y, 6, 1.5, "#9AA6B1"); };
    if (f === 1) return { corpo: sombraChao(80) + chao(80) + casa(40, "#F7BC8C") + casa(80, "#9CC3F0") + escola(118) };
    if (f === 2) return { corpo: sombraChao(84) + chao(84) + casa(22, "#F7BC8C") + casa(56, "#9CC3F0") + escola(92) + arv(150) + arv(170) };
    if (f === 3) return { corpo: sombraChao(86) + chao(86) + casa(22, "#F7BC8C") + casa(56, "#9CC3F0") + torre(102, 70) + dc(128) + rr(172, 160, 16, 26, 2, K.m) };
    if (f === 4) return { corpo: sombraChao(90) + chao(92) + predio(14, 110, 30, "#9CC3F0") + predio(48, 86, 34, K.m) + torre(98, 96) + dc(112) + esc_(136, 128) + predio(156, 100, 30, K.d) + turbina(192) };
    if (f === 5) return { corpo: sombraChao(94) + chao(96) + predio(6, 100, 26, "#9CC3F0") + predio(34, 72, 30, K.m) + predio(66, 92, 24, "#E07A2E") + torre(104, 120) + dc(118) + esc_(140, 120) +
      predio(160, 84, 34, K.d) + arv(28) };
    return { fundo: auraDe(id + "c", "#7FE7F2", 98), corpo: sombraChao(96) + chao(96) + predio(6, 96, 26, "#9CC3F0") + predio(34, 60, 30, K.m) + predio(66, 40, 26, "#2F6DB5") +
      predio(110, 52, 28, K.d) + predio(140, 80, 28, "#E07A2E") + predio(170, 104, 24, "#D9468C") + torre(98, 150) + poe("escudo", 158, 54, 1) +
      drone(30, 36) + drone(170, 24) + path("M20 186q80-30 160 0", "none", tr("#7CF0B0", 2) + ' stroke-dasharray="4 6"') };
  }

  /* ---------- Avatares femininos: Girassol, Gotinha, Borboleta e Gata ---------- */
  // Olhos com cílios e bochechas rosadas.
  function olhosF(exp, xs, y, r, boca) {
    var cil = "";
    xs.forEach(function (x, i) {
      var fechado = exp === "piscando" && i === xs.length - 1, lado = xs.length > 1 ? (i === 0 ? -1 : 1) : -1;
      var topo = y - (exp === "surpreso" ? r * 1.25 : r) - (fechado ? -r * .2 : 0);
      if (exp !== "focado") cil += path("M" + (x + lado * r * .55) + " " + (topo + r * .25) + "l" + lado * r * .55 + " " + (-r * .55) + "M" + (x + lado * r * .1) + " " + topo + "l" + lado * r * .2 + " " + (-r * .7), "none", tr("#16261C", Math.max(1.5, r * .28)));
      cil += ell(x + lado * r * 1.1, y + r * 1.4, r * .75, r * .45, "#F48FB1", ' opacity=".75"');
    });
    return cil + olhosBicho(exp, xs, y, r, boca);
  }
  function laco(x, y, s, c, d) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' + path("M0 0l-15-10v20zM0 0l15-10v20z", c, tr(d, 2)) + circ(0, 0, 4.5, d) + "</g>";
  }
  function brilhos(pts, c) {
    return pts.map(function (p) { return path("M" + p[0] + " " + (p[1] - 6) + "l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6z", c || "#FFE58A"); }).join("");
  }

  /* Girassol (Sol). A cor escolhida pinta o vaso e o laço; as pétalas são sempre amarelas. */
  function girassol(f, K, op, id) {
    var ex = op.expressao, verde = "#3DBA6F", verdeE = "#1B5236";
    var vaso = path("M70 178h60l-8 30h-44z", K.m, tr(K.d)) + rr(66, 172, 68, 10, 4, K.d) + ell(100, 176, 28, 4, "#5A3B22");
    var folhas = function (y, s) { return path("M100 " + y + "c-" + 26 * s + " -2 -" + 36 * s + " -20 -" + 34 * s + " -32 " + 18 * s + " 0 " + 32 * s + " 12 " + 34 * s + " 32zM100 " + (y - 10) + "c" + 24 * s + " -4 " + 34 * s + " -20 " + 32 * s + " -32 -" + 16 * s + " 0 -" + 30 * s + " 10 -" + 32 * s + " 32z", verde, tr(verdeE, 2.5)); };
    var caule = function (y) { return path("M100 174V" + y, "none", tr(verdeE, 6)); };
    var fita = f >= 2 ? laco(100, f === 2 ? 150 : 146, .8, "#E5568B", "#9B2C5C") : "";
    var flor = function (cx, cy, rd, n, rx, ry, dist, solar) {
      var p = "";
      for (var i = 0; i < n; i++) {
        var a = Math.round(i * 360 / n);
        p += ell(cx, cy - dist, rx, ry, K.m, tr(K.d, 2) + ' transform="rotate(' + a + " " + cx + " " + cy + ')"');
        if (solar && i % 2 === 0) p += rr(cx - rx * .45, cy - dist - ry * .5, rx * .9, ry, 2, "#2F6DB5", ' transform="rotate(' + a + " " + cx + " " + cy + ')" opacity=".85"');
      }
      return p + circ(cx, cy, rd, "#8B5A2B", tr("#5A3B22", 3)) + circ(cx, cy, rd * .78, "#C98A4B");
    };
    if (f === 1) return { corpo: sombraChao(36) + vaso + path("M100 146v-12", "none", tr(verdeE, 4)) + path("M100 136c-8-8-16-6-16-2 4 4 12 4 16 2z", verde) +
      ell(100, 160, 17, 20, "#8B5A2B", tr("#5A3B22", 3)) + ell(100, 160, 12, 15, "#C98A4B") + olhosF(ex, [94, 106], 157, 3, [100, 166]),
      a: { olhos: [100, 157, .4], topo: [100, 140, .45], peito: [100, 194, .7], lado: [56, 188, .7], costas: [100, 160, .5] } };
    if (f === 2) return { corpo: sombraChao(40) + vaso + caule(124) + folhas(150, .8) + fita + circ(100, 116, 18, verde, tr(verdeE, 3)) + olhosF(ex, [93, 107], 114, 3.5, [100, 123]),
      a: { olhos: [100, 114, .5], topo: [100, 98, .55], peito: [100, 194, .7], lado: [56, 186, .7], costas: [100, 130, .6] } };
    if (f === 3) return { corpo: sombraChao(42) + vaso + caule(110) + folhas(150, 1) + fita +
      path("M82 92l6-16 6 10 6-14 6 14 6-10 6 16z", K.m, tr(K.d, 2)) + ell(100, 102, 24, 22, verde, tr(verdeE, 3)) + olhosF(ex, [91, 109], 100, 4.5, [100, 111]),
      a: { olhos: [100, 100, .65], topo: [100, 78, .65], peito: [100, 194, .7], lado: [54, 180, .75], costas: [100, 106, .7] } };
    if (f === 4) return { corpo: sombraChao(46) + vaso + caule(110) + folhas(156, 1.05) + fita + flor(100, 94, 24, 12, 8, 15, 36) + olhosF(ex, [91, 109], 92, 4.5, [100, 103]),
      a: { olhos: [100, 92, .7], topo: [100, 70, .75], peito: [100, 194, .7], lado: [150, 152, .8], costas: [100, 100, .8] } };
    var solar = f === 6;
    return { fundo: solar ? auraDe(id + "g", "#FFD54F", 98) : "", corpo: sombraChao(52) + vaso + caule(116) + folhas(160, 1.15) + fita +
      flor(100, 90, 28, 16, 9, 21, 44, solar) + olhosF(ex, [89, 111], 88, 5.5, [100, 101]) + (solar ? brilhos([[28, 44], [172, 40], [24, 132], [178, 128]]) : ""),
      a: { olhos: [100, 88, .85], topo: [100, 62, .85], peito: [100, 194, .7], lado: [156, 150, .85], costas: [100, 96, .9] } };
  }

  /* Gotinha. A gota vira nuvem de dados (computação em nuvem). A cor escolhida pinta o laço. */
  function gota(f, K, op, id) {
    var ex = op.expressao, ag = K.m, agE = K.d, agC = K.l;
    var gotaP = function (cx, cy, r) {
      var ty = Math.round(cy - r * 2.1);
      return path("M" + cx + " " + ty + "C" + (cx + r * .35) + " " + (ty + r * .6) + " " + (cx + r) + " " + (cy - r * .7) + " " + (cx + r) + " " + cy + "A" + r + " " + r + " 0 0 1 " + (cx - r) + " " + cy +
        "C" + (cx - r) + " " + (cy - r * .7) + " " + (cx - r * .35) + " " + (ty + r * .6) + " " + cx + " " + ty + "Z", ag, tr(agE)) +
        ell(cx - r * .45, cy - r * .55, r * .18, r * .35, "#fff", ' opacity=".6"');
    };
    var poca = function (w) { return ell(100, 208, w, 7, agC, tr("#9ED6F5", 2)); };
    var bolhas = function (pts) { return pts.map(function (p) { return circ(p[0], p[1], p[2], agC, tr(agE, 2)) + circ(p[0] - p[2] * .3, p[1] - p[2] * .3, p[2] * .25, "#fff"); }).join(""); };
    var temCabeca = op.cabeca && op.cabeca !== "oculos";
    if (f === 1) return { corpo: poca(30) + gotaP(100, 182, 24) + olhosF(ex, [92, 108], 180, 3.5, [100, 190]),
      a: { olhos: [100, 180, .5], topo: [100, 150, .45], peito: [100, 200, .4], lado: [68, 192, .5], costas: [100, 182, .5] } };
    if (f <= 4) {
      var r = [0, 0, 34, 40, 44][f], cy = [0, 0, 168, 158, 154][f], ty = cy - r * 2.1;
      var corpo = poca(r + 12) + (f === 4 ? path("M40 196q15-10 30 0t30 0 30 0 30 0", "none", tr("#9ED6F5", 3)) : "") + gotaP(100, cy, r) +
        (f >= 3 ? ell(100 - r - 4, cy + 6, 7, 9, ag, tr(agE, 2)) + ell(100 + r + 4, cy + 6, 7, 9, ag, tr(agE, 2)) : "") +
        (f >= 3 ? bolhas(f === 3 ? [[46, 104, 7], [156, 92, 9], [164, 128, 5]] : [[40, 96, 8], [160, 80, 10], [168, 122, 6], [34, 140, 5]]) : "") +
        (temCabeca ? "" : laco(100 + r * .45, ty + r * .9, .9, "#E5568B", "#9B2C5C")) + olhosF(ex, [100 - r * .3, 100 + r * .3], cy - 2, 3 + r * .06, [100, cy + r * .3]);
      return { corpo: corpo, a: { olhos: [100, cy - 2, .55 + r * .008], topo: [100, Math.round(ty + r * .9), .5 + r * .006], peito: [100, cy + r * .62, .55 + r * .004], lado: [100 - r - 12, cy + 12, .6 + r * .005], costas: [100, cy, .6 + r * .007] } };
    }
    var nuvem = circ(66, 122, 30, K.l, tr(K.d)) + circ(100, 98, 38, K.l, tr(K.d)) + circ(136, 118, 32, K.l, tr(K.d)) +
      rr(44, 116, 114, 40, 20, K.l) + path("M46 140c0 10 6 16 20 16h72c14 0 20-8 20-18", "none", tr(K.d)) +
      ell(84, 86, 10, 5, "#fff") + (temCabeca ? "" : laco(132, 82, .95, "#E5568B", "#9B2C5C")) + olhosF(ex, [86, 114], 120, 6, [100, 136]);
    var chuva = [70, 100, 130].map(function (x, i) { return path("M" + x + " " + (166 + i % 2 * 8) + "c3 5 5 8 5 11a5 5 0 0 1-10 0c0-3 2-6 5-11z", ag, tr(agE, 1.5)); }).join("");
    if (f === 5) return { corpo: sombraChao(50) + chuva + nuvem + bolhas([[30, 80, 6], [172, 70, 8]]),
      a: { olhos: [100, 120, .85], topo: [100, 66, .85], peito: [100, 148, .65], lado: [40, 128, .8], costas: [100, 118, 1] } };
    var arco = ["#E5484D", "#FF9F43", "#F7D774", "#4FCB7F", "#4FA3F7", "#9B7BF0"].map(function (c, i) { return path("M" + (20 + i * 7) + " 150a" + (80 - i * 7) + " " + (80 - i * 7) + " 0 0 1 " + (160 - i * 14) + " 0", "none", tr(c, 7)); }).join("");
    return { fundo: auraDe(id + "w", "#9ED6F5", 98) + arco, corpo: sombraChao(54) + chuva + nuvem + path("M150 150l-8 14h8l-6 14 16-20h-8l6-8z", "#F7D774", tr("#C9930E", 1.5)) + brilhos([[24, 40], [178, 36], [30, 180]]),
      a: { olhos: [100, 120, .85], topo: [100, 66, .85], peito: [100, 148, .65], lado: [40, 128, .8], costas: [100, 118, 1] } };
  }

  /* Borboleta (Luna). A cor escolhida pinta as asas. */
  function borboleta(f, K, op, id) {
    var ex = op.expressao, verde = "#8BD47A", verdeE = "#3E8E3A", pele = "#FBE7F0", peleE = "#B98AA6";
    var folha = path("M30 182c30-40 110-46 150-20-40 22-110 34-150 20z", "#5DBB63", tr("#2E7D32", 2.5)) + path("M40 180c40-8 90-14 130-18", "none", tr("#2E7D32", 2));
    var temCabeca = op.cabeca && op.cabeca !== "oculos";
    if (f === 1) return { corpo: sombraChao(60) + folha + ell(100, 150, 22, 28, "#FFF4E0", tr("#C9A26A")) + circ(92, 138, 3, "#F4A6C6") + circ(110, 162, 2.5, "#F4A6C6") + olhosF(ex, [93, 107], 148, 3.5, [100, 158]),
      a: { olhos: [100, 148, .5], topo: [100, 124, .5], peito: [100, 170, .45], lado: [70, 160, .55], costas: [100, 150, .55] } };
    if (f <= 3) {
      var hx = f === 2 ? 130 : 136, hy = f === 2 ? 148 : 136, hr = f === 2 ? 20 : 25, segs = f === 2 ? [72, 90, 108] : [52, 70, 88, 106, 120];
      var corpo = sombraChao(62) + folha + segs.map(function (x, i) { return circ(x, f === 2 ? 164 : 158, f === 2 ? 13 : 15, verde, tr(verdeE, 2.5)) + circ(x, f === 2 ? 170 : 165, 2.5, f === 3 ? "#F2C230" : verdeE); }).join("") +
        path("M" + (hx - 8) + " " + (hy - hr + 2) + "l-6-16M" + (hx + 8) + " " + (hy - hr + 2) + "l6-16", "none", tr(verdeE, 3)) + circ(hx - 14, hy - hr - 14, 4, K.m) + circ(hx + 14, hy - hr - 14, 4, K.m) +
        circ(hx, hy, hr, verde, tr(verdeE, 3)) + (temCabeca ? "" : laco(hx + hr * .7, hy - hr * .7, .7, K.m, K.d)) + olhosF(ex, [hx - hr * .32, hx + hr * .32], hy - 2, 3 + hr * .06, [hx, hy + hr * .38]);
      return { corpo: corpo, a: { olhos: [hx, hy - 2, .5 + hr * .007], topo: [hx, hy - hr + 4, .5 + hr * .006], peito: [segs[Math.floor(segs.length / 2)], f === 2 ? 164 : 158, .5], lado: [segs[0] - 14, 168, .55], costas: [segs[1], 146, .55] } };
    }
    if (f === 4) return { corpo: path("M30 40q70-12 140 0", "none", tr("#7A5532", 6)) + path("M100 40v26", "none", tr("#D8D8D8", 2)) + sombraChao(30) +
      ell(100, 122, 30, 54, "#C9D86A", tr("#7A8A2A")) + path("M74 110q26 10 52 0M72 136q28 10 56 0M78 160q22 8 44 0", "none", tr("#9AAA3A", 2.5)) + circ(100, 150, 4, "#F2C230") +
      ell(100, 102, 18, 14, pele, tr(peleE, 2)) + olhosF(ex, [93, 107], 101, 3.5, [100, 109]),
      a: { olhos: [100, 101, .55], topo: [100, 76, .6], peito: [100, 140, .55], lado: [62, 126, .7], costas: [100, 122, .8] } };
    var g = f === 6, s = g ? 1.12 : 1;
    var asa = function (lado) {
      var x = 100 + lado * 40 * s;
      return '<g class="asa">' + ell(x, 92, 40 * s, 32 * s, K.m, tr(K.d) + ' transform="rotate(' + (-lado * 22) + " " + x + ' 92)"') +
        ell(100 + lado * 30 * s, 148, 28 * s, (g ? 30 : 22), K.m, tr(K.d) + ' transform="rotate(' + (lado * 24) + " " + (100 + lado * 30 * s) + ' 148)"') +
        circ(100 + lado * 46 * s, 86, 10 * s, K.l) + circ(100 + lado * 30 * s, 104, 5 * s, "#fff", ' opacity=".8"') + circ(100 + lado * 32 * s, 150, 7 * s, K.l) +
        path("M" + (100 + lado * 12) + " 100h" + lado * 22 + "v-14h" + lado * 14 + "M" + (100 + lado * 12) + " 140h" + lado * 14 + "v12", "none", tr("#F2C230", 2)) + "</g>";
    };
    var hy = g ? 72 : 78;
    return { fundo: g ? auraDe(id + "b", "#F8BBD9", 98) : "", corpo: sombraChao(48) + asa(-1) + asa(1) + rr(92, hy + 8, 16, 92, 8, "#5A3E7A", tr("#3B2752", 2)) +
      path("M94 " + (hy - 18) + "q-10-22-22-22M106 " + (hy - 18) + "q10-22 22-22", "none", tr("#3B2752", 3)) + circ(72, hy - 40, 5, K.m) + circ(128, hy - 40, 5, K.m) +
      circ(100, hy, 22, pele, tr(peleE, 2.5)) + olhosF(ex, [92, 108], hy - 1, 4.5, [100, hy + 9]) + (g ? brilhos([[26, 34], [176, 30], [22, 190], [178, 186], [100, 200]], "#FFF") + brilhos([[40, 200], [160, 204]]) : ""),
      a: { olhos: [100, hy - 1, .7], topo: [100, hy - 20, .7], peito: [100, hy + 46, .6], lado: [100, 184, .7], costas: [100, hy + 40, .75] } };
  }

  /* Gata (Mia). A cor escolhida pinta o laço, a coleira e a capa. */
  function gata(f, K, op, id) {
    var ex = op.expressao, pelo = K.m, pE = K.d, rosa = "#F4A6C6", focinho = "#F6F0FA", LC = "#E5568B", LD = "#9B2C5C";
    var temCabeca = op.cabeca && op.cabeca !== "oculos";
    var cab = function (cx, cy, r) {
      return path("M" + (cx - r * .95) + " " + (cy - r * .35) + "l" + r * .15 + " " + (-r * .95) + " " + r * .6 + " " + r * .5 + "zM" + (cx + r * .95) + " " + (cy - r * .35) + "l" + (-r * .15) + " " + (-r * .95) + " " + (-r * .6) + " " + r * .5 + "z", pelo, tr(pE, 2.5)) +
        path("M" + (cx - r * .75) + " " + (cy - r * .6) + "l" + r * .08 + " " + (-r * .5) + " " + r * .3 + " " + r * .26 + "zM" + (cx + r * .75) + " " + (cy - r * .6) + "l" + (-r * .08) + " " + (-r * .5) + " " + (-r * .3) + " " + r * .26 + "z", rosa) +
        circ(cx, cy, r, pelo, tr(pE, 3)) + ell(cx, cy + r * .42, r * .42, r * .3, focinho) + path("M" + (cx - 3) + " " + (cy + r * .26) + "h6l-3 3.5z", "#E57FA6") +
        path("M" + (cx - r * .3) + " " + (cy + r * .42) + "h" + (-r * .55) + "M" + (cx - r * .3) + " " + (cy + r * .52) + "l" + (-r * .5) + " " + r * .12 + "M" + (cx + r * .3) + " " + (cy + r * .42) + "h" + r * .55 + "M" + (cx + r * .3) + " " + (cy + r * .52) + "l" + r * .5 + " " + r * .12, "none", tr(pE, 1.5)) +
        olhosF(ex, [cx - r * .36, cx + r * .36], cy - r * .05, r * .14, null);
    };
    var rabo = function (y, brilho) { return path("M132 " + y + "c26 0 34-26 22-40", "none", tr(pE, 13)) + path("M132 " + y + "c26 0 34-26 22-40", "none", tr(brilho ? K.l : pelo, 8)); };
    var corpoG = function (cy, rx, ry) { return ell(100, cy, rx, ry, pelo, tr(pE, 3)) + ell(100, cy + ry * .2, rx * .5, ry * .6, focinho) + ell(84, cy + ry - 4, 10, 7, pelo, tr(pE, 2)) + ell(116, cy + ry - 4, 10, 7, pelo, tr(pE, 2)); };
    var G = [null, [136, 28, 180, 30, 24], [128, 30, 176, 34, 28], [118, 32, 170, 38, 34], [108, 32, 162, 40, 38], [104, 32, 160, 42, 40], [100, 33, 158, 42, 42]][f];
    var cx = 100, cy = G[0], r = G[1];
    var fundo = "", tras = "", frente = "";
    if (f === 5 || f === 6) tras += path("M" + (100 - r * .8) + " " + (cy + r * .7) + "L52 196h96L" + (100 + r * .8) + " " + (cy + r * .7) + "z", f === 6 ? LD : LC, tr(LD, 2.5));
    if (f === 6) { fundo = auraDe(id + "m", "#C9B6F2", 98); frente += brilhos([[30, 40], [170, 34], [26, 150], [176, 140], [60, 20], [140, 18]], "#FFE58A"); }
    if (f >= 3) frente += rr(100 - r * .7, cy + r * .82, r * 1.4, 8, 4, LC, tr(LD, 2)) + circ(100, cy + r * .82 + 12, 6, "#F2C230", tr("#A9820F", 2)) + (f >= 5 ? path("M100 " + (cy + r * .82 + 8) + "l1.5 3 3.5.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.5-.5z", "#A9820F") : "");
    if (f === 4) frente += rr(62, 170, 76, 6, 3, "#9AA6B1", tr("#55616C", 2)) + path("M68 170l6-34h52l6 34z", "#55616C", tr("#2A3138", 2)) + rr(78, 142, 44, 22, 2, "#16261C") +
      path("M84 150h10M84 156h18M98 150h14", "none", tr("#7CF0B0", 2)) + circ(100, 154, 2, "#F4A6C6");
    var corpo = sombraChao(40 + f * 3) + tras + rabo(G[2] + G[4] * .5, f === 6) + corpoG(G[2], G[3], G[4]) + cab(cx, cy, r) + frente +
      (f >= 2 && !temCabeca ? laco(cx + r * .62, cy - r * .78, .85, LC, LD) : "");
    return { fundo: fundo, corpo: corpo, a: { olhos: [cx, cy - r * .05, r * .025], topo: [cx, cy - r * .92, r * .024], peito: [100, f === 4 ? cy + r * .7 : G[2] + 2, .6], lado: [100 - G[3] - 12, G[2] + 6, .7], costas: [100, G[2] - 6, .75] } };
  }

  var MODELOS = [
    { id: "bit", nome: "Bit, o robô", apelido: "Bit", rosto: true, etapas: ["Robô sobre rodas", "Braços e antena", "Visor e painel", "Pernas e ombreiras", "Propulsores", "Aura de lenda"] },
    { id: "pixel", nome: "Pixel, a criatura digital", apelido: "Pixel", rosto: true, desenho: pixel, etapas: ["Ovo de dados", "Ovo rachando", "Filhote", "Pixel jovem", "Asas de cabo", "Dragão de código"] },
    { id: "tatu", nome: "Tatu-bola tech", apelido: "Tatu", rosto: true, desenho: tatu, etapas: ["Filhote", "Capacete de minerador", "Casco com circuitos", "Carapaça placa-mãe", "Rolando", "Bola de energia"] },
    { id: "sonda", nome: "Sonda", apelido: "Sonda", rosto: false, desenho: sonda, etapas: ["Drone", "Drone de patrulha", "Satélite", "Sonda espacial", "Sonda com anel", "Estação orbital"] },
    { id: "arvore", nome: "Árvore-circuito", apelido: "Raiz", rosto: false, desenho: arvore, etapas: ["Semente-chip", "Broto", "Muda", "Árvore jovem", "Copa de circuitos", "Frutos de LED"] },
    { id: "cidade", nome: "Minha Smart City", apelido: "Cidade", rosto: false, desenho: cidade, etapas: ["Vila", "Vila com escola", "Bairro conectado", "Cidade", "Cidade grande", "Metrópole inteligente"] },
    { id: "girassol", nome: "Girassol, a florzinha", apelido: "Girassol", rosto: true, desenho: girassol, etapas: ["Semente", "Brotinho", "Muda com laço", "Botão de flor", "Girassol", "Girassol solar"] },
    { id: "gotinha", nome: "Gotinha, a gota d'água", apelido: "Gotinha", rosto: true, desenho: gota, etapas: ["Gotinha", "Gota", "Gota com laço", "Gota com ondas", "Nuvenzinha", "Nuvem arco-íris"] },
    { id: "borboleta", nome: "Borboleta, a metamorfose", apelido: "Borboleta", rosto: true, desenho: borboleta, etapas: ["Ovinho", "Lagarta", "Lagarta crescida", "Crisálida", "Borboleta", "Borboleta de luz"] },
    { id: "gata", nome: "Gata, a gatinha", apelido: "Mia", rosto: true, desenho: gata, etapas: ["Gatinha", "Gata com laço", "Gata de coleira", "Gata programadora", "Gata de capa", "Gata mística"] }
  ];
  function etapaDe(modelo, forma) { var m = achar(MODELOS, modelo) || MODELOS[0]; return m.etapas[Math.min(6, Math.max(1, forma)) - 1]; }

  function desenharModelo(m, op, meta, forma) {
    var cor = achar(CORES, op.cor) || CORES[0], id = "av" + (++seq);
    var K = { m: cor.c[0] === "holo" ? "url(#" + id + "h)" : cor.c[0], d: cor.c[1], l: cor.c[2] };
    var r = m.desenho(forma, K, op, id), a = r.a, tras = "", frente = "";
    if (m.rosto && a) {
      if (op.extra === "jetpack") tras = poe("jetpack", a.costas[0], a.costas[1], a.costas[2]);
      if (op.cabeca === "oculos") frente += poe("oculos", a.olhos[0], a.olhos[1], a.olhos[2]);
      else if (op.cabeca) frente += poe(op.cabeca, a.topo[0], a.topo[1], a.topo[2]);
      if (op.peito) frente += poe(op.peito, a.peito[0], a.peito[1], a.peito[2]);
      if (op.extra && op.extra !== "jetpack") frente += poe(op.extra, a.lado[0], a.lado[1], a.lado[2]);
    } else {
      if (op.cabeca) frente += selo(op.cabeca, 24, 26);
      if (op.peito) frente += selo(op.peito, 176, 26);
      if (op.extra) frente += selo(op.extra, 182, 74);
    }
    var defs = cor.c[0] === "holo" ? '<defs><linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FE7F2"/><stop offset=".5" stop-color="#C79BF2"/><stop offset="1" stop-color="#F7D774"/></linearGradient></defs>' : "";
    var nome = esc(meta.titulo || ("Avatar " + limparNome(op.nome)));
    var desc = esc(meta.desc || descrever(op, forma));
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 224" role="img" aria-labelledby="' + id + "t " + id + 'd" class="bit bit-f' + forma + " av-" + m.id + '">' +
      '<title id="' + id + 't">' + nome + '</title><desc id="' + id + 'd">' + desc + "</desc>" + defs + (r.fundo || "") +
      '<g class="bit-corpo">' + tras + r.corpo + frente + "</g></svg>";
  }

  var motor = {
    MATERIAIS: MATERIAIS, NOMES_MATERIAIS: NOMES_MATERIAIS, ATRIBUTOS: ATRIBUTOS, CARGOS: CARGOS, CORES: CORES,
    ACESSORIOS: ACESSORIOS, EXPRESSOES: EXPRESSOES, MODELOS: MODELOS, etapaDe: etapaDe, CONQUISTAS: CONQUISTAS, ESCOLHAS_PADRAO: ESCOLHAS_PADRAO,
    xpMaterial: xpMaterial, xpParaNivel: xpParaNivel, nivelDe: nivelDe, cargoDe: cargoDe, calcular: calcular,
    desbloqueados: desbloqueados, validarEscolhas: validarEscolhas, novidades: novidades, desenhar: desenhar,
    descrever: descrever, limparNome: limparNome, esc: esc
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = motor; return; }
  if (typeof document === "undefined") return;

  /* ================= NAVEGADOR ================= */

  var me = document.currentScript;
  var BASE = me && me.src ? me.src.replace(/jogo\/[^\/]*$/, "") : "";
  var URL_ = String(raiz.RANKING_URL || "").trim();
  var DEMO = /[?&]demo\b/.test(location.search);
  var CACHE_MS = 2 * 60 * 1000;
  var estado = calcular([]), escolhas = Object.assign({}, ESCOLHAS_PADRAO), progresso = [];

  var DEMO_LINHAS = [
    { material: "redes-console-v1", feitas: 186, total: 520 }, { material: "subnetting-v1", feitas: 24, total: 24 },
    { material: "mapa-do-chamado-v1", feitas: 6, total: 10 }, { material: "seginfo-console-v1", feitas: 64, total: 400 },
    { material: "detetives-digitais-v1", feitas: 9, total: 12 }, { material: "esp32-lab-v1", feitas: 12, total: 30 }
  ];
  var DEMO_ESCOLHAS = { cor: "azul", cabeca: "fone", peito: "medalha", extra: "", expressao: "feliz", nome: "Bit" };

  function perfil() { return raiz.PORTAL_ALUNO && raiz.PORTAL_ALUNO.perfil ? raiz.PORTAL_ALUNO.perfil() : null; }
  function chave() { var p = perfil(); return "jogo:v1:" + (DEMO ? "demo" : p ? p.id : "anon"); }
  function ler() { try { return JSON.parse(localStorage.getItem(chave()) || "null") || {}; } catch (e) { return {}; } }
  function gravar(o) { try { localStorage.setItem(chave(), JSON.stringify(Object.assign(ler(), o))); } catch (e) {} }

  // Junta o progresso do servidor com o do material aberto (ainda não enviado), para o XP mudar na hora.
  function comLocal(linhas) {
    var id = raiz.PROGRESSO_ID, f = raiz.PROGRESSO_DADOS, out = (linhas || []).slice();
    if (!id || typeof f !== "function") return out;
    var d; try { d = f(); } catch (e) { d = null; }
    if (!d) return out;
    var i = -1;
    out.forEach(function (r, k) { if (r.material === id) i = k; });
    var nova = { material: id, feitas: d.feitas, total: d.total };
    if (i < 0) out.push(nova);
    else if (num(d.feitas) >= num(out[i].feitas)) out[i] = nova;
    return out;
  }

  function aplicar(linhas, esc_, silencioso) {
    progresso = linhas || [];
    var antes = ler().ultimo || null;
    estado = calcular(comLocal(progresso));
    escolhas = validarEscolhas(esc_ || escolhas, estado);
    var nov = novidades(antes, estado);
    gravar({ ultimo: { nivel: estado.nivel, forma: estado.forma, conquistas: estado.conquistas } });
    pintarSelo();
    pintarBloco();
    if (!silencioso) {
      if (!antes && estado) boasVindas();
      else if (nov.subiu || nov.conquistas.length) avisar(nov);
    }
    try { raiz.dispatchEvent(new CustomEvent("jogo:atualizado", { detail: { estado: estado, escolhas: escolhas } })); } catch (e) {}
  }

  function post(corpo) {
    var p = perfil();
    if (!URL_ || !p) return Promise.resolve({ ok: false, erro: "Entre no portal para salvar o seu personagem." });
    corpo.turma = p.turma; corpo.id = p.id; corpo.pin = p.pin;
    return fetch(URL_, { method: "POST", body: JSON.stringify(corpo) }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, erro: "Sem conexão com a internet. Tente de novo." }; });
  }

  function carregar(forcar) {
    var c = ler();
    if (DEMO) { aplicar(DEMO_LINHAS, c.escolhas || DEMO_ESCOLHAS, !forcar); return Promise.resolve(estado); }
    if (c.progresso) aplicar(c.progresso, c.escolhas, true);
    if (!perfil() || !URL_) return Promise.resolve(estado);
    if (!forcar && c.t && Date.now() - c.t < CACHE_MS) { aplicar(c.progresso, c.escolhas); return Promise.resolve(estado); }
    return post({ acao: "avatar" }).then(function (r) {
      if (!r || !r.ok) { aplicar(c.progresso || [], c.escolhas); return estado; }
      var esc_ = r.escolhas && typeof r.escolhas === "object" && Object.keys(r.escolhas).length ? r.escolhas : c.escolhas;
      gravar({ t: Date.now(), progresso: r.progresso || [], escolhas: esc_ });
      aplicar(r.progresso || [], esc_);
      return estado;
    });
  }

  function salvar(novas) {
    escolhas = validarEscolhas(novas, estado);
    gravar({ escolhas: escolhas });
    pintarSelo(); pintarBloco();
    try { raiz.dispatchEvent(new CustomEvent("jogo:atualizado", { detail: { estado: estado, escolhas: escolhas } })); } catch (e) {}
    if (DEMO) return Promise.resolve({ ok: true, demo: true });
    return post({ acao: "avatar-salvar", escolhas: escolhas });
  }

  function svg(tam, op) {
    return desenhar(Object.assign({}, escolhas, { forma: estado.forma }, op || {}),
      { titulo: escolhas.nome + ", nível " + estado.nivel + " (" + estado.cargo + ")" }).replace("<svg ", '<svg width="' + tam + '" height="' + Math.round(tam * 1.12) + '" ');
  }

  /* ---------- estilos ---------- */
  var css = document.createElement("style");
  css.textContent =
    "@keyframes bit-flutua{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}" +
    "@keyframes bit-pisca{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}" +
    "@keyframes bit-gira{to{transform:rotate(360deg)}}" +
    "@keyframes bit-chama{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.6)}}" +
    ".bit-vivo .bit-corpo{animation:bit-flutua 3.2s ease-in-out infinite}" +
    ".bit-vivo .bit-olhos{transform-box:fill-box;transform-origin:center;animation:bit-pisca 5s infinite}" +
    ".bit-vivo .bit-orbita{transform-origin:100px 112px;animation:bit-gira 14s linear infinite}" +
    ".bit-vivo .bit-jato{transform-box:fill-box;transform-origin:top;animation:bit-chama .5s ease-in-out infinite}" +
    "@media (prefers-reduced-motion:reduce){.bit-vivo *{animation:none!important}}" +
    "html[data-a11y-mov=reduzir] .bit-vivo *{animation:none!important}" +
    ".jg-selo{display:inline-flex;align-items:center;gap:6px;margin:-8px 8px -8px -10px;vertical-align:middle}" +
    ".jg-selo svg{display:block;background:rgba(255,255,255,.16);border-radius:50%}" +
    ".jg-selo b{font:700 12px/1 'JetBrains Mono',ui-monospace,monospace;background:#fff;color:#1F5135;border-radius:999px;padding:3px 6px}" +
    ".pt-fab.jg-tem .pt-dot{display:none}" +
    ".jg-bloco{display:flex;gap:12px;align-items:center;margin:10px 0 4px;padding:10px 12px;border:1px solid #D5DDDA;border-radius:12px}" +
    ".jg-bloco svg{flex:none}.jg-bloco div{flex:1;min-width:0}" +
    ".jg-bloco strong{display:block;font:700 20px/1.1 'Barlow Condensed','Arial Narrow',sans-serif}" +
    ".jg-bloco small{display:block;font:12px/1.4 'JetBrains Mono',ui-monospace,monospace;color:#5B6871}" +
    ".jg-barra{height:8px;border-radius:99px;background:#E3E9E6;overflow:hidden;margin:6px 0 4px}" +
    ".jg-barra i{display:block;height:100%;background:linear-gradient(90deg,#2E8B57,#7CC77A);border-radius:inherit}" +
    ".jg-bloco a{display:inline-block;margin-top:2px;font-weight:600;color:#1F5135;text-decoration:none}.jg-bloco a:hover{text-decoration:underline}" +
    ".jg-toast{position:fixed;left:50%;top:16px;z-index:10001;transform:translateX(-50%);display:flex;gap:12px;align-items:center;width:min(420px,calc(100vw - 32px));padding:12px 44px 12px 12px;border-radius:14px;background:#16261C;color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.3);font:15px/1.4 'Source Sans 3','Segoe UI',system-ui,sans-serif}" +
    ".jg-toast[hidden]{display:none}.jg-toast svg{flex:none}.jg-toast strong{display:block;font:700 20px/1.1 'Barlow Condensed','Arial Narrow',sans-serif;color:#9FE6B5}" +
    ".jg-toast a{color:#9FE6B5;font-weight:600}.jg-toast button{position:absolute;top:6px;right:6px;width:36px;height:36px;border:0;border-radius:8px;background:transparent;color:#fff;font-size:24px;cursor:pointer}" +
    ".jg-toast button:focus-visible,.jg-toast a:focus-visible{outline:3px solid #9FE6B5;outline-offset:2px}" +
    "@keyframes jg-entra{from{opacity:0;transform:translate(-50%,-12px)}to{opacity:1;transform:translate(-50%,0)}}.jg-toast{animation:jg-entra .3s ease-out}" +
    "@media (prefers-color-scheme:dark){.jg-bloco{border-color:#2A3A45}.jg-bloco small{color:#8699A4}.jg-barra{background:#2A3A45}.jg-bloco a{color:#7FBF7A}.jg-selo b{color:#12241A}}" +
    "@media print{.jg-toast{display:none}}";
  document.head.appendChild(css);

  /* ---------- selo no botão do canto ---------- */
  function pintarSelo() {
    var fab = document.querySelector(".pt-fab");
    if (!fab || (!perfil() && !DEMO)) return;
    var s = fab.querySelector(".jg-selo");
    if (!s) { s = document.createElement("span"); s.className = "jg-selo"; s.setAttribute("aria-hidden", "true"); fab.insertBefore(s, fab.firstChild); }
    s.innerHTML = svg(30) + "<b>Nv " + estado.nivel + "</b>";
    fab.classList.add("jg-tem");
    var lb = fab.getAttribute("aria-label") || "Minhas disciplinas";
    fab.setAttribute("aria-label", lb.replace(/, nível \d+.*$/, "") + ", nível " + estado.nivel);
  }

  /* ---------- bloco no painel ---------- */
  function pintarBloco() {
    var b = document.querySelector(".pt-jogo");
    if (!b) return;
    var falta = estado.proximo - estado.xp;
    b.hidden = false;
    b.innerHTML = '<div class="jg-bloco">' + svg(64) + "<div><strong>" + esc(escolhas.nome) + " · Nível " + estado.nivel + "</strong>" +
      "<small>" + esc(estado.cargo) + " · " + estado.xp.toLocaleString("pt-BR") + " XP</small>" +
      '<div class="jg-barra" role="progressbar" aria-label="Progresso até o próximo nível" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(estado.fracao * 100) + '"><i style="width:' + Math.round(estado.fracao * 100) + '%"></i></div>' +
      "<small>Faltam " + falta.toLocaleString("pt-BR") + " XP para o nível " + (estado.nivel + 1) + "</small>" +
      '<a href="' + esc(BASE + "meu-personagem/" + (DEMO ? "?demo" : "")) + '">Meu personagem →</a></div></div>';
  }

  /* ---------- avisos ---------- */
  var toast = document.createElement("div");
  toast.className = "jg-toast";
  toast.hidden = true;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var tt = null;
  function mostrar(titulo, texto) {
    toast.innerHTML = svg(54) + "<div><strong>" + esc(titulo) + "</strong>" + esc(texto) +
      ' <a href="' + esc(BASE + "meu-personagem/" + (DEMO ? "?demo" : "")) + '">Ver personagem</a></div><button type="button" aria-label="Fechar aviso">×</button>';
    toast.hidden = false;
    toast.querySelector("button").onclick = function () { toast.hidden = true; };
    clearTimeout(tt);
    tt = setTimeout(function () { if (!toast.contains(document.activeElement)) toast.hidden = true; }, 7000);
  }
  function avisar(nov) {
    if (nov.cargoNovo) return mostrar(escolhas.nome + " evoluiu!", "Nova etapa: " + etapaDe(escolhas.modelo, estado.forma) + " (" + estado.cargo + ", nível " + estado.nivel + ").");
    if (nov.subiu) return mostrar("Subiu para o nível " + estado.nivel + "!", "Continue assim. Novas cores aparecem conforme você sobe.");
    var c = achar(CONQUISTAS, nov.conquistas[0]), a = ACESSORIOS.filter(function (x) { return x.conquista === c.id; })[0];
    mostrar("Conquista: " + c.nome, a ? "Você liberou: " + a.nome.toLowerCase() + "." : "");
  }
  function boasVindas() {
    if (!perfil() && !DEMO) return;
    mostrar("Conheça o " + escolhas.nome + "!", "É o seu avatar de estudos: ele evolui a cada atividade. Em Meu personagem você pode trocar o modelo.");
  }

  /* ---------- ligações com progresso-turma.js ---------- */
  var orig = raiz.progressoMudou, rt = null;
  raiz.progressoMudou = function () {
    if (typeof orig === "function") orig.apply(this, arguments);
    clearTimeout(rt);
    rt = setTimeout(function () { aplicar(progresso, escolhas); }, 1500);
  };
  raiz.addEventListener("progresso:enviado", function () { gravar({ t: 0 }); });
  raiz.addEventListener("painel:aberto", pintarBloco);
  raiz.addEventListener("perfil:mudou", function () { estado = calcular([]); if (perfil()) carregar(false); });

  raiz.JOGO = Object.assign({}, motor, {
    carregar: carregar, salvar: salvar, svg: svg, demo: DEMO, base: BASE,
    estado: function () { return estado; }, escolhas: function () { return Object.assign({}, escolhas); },
    perfil: perfil, temServidor: function () { return !!URL_; }
  });

  if (perfil() || DEMO) carregar(false);
})(typeof window !== "undefined" ? window : this);
