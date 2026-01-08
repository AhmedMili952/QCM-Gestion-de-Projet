const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "C"], 28: "A", 29: "B", 30: ["A", "B", "C"]
};

// --- ALGORITHME DE FISHER-YATES ---
function algorithmeDeFisherYates() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const container = q.querySelector(".qcm-options");
        if (!container) return;

        const labels = Array.from(container.querySelectorAll("label"));
        const lettresOrdre = ["A", "B", "C", "D"];

        // Application de l'algorithme selon ton image
        for (let i = labels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labels[i], labels[j]] = [labels[j], labels[i]];
        }

        // Reconstruction du HTML
        container.innerHTML = "";
        labels.forEach((label, index) => {
            const input = label.querySelector("input");
            
            // Nettoyage des anciennes lettres pour eviter les doublons (A. C. Texte)
            let texteBrut = label.innerText.replace(/^([A-Z][\.\s]*)+/i, "").trim();
            
            label.innerHTML = "";
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${lettresOrdre[index]}. ${texteBrut}`));
            container.appendChild(label);
        });
    });
}

// --- LOGIQUE DE CORRECTION ---
function corrigerQCM() {
    let scoreTotal = 0;
    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const attendu = bonnesReponses[id];
        const navBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        
        const labels = Array.from(q.querySelectorAll(".qcm-options label"));
        const coches = [];
        
        // On identifie quelles lettres (A, B, C, D) ont ete cochees apres melange
        labels.forEach((label, index) => {
            if (label.querySelector("input").checked) {
                coches.push(["A", "B", "C", "D"][index]);
            }
        });

        let pts = 0;
        if (coches.length > 0) {
            if (type === "single") {
                if (coches[0] === attendu) pts = 1;
            } else {
                let trouves = 0, erreurs = 0;
                coches.forEach(v => attendu.includes(v) ? trouves++ : erreurs++);
                pts = (erreurs === 0) ? (trouves / attendu.length) : 0;
            }
        }

        // Style visuel de la question
        q.style.borderLeft = pts === 1 ? "8px solid #00ff80" : (pts > 0 ? "8px solid #ffb300" : "8px solid #ff5252");
        
        // Mise a jour de la barre de navigation
        if (navBtn) {
            navBtn.classList.remove("good", "bad", "missing");
            if (coches.length === 0) navBtn.classList.add("missing");
            else navBtn.classList.add(pts === 1 ? "good" : (pts > 0 ? "missing" : "bad"));
        }
        
        // Affichage du panel de correction
        const panel = q.querySelector(".correction-panel");
        if (panel) panel.style.display = "block";

        q.querySelectorAll("input").forEach(i => i.disabled = true);
        scoreTotal += pts;
    });

    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = `Score : ${scoreTotal.toFixed(1)} / 30`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- INITIALISATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Appel de la fonction de melange
    algorithmeDeFisherYates();
    
    const btnV = document.getElementById("validate-qcm");
    if (btnV) btnV.onclick = corrigerQCM;

    // Navigation fluide via la sidebar
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const t = document.getElementById(`question-${btn.dataset.target}`);
            if (t) t.scrollIntoView({ behavior: "smooth", block: "center" });
        };
    });
});