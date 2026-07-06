let safeHistory = [0];
let riskHistory = [0];
let totalAnalyses = 0;
let safeCount = 0;
let riskCount = 0;
/* =========================
   NAVIGATION
========================= */
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

/* =========================
   RESULT DISPLAY
========================= */
function showResult(result, details) {
  document.getElementById("result").innerText = result;
  document.getElementById("details").innerText = details.join("\n");
}

/* =========================
   LINK ANALYSIS
========================= */
function analyzeLink() {
  let link = document.getElementById("linkInput").value.trim();
  let score = 100;
  let reasons = [];

  if (!link) return;

  let text = link.toLowerCase();

  if (!text.startsWith("https")) {
    score -= 20;
    reasons.push("Connexion non sécurisée ou absente (HTTPS).");
  }

  let phishingWords = ["login", "free", "gift", "verify", "password", "bank", "urgent"];

  phishingWords.forEach(w => {
    if (text.includes(w)) {
      score -= 15;
      reasons.push("Mot sensible détecté : " + w);
    }
  });

  if (link.length > 80) {
    score -= 10;
    reasons.push("URL trop longue");
  }

  let verdict = getVerdict(score, reasons);
  showResult(verdict, reasons);
}
clearInputs();
/* =========================
   PHONE ANALYSIS
========================= */
function analyzePhone() {
  let phone = document.getElementById("phoneInput").value.trim();
  let score = 100;
  let reasons = [];

  if (!phone) return;

  if (phone.length < 8 || phone.length > 15) {
    score -= 20;
    reasons.push("Format invalide");
  }

  if (/[^0-9+ ]/.test(phone)) {
    score -= 20;
    reasons.push("Caractères suspects");
  }

  let verdict = getVerdict(score, reasons);
  showResult(verdict, reasons);
}
clearInputs();
/* =========================
   MESSAGE ANALYSIS
========================= */
function analyzeMessage() {
  let msg = document.getElementById("msgInput").value.toLowerCase();
  let score = 100;
  let reasons = [];

  if (!msg) return;

  let scamWords = ["urgent", "argent", "gagné", "clique", "prix", "lotterie"];

  scamWords.forEach(w => {
    if (msg.includes(w)) {
      score -= 20;
      reasons.push("Mot suspect : " + w);
    }
  });

  if (msg.includes("http")) {
    score -= 20;
    reasons.push("Lien détecté dans le message");
  }

  let verdict = getVerdict(score, reasons);
  showResult(verdict, reasons);
}
clearInputs();
/* =========================
   SCORE SYSTEM
========================= */
function getVerdict(score, reasons) {

  if (score >= 80) {
    return "🟢 Fiable (" + score + "/100)";
  } 
  else if (score >= 60) {
    return "🔵 À vérifier (" + score + "/100)";
  } 
  else if (score >= 40) {
    return "🟡 Prudence (" + score + "/100)";
  } 
  else {
    return "🔴 Risque élevé (" + score + "/100)";
  }
}
function clearInputs() {
  document.getElementById("linkInput").value = "";
  document.getElementById("phoneInput").value = "";
  document.getElementById("msgInput").value = "";
}
y
function updateChart() {

  safeHistory.push(safeCount);
  riskHistory.push(riskCount);

  let chartData = [];

  for (let i = 0; i < safeHistory.length; i++) {
    chartData.push({
      index: i,
      safe: safeHistory[i] || 0,
      risk: riskHistory[i] || 0
    });
  }

  renderChart(chartData);
                   }
