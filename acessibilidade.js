/* Acessibilidade compartilhada · Prof. Eber Santana
 * Carregado em todas as páginas do portal. Faz cinco coisas, sem alterar o visual:
 *  1. Link "Pular para o conteúdo" (aparece ao apertar Tab).
 *  2. VLibras (tradução para Libras), carregado do serviço oficial do governo federal.
 *  3. Respeita "reduzir movimento" do sistema e garante um anel de foco visível.
 *  4. Dá foco de teclado (Tab, Enter e Espaço) a elementos que só respondiam ao mouse.
 *  5. Garante o idioma (pt-BR) da página.
 *
 * Para desligar o VLibras em uma página, defina antes deste script:
 *   window.A11Y_SEM_VLIBRAS = true;
 */
(function () {
  if (window.__a11yOk) return;
  window.__a11yOk = true;
  var d = document;

  function pronto(fn) {
    if (d.readyState !== "loading") fn(); else d.addEventListener("DOMContentLoaded", fn);
  }

  /* 1 e 3: estilos */
  var css =
    ".a11y-skip{position:fixed;left:12px;top:-80px;z-index:100001;background:#fff;color:#16261C;padding:10px 16px;" +
    "border-radius:8px;font:600 16px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;text-decoration:none;" +
    "box-shadow:0 0 0 3px #1F5135,0 8px 20px rgba(0,0,0,.3);transition:top .15s}" +
    ".a11y-skip:focus{top:12px;outline:none}" +
    ".a11y-vh{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}" +
    ":where(a,button,input,select,textarea,summary,[tabindex]):focus-visible{outline:3px solid var(--a11y-focus,#0B6BCB);outline-offset:2px}" +
    "[data-a11y-kb]:focus-visible{outline:3px solid var(--a11y-focus,#0B6BCB);outline-offset:2px}" +
    "@media (prefers-color-scheme:dark){:where(a,button,input,select,textarea,summary,[tabindex]):focus-visible,[data-a11y-kb]:focus-visible{outline-color:var(--a11y-focus,#7FB5F5)}}" +
    "@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;" +
    "animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}";
  var st = d.createElement("style");
  st.setAttribute("data-a11y", "");
  st.appendChild(d.createTextNode(css));
  (d.head || d.documentElement).appendChild(st);

  pronto(function () {
    /* 5: idioma */
    if (!d.documentElement.getAttribute("lang")) d.documentElement.setAttribute("lang", "pt-BR");

    /* 1: pular para o conteúdo */
    var alvo = d.querySelector("main, [role=main]") || d.querySelector("h1");
    if (alvo && d.body) {
      if (!alvo.id) alvo.id = "conteudo-principal";
      if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
      var a = d.createElement("a");
      a.className = "a11y-skip";
      a.href = "#" + alvo.id;
      a.textContent = "Pular para o conteúdo";
      a.addEventListener("click", function (ev) {
        ev.preventDefault(); /* não mexe no hash: algumas páginas usam o endereço para navegar */
        alvo.focus();
        if (alvo.scrollIntoView) alvo.scrollIntoView({ block: "start" });
      });
      d.body.insertBefore(a, d.body.firstChild);
    }

    /* 4: teclado em elementos clicáveis que não são botões */
    var SEMFOCO = "a,button,input,select,textarea,summary,[tabindex]";
    function teclado(raiz) {
      var lista = (raiz.querySelectorAll ? raiz.querySelectorAll("[onclick]") : []);
      for (var i = 0; i < lista.length; i++) {
        var e = lista[i];
        if (e.matches(SEMFOCO) || e.closest("a,button") || e.querySelector("a,button,input,select,textarea")) continue;
        e.setAttribute("tabindex", "0");
        e.setAttribute("data-a11y-kb", "1");
        if ((e.tagName === "DIV" || e.tagName === "SPAN") && !e.getAttribute("role")) e.setAttribute("role", "button");
      }
    }
    /* títulos sem saltos de nível (ex.: h1 seguido de h3) e cabeçalhos de tabela vazios: só mudam a leitura por leitor de tela */
    function visivel(e) { return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length); }
    function estrutura() {
      var hs = d.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]"), anterior = 0;
      for (var i = 0; i < hs.length; i++) {
        var h = hs[i];
        if (!visivel(h)) continue;
        var nativo = h.getAttribute("data-a11y-lv") ? 0 : parseInt(h.getAttribute("aria-level") || (/^H[1-6]$/.test(h.tagName) ? h.tagName.charAt(1) : "2"), 10);
        if (h.getAttribute("data-a11y-lv")) { h.removeAttribute("aria-level"); h.removeAttribute("data-a11y-lv"); nativo = /^H[1-6]$/.test(h.tagName) ? parseInt(h.tagName.charAt(1), 10) : 2; }
        if (anterior && nativo > anterior + 1) {
          h.setAttribute("aria-level", String(anterior + 1));
          h.setAttribute("data-a11y-lv", "1");
          nativo = anterior + 1;
        }
        anterior = nativo;
      }
      var ths = d.querySelectorAll("th:empty");
      for (var j = 0; j < ths.length; j++) {
        var sp = d.createElement("span"); sp.className = "a11y-vh"; sp.textContent = "Item"; ths[j].appendChild(sp);
      }
    }
    teclado(d); estrutura();
    var agendado = false;
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (agendado) return;
        agendado = true;
        setTimeout(function () { agendado = false; teclado(d); estrutura(); }, 200);
      }).observe(d.body, { childList: true, subtree: true });
    }
    d.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      var t = ev.target;
      if (t && t.getAttribute && t.getAttribute("data-a11y-kb")) { ev.preventDefault(); t.click(); }
    });

    /* 2: VLibras */
    if (window.A11Y_SEM_VLIBRAS || window.self !== window.top || d.querySelector("[vw]")) return;
    var w = d.createElement("div");
    w.setAttribute("vw", "");
    w.className = "enabled";
    w.innerHTML = '<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    d.body.appendChild(w);
    var s = d.createElement("script");
    s.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    s.async = true;
    s.onload = function () {
      try { new window.VLibras.Widget("https://vlibras.gov.br/app"); } catch (e) { /* sem rede: o portal segue normal */ }
    };
    d.body.appendChild(s);
  });
})();
