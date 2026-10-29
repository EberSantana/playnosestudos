/* Liga uma apostila ao jogo (XP). Lê o contador "n / total" que a própria apostila já mostra
 * (#progressLabel ou #progTxt) e avisa o portal quando ele muda.
 * Uso na página, antes de ../progresso-turma.js:
 *   <script>window.PROGRESSO_ID = "id-da-apostila-v1";</script>
 *   <script src="../apostila-progresso.js"></script>
 */
(function () {
  "use strict";
  function rotulo() { return document.getElementById("progressLabel") || document.getElementById("progTxt"); }
  function ler() {
    var el = rotulo(), m = el && /(\d+)\s*\/\s*(\d+)/.exec(el.textContent || "");
    return m ? { feitas: +m[1], total: +m[2] } : { feitas: 0, total: 0 };
  }
  window.PROGRESSO_DADOS = function () {
    var p = ler();
    return { feitas: p.feitas, total: p.total, pontos: p.feitas * 10, detalhe: {} };
  };
  var antes = null;
  function avisar() {
    var p = ler(), chave = p.feitas + "/" + p.total;
    if (antes === null) { antes = chave; return; }
    if (chave !== antes) { antes = chave; if (window.progressoMudou) window.progressoMudou(); }
  }
  function ligar() {
    var el = rotulo();
    if (!el) return;
    avisar();
    new MutationObserver(avisar).observe(el, { childList: true, characterData: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ligar); else ligar();
})();
