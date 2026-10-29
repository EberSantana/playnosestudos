/* Meu visual · Prof. Eber Santana
 * Cada estudante escolhe cores, tamanho da letra, espaçamento e fonte. A escolha fica salva
 * para ele (no aparelho, ligada ao login) e vale em todas as páginas do portal.
 * Todas as paletas têm contraste de texto de pelo menos 4,5:1 (WCAG 2.1 AA / e-MAG);
 * o "Alto contraste" passa de 7:1 (AAA).
 *
 * Páginas que aceitam troca de cores têm o atributo data-a11y-cores no <html>.
 * Nas demais, valem tamanho, espaçamento, fonte, movimento e links.
 */
(function () {
  "use strict";

  /* ordem: bg, panel, ink, ink2, muted, line, accent, accentInk, accentSoft, side, sideInk,
            ok, okSoft, bad, badSoft, warn, warnSoft, blue, focus */
  var CHAVES = ["bg", "panel", "ink", "ink2", "muted", "line", "accent", "accentInk", "accentSoft", "side", "sideInk",
    "ok", "okSoft", "bad", "badSoft", "warn", "warnSoft", "blue", "focus"];
  var OKL = ["#1B6B45", "#DDF0E4", "#A8321F", "#F8E0DB", "#8A5A00", "#FBEFD0", "#1F5F99", "#0B6BCB"];
  var OKD = ["#63C48F", "#123425", "#F08A7C", "#3A1D19", "#E6B450", "#3A2F12", "#7FB0E0", "#7FB5F5"];
  function junta(a, b) { return a.concat(b); }

  var TEMAS = {
    padrao: { nome: "Padrão IFS", desc: "Verde institucional, o visual original.",
      claro: junta(["#EEF2F0", "#FFFFFF", "#16261C", "#3F4F5B", "#5B6871", "#D5DDDA", "#1F5135", "#FFFFFF", "#E3EEE7", "#16261C", "#DCE5EA"], ["#25724A", "#DDF0E4", "#AE3A30", "#F6DEDB", "#8A5A00", "#FBEFD0", "#2A5C8C", "#0B6BCB"]),
      escuro: junta(["#0F171D", "#16222B", "#E4ECEF", "#B8C6CD", "#8699A4", "#2A3A45", "#6BAA68", "#12241A", "#1A2D20", "#0B140E", "#DCE5EA"], OKD) },
    verde: { nome: "Verde Comunidade", desc: "Tons calmos de verde-azulado, bons para estudar por mais tempo.",
      claro: junta(["#F3F7F6", "#FFFFFF", "#0F2A27", "#34504B", "#4F5E5A", "#D3E1DE", "#0D6D66", "#FFFFFF", "#DCEFEC", "#0F2A27", "#DCEFEC"], OKL),
      escuro: junta(["#0B1917", "#11272A", "#E3F1EE", "#B5CBC7", "#93ADA8", "#24403F", "#5FC4B8", "#06201D", "#143532", "#07110F", "#DCEFEC"], OKD) },
    azul: { nome: "Azul Institucional", desc: "Azul nítido e sério. Azul e amarelo se distinguem bem no daltonismo.",
      claro: junta(["#F5F7FB", "#FFFFFF", "#0F172A", "#374360", "#525C73", "#D9DFEC", "#1D4ED8", "#FFFFFF", "#E2EAFD", "#0F172A", "#DDE5FB"], OKL),
      escuro: junta(["#0B1020", "#121A30", "#E6EBFA", "#B8C2E0", "#95A1C4", "#26304F", "#8DAEFF", "#0B1020", "#1A2750", "#070B17", "#DDE5FB"], OKD) },
    terracota: { nome: "Terracota Editorial", desc: "Tons quentes e acolhedores, com cara de revista.",
      claro: junta(["#FAF7F2", "#FFFFFF", "#1C1917", "#44403C", "#625B52", "#E7DFD3", "#B23A0B", "#FFFFFF", "#FBE9DC", "#1C1917", "#F5E6DA"], OKL),
      escuro: junta(["#171310", "#211B17", "#F3EBE3", "#D2C6BA", "#A89B8E", "#3A312A", "#F0955F", "#1C1108", "#3A2418", "#0E0B09", "#F5E6DA"], OKD) },
    rosa: { nome: "Rosa Aurora", desc: "Rosa vibrante com fundo suave e acolhedor.",
      claro: junta(["#FDF5F8", "#FFFFFF", "#2A1220", "#5A3347", "#6B4A5C", "#F0D5E0", "#B0246B", "#FFFFFF", "#FBE3EE", "#2A1220", "#FBE3EE"], OKL),
      escuro: junta(["#1C0F16", "#2A1822", "#FBEAF2", "#E3C3D3", "#BE97AC", "#4A2C3B", "#F58DB8", "#2A0A18", "#3D1D2E", "#12080E", "#FBE3EE"], OKD) },
    lilas: { nome: "Lilás Sonho", desc: "Lilás e violeta, calmo e criativo.",
      claro: junta(["#F8F5FD", "#FFFFFF", "#1E1433", "#4A3F6B", "#5F5680", "#DDD5F0", "#6D3FC4", "#FFFFFF", "#EAE0FB", "#1E1433", "#EAE0FB"], OKL),
      escuro: junta(["#140F22", "#1E1833", "#EEE8FB", "#CBC1EA", "#A89CD0", "#342B54", "#B79BFF", "#1A0F36", "#2E2350", "#0C0816", "#EAE0FB"], OKD) },
    creme: { nome: "Creme Leitura", desc: "Fundo creme, sem o branco forte da tela, para cansar menos a vista.",
      claro: junta(["#F6F0E3", "#FFFBF2", "#2B2A26", "#46433C", "#5E5A50", "#E0D6C0", "#2F6B57", "#FFFFFF", "#E3EDDD", "#2B2A26", "#F1E9D6"], OKL),
      escuro: junta(["#1A1914", "#23221B", "#EFE8D8", "#CFC8B6", "#A7A08E", "#3A382D", "#8CC6A8", "#10201A", "#28392F", "#100F0B", "#EFE8D8"], OKD) },
    contraste: { nome: "Alto contraste", desc: "Contraste máximo (acima de 7:1), para baixa visão.",
      claro: ["#FFFFFF", "#FFFFFF", "#000000", "#000000", "#1F1F1F", "#000000", "#0033CC", "#FFFFFF", "#E6ECFF", "#000000", "#FFFFFF", "#005A2B", "#E3F5EA", "#8F0000", "#FBE3E3", "#6B4600", "#FFF3D1", "#00338F", "#0000FF"],
      escuro: ["#000000", "#000000", "#FFFFFF", "#FFFFFF", "#E0E0E0", "#FFFFFF", "#FFD400", "#000000", "#1A1A00", "#000000", "#FFFFFF", "#4DFF9A", "#002B14", "#FF8A80", "#330000", "#FFD400", "#332B00", "#8FC1FF", "#FFD400"] }
  };
  var ORDEM = ["padrao", "verde", "azul", "terracota", "rosa", "lilas", "creme", "contraste"];
  var PADRAO = { tema: "padrao", modo: "auto", tam: 100, esp: "normal", fonte: "padrao", mov: "auto", links: "nao" };
  var TAMANHOS = [[100, "Normal"], [115, "Grande"], [130, "Maior"], [150, "Máximo"]];

  if (typeof module !== "undefined" && module.exports) { module.exports = { TEMAS: TEMAS, CHAVES: CHAVES, ORDEM: ORDEM }; return; }

  var d = document, root = d.documentElement, ls = null;
  try { ls = window.localStorage; } catch (e) { ls = null; }
  function lerLS(k) { try { return ls ? ls.getItem(k) : null; } catch (e) { return null; } }
  function gravarLS(k, v) { try { if (ls) ls.setItem(k, v); } catch (e) { /* sem armazenamento: vale só nesta visita */ } }

  function perfil() { try { var p = JSON.parse(lerLS("perfil:aluno") || "null"); return p && p.id ? p : null; } catch (e) { return null; } }
  function chave() { var p = perfil(); return "a11y-aparencia" + (p ? ":" + p.id : ""); }
  function mescla(o) {
    var r = {}, k;
    for (k in PADRAO) r[k] = PADRAO[k];
    if (o && typeof o === "object") for (k in PADRAO) if (o[k] !== undefined) r[k] = o[k];
    if (!TEMAS[r.tema]) r.tema = "padrao";
    r.tam = [100, 115, 130, 150].indexOf(+r.tam) >= 0 ? +r.tam : 100;
    return r;
  }
  function ler() { var v = lerLS(chave()); try { return mescla(v ? JSON.parse(v) : null); } catch (e) { return mescla(null); } }
  function salvar() { gravarLS(chave(), JSON.stringify(P)); }

  var P = ler();
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function esquema() { return P.modo === "claro" ? "claro" : P.modo === "escuro" ? "escuro" : (mq && mq.matches ? "escuro" : "claro"); }

  /* ---------- CSS ---------- */
  function cssTemas() {
    var out = "";
    ORDEM.forEach(function (t) {
      ["claro", "escuro"].forEach(function (e) {
        var v = TEMAS[t][e], s = "html[data-a11y-pintar][data-a11y-tema=\"" + t + "\"][data-a11y-esq=\"" + e + "\"]{";
        var m = {};
        CHAVES.forEach(function (k, i) { m[k] = v[i]; });
        s += "--bg:" + m.bg + ";--panel:" + m.panel + ";--surface:" + m.panel + ";--surface-2:" + m.bg + ";--panel-2:" + m.bg +
          ";--ink:" + m.ink + ";--ink-2:" + m.ink2 + ";--ink-soft:" + m.ink2 + ";--muted:" + m.muted + ";--ink-3:" + m.muted + ";--line:" + m.line + ";--line-soft:" + m.line + ";--panel-line:" + m.line +
          ";--accent:" + m.accent + ";--accent-ink:" + m.accentInk + ";--accent-soft:" + m.accentSoft + ";--side:" + m.side + ";--side-ink:" + m.sideInk +
          ";--ok:" + m.ok + ";--ok-soft:" + m.okSoft + ";--bad:" + m.bad + ";--bad-soft:" + m.badSoft + ";--warn:" + m.warn + ";--warn-soft:" + m.warnSoft + ";--blue:" + m.blue +
          ";color-scheme:" + (e === "escuro" ? "dark" : "light") + "}";
        s += "html[data-a11y-tema=\"" + t + "\"][data-a11y-esq=\"" + e + "\"]{--a11y-focus:" + m.focus + "}";
        out += s;
      });
    });
    return out;
  }
  var CSS = cssTemas() +
    "html[data-a11y-pintar] body{background:var(--bg);color:var(--ink)}" +
    "html[data-a11y-zoom=\"115\"]{zoom:1.15}html[data-a11y-zoom=\"130\"]{zoom:1.3}html[data-a11y-zoom=\"150\"]{zoom:1.5}" +
    "html[data-a11y-esp=amplo] :is(p,li,td,th,dd,dt,label,blockquote,figcaption,summary,small,h1,h2,h3,h4,h5,h6){line-height:1.8!important}" +
    "html[data-a11y-esp=amplo] :is(body,p,li,td,th,dd,dt,label,a,span,div,small,button,h1,h2,h3,h4,h5,h6):not(pre):not(code):not(.term):not(.cmd):not(.mono):not(kbd):not(samp){letter-spacing:.03em!important;word-spacing:.12em!important}" +
    "html[data-a11y-esp=amplo] :is(p,li,dd,blockquote){margin-bottom:.9em}" +
    "html[data-a11y-fonte=leitura] :is(body,p,li,td,th,dd,dt,label,a,span,div,small,em,strong,b,button,input,select,textarea,summary,h1,h2,h3,h4,h5,h6):not(pre):not(code):not(.term):not(.cmd):not(.mono):not(kbd):not(samp){font-family:\"Atkinson Hyperlegible\",\"Segoe UI\",system-ui,sans-serif!important}" +
    "html[data-a11y-mov=reduzir] *,html[data-a11y-mov=reduzir] *::before,html[data-a11y-mov=reduzir] *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}" +
    "html[data-a11y-links=sim] :is(a:not([class]),p a,li a,td a,footer a){text-decoration:underline!important;text-underline-offset:.15em}" +
    /* interface do painel (cores próprias, não dependem do tema da página) */
    ".a11y-ap-btn,.a11y-ap,.a11y-ap-dica{--u-bg:#FFFFFF;--u-ink:#16261C;--u-ink2:#3F4F5B;--u-line:#8FA39A;--u-acc:#1F5135;--u-acc-ink:#FFFFFF;--u-soft:#E3EEE7;--u-focus:#0B6BCB}" +
    "html[data-a11y-esq=escuro] :is(.a11y-ap-btn,.a11y-ap,.a11y-ap-dica){--u-bg:#16222B;--u-ink:#E4ECEF;--u-ink2:#B8C6CD;--u-line:#5C7280;--u-acc:#6BAA68;--u-acc-ink:#0B140E;--u-soft:#1F3328;--u-focus:#7FB5F5}" +
    ".a11y-ap-btn{position:fixed;left:16px;bottom:16px;z-index:9997;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;border:2px solid var(--u-acc);background:var(--u-bg);color:var(--u-ink);font:600 15px/1 system-ui,-apple-system,'Segoe UI',sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.22)}" +
    ".a11y-ap-btn svg{flex:none}.a11y-ap-btn:hover{background:var(--u-soft)}" +
    ".a11y-ap-btn:focus-visible,.a11y-ap :is(button,input,summary):focus-visible,.a11y-ap-dica button:focus-visible{outline:3px solid var(--u-focus)!important;outline-offset:2px}" +
    ".a11y-ap{position:fixed;left:16px;bottom:72px;z-index:9999;width:min(94vw,400px);max-height:min(82vh,720px);overflow:auto;background:var(--u-bg);color:var(--u-ink);border:2px solid var(--u-acc);border-radius:16px;padding:18px;box-shadow:0 16px 48px rgba(0,0,0,.35);font:16px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;text-align:left}" +
    ".a11y-ap[hidden],.a11y-ap-dica[hidden]{display:none}" +
    ".a11y-ap h2{font:700 20px/1.25 system-ui,-apple-system,'Segoe UI',sans-serif;margin:0 0 4px;color:var(--u-ink);letter-spacing:0;word-spacing:0}" +
    ".a11y-ap h2:focus{outline:none}.a11y-ap p{margin:0 0 12px;color:var(--u-ink2);font-size:14.5px;letter-spacing:0;word-spacing:0;line-height:1.5}" +
    ".a11y-ap fieldset{border:0;margin:0 0 14px;padding:0;min-width:0}.a11y-ap legend{font-weight:700;font-size:15px;padding:0;margin-bottom:8px;color:var(--u-ink)}" +
    ".a11y-temas{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    ".a11y-op{position:relative;display:block;cursor:pointer;border:2px solid var(--u-line);border-radius:12px;padding:10px;background:var(--u-bg);min-height:44px}" +
    ".a11y-op input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer;width:100%;height:100%}" +
    ".a11y-op:has(input:checked){border-color:var(--u-acc);background:var(--u-soft);box-shadow:inset 0 0 0 1px var(--u-acc)}" +
    ".a11y-op:has(input:focus-visible){outline:3px solid var(--u-focus);outline-offset:2px}" +
    ".a11y-op b{display:block;font-size:14.5px;line-height:1.25;color:var(--u-ink);letter-spacing:0;word-spacing:0}" +
    ".a11y-op small{display:block;font-size:12.5px;line-height:1.35;color:var(--u-ink2);margin-top:3px;letter-spacing:0;word-spacing:0}" +
    ".a11y-op .ck{display:none;position:absolute;right:8px;top:6px;font-weight:700;color:var(--u-acc)}.a11y-op:has(input:checked) .ck{display:block}" +
    ".a11y-sw{display:flex;gap:4px;margin-bottom:6px}.a11y-sw i{width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,0,0,.45);display:block}" +
    ".a11y-seg{display:flex;flex-wrap:wrap;gap:6px}.a11y-seg .a11y-op{flex:1 1 auto;padding:8px 12px;text-align:center;border-radius:10px}" +
    ".a11y-seg .a11y-op b{font-size:14px}.a11y-seg .a11y-op .ck{display:none!important}" +
    ".a11y-chk{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;cursor:pointer;min-height:24px}.a11y-chk input{width:22px;height:22px;flex:none;margin:1px 0 0;accent-color:var(--u-acc)}" +
    ".a11y-chk span{font-size:15px;line-height:1.4;color:var(--u-ink);letter-spacing:0;word-spacing:0}" +
    ".a11y-acoes{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}.a11y-acoes button,.a11y-dica-acoes button{min-height:44px;padding:0 16px;border-radius:10px;border:2px solid var(--u-acc);background:var(--u-acc);color:var(--u-acc-ink);font:600 15px/1 system-ui,-apple-system,'Segoe UI',sans-serif;cursor:pointer}" +
    ".a11y-acoes button.sec,.a11y-dica-acoes button.sec{background:var(--u-bg);color:var(--u-ink)}" +
    ".a11y-ap-dica{position:fixed;left:16px;bottom:72px;z-index:9996;width:min(94vw,340px);background:var(--u-bg);color:var(--u-ink);border:2px solid var(--u-acc);border-radius:14px;padding:14px 16px;box-shadow:0 10px 32px rgba(0,0,0,.3);font:15px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif}" +
    ".a11y-ap-dica p{margin:0 0 10px;letter-spacing:0;word-spacing:0}.a11y-dica-acoes{display:flex;gap:8px;flex-wrap:wrap}" +
    ".a11y-estado{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
    "@media (max-width:480px){.a11y-ap{left:8px;right:8px;width:auto;bottom:68px}.a11y-ap-btn{left:8px;bottom:8px}.a11y-ap-dica{left:8px;right:8px;width:auto}}";

  var estilo = d.createElement("style");
  estilo.setAttribute("data-a11y-tema", "");
  estilo.appendChild(d.createTextNode(CSS));
  (d.head || root).appendChild(estilo);

  /* ---------- aplicar ---------- */
  var fonteCarregada = false;
  var aplicar = function () {
    var e = esquema(), pinta = root.hasAttribute("data-a11y-cores") && !(P.tema === "padrao" && P.modo === "auto");
    root.setAttribute("data-a11y-tema", P.tema);
    root.setAttribute("data-a11y-esq", e);
    if (pinta) root.setAttribute("data-a11y-pintar", ""); else root.removeAttribute("data-a11y-pintar");
    if (P.tam !== 100) root.setAttribute("data-a11y-zoom", String(P.tam)); else root.removeAttribute("data-a11y-zoom");
    root.setAttribute("data-a11y-esp", P.esp);
    root.setAttribute("data-a11y-fonte", P.fonte);
    root.setAttribute("data-a11y-mov", P.mov === "reduzir" ? "reduzir" : "auto");
    root.setAttribute("data-a11y-links", P.links);
    root.style.setProperty("--a11y-focus", TEMAS[P.tema][e][18]);
    if (P.fonte === "leitura" && !fonteCarregada && d.head) {
      fonteCarregada = true;
      var l = d.createElement("link"); l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap";
      d.head.appendChild(l);
    }
  };
  /* Quando o aluno força claro ou escuro, as regras @media (prefers-color-scheme) das páginas
     passam a obedecer à escolha dele (e não ao sistema). Cada regra guarda o texto original. */
  function emularEsquema() {
    var forca = P.modo === "claro" || P.modo === "escuro";
    var sim = "(min-width:0px)", nao = "(max-width:0px)";
    function trata(regra) {
      if (!regra.media || regra.type !== 4) return;
      var orig = regra.__a11yMedia;
      if (orig === undefined) {
        orig = regra.media.mediaText;
        if (!/prefers-color-scheme/.test(orig)) { regra.__a11yMedia = null; return; }
        regra.__a11yMedia = orig;
      }
      if (orig === null) return;
      var novo = orig;
      if (forca) {
        novo = orig.replace(/\(\s*prefers-color-scheme\s*:\s*dark\s*\)/g, P.modo === "escuro" ? sim : nao)
                   .replace(/\(\s*prefers-color-scheme\s*:\s*light\s*\)/g, P.modo === "claro" ? sim : nao);
      }
      try { if (regra.media.mediaText !== novo) regra.media.mediaText = novo; } catch (e) { /* ignora */ }
    }
    function varre(lista) {
      for (var i = 0; i < lista.length; i++) {
        var r = lista[i];
        if (r.type === 4) trata(r);
        if (r.cssRules && r.type !== 1) varre(r.cssRules);
      }
    }
    for (var i = 0; i < d.styleSheets.length; i++) {
      var f; try { f = d.styleSheets[i].cssRules; } catch (e) { continue; }
      if (f) varre(f);
    }
  }
  var _aplicar = aplicar;
  aplicar = function () { _aplicar(); emularEsquema(); };
  aplicar();
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", emularEsquema);
  window.addEventListener("load", emularEsquema);
  if (mq && mq.addEventListener) mq.addEventListener("change", function () { if (P.modo === "auto") aplicar(); });

  /* ---------- interface ---------- */
  var btn, painel, dica, ultimoFoco = null, estadoEl;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function nomeAluno() { var p = perfil(); if (!p) return ""; var n = (p.apelido || p.nome || "").trim().split(/\s+/)[0]; return n; }

  function radio(nome, valor, rotulo, marcado, extra) {
    return '<label class="a11y-op"><input type="radio" name="' + nome + '" value="' + valor + '"' + (marcado ? " checked" : "") + ">" + (extra || "<b>" + rotulo + "</b>") + "</label>";
  }
  function corpo() {
    var e = esquema(), n = nomeAluno();
    var h = '<h2 id="a11y-ap-t" tabindex="-1">' + (n ? "Visual de " + esc(n) : "Meu visual") + "</h2>" +
      "<p>Escolha o que deixa o estudo mais confortável para você. " + (n ? "Fica salvo na sua conta neste aparelho." : "Fica salvo neste aparelho.") + "</p>";
    h += '<fieldset><legend>Cores</legend><div class="a11y-temas">' + ORDEM.map(function (t) {
      var v = TEMAS[t][e], sw = '<span class="a11y-sw" aria-hidden="true"><i style="background:' + v[0] + '"></i><i style="background:' + v[6] + '"></i><i style="background:' + v[2] + '"></i></span>';
      return radio("a11y-tema", t, "", P.tema === t, sw + "<b>" + esc(TEMAS[t].nome) + '</b><small>' + esc(TEMAS[t].desc) + '</small><span class="ck" aria-hidden="true">✓</span>');
    }).join("") + "</div></fieldset>";
    h += '<fieldset><legend>Claro ou escuro</legend><div class="a11y-seg">' + radio("a11y-modo", "auto", "Automático", P.modo === "auto") + radio("a11y-modo", "claro", "Claro", P.modo === "claro") + radio("a11y-modo", "escuro", "Escuro", P.modo === "escuro") + "</div></fieldset>";
    h += '<fieldset><legend>Tamanho da letra</legend><div class="a11y-seg">' + TAMANHOS.map(function (t) { return radio("a11y-tam", t[0], t[1], P.tam === t[0]); }).join("") + "</div></fieldset>";
    h += '<fieldset><legend>Espaço entre linhas e letras</legend><div class="a11y-seg">' + radio("a11y-esp", "normal", "Normal", P.esp === "normal") + radio("a11y-esp", "amplo", "Amplo", P.esp === "amplo") + "</div></fieldset>";
    h += '<fieldset><legend>Fonte</legend><div class="a11y-seg">' + radio("a11y-fonte", "padrao", "Padrão", P.fonte === "padrao") + radio("a11y-fonte", "leitura", "Leitura fácil", P.fonte === "leitura") + "</div></fieldset>";
    h += '<label class="a11y-chk"><input type="checkbox" id="a11y-mov"' + (P.mov === "reduzir" ? " checked" : "") + '><span>Reduzir animações e movimentos</span></label>';
    h += '<label class="a11y-chk"><input type="checkbox" id="a11y-links"' + (P.links === "sim" ? " checked" : "") + '><span>Sublinhar todos os links</span></label>';
    h += '<div class="a11y-acoes"><button type="button" id="a11y-fechar">Pronto</button><button type="button" class="sec" id="a11y-reset">Restaurar padrão</button></div>';
    h += '<p style="margin:12px 0 0;font-size:13px" id="a11y-nota"></p>';
    return h;
  }
  function nota() {
    var el = painel && painel.querySelector("#a11y-nota");
    if (!el) return;
    var cores = root.hasAttribute("data-a11y-cores");
    el.textContent = cores ? "" : "Esta página tem cores próprias e mantém as cores originais. Tamanho, espaçamento, fonte e movimento valem aqui também.";
  }
  function anuncia(t) { if (estadoEl) estadoEl.textContent = t; }
  function resumo() {
    var m = P.modo === "auto" ? "automático" : P.modo;
    return "Visual: " + TEMAS[P.tema].nome + ", modo " + m + ", letra " + P.tam + "%.";
  }
  function ligar() {
    painel.addEventListener("change", function (ev) {
      var t = ev.target;
      if (t.name === "a11y-tema") P.tema = t.value;
      else if (t.name === "a11y-modo") P.modo = t.value;
      else if (t.name === "a11y-tam") P.tam = +t.value;
      else if (t.name === "a11y-esp") P.esp = t.value;
      else if (t.name === "a11y-fonte") P.fonte = t.value;
      else if (t.id === "a11y-mov") P.mov = t.checked ? "reduzir" : "auto";
      else if (t.id === "a11y-links") P.links = t.checked ? "sim" : "nao";
      salvar(); aplicar(); anuncia(resumo());
      if (t.name === "a11y-modo" || t.name === "a11y-tema") atualizarAmostras();
    });
    painel.querySelector("#a11y-fechar").onclick = fechar;
    painel.querySelector("#a11y-reset").onclick = function () { P = mescla(null); salvar(); aplicar(); renderPainel(); anuncia("Visual restaurado para o padrão."); var r = painel.querySelector("#a11y-fechar"); if (r) r.focus(); };
  }
  function atualizarAmostras() {
    var e = esquema(), sw = painel.querySelectorAll(".a11y-op"), i = 0;
    ORDEM.forEach(function (t) {
      var op = painel.querySelectorAll('input[name="a11y-tema"]')[i++]; if (!op) return;
      var is = op.parentNode.querySelectorAll(".a11y-sw i"), v = TEMAS[t][e];
      if (is.length === 3) { is[0].style.background = v[0]; is[1].style.background = v[6]; is[2].style.background = v[2]; }
    });
    void sw;
  }
  function renderPainel() { painel.innerHTML = corpo(); ligar(); nota(); }
  function abrir() {
    fecharDica(true);
    renderPainel();
    painel.hidden = false; btn.setAttribute("aria-expanded", "true");
    ultimoFoco = d.activeElement;
    var t = painel.querySelector("#a11y-ap-t"); if (t) t.focus();
  }
  function fechar() {
    if (painel.hidden) return;
    painel.hidden = true; btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }
  function fecharDica(semSalvar) {
    if (!dica || dica.hidden) return;
    dica.hidden = true;
    if (!semSalvar) return;
    var p = perfil(); if (p) gravarLS("a11y-aparencia-visto:" + p.id, "1");
  }
  function mostrarDica() {
    var p = perfil();
    if (!p || lerLS("a11y-aparencia:" + p.id) || lerLS("a11y-aparencia-visto:" + p.id)) return;
    if (!dica) {
      dica = d.createElement("div"); dica.className = "a11y-ap-dica"; dica.setAttribute("role", "region"); dica.setAttribute("aria-label", "Personalizar o visual"); dica.hidden = true;
      d.body.appendChild(dica);
    }
    dica.innerHTML = "<p><b>" + esc(nomeAluno() || "Olá") + "</b>, quer deixar o portal do seu jeito? Escolha cores, tamanho de letra e mais.</p>" +
      '<div class="a11y-dica-acoes"><button type="button" id="a11y-d-sim">Personalizar</button><button type="button" class="sec" id="a11y-d-nao">Agora não</button></div>';
    dica.querySelector("#a11y-d-sim").onclick = function () { fecharDica(true); abrir(); };
    dica.querySelector("#a11y-d-nao").onclick = function () { fecharDica(true); };
    dica.hidden = false;
  }
  function montar() {
    if (!d.body || d.querySelector(".a11y-ap-btn")) return;
    btn = d.createElement("button"); btn.type = "button"; btn.className = "a11y-ap-btn";
    btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15.5" cy="7.5" r="1"/></svg><span>Aparência</span>';
    btn.onclick = function () { if (painel.hidden) abrir(); else fechar(); };
    painel = d.createElement("div"); painel.className = "a11y-ap"; painel.setAttribute("role", "dialog"); painel.setAttribute("aria-labelledby", "a11y-ap-t"); painel.hidden = true;
    estadoEl = d.createElement("div"); estadoEl.className = "a11y-estado"; estadoEl.setAttribute("role", "status"); estadoEl.setAttribute("aria-live", "polite");
    d.body.appendChild(btn); d.body.appendChild(painel); d.body.appendChild(estadoEl);
    d.addEventListener("keydown", function (ev) {
      if (painel.hidden) return;
      if (ev.key === "Escape") { ev.preventDefault(); fechar(); return; }
      if (ev.key === "Tab") { /* mantém o foco dentro do painel enquanto ele está aberto */
        var f = [].slice.call(painel.querySelectorAll("input,button")).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
        f.unshift(btn);
        if (!f.length) return;
        var i = f.indexOf(d.activeElement);
        if (ev.shiftKey && (i <= 0)) { ev.preventDefault(); f[f.length - 1].focus(); }
        else if (!ev.shiftKey && (i === f.length - 1)) { ev.preventDefault(); f[0].focus(); }
      }
    });
    setTimeout(mostrarDica, 1500);
  }

  function recarregar() { P = ler(); aplicar(); if (painel && !painel.hidden) renderPainel(); if (dica) dica.hidden = true; setTimeout(mostrarDica, 800); }
  window.A11Y_AP = { recarregar: recarregar, abrir: function () { if (painel) abrir(); }, estado: function () { return mescla(P); } };

  if (d.readyState !== "loading") montar(); else d.addEventListener("DOMContentLoaded", montar);
})();
