// ===============================
//   Bonnes réponses du QCM
//   (Synchronisées avec le HTML)
// ===============================
const bonnesReponses = {
  1: "A", 2: "D", 3: "C", 4: "B", 5: "D",
  6: "A", 7: "C", 8: "B", 9: "D", 10: "A",
  11: "C", 12: "D", 13: "B", 14: "A", 15: "C",
  16: "D", 17: "A", 18: "B", 19: "C", 20: "D",
  21: "A", 22: "C", 23: "B", 24: "D", 25: "A",
  26: "C", 27: "D", 28: "B", 29: "A", 30: "C"
};

// ===============================
//   Fonction de validation
// ===============================
function corrigerQCM() {
  const questions = document.querySelectorAll(".qcm-question");
  let score = 0;

  // Reset bordures avant correction
  questions.forEach(q => q.style.border = "2px solid transparent");

  // Reset état sidebar
  document.querySelectorAll(".nav-question").forEach(btn => {
    btn.classList.remove("good", "bad", "missing");
  });

  // Correction principale
  for (let i = 1; i <= 30; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const block = document.getElementById(`question-${i}`);
    const navBtn = document.querySelector(`.nav-question[data-target="${i}"]`);

    if (!selected) {
      // Question non répondue
      if (block) block.style.border = "3px solid orange";
      navBtn?.classList.add("missing");
      continue;
    }

    if (selected.value === bonnesReponses[i]) {
      // Bonne réponse
      score++;
      if (block) block.style.border = "3px solid #2ecc71"; // Vert émeraude
      navBtn?.classList.add("good");
    } else {
      // Mauvaise réponse
      if (block) block.style.border = "3px solid #e74c3c"; // Rouge corail
      navBtn?.classList.add("bad");
    }
  }

  // Affichage du score
  const scoreBox = document.getElementById("score-result");
  scoreBox.textContent = `Score : ${score} / 30`;
  
  // Animation du score
  scoreBox.classList.remove("score-bump");
  void scoreBox.offsetWidth; // Force le reflux (reflow) pour relancer l'animation
  scoreBox.classList.add("score-bump");

  // Afficher toutes les explications
  document.querySelectorAll(".correction-panel").forEach(p => {
    p.style.opacity = "1";
    p.style.transform = "translateY(0)";
    p.style.pointerEvents = "auto";
    p.style.display = "block"; // S'assure que le panneau est visible
  });

  // Désactivation des boutons radio pour empêcher de tricher après validation
  document.querySelectorAll("input[type='radio']").forEach(r => {
    r.disabled = true;
  });
}

// ===============================
//   Reset complet
// ===============================
function resetQCM() {
  // Réinitialisation des questions et des radios
  document.querySelectorAll(".qcm-question").forEach(q => {
    q.style.border = "2px solid transparent";
  });

  document.querySelectorAll("input[type='radio']").forEach(r => {
    r.checked = false;
    r.disabled = false;
  });

  // Masquer les explications
  document.querySelectorAll(".correction-panel").forEach(p => {
    p.style.opacity = "0";
    p.style.transform = "translateY(-5px)";
    p.style.pointerEvents = "none";
  });

  // Reset score
  const scoreBox = document.getElementById("score-result");
  scoreBox.textContent = "Score : — / 30";

  // Reset couleurs sidebar
  document.querySelectorAll(".nav-question").forEach(btn => {
    btn.classList.remove("good", "bad", "missing");
  });

  // Scroll en haut
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================
//   Navigation et Menu
// ===============================
function initSidebarNavigation() {
  document.querySelectorAll(".nav-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = `question-${btn.dataset.target}`;
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Fermer le menu sur mobile après clic
      if (window.innerWidth <= 900) {
        document.body.classList.remove("sidebar-open");
      }
    });
  });
}

function initBurger() {
  const burger = document.getElementById("sidebar-toggle");
  if (burger) {
    burger.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  }
}

// ===============================
//   INIT GLOBAL
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initSidebarNavigation();
  initBurger();

  const validateBtn = document.getElementById("validate-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (validateBtn) validateBtn.addEventListener("click", corrigerQCM);
  if (resetBtn) resetBtn.addEventListener("click", resetQCM);
});