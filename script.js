// 1. Base de données
const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "D"], 28: "B", 29: "B", 30: ["A", "C", "D"]
};

// 2. Mélange physique des options
function mélangerToutesLesQuestions() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const container = q.querySelector(".qcm-options");
        if (!container) return;
        const items = Array.from(container.querySelectorAll("label"));
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        container.innerHTML = "";
        items.forEach(item => container.appendChild(item));
    });
}

// 3. Correction avec points partiels + Navigation
function corrigerQCM() {
    let scoreTotal = 0;
    const questions = document.querySelectorAll(".qcm-question");

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
                // Ta règle : pas d'erreur = prorata
                if (erreurs === 0) pointsQuestion = (bonnesTrouvees / nbBonnesTotal);
                else pointsQuestion = 0;
            }

            // Visuel Question + Sidebar
            if (pointsQuestion === 1) {
                q.style.border = "3px solid #00ff80";
                navBtn?.classList.add("good");
            } else if (pointsQuestion > 0) {
                q.style.border = "3px solid #ffb300"; // Orange partiel
                navBtn?.classList.add("missing");
            } else {
                q.style.border = "3px solid #ff5252";
                navBtn?.classList.add("bad");
            }
        }

        scoreTotal += pointsQuestion;
        const panel = q.querySelector(".correction-panel");
        if (panel) panel.style.display = "block";
        q.querySelectorAll("input").forEach(i => i.disabled = true);
    });

    const scoreBox = document.getElementById("score-result");
    if (scoreBox) scoreBox.textContent = `Score : ${scoreTotal.toFixed(1)} / 30`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Reset Complet
function resetQCM() {
    document.querySelectorAll("input").forEach(i => {
        i.checked = false;
        i.disabled = false;
    });
    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.border = "2px solid transparent";
        const p = q.querySelector(".correction-panel");
        if (p) p.style.display = "none";
    });
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.classList.remove("good", "bad", "missing");
    });
    
    mélangerToutesLesQuestions(); // Le mélange se fait ICI
    
    const scoreBox = document.getElementById("score-result");
    if (scoreBox) scoreBox.textContent = "Score : -- / 30";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. Initialisation
document.addEventListener("DOMContentLoaded", () => {
    mélangerToutesLesQuestions();
    
    // Liaison des boutons
    const btnValider = document.getElementById("validate-btn");
    const btnReset = document.getElementById("reset-btn");
    if (btnValider) btnValider.onclick = corrigerQCM;
    if (btnReset) btnReset.onclick = resetQCM;

    // Navigation (Sidebar)
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = document.getElementById(`question-${btn.dataset.target}`);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });
});