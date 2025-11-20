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
//   Fonction de validation
// ===============================
function corrigerQCM() {
  const total = Object.keys(bonnesReponses).length;
  const questions = document.querySelectorAll(".qcm-question");
  let score = 0;

  // Reset des bordures avant nouveau calcul
  questions.forEach(q => {
    q.style.border = "none";
  });

  // Reset des états des boutons de navigation
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.classList.remove("nav-item--correct", "nav-item--wrong", "nav-item--missing");
  });

  for (let q = 1; q <= total; q++) {
    const selected = document.querySelector(`input[name="q${q}"]:checked`);
    const good = bonnesReponses[q];
    const block = questions[q - 1];
    const navItem = document.querySelector(`.nav-item[data-question="${q}"]`);

    if (!selected) {
      // Question non répondue
      block.style.border = "3px solid orange";
      if (navItem) {
        navItem.classList.add("nav-item--missing");
      }
      continue;
    }

    if (selected.value === good) {
      score++;
      block.style.border = "3px solid lime";
      if (navItem) {
        navItem.classList.add("nav-item--correct");
      }
    } else {
      block.style.border = "3px solid #ff4444";
      if (navItem) {
        navItem.classList.add("nav-item--wrong");
      }
    }
  }

  const scoreBox = document.getElementById("score-result");
  scoreBox.innerHTML = `<strong>Score :</strong> ${score} / ${total}`;
  scoreBox.classList.add("visible");
}

// ===============================
//   Fonction de reset
// ===============================
function resetQCM() {
  const questions = document.querySelectorAll(".qcm-question");

  questions.forEach(q => {
    // On enlève les bordures de correction
    q.style.border = "none";

    // On décoche toutes les réponses
    const radios = q.querySelectorAll('input[type="radio"]');
    radios.forEach(r => {
      r.checked = false;
    });
  });

  // On masque le score
  const scoreBox = document.getElementById("score-result");
  scoreBox.classList.remove("visible");
  scoreBox.innerHTML = "";

  // On remet les boutons de navigation à l'état neutre
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.classList.remove("nav-item--correct", "nav-item--wrong", "nav-item--missing");
  });
}

// ===============================
//   Navigation par Q1, Q2, ...
// ===============================
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const num = item.getAttribute("data-question");
      const target = document.getElementById(`q${num}`);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      // Sur mobile, on ferme le menu après clic
      const sideNav = document.querySelector(".side-nav");
      if (window.innerWidth < 900 && sideNav && sideNav.classList.contains("open")) {
        sideNav.classList.remove("open");
      }
    });
  });
}

// ===============================
//   Gestion du menu burger
// ===============================
function initBurgerMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const sideNav = document.querySelector(".side-nav");

  if (!navToggle || !sideNav) return;

  navToggle.addEventListener("click", () => {
    sideNav.classList.toggle("open");
  });
}

// ===============================
//   Initialisation globale
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const validateBtn = document.getElementById("validate-btn");
  const resetBtn = document.getElementById("reset-btn");

  if (validateBtn) {
    validateBtn.addEventListener("click", corrigerQCM);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetQCM);
  }

  initNavigation();
  initBurgerMenu();
});
