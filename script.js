// ==========================================
//    Bonnes réponses du QCM (Niveau Expert)
// ==========================================
const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "D"], 28: "B", 29: "B", 30: ["A", "C", "D"]
};

// ===============================
//    Fonction de Mélange (Shuffle)
// ===============================
function melangerOptions(questionBlock) {
    const optionsContainer = questionBlock.querySelector(".qcm-options");
    if (!optionsContainer) return;

    const labels = Array.from(optionsContainer.querySelectorAll("label"));
    
    // Algorithme de Fisher-Yates
    for (let i = labels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [labels[i], labels[j]] = [labels[j], labels[i]];
    }

    // Ré-insertion dans le DOM
    labels.forEach(label => optionsContainer.appendChild(label));
}

// ===============================
//    Fonction de validation
// ===============================
function corrigerQCM() {
    const questions = document.querySelectorAll(".qcm-question");
    let scoreTotal = 0;

    questions.forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const attendu = bonnesReponses[id];
        const navBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        
        const inputsChecked = Array.from(q.querySelectorAll(`input:checked`));
        const reponsesUser = inputsChecked.map(input => input.value);

        let pointsQuestion = 0;

        if (reponsesUser.length === 0) {
            q.style.border = "3px solid orange";
            navBtn?.classList.add("missing");
        } else {
            if (type === "single") {
                if (reponsesUser[0] === attendu) pointsQuestion = 1;
            } else {
                const nbBonnesTotal = attendu.length;
                let bonnesTrouvees = 0;
                let erreurs = 0;

                reponsesUser.forEach(val => {
                    if (attendu.includes(val)) bonnesTrouvees++;
                    else erreurs++;
                });

                // Ta règle : Pas d'erreur = prorata, 1 erreur = 0
                if (erreurs === 0) {
                    pointsQuestion = bonnesTrouvees / nbBonnesTotal;
                } else {
                    pointsQuestion = 0;
                }
            }

            // Gestion visuelle
            if (pointsQuestion === 1) {
                q.style.border = "3px solid #00ff80";
                navBtn?.classList.add("good");
            } else if (pointsQuestion > 0) {
                q.style.border = "3px solid #ffb300"; // Orange pour partiel
                navBtn?.classList.add("missing");
            } else {
                q.style.border = "3px solid #ff5252";
                navBtn?.classList.add("bad");
            }
        }

        scoreTotal += pointsQuestion;

        const panel = q.querySelector(".correction-panel");
        if (panel) {
            panel.style.display = "block";
            panel.style.opacity = "1";
        }
    });

    const scoreBox = document.getElementById("score-result");
    if (scoreBox) scoreBox.textContent = `Score : ${scoreTotal.toFixed(1)} / 30`;

    document.querySelectorAll("input").forEach(i => i.disabled = true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================
//    Reset (Avec Shuffle)
// ===============================
function resetQCM() {
    document.querySelectorAll('input').forEach(input => {
        input.checked = false;
        input.disabled = false;
    });

    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.border = "2px solid transparent";
        const panel = q.querySelector(".correction-panel");
        if (panel) {
            panel.style.display = "none";
            panel.style.opacity = "0";
        }
        
        // ON MÉLANGE ICI
        melangerOptions(q);
    });

    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.classList.remove("good", "bad", "missing");
    });

    const scoreBox = document.getElementById("score-result");
    if (scoreBox) scoreBox.textContent = "Score : -- / 30";

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===============================
//    Initialisation
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    // Navigation Sidebar
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = `question-${btn.dataset.target}`;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    });

    // Burger Menu
    const burger = document.getElementById("sidebar-toggle");
    if (burger) {
        burger.addEventListener("click", () => {
            document.body.classList.toggle("sidebar-open");
        });
    }

    // Initialiser les boutons si présents
    const validateBtn = document.getElementById("validate-btn");
    const resetBtn = document.getElementById("reset-btn");
    if (validateBtn) validateBtn.addEventListener("click", corrigerQCM);
    if (resetBtn) resetBtn.addEventListener("click", resetQCM);
});