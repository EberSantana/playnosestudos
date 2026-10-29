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
  var ESCOLHAS_PADRAO = { cor: "verde", cabeca: "", peito: "", extra: "", expressao: "feliz", nome: "Bit" };

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
    var cargo = CARGOS.filter(function (c) { return c.forma === forma; })[0];
    var cor = achar(CORES, op.cor) || CORES[0];
    var itens = ["cabeca", "peito", "extra"].map(function (l) { var a = achar(ACESSORIOS, op[l]); return a ? a.nome.toLowerCase() : ""; }).filter(Boolean);
    var ex = achar(EXPRESSOES, op.expressao) || EXPRESSOES[0];
    return "Robô na forma " + cargo.nome + ", cor " + cor.nome + ", expressão " + ex.nome.toLowerCase() + (itens.length ? ", com " + itens.join(", ") : "") + ".";
  }

  var motor = {
    MATERIAIS: MATERIAIS, NOMES_MATERIAIS: NOMES_MATERIAIS, ATRIBUTOS: ATRIBUTOS, CARGOS: CARGOS, CORES: CORES,
    ACESSORIOS: ACESSORIOS, EXPRESSOES: EXPRESSOES, CONQUISTAS: CONQUISTAS, ESCOLHAS_PADRAO: ESCOLHAS_PADRAO,
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
    if (nov.cargoNovo) return mostrar(escolhas.nome + " evoluiu!", "Agora é " + estado.cargo + ", nível " + estado.nivel + ".");
    if (nov.subiu) return mostrar("Subiu para o nível " + estado.nivel + "!", "Continue assim. Novas cores aparecem conforme você sobe.");
    var c = achar(CONQUISTAS, nov.conquistas[0]), a = ACESSORIOS.filter(function (x) { return x.conquista === c.id; })[0];
    mostrar("Conquista: " + c.nome, a ? "Você liberou: " + a.nome.toLowerCase() + "." : "");
  }
  function boasVindas() {
    if (!perfil() && !DEMO) return;
    mostrar("Conheça o " + escolhas.nome + "!", "É o seu robô de estudos: ele evolui a cada atividade que você faz.");
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
