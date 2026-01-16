/* ===========================================================
   CONFIGURATION STRICTE (MOT POUR MOT)
   =========================================================== */


const bonnesReponses = {
    1: "Un ensemble de règles de conduite s'imposant par la contrainte de l'Etat",
    2: "L'ensemble des règles juridiques régissant la vie en société",
    3: ["La Constitution", "La Jurisprudence", "La Loi"],
    4: "L’adresse IP de l’ordinateur utilisée pour le constat",
    5: "APP",
    6: "S’identifier avec sa véritable identité",
    7: "Non, seules leurs mises en forme sont protégées",
    8: "National",
    9: "Redevance",
    10: "Du seul fait de la création de l’œuvre",
    11: "70 ans après la mort de l'auteur",
    12: "Original reflétant un apport intellectuel",
    13: "Une invention technique nouvelle",
    14: "20 ans",
    15: "L'action en contrefaçon",
    16: "De l'Union Européenne",
    17: "La Marque",
    18: "Non, les algorithmes nus sont exclus de la brevetabilité",
    19: "Qu'on ne peut pas le céder ou le vendre",
    20: "Un actif immatériel",
    21: "La saisie-contrefaçon réalisée par un huissier",
    22: "10 ans renouvelables indéfiniment",
    23: "Que la protection est limitée aux classes de produits/services choisies",
    24: "Un ensemble d'informations techniques secrètes et non brevetées",
    25: "L'apparence esthétique et ornementale d'un produit",
    26: "Genève (Suisse)",
    27: "À l'employeur",
    28: "À caractère personnel",
    29: "CNIL",
    30: "L'accès à distance à un logiciel hébergé via un abonnement"
};

function mélangerTout() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        if (q.dataset.type === "text") return;
        const container = q.querySelector(".qcm-options");
        const labels = Array.from(container.querySelectorAll("label"));
        for (let i = labels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labels[i], labels[j]] = [labels[j], labels[i]];
        }
        container.innerHTML = "";
        labels.forEach(l => {
            const input = l.querySelector("input");
            input.checked = false; input.disabled = false;
            container.appendChild(l);
        });
    });
}

function corrigerQCM() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const panel = q.querySelector(".correction-panel");
        const sideBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        const solution = bonnesReponses[id];
        
        panel.classList.add("visible");

        if (type === "text") {
            const userVal = q.querySelector("textarea").value.trim();
            const correctText = Array.isArray(solution) ? solution[0] : solution;
            
            if (userVal.toUpperCase() === correctText.toUpperCase()) {
                q.style.borderLeft = "8px solid #00ff80";
                sideBtn.classList.remove("bad", "missing");
                sideBtn.classList.add("good");
            } else {
                // Création des boutons de validation manuelle si pas déjà présents
                if (!panel.querySelector(".manual-validation")) {
                    const div = document.createElement("div");
                    div.className = "manual-validation";
                    // CORRECTION ICI : Utilisation de window.force et ajout des classes CSS
                    div.innerHTML = `
                        <button class="btn-juste" onclick="window.force('${id}',true)">J'ai juste</button>
                        <button class="btn-faux" onclick="window.force('${id}',false)">Faux</button>
                    `;
                    panel.appendChild(div);
                }
            }
        } else {
            const inputs = Array.from(q.querySelectorAll("input"));
            const checks = inputs.filter(i => i.checked).map(i => i.value);
            inputs.forEach(i => i.disabled = true);
            
            let isGood = false;
            if (type === "single") {
                isGood = (checks[0] === solution);
            } else {
                isGood = solution.every(s => checks.includes(s)) && checks.length === solution.length;
            }

            sideBtn.classList.remove("good", "bad", "missing");
            if (checks.length > 0) {
                q.style.borderLeft = isGood ? "8px solid #00ff80" : "8px solid #ff5252";
                sideBtn.classList.add(isGood ? "good" : "bad");
            } else {
                sideBtn.classList.add("missing");
            }
        }
    });
    score();
}

function resetQCM() {

    // 1. Réinitialiser les inputs et les bordures
    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.borderLeft = "none"; // Enlève la couleur de correction
        
        // Décoche les radios/checkbox et les réactive
        const inputs = q.querySelectorAll("input");
        inputs.forEach(i => {
            i.checked = false;
            i.disabled = false;
        });

        // Vide les zones de texte et les réactive
        const textAreas = q.querySelectorAll("textarea");
        textAreas.forEach(t => {
            t.value = "";
            t.disabled = false;
        });

        // Cache le panneau de correction et supprime la validation manuelle
        const panel = q.querySelector(".correction-panel");
        panel.classList.remove("visible");
        const manual = panel.querySelector(".manual-validation");
        if (manual) manual.remove();
    });

    // 2. Réinitialiser la barre latérale
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.classList.remove("good", "bad", "missing");
    });

    // 3. Remettre le score à zéro
    document.getElementById("score-result").textContent = "Score : — / 30";
    document.getElementById("score-container").classList.remove("score-bump");

    // 4. (Optionnel) Remélanger les questions pour une nouvelle tentative
    mélangerTout();
    
    // Scroll en haut de page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


window.force = (id, ok) => {
    const b = document.querySelector(`.nav-question[data-target="${id}"]`);
    const q = document.getElementById(`question-${id}`);
    
    b.classList.remove("good","bad","missing");
    b.classList.add(ok ? "good" : "bad");
    
    q.style.borderLeft = ok ? "8px solid #00ff80" : "8px solid #ff5252";
    
    // Animation du score
    score();
};

function score() {
    const ok = document.querySelectorAll(".nav-question.good").length;
    const scoreContainer = document.getElementById("score-container");
    const scoreResult = document.getElementById("score-result");
    
    scoreResult.textContent = `Score : ${ok} / ${NbQuestions}`;
    
    // Effet visuel de pulsation sur le score
    scoreContainer.classList.remove("score-bump");
    void scoreContainer.offsetWidth; // Trigger reflow
    scoreContainer.classList.add("score-bump");
}

document.addEventListener("DOMContentLoaded", () => {
    mélangerTout();
    document.getElementById("validate-qcm").onclick = corrigerQCM;
    document.getElementById("reset-qcm").onclick = resetQCM;
    
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const target = document.getElementById(`question-${btn.dataset.target}`);
            target.scrollIntoView({behavior:"smooth", block:"center"});
        };
    });
});