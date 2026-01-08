const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "D"], 28: "B", 29: "B", 30: ["A", "C", "D"]
};

// --- MÉLANGE DES TEXTES MAIS GARDE LES LETTRES A, B, C, D ---
function mélangerEtRéindexer() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const container = q.querySelector(".qcm-options");
        if (!container) return;

        const labels = Array.from(container.querySelectorAll("label"));
        const lettres = ["A.", "B.", "C.", "D."];

        // 1. Extraire et mélanger uniquement le texte (sans la lettre)
        const textesSeuls = labels.map(label => {
            // On enlève "A. ", "B. ", etc. au début pour ne garder que la phrase
            return label.innerText.replace(/^[A-D]\.\s+/i, "").trim();
        });

        // Algorithme de mélange (Fisher-Yates)
        for (let i = textesSeuls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [textesSeuls[i], textesSeuls[j]] = [textesSeuls[j], textesSeuls[i]];
        }

        // 2. Ré-injecter dans les labels avec les lettres dans le bon ordre
        labels.forEach((label, index) => {
            const input = label.querySelector("input");
            const nouvelleLettre = lettres[index]; // Toujours A, puis B, puis C...
            const nouveauTexte = textesSeuls[index];

            // On reconstruit le contenu du label
            label.innerHTML = ""; 
            label.appendChild(input); // On remet la case à cocher
            label.appendChild(document.createTextNode(` ${nouvelleLettre} ${nouveauTexte}`));
        });
    });
}

// --- CORRECTION ---
function corrigerQCM() {
    let scoreTotal = 0;
    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const attendu = bonnesReponses[id];
        const navBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        
        // ATTENTION : On juge maintenant par le TEXTE de la réponse pour ne pas se tromper
        // Mais pour rester simple, on va comparer la valeur de l'input
        const inputsChecked = Array.from(q.querySelectorAll(`input:checked`));
        const reponsesUser = inputsChecked.map(input => input.value);

        let points = 0;
        if (reponsesUser.length > 0) {
            if (type === "single") {
                if (reponsesUser[0] === attendu) points = 1;
            } else {
                const nbBonnes = attendu.length;
                let trouvées = 0, erreurs = 0;
                reponsesUser.forEach(v => attendu.includes(v) ? trouvées++ : erreurs++);
                points = (erreurs === 0) ? (trouvées / nbBonnes) : 0;
            }
        }

        q.style.border = points === 1 ? "3px solid #00ff80" : (points > 0 ? "3px solid #ffb300" : "3px solid #ff5252");
        if (reponsesUser.length === 0) {
            q.style.border = "3px solid orange";
            navBtn?.classList.add("missing");
        } else {
            navBtn?.classList.add(points === 1 ? "good" : (points > 0 ? "missing" : "bad"));
        }
        
        scoreTotal += points;
        const p = q.querySelector(".correction-panel");
        if (p) p.style.display = "block";
        q.querySelectorAll("input").forEach(i => i.disabled = true);
    });

    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = `Score : ${scoreTotal.toFixed(1)} / 30`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- RESET ---
function resetQCM() {
    document.querySelectorAll("input").forEach(i => { i.checked = false; i.disabled = false; });
    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.border = "2px solid transparent";
        const p = q.querySelector(".correction-panel");
        if (p) p.style.display = "none";
    });
    document.querySelectorAll(".nav-question").forEach(b => b.classList.remove("good", "bad", "missing"));
    
    mélangerEtRéindexer(); // MÉLANGE LES TEXTES ET RE-MET LES LETTRES A,B,C,D
    
    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = "Score : -- / 30";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
    mélangerEtRéindexer();
    
    const btnV = document.getElementById("validate-btn");
    const btnR = document.getElementById("reset-btn");
    if (btnV) btnV.onclick = corrigerQCM;
    if (btnR) btnR.onclick = resetQCM;

    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const t = document.getElementById(`question-${btn.dataset.target}`);
            if (t) t.scrollIntoView({ behavior: "smooth", block: "center" });
        };
    });
});