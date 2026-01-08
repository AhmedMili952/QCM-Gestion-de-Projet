// ==========================================
//   Bonnes réponses du QCM (Niveau Expert)
// ==========================================
const bonnesReponses = {
    // Cours 1
    1: "B",
    2: ["A", "B"], // Multiple
    3: "C",
    4: ["B", "D"], // Multiple
    5: "B",
    6: "C",
    7: ["A", "C", "D"], // Multiple
    8: "B",
    9: "B",
    10: "C",
    // Cours 2
    11: "B",
    12: ["A", "B", "D"], // Multiple
    13: "C",
    14: "A",
    15: ["A", "B", "D"], // Multiple
    16: "C",
    17: "B",
    18: ["B", "C"], // Multiple
    19: "A",
    20: "C",
    // Cours 3
    21: ["A", "B", "C"], // Multiple
    22: "B",
    23: "B",
    24: ["B", "D"], // Multiple
    25: "A",
    26: "C",
    27: ["A", "B", "D"], // Multiple
    28: "B",
    29: "B",
    30: ["A", "C", "D"]  // Multiple
};

// ===============================
//   Fonction de validation
// ===============================
function corrigerQCM() {
    const questions = document.querySelectorAll(".qcm-question");
    let score = 0;

    questions.forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type; // 'single' ou 'multiple'
        const attendu = bonnesReponses[id];
        const block = document.getElementById(`question-${id}`);
        const navBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        
        let estCorrect = false;

        // 1. Récupération des réponses de l'utilisateur
        const inputsChecked = Array.from(q.querySelectorAll(`input[name="q${id}"]:checked`));
        const reponsesUser = inputsChecked.map(input => input.value);

        // 2. Logique de vérification
        if (reponsesUser.length === 0) {
            // Non répondu
            if (block) block.style.border = "3px solid orange";
            navBtn?.classList.add("missing");
            return; // On passe à la question suivante
        }

        if (type === "single") {
            // Comparaison simple pour bouton radio
            estCorrect = reponsesUser[0] === attendu;
        } else {
            // Comparaison de tableaux pour cases à cocher
            // L'utilisateur doit avoir exactement le même nombre et les bonnes valeurs
            estCorrect = reponsesUser.length === attendu.length && 
                         reponsesUser.every(val => attendu.includes(val));
        }

        // 3. Application visuelle des résultats
        navBtn?.classList.remove("good", "bad", "missing");

        if (estCorrect) {
            score++;
            if (block) block.style.border = "3px solid #2ecc71";
            navBtn?.classList.add("good");
        } else {
            if (block) block.style.border = "3px solid #e74c3c";
            navBtn?.classList.add("bad");
        }
    });

    // Affichage du score
    const scoreBox = document.getElementById("score-result");
    scoreBox.textContent = `Score : ${score} / 30`;
    
    // Animation
    scoreBox.classList.remove("score-bump");
    void scoreBox.offsetWidth; 
    scoreBox.classList.add("score-bump");

    // Afficher les explications et bloquer les inputs
    document.querySelectorAll(".correction-panel").forEach(p => p.style.display = "block");
    document.querySelectorAll("input").forEach(i => i.disabled = true);
    
    // Scroll vers le score pour feedback immédiat
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================
//   Reset complet
// ===============================
function resetQCM() {
    // Rechargement simple pour tout nettoyer proprement
    window.location.reload();
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
                // On centre la question dans l'écran
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
                
                // Effet visuel temporaire sur la question ciblée
                targetElement.classList.add("highlight-flash");
                setTimeout(() => targetElement.classList.remove("highlight-flash"), 1000);
            }

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