
/* =========================
   NAVIGATION TABS
========================= */
function showTab(tabId) {
  let tabs = document.querySelectorAll(".tab");
  tabs.forEach(t => t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
}

/* =========================
   RESULT SYSTEM
========================= */
function showResult(result, details) {
  document.getElementById("result").innerText = result;
  document.getElementById("details").innerHTML = details.join("<br>");

  saveHistory(result, details);
}

/* =========================
   LINK ANALYSIS
========================= */
function analyzeLink() {
  let link = document.getElementById("linkInput").value;
  let score = 0;
  let reasons = [];

  if (!link) {
    showResult("⚠️ Aucun lien", []);
    return;
  }

  if (!link.startsWith("https")) {
    score++;
    reasons.push("❌ Pas de HTTPS");
  }

  let scamWords = ["free", "win", "gift", "login", "verify", "urgent", "password"];

  scamWords.forEach(w => {
    if (link.toLowerCase().includes(w)) {
      score++;
      reasons.push("⚠️ Mot suspect : " + w);
    }
  });

  if (link.length > 60) {
    score++;
    reasons.push("⚠️ Lien trop long");
  }

  let verdict =
    score === 0 ? "🟢 LIEN SÛR" :
    score === 1 ? "🟡 SUSPECT" :
    score === 2 ? "🟠 RISQUE ÉLEVÉ" :
    "🔴 DANGEREUX";

  showResult(verdict, reasons);
}

/* =========================
   PHONE ANALYSIS
========================= */
function analyzePhone() {
  let phone = document.getElementById("phoneInput").value;
  let score = 0;
  let reasons = [];

  if (!phone) {
    showResult("⚠️ Aucun numéro", []);
    return;
  }

  if (phone.length < 8 || phone.length > 15) {
    score++;
    reasons.push("⚠️ Format étrange");
  }

  if (/[^0-9+ ]/.test(phone)) {
    score++;
    reasons.push("⚠️ Caractères invalides");
  }

  if (/(.)\1{4,}/.test(phone)) {
    score++;
    reasons.push("⚠️ Répétition suspecte");
  }

  let verdict =
    score === 0 ? "🟢 NUMÉRO NORMAL" :
    score === 1 ? "🟡 SUSPECT" :
    score === 2 ? "🟠 RISQUE ÉLEVÉ" :
    "🔴 TRÈS SUSPECT";

  showResult(verdict, reasons);
}

/* =========================
   MESSAGE ANALYSIS
========================= */
function analyzeMessage() {
  let msg = document.getElementById("msgInput").value;
  let score = 0;
  let reasons = [];

  if (!msg) {
    showResult("⚠️ Aucun message", []);
    return;
  }

  let scamWords = ["gagné", "argent", "urgent", "clique", "lotterie", "prix", "verifier"];

  scamWords.forEach(w => {
    if (msg.toLowerCase().includes(w)) {
      score++;
      reasons.push("⚠️ Mot suspect : " + w);
    }
  });

  if (msg.includes("http")) {
    score++;
    reasons.push("⚠️ Lien dans le message");
  }

  let verdict =
    score === 0 ? "🟢 MESSAGE NORMAL" :
    score === 1 ? "🟡 SUSPECT" :
    score === 2 ? "🟠 RISQUE ÉLEVÉ" :
    "🔴 ARNAQUE PROBABLE";

  showResult(verdict, reasons);
}

/* =========================
   RESET
========================= */
function resetAll() {
  document.getElementById("linkInput").value = "";
  document.getElementById("phoneInput").value = "";
  document.getElementById("msgInput").value = "";

  document.getElementById("result").innerText = "Résultat";
  document.getElementById("details").innerHTML = "";
}

/* =========================
   COPY RESULT
========================= */
function copyResult() {
  let text = document.getElementById("result").innerText;
  navigator.clipboard.writeText(text);
  alert("Résultat copié !");
}

/* =========================
   HISTORY (LOCAL STORAGE)
========================= */
function saveHistory(result, details) {
  let history = JSON.parse(localStorage.getItem("shield_history")) || [];

  history.unshift({
    result: result,
    details: details,
    date: new Date().toLocaleString()
  });

  history = history.slice(0, 20);

  localStorage.setItem("shield_history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("shield_history")) || [];
  let box = document.getElementById("historyList");

  box.innerHTML = history.map(h =>
    `<p><b>${h.result}</b><br><small>${h.date}</small></p>`
  ).join("");
}

function clearHistory() {
  localStorage.removeItem("shield_history");
  renderHistory();
}

/* INIT */
renderHistory();
