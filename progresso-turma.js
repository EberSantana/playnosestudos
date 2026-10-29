/* Login, menu de disciplinas e progresso da turma \u2014 Prof. Eber Santana
 * Quem n\u00e3o fez login v\u00ea a tela de entrada, que ocupa a p\u00e1gina inteira. O site aparece depois do login.
 * O aluno escolhe a turma, toca no pr\u00f3prio nome e digita o PIN. O login vale em todos os materiais.
 * A lista de alunos fica na aba Turmas da planilha do professor (nunca neste reposit\u00f3rio).
 * Depois de entrar, o bot\u00e3o no canto vira o menu com as disciplinas do curso do aluno.
 * O progresso vai para a planilha do professor (App da Web definido em config.js).
 *
 * Para mudar quais disciplinas pertencem a cada curso, edite a lista CURSOS logo abaixo.
 * Para abrir uma p\u00e1gina sem login (ex.: modo professor), acrescente ?professor ao endere\u00e7o.
 *
 * Em uma p\u00e1gina de material, defina antes deste script:
 *   window.PROGRESSO_ID = "id-do-material";
 *   window.PROGRESSO_DADOS = () => ({ feitas, total, pontos, detalhe });
 * e chame window.progressoMudou() sempre que o aluno avan\u00e7ar.
 */
(function () {
  // O nome do curso aqui precisa ser igual \u00e0 coluna "curso" da aba Turmas da planilha.
  var CURSOS = [
    { nome: "Subsequente em Inform\u00e1tica", disciplinas: [
      ["Inform\u00e1tica B\u00e1sica", "informatica-basica"],
      ["Engenharia de Software", "engenharia-de-software"] ] },
    { nome: "Integrado em Desenvolvimento de Sistemas \u00b7 1\u00ba ano", disciplinas: [
      ["Constru\u00e7\u00e3o de Sites 1", "construcao-de-sites-1"] ] },
    { nome: "Integrado em Desenvolvimento de Sistemas \u00b7 2\u00ba ano", disciplinas: [
      ["Banco de Dados", "banco-de-dados"],
      ["Engenharia de Software", "engenharia-de-software"] ] },
    { nome: "T\u00e9cnico em Inform\u00e1tica", disciplinas: [
      ["Redes de Computadores", "redes-de-computadores"],
      ["Projeto de Redes", "projeto-de-redes"],
      ["Seguran\u00e7a da Informa\u00e7\u00e3o", "seguranca-da-informacao"] ] }
  ];
  // Pastas que o professor pode liberar ou bloquear por turma (aba Acesso da planilha).
  var NOMES_PASTAS = { "laboratorio-3d": "Laborat\u00f3rio 3D" };
  CURSOS.forEach(function (c) { c.disciplinas.forEach(function (d) { NOMES_PASTAS[d[1]] = d[0]; }); });
  var TKEY = "pt-ultima-turma", LKEY = "pt-turmas-v2";

  var URL_ = String(window.RANKING_URL || "").trim();
  var ID = window.PROGRESSO_ID || "";
  var DADOS = typeof window.PROGRESSO_DADOS === "function" ? window.PROGRESSO_DADOS : null;
  var PKEY = "perfil:aluno";
  var LIVRE = /[?&](professor|demo)\b/.test(location.search) || location.hash === "#professor";
  var me = document.currentScript;
  var BASE = me && me.src ? me.src.replace(/[^\/]*$/, "") : "";
  var root = document.documentElement;

  function cursoDe(nome) { for (var i = 0; i < CURSOS.length; i++) if (CURSOS[i].nome === nome) return CURSOS[i]; return null; }
  function lerPerfil() {
    try { var p = JSON.parse(localStorage.getItem(PKEY) || "null"); return p && p.id && p.pin && p.nome ? p : null; } catch (e) { return null; }
  }
  var perfil = lerPerfil();
  // perfil.disciplinas: lista de pastas liberadas para a turma, ou ausente/null = todas.
  function liberada(pasta) { return !perfil || !Array.isArray(perfil.disciplinas) || !NOMES_PASTAS[pasta] || perfil.disciplinas.indexOf(pasta) >= 0; }

  if (!document.querySelector('link[href*="Barlow+Condensed"]')) {
    var fl = document.createElement("link");
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap";
    document.head.appendChild(fl);
  }

  var F = "'Source Sans 3','Segoe UI',system-ui,sans-serif", FD = "'Barlow Condensed','Arial Narrow',sans-serif", FM = "'JetBrains Mono',ui-monospace,monospace";
  var css = document.createElement("style");
  css.textContent =
    /* tela de entrada */
    "html.pt-gate,html.pt-gate body{overflow:hidden!important}" +
    "html.pt-gate body>*:not(.pt-screen){visibility:hidden!important}" +
    ".pt-screen{position:fixed;inset:0;z-index:10000;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);background:#EEF2F0;color:#16261C;font:16px/1.55 " + F + ";overflow:auto;-webkit-font-smoothing:antialiased}" +
    ".pt-screen[hidden]{display:none}" +
    ".pt-screen :is(button,input,select,a,[tabindex]):focus-visible,.pt-menu a:focus-visible,.pt-fab:focus-visible{outline:3px solid #0B6BCB!important;outline-offset:2px}" +
    ".pt-hero{background:#16261C;color:#DCE5EA;padding:clamp(28px,6vw,72px);display:flex;flex-direction:column;justify-content:center;gap:18px;position:relative;overflow:hidden}" +
    ".pt-hero::after{content:'';position:absolute;right:-120px;bottom:-120px;width:360px;height:360px;border-radius:50%;border:56px solid rgba(31,81,53,.16);pointer-events:none}" +
    ".pt-eyebrow{font:12px/1.4 " + FM + ";letter-spacing:.12em;text-transform:uppercase;color:#7FBF7A}" +
    ".pt-hero h1{margin:0;font:700 clamp(40px,6vw,68px)/1 " + FD + ";color:#fff;text-wrap:balance}" +
    ".pt-hero p{margin:0;max-width:44ch;color:#B8C6CD;font-size:17px}" +
    ".pt-feats{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:12px;max-width:46ch}" +
    ".pt-feats li{display:flex;gap:12px;align-items:flex-start;color:#DCE5EA}" +
    ".pt-feats b{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:rgba(31,81,53,.18);color:#7FBF7A;font:700 14px/1 " + FM + "}" +
    ".pt-side{display:flex;align-items:center;justify-content:center;padding:clamp(20px,5vw,56px)}" +
    ".pt-card{width:100%;max-width:440px;background:#fff;border:1px solid #D5DDDA;border-radius:16px;padding:clamp(20px,4vw,32px);box-shadow:0 12px 40px rgba(21,33,43,.08)}" +
    ".pt-card h2{margin:0 0 4px;font:700 32px/1.1 " + FD + "}" +
    ".pt-card .pt-sub{margin:0 0 14px;color:#3F4F5B;font-size:15px}" +
    ".pt-card label{display:block;font-size:14px;font-weight:600;margin:12px 0 4px}" +
    ".pt-card input,.pt-card select{width:100%;box-sizing:border-box;min-height:46px;padding:10px 12px;border-radius:10px;border:1px solid #B8C6CD;background:#fff;color:#16261C;font:16px " + F + "}" +
    ".pt-card input,.pt-card select{margin-top:2px}.pt-card input:focus,.pt-card select:focus{outline:2px solid #1F5135;outline-offset:1px;border-color:#1F5135}" +
    ".pt-step[hidden]{display:none}" +
    ".pt-list{display:grid;gap:8px;margin-top:6px;max-height:min(52vh,460px);overflow:auto;padding:2px}" +
    ".pt-nomes{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}" +
    ".pt-opt{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;min-height:52px;padding:10px 14px;border:1px solid #D5DDDA;border-radius:12px;background:#fff;color:#16261C;font:600 16px/1.25 " + F + ";text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".pt-opt[hidden]{display:none}.pt-opt:hover,.pt-opt:focus-visible{border-color:#1F5135;outline:none;background:rgba(31,81,53,.06)}" +
    ".pt-opt small{font:400 13px/1.3 " + F + ";color:#5B6871}" +
    ".pt-back{border:0;background:none;padding:6px 0;margin:0 0 6px;color:#163D28;font:600 15px/1 " + F + ";cursor:pointer}" +
    ".pt-busca{margin-bottom:4px}" +
    ".pt-two{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}" +
    ".pt-go{width:100%;min-height:50px;margin-top:20px;border:0;border-radius:10px;background:#1F5135;color:#fff;font:700 17px/1 " + F + ";cursor:pointer}" +
    ".pt-go:hover{background:#163D28}.pt-go:focus-visible{outline:3px solid #16261C;outline-offset:2px}.pt-go[disabled]{opacity:.7;cursor:wait}" +
    ".pt-note{margin:12px 0 0;font-size:13px;color:#5B6871}" +
    ".pt-opt{display:flex;gap:8px;align-items:center;margin:10px 0 2px;font-size:14px}.pt-opt input{width:18px;height:18px}" +
    ".pt-msg{margin-top:10px;font-size:14px}.pt-msg:empty{margin:0}" +
    ".pt-msg.bad{color:#B3261E}.pt-msg.good{color:#0B7A49}" +
    "@media (max-width:820px){.pt-screen{grid-template-columns:1fr;grid-template-rows:auto auto;align-content:start}.pt-hero{padding:28px 20px 26px;gap:10px;overflow:visible;flex-shrink:0}.pt-hero::after{display:none}.pt-hero h1{font-size:40px}.pt-hero p{font-size:15.5px}.pt-feats{display:none}.pt-side{padding:18px 16px 32px;align-items:flex-start}}" +
    "@media (max-width:380px){.pt-two{grid-template-columns:1fr}}" +
    /* bot\u00e3o e menu depois do login */
    ".pt-fab{position:fixed;right:16px;bottom:16px;z-index:9998;border:0;border-radius:999px;padding:12px 18px;font:600 15px/1.2 " + F + ";background:#1F5135;color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;max-width:calc(100vw - 32px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".pt-fab,.pt-box button,.pt-box a,.pt-go{-webkit-tap-highlight-color:transparent}" +
    ".pt-fab[hidden]{display:none}" +
    ".pt-fab:focus-visible{outline:3px solid #16261C;outline-offset:2px}" +
    ".pt-fab .pt-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background:#7CF0B0;vertical-align:middle}" +
    ".pt-box{position:fixed;right:16px;bottom:72px;z-index:9999;width:min(380px,calc(100vw - 32px));max-height:calc(100vh - 100px);overflow:auto;border-radius:14px;padding:18px;font:15px/1.5 " + F + ";background:#fff;color:#16261C;border:1px solid #D5DDDA;box-shadow:0 10px 30px rgba(0,0,0,.25);text-align:left}" +
    ".pt-box[hidden]{display:none}" +
    ".pt-close{position:absolute;top:8px;right:8px;width:40px;height:40px;border:0;border-radius:10px;background:transparent;color:inherit;font:400 28px/1 " + F + ";cursor:pointer;opacity:.7}.pt-close:hover,.pt-close:focus-visible{opacity:1;background:rgba(127,127,127,.15);outline:none}" +
    ".pt-box h3{margin:0 0 4px;padding-right:40px;font:700 24px/1.1 " + FD + ";color:inherit}" +
    ".pt-box h4{margin:14px 0 6px;font:700 12px/1.2 " + FM + ";letter-spacing:.08em;text-transform:uppercase;color:#163D28}" +
    ".pt-box p{margin:0 0 10px;color:#3F4F5B;font-size:14px}" +
    ".pt-row{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap}" +
    ".pt-btn{display:inline-flex;align-items:center;min-height:38px;border:1px solid #1F5135;background:#1F5135;color:#fff;border-radius:8px;padding:0 14px;font:600 14px/1 " + F + ";cursor:pointer;text-decoration:none}" +
    ".pt-btn.sec{background:transparent;color:#163D28}" +
    ".pt-menu{display:grid;gap:6px;margin:0;padding:0;list-style:none}" +
    ".pt-menu a{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:44px;padding:0 12px;border:1px solid #D5DDDA;border-radius:10px;color:inherit;text-decoration:none;font-weight:600}" +
    ".pt-menu a:hover,.pt-menu a:focus-visible{border-color:#1F5135;outline:none}" +
    ".pt-menu a[aria-current]{border-color:#1F5135;background:rgba(31,81,53,.08)}" +
    ".pt-menu a span{color:#1F5135}" +
    ".pt-stat{font-family:" + FM + ";font-size:13px;color:#5B6871}" +
    ".pt-rank{margin:8px 0 0;padding:0;list-style:none;font-size:14px}" +
    ".pt-rank li{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-top:1px solid #E3E9E6}" +
    ".pt-rank li.me{font-weight:700}" +
    "@media (prefers-color-scheme:dark){" +
      ".pt-screen{background:#0F171D;color:#E4ECEF}.pt-hero{background:#0B140E}" +
      ".pt-card{background:#16222B;border-color:#2A3A45;box-shadow:none}.pt-card .pt-sub{color:#B8C6CD}.pt-note{color:#8699A4}" +
      ".pt-card input,.pt-card select{background:#0F171D;color:#E4ECEF;border-color:#3A4C58}" +
      ".pt-opt{background:#0F171D;color:#E4ECEF;border-color:#2A3A45}.pt-opt small{color:#8699A4}.pt-back{color:#7FBF7A}" +
      ".pt-box{background:#16222B;color:#E4ECEF;border-color:#2A3A45}.pt-box p{color:#B8C6CD}.pt-box h4{color:#7FBF7A}" +
      ".pt-btn.sec{color:#7FBF7A;border-color:#7FBF7A}.pt-menu a{border-color:#2A3A45}.pt-menu a span{color:#7FBF7A}.pt-rank li{border-color:#2A3A45}" +
      ".pt-msg.bad{color:#FF8174}.pt-msg.good{color:#4FD899}}" +
    "@media print{.pt-fab,.pt-box,.pt-screen{display:none}}";
  document.head.appendChild(css);

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function primeiroNome() { return perfil ? perfil.nome.trim().split(/\s+/)[0] : ""; }
  function dados() { return DADOS ? DADOS() : null; }
  function corpo(d) {
    return { disciplina: ID || "portal", turma: perfil.turma, id: perfil.id, pin: perfil.pin, nome: perfil.nome, apelido: perfil.apelido,
      curso: perfil.curso, turno: perfil.turno, pontos: d.pontos, feitas: d.feitas, total: d.total, detalhe: d.detalhe || {} };
  }
  function avisar() { try { window.dispatchEvent(new CustomEvent("perfil:mudou", { detail: perfil })); } catch (e) {} }
  function pastaAtual() {
    if (!BASE || location.href.indexOf(BASE) !== 0) return "";
    return location.href.slice(BASE.length).split(/[\/?#]/)[0];
  }
  // Bloqueia a p\u00e1gina de uma disciplina que n\u00e3o foi liberada para a turma do estudante.
  function guarda() {
    var pasta = pastaAtual(), ex = document.getElementById("pt-bloqueio");
    if (!perfil || liberada(pasta) || LIVRE) { if (ex) { ex.remove(); root.classList.remove("pt-trava"); } return; }
    if (ex) return;
    var b = document.createElement("div");
    b.id = "pt-bloqueio"; b.className = "pt-screen"; b.setAttribute("role", "alertdialog"); b.setAttribute("aria-modal", "true"); b.setAttribute("aria-labelledby", "pt-bl-t");
    b.style.cssText = "display:grid;place-items:center;grid-template-columns:1fr;padding:20px";
    b.innerHTML = '<div class="pt-card" style="max-width:440px"><h2 id="pt-bl-t">Esta disciplina ainda n\u00e3o foi liberada</h2>' +
      '<p class="pt-sub">' + esc(NOMES_PASTAS[pasta] || "Esta disciplina") + " n\u00e3o est\u00e1 dispon\u00edvel para a turma " + esc(perfil.turma) + ". O professor libera quando chegar a hora.</p>" +
      '<a class="pt-go" style="display:block;text-align:center;text-decoration:none;line-height:48px" href="' + esc(BASE) + '">Voltar \u00e0s minhas disciplinas</a></div>';
    document.body.appendChild(b);
    var a = b.querySelector("a"); if (a) a.focus();
  }
  function enviar(d) {
    if (!URL_ || !perfil || !d) return Promise.resolve({ ok: false, erro: "sem configura\u00e7\u00e3o" });
    return fetch(URL_, { method: "POST", body: JSON.stringify(corpo(d)) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r && r.ok) {
          try { window.dispatchEvent(new CustomEvent("progresso:enviado")); } catch (e) {}
          if (r.perfil && perfil && JSON.stringify(r.perfil.disciplinas || null) !== JSON.stringify(perfil.disciplinas || null)) {
            perfil.disciplinas = r.perfil.disciplinas || null;
            try { localStorage.setItem(PKEY, JSON.stringify(perfil)); } catch (e) {}
            avisar(); guarda();
          }
        }
        return r;
      })
      .catch(function () { return { ok: false, erro: "Sem conex\u00e3o com a internet. Tente de novo." }; });
  }

  /* ---------- tela de entrada ---------- */
  var screen = document.createElement("div");
  screen.className = "pt-screen";
  screen.hidden = true;
  screen.setAttribute("role", "dialog");
  screen.setAttribute("aria-modal", "true");
  screen.setAttribute("aria-labelledby", "pt-title");
  screen.innerHTML =
    '<section class="pt-hero">' +
      '<span class="pt-eyebrow">Prof. Eber Santana \u00b7 IFS Campus Tobias Barreto</span>' +
      "<h1>Play nos Estudos</h1>" +
      "<p>Entre para acessar as disciplinas do seu curso. A cada atividade, o seu avatar ganha experi\u00eancia e evolui.</p>" +
      '<ul class="pt-feats">' +
        "<li><b>01</b><span>Laborat\u00f3rios visuais e simuladores para ver cada conceito funcionando.</span></li>" +
        "<li><b>02</b><span>Caderno, flashcards, verdadeiro ou falso e PBL. A resposta aparece depois que voc\u00ea tenta.</span></li>" +
        "<li><b>03</b><span>Escolha o seu avatar (rob\u00f4, tatu-bola, \u00e1rvore\u2026). Ele sobe de n\u00edvel, evolui e libera acess\u00f3rios conforme voc\u00ea estuda.</span></li>" +
      "</ul>" +
    "</section>" +
    '<section class="pt-side"><div class="pt-card">' +
      '<div class="pt-step" data-step="1">' +
        '<h2 id="pt-title">Entrar</h2>' +
        '<p class="pt-sub">Escolha a sua turma.</p>' +
        '<div class="pt-list pt-turmas"></div>' +
        '<div class="pt-msg" role="status" aria-live="polite"></div>' +
      "</div>" +
      '<div class="pt-step" data-step="2" hidden>' +
        '<button class="pt-back" type="button" data-volta="1">\u2190 Trocar turma</button>' +
        "<h2>Quem \u00e9 voc\u00ea?</h2>" +
        '<p class="pt-sub pt-turma-nome"></p>' +
        '<input class="pt-busca" type="search" placeholder="Procurar o seu nome" aria-label="Procurar o seu nome" autocomplete="off" hidden>' +
        '<div class="pt-list pt-nomes"></div>' +
        '<div class="pt-msg" role="status" aria-live="polite"></div>' +
        '<p class="pt-note">N\u00e3o achou o seu nome? Fale com o professor.</p>' +
      "</div>" +
      '<form class="pt-step" data-step="3" novalidate hidden>' +
        '<button class="pt-back" type="button" data-volta="2">\u2190 N\u00e3o sou eu</button>' +
        '<h2 class="pt-ola"></h2>' +
        '<p class="pt-sub pt-pin-dica"></p>' +
        '<label for="pt-p">PIN de 4 n\u00fameros</label><input id="pt-p" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off">' +
        '<div class="pt-p2" hidden><label for="pt-p2">Repita o PIN</label><input id="pt-p2" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off"></div>' +
        '<button class="pt-go" type="submit">Entrar</button>' +
        '<div class="pt-msg" role="status" aria-live="polite"></div>' +
        '<p class="pt-note pt-pin-nota"></p>' +
      "</form>" +
      '<p class="pt-note pt-priv">Guardamos s\u00f3 o seu nome na lista da turma, o seu progresso, o XP e as escolhas do avatar. N\u00e3o pedimos e-mail, telefone nem foto. O professor v\u00ea o seu progresso. <a href="' + BASE + 'privacidade.html">Aviso de privacidade</a></p>' +
    "</div></section>";
  document.body.appendChild(screen);
  var passo = 1, turmaSel = null, alunoSel = null, turmasCache = null, autoFeito = false;
  function q(sel) { return screen.querySelector(sel); }
  function gmsg(t, cl) { var m = screen.querySelector('.pt-step[data-step="' + passo + '"] .pt-msg'); if (m) { m.textContent = t || ""; m.className = "pt-msg " + (cl || ""); } }
  function irPara(n) {
    passo = n;
    Array.prototype.forEach.call(screen.querySelectorAll(".pt-step"), function (el) { el.hidden = +el.getAttribute("data-step") !== n; });
    screen.scrollTop = 0;
    gmsg("");
  }
  function getJSON(params) {
    return fetch(URL_ + (URL_.indexOf("?") >= 0 ? "&" : "?") + params).then(function (r) { return r.json(); });
  }
  function opcao(html, onClick) {
    var b = document.createElement("button"); b.type = "button"; b.className = "pt-opt"; b.innerHTML = html; b.onclick = onClick; return b;
  }
  function carregarTurmas() {
    var box1 = q(".pt-turmas");
    if (!URL_) { box1.innerHTML = ""; gmsg("O portal ainda n\u00e3o est\u00e1 ligado \u00e0 planilha da turma. Avise o professor.", "bad"); return; }
    var guardadas = null;
    if (!turmasCache) { try { guardadas = JSON.parse(localStorage.getItem(LKEY) || "null"); } catch (e) {} }
    if (turmasCache || (guardadas && guardadas.length)) desenharTurmas({ ok: true, turmas: turmasCache || guardadas });
    else box1.innerHTML = '<p class="pt-note">Carregando turmas\u2026</p>';
    if (turmasCache) return;
    getJSON("acao=turmas").then(function (r) {
      if (!r.ok || !r.turmas) throw 0;
      try { localStorage.setItem(LKEY, JSON.stringify(r.turmas)); } catch (e) {}
      var mudou = JSON.stringify(r.turmas) !== JSON.stringify(guardadas);
      turmasCache = r.turmas;
      if (turmaSel) r.turmas.forEach(function (t) { if (t.turma === turmaSel.turma) turmaSel.lista = t.lista; });
      if (passo === 1 && (mudou || !guardadas)) desenharTurmas(r);
      else if (passo === 2 && mudou && turmaSel) desenharNomes(turmaSel);
    }).catch(function () {
      if (guardadas && guardadas.length) return;
      box1.innerHTML = "";
      var b = opcao("<b>Tentar de novo</b><small>N\u00e3o foi poss\u00edvel carregar as turmas. Confira a internet.</small>", carregarTurmas);
      box1.appendChild(b);
    });
  }
  function desenharTurmas(r) {
    var box1 = q(".pt-turmas");
    (function () {
      box1.innerHTML = "";
      if (!r.turmas.length) { gmsg("Nenhuma turma cadastrada ainda. Avise o professor.", "bad"); return; }
      r.turmas.forEach(function (t) {
        box1.appendChild(opcao("<b>" + esc(t.turma) + "</b><small>" + esc(t.curso) + (t.turno ? " \u00b7 " + esc(t.turno) : "") + "</small>", function () { escolherTurma(t); }));
      });
      var ult = null; try { ult = localStorage.getItem(TKEY); } catch (e) {}
      var achou = r.turmas.filter(function (t) { return t.turma === ult; })[0];
      if (achou && passo === 1 && !turmaSel && !autoFeito) { autoFeito = true; escolherTurma(achou); }
      autoFeito = true;
    })();
  }
  function escolherTurma(t) {
    turmaSel = t;
    try { localStorage.setItem(TKEY, t.turma); } catch (e) {}
    irPara(2);
    q(".pt-turma-nome").textContent = t.turma;
    var lista = q(".pt-nomes"), busca = q(".pt-busca");
    busca.value = ""; busca.hidden = true;
    if (t.lista) return desenharNomes(t);
    lista.innerHTML = '<p class="pt-note">Carregando nomes\u2026</p>';
    getJSON("acao=alunos&turma=" + encodeURIComponent(t.turma)).then(function (r) {
      if (!r.ok || !r.alunos) throw 0;
      t.lista = r.alunos; desenharNomes(t);
    }).catch(function () {
      lista.innerHTML = "";
      lista.appendChild(opcao("<b>Tentar de novo</b><small>N\u00e3o foi poss\u00edvel carregar os nomes. Confira a internet.</small>", function () { escolherTurma(t); }));
    });
  }
  function desenharNomes(t) {
    var lista = q(".pt-nomes"), busca = q(".pt-busca");
    lista.innerHTML = "";
    t.lista.forEach(function (a) {
      var b = opcao("<b>" + esc(a.nome) + "</b>", function () { escolherAluno(a); });
      b.setAttribute("data-nome", a.nome.toLowerCase());
      lista.appendChild(b);
    });
    busca.hidden = t.lista.length <= 12;
    if (busca.value) busca.dispatchEvent(new Event("input"));
  }
  function semAcento(s) { return s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : s; }
  q(".pt-busca").addEventListener("input", function () {
    var v = semAcento(this.value.trim().toLowerCase());
    Array.prototype.forEach.call(q(".pt-nomes").children, function (b) { b.hidden = v && semAcento(b.getAttribute("data-nome") || "").indexOf(v) < 0; });
  });
  function escolherAluno(a) {
    alunoSel = a;
    irPara(3);
    q(".pt-ola").textContent = "Ol\u00e1, " + a.nome.split(" ")[0] + "!";
    q("#pt-p").value = ""; q("#pt-p2").value = "";
    q(".pt-p2").hidden = a.temPin;
    q(".pt-pin-dica").textContent = a.temPin ? "Digite o seu PIN para entrar." : "\u00c9 o seu primeiro acesso. Crie um PIN de 4 n\u00fameros e guarde: voc\u00ea vai usar sempre para entrar.";
    q(".pt-go").textContent = a.temPin ? "Entrar" : "Criar PIN e entrar";
    q(".pt-pin-nota").textContent = a.temPin ? "Esqueceu o PIN? Pe\u00e7a ao professor para liberar um novo." : "N\u00e3o use datas f\u00e1ceis, como o seu anivers\u00e1rio.";
    if (matchMedia("(pointer: fine)").matches) setTimeout(function () { q("#pt-p").focus({ preventScroll: true }); }, 30);
  }
  Array.prototype.forEach.call(screen.querySelectorAll(".pt-back"), function (b) {
    b.onclick = function () { var n = +b.getAttribute("data-volta"); if (n === 1) { turmaSel = null; irPara(1); carregarTurmas(); } else irPara(n); };
  });

  function setInert(on) {
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el === screen) return;
      if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert");
    });
  }
  function mostrarEntrada() {
    root.classList.add("pt-gate");
    screen.hidden = false;
    fab.hidden = true; box.hidden = true;
    setInert(true);
    turmaSel = null; alunoSel = null;
    irPara(1);
    carregarTurmas();
  }
  function esconderEntrada() {
    root.classList.remove("pt-gate");
    screen.hidden = true;
    setInert(false);
    fab.hidden = false;
  }

  q('form.pt-step').addEventListener("submit", function (ev) {
    ev.preventDefault();
    var p = q("#pt-p").value.trim(), p2 = q("#pt-p2").value.trim();
    if (!/^\d{4}$/.test(p)) { gmsg("O PIN precisa ter 4 n\u00fameros.", "bad"); q("#pt-p").focus(); return; }
    if (!alunoSel.temPin && (/^(\d)\1{3}$/.test(p) || "01234567890".indexOf(p) >= 0 || "09876543210".indexOf(p) >= 0)) { gmsg("Esse PIN \u00e9 f\u00e1cil de adivinhar. Escolha outro (evite 1234, 0000 e repeti\u00e7\u00f5es).", "bad"); q("#pt-p").focus(); return; }
    if (!alunoSel.temPin && p !== p2) { gmsg("Os dois PINs n\u00e3o s\u00e3o iguais. Digite de novo.", "bad"); q("#pt-p2").focus(); return; }
    var btn = q(".pt-go"), txt = btn.textContent;
    btn.disabled = true; btn.textContent = "Entrando\u2026"; gmsg("");
    fetch(URL_, { method: "POST", body: JSON.stringify({ acao: "entrar", turma: turmaSel.turma, id: alunoSel.id, pin: p, criarPin: !alunoSel.temPin }) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, erro: "Sem conex\u00e3o com a internet. Tente de novo." }; })
      .then(function (r) {
        btn.disabled = false; btn.textContent = txt;
        if (!r.ok || !r.perfil) {
          q("#pt-p").value = ""; q("#pt-p2").value = "";
          turmasCache = null; try { localStorage.removeItem(LKEY); } catch (e) {}
          if (/n\u00e3o tem PIN/.test(r.erro || "") && alunoSel.temPin) { alunoSel.temPin = false; escolherAluno(alunoSel); return gmsg("Crie um PIN novo: digite duas vezes.", "bad"); }
          return gmsg(r.erro || "N\u00e3o foi poss\u00edvel entrar.", "bad");
        }
        perfil = r.perfil; perfil.pin = p;
        try { localStorage.setItem(PKEY, JSON.stringify(perfil)); } catch (err) {}
        try { sessionStorage.setItem("pt-sync", perfil.id); } catch (err) {}
        if (window.A11Y_AP) window.A11Y_AP.recarregar();
        if (DADOS) enviar(dados());
        paintFab(); esconderEntrada(); avisar(); guarda();
      });
  });

  /* ---------- bot\u00e3o e menu depois do login ---------- */
  var fab = document.createElement("button");
  fab.className = "pt-fab";
  fab.type = "button";
  fab.hidden = true;
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-controls", "pt-box");
  var box = document.createElement("div");
  box.className = "pt-box";
  box.id = "pt-box";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Minhas disciplinas");
  document.body.appendChild(box);
  document.body.appendChild(fab);

  function paintFab() {
    fab.innerHTML = '<span class="pt-dot" aria-hidden="true"></span>Minhas disciplinas';
    fab.setAttribute("aria-label", "Minhas disciplinas, " + primeiroNome());
  }
  function bmsg(t, cl) { var m = box.querySelector(".pt-msg"); if (m) { m.textContent = t; m.className = "pt-msg " + (cl || ""); } }

  function painel() {
    var d = dados(), c = Array.isArray(perfil.disciplinas) ? { disciplinas: perfil.disciplinas.filter(function (f) { return NOMES_PASTAS[f]; }).map(function (f) { return [NOMES_PASTAS[f], f]; }) } : cursoDe(perfil.curso) || { disciplinas: [].concat.apply([], CURSOS.map(function (x) { return x.disciplinas; })).filter(function (x, i, a) { return a.map(function (y) { return y[1]; }).indexOf(x[1]) === i; }) }, atual = pastaAtual();
    box.innerHTML =
      '<button class="pt-close" id="pt-x" type="button" aria-label="Fechar">\u00d7</button>' +
      "<h3>Ol\u00e1, " + esc(primeiroNome()) + "</h3>" +
      '<p class="pt-stat">' + esc(perfil.curso) + "<br>" + esc(perfil.turma) + " \u00b7 " + esc(perfil.turno) + "</p>" +
      '<div class="pt-jogo" hidden></div>' +
      "<h4>Suas disciplinas</h4>" +
      '<ul class="pt-menu">' + c.disciplinas.map(function (x) {
        return '<li><a href="' + esc(BASE + x[1] + "/") + '"' + (atual === x[1] ? ' aria-current="page"' : "") + ">" + esc(x[0]) + "<span>\u2192</span></a></li>";
      }).join("") + "</ul>" +
      (d ? "<h4>Este material</h4>" + '<p class="pt-stat">' + d.feitas + " de " + d.total + " feitas \u00b7 " + d.pontos + " pontos</p>" +
        (URL_ ? "<p>O progresso \u00e9 enviado sozinho enquanto voc\u00ea estuda.</p>" : "<p>O envio para o professor ainda n\u00e3o foi ativado. Seu progresso fica salvo neste aparelho.</p>") : "") +
      '<div class="pt-row">' + (d && URL_ ? '<button class="pt-btn" id="pt-s" type="button">Enviar agora</button>' : "") +
      '<a class="pt-btn sec" href="' + esc(BASE + "meu-personagem/") + '">Meu personagem</a>' +
      '<a class="pt-btn sec" href="' + esc(BASE) + '">P\u00e1gina inicial</a>' +
      '<button class="pt-btn sec" id="pt-out" type="button">Sair</button></div>' +
      '<div class="pt-msg" role="status"></div>' + (d && URL_ ? '<label class="pt-opt"><input type="checkbox" id="pt-ver-rank"' + (verRanking() ? " checked" : "") + '> Mostrar o ranking da turma</label>' + (verRanking() ? '<ol class="pt-rank" aria-label="Ranking da turma"></ol>' : "") : "");
    box.querySelector("#pt-x").onclick = fechar;
    var s = box.querySelector("#pt-s");
    if (s) s.onclick = function () { bmsg("Enviando\u2026"); enviar(dados()).then(function (r) { bmsg(r.ok ? "Progresso salvo." : r.erro || "Falha no envio.", r.ok ? "good" : "bad"); if (r.ok) ranking(); }); };
    box.querySelector("#pt-out").onclick = function () {
      perfil = null; try { localStorage.removeItem(PKEY); } catch (e) {}
      if (window.A11Y_AP) window.A11Y_AP.recarregar();
      fechar(); avisar(); mostrarEntrada();
    };
    var cb = box.querySelector("#pt-ver-rank");
    if (cb) cb.onchange = function () { try { localStorage.setItem("pt:ranking", cb.checked ? "1" : "0"); } catch (e) {} painel(); };
    ranking();
    try { window.dispatchEvent(new CustomEvent("painel:aberto")); } catch (e) {}
  }

  // O estudante escolhe se quer ver o ranking (algumas pessoas preferem comparar só consigo mesmas).
  function verRanking() { try { return localStorage.getItem("pt:ranking") !== "0"; } catch (e) { return true; } }
  function ranking() {
    var ol = box.querySelector(".pt-rank");
    if (!ol || !URL_ || !perfil) return;
    fetch(URL_ + (URL_.indexOf("?") >= 0 ? "&" : "?") + "disciplina=" + encodeURIComponent(ID) + "&turma=" + encodeURIComponent(perfil.turma))
      .then(function (r) { return r.json(); })
      .then(function (v) {
        if (!v.ok || !v.lista || !v.lista.length) return;
        ol.innerHTML = v.lista.slice(0, 15).map(function (x, i) {
          var eu = String(x.apelido).toLowerCase() === perfil.apelido.toLowerCase();
          return '<li class="' + (eu ? "me" : "") + '"><span>' + (i + 1) + "\u00ba " + esc(x.apelido) + "</span><span>" + x.pontos + " pts</span></li>";
        }).join("");
        ol.insertAdjacentHTML("beforebegin", "<h4>Ranking da turma</h4>");
      })
      .catch(function () {});
  }

  function abrir() { box.hidden = false; box.style.display = ""; fab.setAttribute("aria-expanded", "true"); painel(); var f = box.querySelector("a,button"); if (f) f.focus(); }
  function fechar() { box.hidden = true; box.style.display = "none"; fab.setAttribute("aria-expanded", "false"); }
  fab.onclick = function (ev) { ev.stopPropagation(); box.hidden ? abrir() : fechar(); };
  document.addEventListener("click", function (ev) { if (!box.hidden && !box.contains(ev.target) && ev.target !== fab && !fab.contains(ev.target)) fechar(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) { fechar(); fab.focus(); } });

  /* ---------- envio autom\u00e1tico do progresso ---------- */
  var timer = null;
  window.progressoMudou = function () {
    if (!URL_ || !perfil || !DADOS) return;
    clearTimeout(timer);
    timer = setTimeout(function () { timer = null; enviar(dados()); }, 4000);
  };
  window.addEventListener("pagehide", function () {
    if (!URL_ || !perfil || !DADOS || !timer) return;
    try { navigator.sendBeacon(URL_, JSON.stringify(corpo(dados()))); } catch (e) {}
  });

  // Para a p\u00e1gina inicial organizar as disciplinas pelo curso do aluno
  window.PORTAL_ALUNO = { perfil: function () { return perfil; }, liberada: liberada, nomes: NOMES_PASTAS, cursos: CURSOS, entrar: mostrarEntrada };

  // Quem entrou quando o envio ainda n\u00e3o estava ligado \u00e9 cadastrado na planilha agora (uma vez por visita).
  function sincronizar() {
    if (!URL_ || !perfil) return;
    try { if (sessionStorage.getItem("pt-sync") === perfil.id) return; } catch (e) {}
    enviar(DADOS ? dados() : { feitas: 0, total: 0, pontos: 0 }).then(function (r) {
      if (r && r.ok) { try { sessionStorage.setItem("pt-sync", perfil.id); } catch (e) {} }
    });
  }

  if (perfil) { paintFab(); esconderEntrada(); sincronizar(); guarda(); }
  else if (LIVRE) { root.classList.remove("pt-gate"); }
  else { mostrarEntrada(); }
  avisar();

  // Play nos Estudos: carrega o rob\u00f4 Bit (n\u00edvel, XP e conquistas) em todas as p\u00e1ginas.
  if (BASE && !window.JOGO && !document.querySelector('script[src*="jogo/jogo.js"]')) {
    var sj = document.createElement("script");
    sj.src = BASE + "jogo/jogo.js";
    document.body.appendChild(sj);
  }
})();
