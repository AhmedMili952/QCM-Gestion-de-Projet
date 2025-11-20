// ===============================
//   Bonnes réponses du QCM
// ===============================
const bonnesReponses = {
  1: "B",
  2: "B",
  3: "B",
  4: "B",
  5: "B",
  6: "A",
  7: "B",
  8: "A",
  9: "B",
  10: "B",
  11: "B",
  12: "B",
  13: "B",
  14: "B",
  15: "B",
  16: "C",
  17: "B",
  18: "B",
  19: "B",
  20: "B",
  21: "B",
  22: "B",
  23: "B",
  24: "B",
  25: "B",
  26: "B",
  27: "C",
  28: "B",
  29: "B",
  30: "B"
};

// ===============================
//   Correction + score + couleurs
// ===============================
function corrigerQCM() {
  const total = Object.keys(bonnesReponses).length;
  const questions = document.querySelectorAll(".qcm-question");
  let score = 0;

  // Reset des bordures
  questions.forEach(q => {
    q.style.border = "2px solid transparent";
  });

  // Reset nav buttons
  const navButtons = document.querySelectorAll(".nav-question");
  navButtons.forEach(btn => {
    btn.classList.remove("good", "bad", "missing");
  });

  for (let q = 1; q <= total; q++) {
    const selected = document.querySelector(`input[name="q${q}"]:checked`);
    const good = bonnesReponses[q];
    const block = questions[q - 1];
    const navBtn = document.querySelector(`.nav-question[data-target="${q}"]`);

    if (!selected) {
      // Question non répondue
      block.style.border = "3px solid orange";
      if (navBtn) navBtn.classList.add("missing");
      continue;
    }

    if (selected.value === good) {
      score++;
      block.style.border = "3px solid lime";
      if (navBtn) navBtn.classList.add("good");
    } else {
      block.style.border = "3px solid #ff4444";
      if (navBtn) navBtn.classList.add("bad");
    }
  }

  // Mise à jour du score dans la barre latérale
  const scoreBox = document.getElementById("score-result");
  if (scoreBox) {
    scoreBox.textContent = `Score : ${score} / ${total}`;
    scoreBox.classList.remove("score-bump");
    // forcer le reflow pour relancer l'animation
    void scoreBox.offsetWidth;
    scoreBox.classList.add("score-bump");
  }

  // Version 1 : tout ouvrir automatiquement
  const allDetails = document.querySelectorAll(".correction");
  allDetails.forEach(det => {
    det.open = true;
    det.classList.add("force-open"); // cache le bouton, garde le panel visible
  });

  // Désactiver le bouton global d'explications
  const toggleBtn = document.getElementById("toggle-explanations-btn");
  if (toggleBtn) {
    toggleBtn.disabled = true;
    toggleBtn.textContent = "Explications affichées après validation";
    toggleBtn.classList.add("disabled");
  }
}

// ===============================
//   Reset complet
// ===============================
function resetQCM() {
  const questions = document.querySelectorAll(".qcm-question");

  questions.forEach(q => {
    q.style.border = "2px solid transparent";

    // Décoche tous les radios
    const radios = q.querySelectorAll('input[type="radio"]');
    radios.forEach(r => {
      r.checked = false;
    });
  });

  // Fermer toutes les explications
  const allDetails = document.querySelectorAll(".correction");
  allDetails.forEach(det => {
    det.open = false;
    det.classList.remove("force-open");
  });

  // Score remis à zéro
  const scoreBox = document.getElementById("score-result");
  if (scoreBox) {
    scoreBox.textContent = "Score : — / 30";
    scoreBox.classList.remove("score-bump");
  }

  // Réactiver le bouton global
  const toggleBtn = document.getElementById("toggle-explanations-btn");
  if (toggleBtn) {
    toggleBtn.disabled = false;
    toggleBtn.textContent = "Afficher toutes les explications";
    toggleBtn.classList.remove("disabled");
  }

  // Reset nav buttons
  const navButtons = document.querySelectorAll(".nav-question");
  navButtons.forEach(btn => {
    btn.classList.remove("good", "bad", "missing");
  });
}

// ===============================
//   Bouton "Afficher toutes les explications"
//   (avant validation uniquement)
// ===============================
function toggleAllExplanations() {
  const toggleBtn = document.getElementById("toggle-explanations-btn");
  if (!toggleBtn || toggleBtn.disabled) return;

  const allDetails = Array.from(document.querySelectorAll(".correction"));
  if (allDetails.length === 0) return;

  const someClosed = allDetails.some(det => !det.open);

  allDetails.forEach(det => {
    det.open = someClosed;
  });

  toggleBtn.textContent = someClosed
    ? "Masquer toutes les explications"
    : "Afficher toutes les explications";
}

// ===============================
//   Navigation latérale Q1–Q30
// ===============================
function initSidebarNavigation() {
  const navButtons = document.querySelectorAll(".nav-question");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const qNum = btn.dataset.target;
      const target = document.getElementById(`question-${qNum}`);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

      // sur mobile : refermer la side-bar après clic
      if (window.innerWidth <= 900) {
        document.body.classList.remove("sidebar-open");
      }
    });
  });
}

// ===============================
//   Burger menu (mobile)
// ===============================
function initBurger() {
  const burger = document.getElementById("sidebar-toggle");
  if (!burger) return;

  burger.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-open");
  });
}

// ===============================
//   Initialisation globale
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const validateBtn = document.getElementById("validate-btn");
  const resetBtn = document.getElementById("reset-btn");
  const toggleBtn = document.getElementById("toggle-explanations-btn");

  if (validateBtn) {
    validateBtn.addEventListener("click", corrigerQCM);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetQCM);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleAllExplanations);
  }

  initSidebarNavigation();
  initBurger();
});
