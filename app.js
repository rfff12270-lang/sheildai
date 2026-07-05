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

function showResult(result, details, score = null, type = "link") {

  document.getElementById("result").innerText = result;

  let aiText = "";

  if (score !== null) {
    aiText = generateAIExplanation(score, details, type);
  } else {
    aiText = details.join("\n");
  }

  document.getElementById("details").innerText = aiText;

  saveHistory(result, details);
}

/* =========================
   LINK ANALYSIS
========================= */
  function analyzeLink() {

  let link = document.getElementById("linkInput").value.trim();

  if (!link) {
    showResult("⚠️ Aucun lien saisi", [
      "Veuillez entrer un lien à analyser."
    ]);
    return;
  }

  let score = 100;
  let reasons = [];

  const text = link.toLowerCase();

  // Vérifie si le protocole est indiqué
  if (!text.startsWith("http://") && !text.startsWith("https://")) {
    score -= 10;
    reasons.push("🔵 Le protocole (http/https) n'est pas indiqué.");
    reasons.push("ℹ️ Cela ne signifie pas que le site est dangereux.");
  }

  // HTTP uniquement
  if (text.startsWith("http://")) {
    score -= 30;
    reasons.push("🟠 Le site utilise HTTP au lieu de HTTPS.");
    reasons.push("🛡️ Évitez de transmettre des informations sensibles.");
  }

  // HTTPS
  if (text.startsWith("https://")) {
    reasons.push("🟢 Connexion HTTPS détectée.");
  }

  // Adresse très longue
  if (link.length > 80) {
    score -= 15;
    reasons.push("🟡 L'adresse est particulièrement longue.");
  }

  // Mots souvent utilisés dans des tentatives d'hameçonnage
  const riskyWords = [
    "login",
    "verify",
    "password",
    "gift",
    "free",
    "bonus",
    "bank",
    "wallet",
    "crypto",
    "claim"
  ];

  riskyWords.forEach(word => {
    if (text.includes(word)) {
      score -= 10;
      reasons.push("🟠 Mot sensible détecté : " + word);
    }
  });

  // Limites
  if (score < 0) score = 0;

  let verdict;

  if (score >= 90) {
    verdict = "🟢 Fiable (" + score + "/100)";
  }
  else if (score >= 70) {
    verdict = "🔵 À vérifier (" + score + "/100)";
  }
  else if (score >= 50) {
    verdict = "🟡 Prudence (" + score + "/100)";
  }
  else if (score >= 30) {
    verdict = "🟠 Risque élevé (" + score + "/100)";
  }
  else {
    verdict = "🔴 Probablement frauduleux (" + score + "/100)";
  }

  // Si aucune remarque
  if (reasons.length === 0) {
    reasons.push("✅ Aucun indice de risque évident n'a été détecté.");
    reasons.push("ℹ️ Une analyse automatique ne garantit jamais qu'un site est totalement sûr.");
  }

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

  // nettoyage
  let clean = phone.replace(/\s/g, "");

  // 1. longueur suspecte
  if (clean.length < 8 || clean.length > 15) {
    score++;
    reasons.push("⚠️ Format invalide");
  }

  // 2. caractères invalides
  if (/[^0-9+]/.test(clean)) {
    score++;
    reasons.push("⚠️ Caractères suspects");
  }

  // 3. codes pays suspects incohérents (ex: +225 puis format incohérent)
  if (clean.startsWith("+225") && clean.length !== 13) {
    score++;
    reasons.push("⚠️ Format Côte d'Ivoire incohérent");
  }

  if (clean.startsWith("+229") && clean.length !== 12) {
    score++;
    reasons.push("⚠️ Format Bénin incohérent");
  }

  // 4. numéros trop “faux” (beaucoup de zéros ou répétitions)
  if ((clean.match(/0/g) || []).length > 6) {
    score++;
    reasons.push("⚠️ Trop de zéros (suspect)");
  }

  if (/(.)\1{4,}/.test(clean)) {
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

function generateAIExplanation(score, reasons, type) {

  let intro = "";
  let advice = "";

  if (type === "link") {
    intro = "Analyse IA du lien :";
    advice = "Vérifiez toujours l'identité du site avant de saisir des données sensibles.";
  }

  if (type === "phone") {
    intro = "Analyse IA du numéro :";
    advice = "Un numéro inconnu doit toujours être traité avec prudence.";
  }

  if (type === "message") {
    intro = "Analyse IA du message :";
    advice = "Les messages contenant urgence ou argent sont souvent utilisés dans les arnaques.";
  }

  let text = intro + "\n\n";

  if (score >= 80) {
    text += "Le niveau de confiance est élevé.\n\n";
  } else if (score >= 60) {
    text += "Le niveau de confiance est moyen.\n\n";
  } else {
    text += "Le niveau de confiance est faible.\n\n";
  }

  text += "Éléments détectés :\n";

  reasons.forEach(r => {
    text += "• " + r.replace(/[🟢🟡🟠🔴🔵]/g, "") + "\n";
  });

  text += "\nRecommandation : " + advice;

  return text;
}
