/* ===========================================================
   CONFIGURATION & DONNÉES
   =========================================================== */
const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "C"], 28: "A", 29: "B", 30: "C"
};

const LETTRES = ["A", "B", "C", "D"];

/* ===========================================================
   SÉCURITÉ : BLOCAGE DES OUTILS D'INSPECTION
   =========================================================== */

// 1. Bloquer le clic droit (empêche l'accès au menu "Inspecter")
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 2. Bloquer les raccourcis clavier stratégiques
document.addEventListener('keydown', function(e) {
    
    // Bloque F12 (Ouverture des outils développeur)
    if (e.key === "F12") {
        e.preventDefault();
    }

    // Bloque Ctrl + U (Afficher le code source de la page)
    if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
    }

    // Bloque Ctrl + Shift + I (Ouvrir l'inspecteur d'éléments)
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
    }

    // Bloque Ctrl + Shift + J (Ouvrir la console)
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
    }

    // Bloque Ctrl + S (Empêche d'enregistrer la page sur l'ordinateur)
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
    }
});

/* ===========================================================
   FONCTIONS DE MÉLANGE (UI)
   =========================================================== */
function algorithmeDeFisherYates() {
    const LETTRES = ["A", "B", "C", "D"];

    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const container = q.querySelector(".qcm-options");
        if (!container || !bonnesReponses[id]) return;

        const labels = Array.from(container.querySelectorAll("label"));
        const reponseAttendue = bonnesReponses[id];

        // On trouve quelle était la lettre de la bonne réponse AVANT le mélange
        // (En cherchant quel label contient l'input avec la valeur correcte)
        const indexAncien = labels.findIndex(l => {
            const val = l.querySelector("input").value;
            return Array.isArray(reponseAttendue) ? reponseAttendue.includes(val) : val === reponseAttendue;
        });

        let tentatives = 0;
        let indexNouveau = -1;

        do {
            // Mélange classique Fisher-Yates
            for (let i = labels.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [labels[i], labels[j]] = [labels[j], labels[i]];
            }

            // On regarde où a atterri la bonne réponse
            indexNouveau = labels.findIndex(l => {
                const val = l.querySelector("input").value;
                return Array.isArray(reponseAttendue) ? reponseAttendue.includes(val) : val === reponseAttendue;
            });

            tentatives++;
            // On recommence si la bonne réponse est sur la même lettre qu'avant
            // (Sauf si on boucle trop, par sécurité)
        } while (indexNouveau === indexAncien && tentatives < 15);

        // Reconstruction du HTML avec les nouvelles lettres
        container.innerHTML = "";
        labels.forEach((label, index) => {
            const input = label.querySelector("input");
            let texteBrut = label.textContent.replace(/^[A-Z0-9][\.\s-]*/gi, "").trim();
            
            label.innerHTML = ""; 
            label.appendChild(input); 
            
            const spanLettre = document.createElement("strong");
            spanLettre.textContent = `${LETTRES[index]}. `;
            
            label.appendChild(spanLettre);
            label.appendChild(document.createTextNode(texteBrut));
            container.appendChild(label);
        });
    });
}

/* ===========================================================
   LOGIQUE DE CORRECTION
   =========================================================== */
function corrigerQCM() {
    let scoreTotal = 0;

    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const attendu = bonnesReponses[id];
        const inputs = Array.from(q.querySelectorAll(".qcm-options input"));
        
        // 1. Détermination des nouvelles lettres correctes après mélange
        let lettresCorrectes = [];
        inputs.forEach((input, index) => {
            const isMatch = Array.isArray(attendu) ? attendu.includes(input.value) : input.value === attendu;
            if (isMatch) lettresCorrectes.push(LETTRES[index]);
        });

        // 2. Mise à jour de l'affichage de la correction
        const spanLettre = q.querySelector(".lettre-correcte");
        if (spanLettre) spanLettre.textContent = lettresCorrectes.join(" et ");

        const panel = q.querySelector(".correction-panel");
        if (panel) panel.classList.add("visible");

        // 3. Calcul précis des points
        const coches = inputs.filter(i => i.checked).map(i => i.value);
        let pts = 0;

        if (coches.length > 0) {
            if (type === "single") {
                pts = (coches[0] === attendu) ? 1 : 0;
            } else {
                let trouves = 0, erreurs = 0;
                coches.forEach(v => attendu.includes(v) ? trouves++ : erreurs++);
                pts = (erreurs === 0) ? (trouves / attendu.length) : 0;
            }
        }
        
        // 4. Feedback Visuel sur la question
        q.style.borderLeft = (pts === 1) ? "8px solid #00ff80" : (pts > 0 ? "8px solid #ffb300" : "8px solid #ff5252");
        inputs.forEach(i => i.disabled = true);
        scoreTotal += pts;

        // --- AJOUT : MISE À JOUR DE LA BARRE LATÉRALE (SIDEBAR) ---
        const sideBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        if (sideBtn) {
            sideBtn.classList.remove("good", "bad", "missing");

        if (pts === 1) {
                // JUSTE : Vert
                sideBtn.classList.add("good");
            } else {
                // FAUX : Rouge
                sideBtn.classList.add("bad");
            }
        }
    });

    afficherScore(scoreTotal);
}

/* ===========================================================
   FONCTIONS UTILITAIRES
   =========================================================== */
function afficherScore(score) {
    const scoreEl = document.getElementById("score-result");
    scoreEl.textContent = `Score : ${score.toFixed(1)} / 30`;
    
    // Relance l'animation bump
    scoreEl.classList.remove("score-bump");
    void scoreEl.offsetWidth; 
    scoreEl.classList.add("score-bump");
}

function resetQCM() {
    // Reset des inputs
    document.querySelectorAll("input").forEach(i => {
        i.checked = false;
        i.disabled = false;
    });

    // Reset des questions et panneaux
    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.borderLeft = "none";
        const panel = q.querySelector(".correction-panel");
        if (panel) panel.classList.remove("visible");
    });

    // Reset Sidebar et Score
    document.querySelectorAll(".nav-question").forEach(btn => btn.classList.remove("good", "bad", "missing"));
    document.getElementById("score-result").textContent = "Score : — / 30";
    
    algorithmeDeFisherYates(); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===========================================================
   INITIALISATION
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    algorithmeDeFisherYates();

    document.getElementById("validate-qcm").onclick = corrigerQCM;
    document.getElementById("reset-qcm").onclick = resetQCM;

    // Navigation fluide vers les questions
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const target = document.getElementById(`question-${btn.dataset.target}`);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        };
    });
});