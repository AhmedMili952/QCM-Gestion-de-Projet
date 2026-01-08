const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "D"], 28: "B", 29: "B", 30: ["A", "C", "D"]
};

// --- MÉLANGE ET NETTOYAGE DES LETTRES ---
function mélangerEtRéindexer() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const container = q.querySelector(".qcm-options");
        if (!container) return;

        const labels = Array.from(container.querySelectorAll("label"));
        const lettres = ["A.", "B.", "C.", "D."];

        // 1. Extraire les textes sans les lettres accumulées
        const textesNettoyés = labels.map(label => {
            let texte = label.innerText;
            // On retire tout ce qui ressemble à "A. ", "B. " etc au début, même répété
            return texte.replace(/^([A-D]\.\s*)+/gi, "").trim();
        });

        // 2. Mélange (Fisher-Yates)
        for (let i = textesNettoyés.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [textesNettoyés[i], textesNettoyés[j]] = [textesNettoyés[j], textesNettoyés[i]];
        }

        // 3. Ré-injection propre
        labels.forEach((label, index) => {
            const input = label.querySelector("input");
            label.innerHTML = ""; 
            label.appendChild(input); 
            const nouveauTexte = document.createTextNode(` ${lettres[index]} ${textesNettoyés[index]}`);
            label.appendChild(nouveauTexte);
        });
    });
}

// --- CORRECTION (AVEC AFFICHAGE EXPLICATION) ---
function corrigerQCM() {
    let scoreTotal = 0;
    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const attendu = bonnesReponses[id];
        const navBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        const cochés = Array.from(q.querySelectorAll(`input:checked`)).map(i => i.value);

        let pts = 0;
        if (cochés.length > 0) {
            if (type === "single") {
                if (cochés[0] === attendu) pts = 1;
            } else {
                let trouvées = 0, erreurs = 0;
                cochés.forEach(v => attendu.includes(v) ? trouvées++ : erreurs++);
                pts = (erreurs === 0) ? (trouvées / attendu.length) : 0;
            }
        }

        // --- FEEDBACK VISUEL ---
        q.style.border = pts === 1 ? "3px solid #00ff80" : (pts > 0 ? "3px solid #ffb300" : "3px solid #ff5252");
        if (cochés.length === 0) q.style.border = "3px solid orange";

        // Mise à jour Sidebar
        navBtn?.classList.remove("good", "bad", "missing");
        if (cochés.length === 0) navBtn?.classList.add("missing");
        else navBtn?.classList.add(pts === 1 ? "good" : (pts > 0 ? "missing" : "bad"));
        
        // --- AFFICHAGE DE L'EXPLICATION ---
        const panel = q.querySelector(".correction-panel");
        if (panel) {
            panel.style.display = "block";
            panel.style.opacity = "1";
            panel.style.transform = "translateY(0)";
        }

        q.querySelectorAll("input").forEach(i => i.disabled = true);
        scoreTotal += pts;
    });

    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = `Score : ${scoreTotal.toFixed(1)} / 30`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- RESET ---
function resetQCM() {
    document.querySelectorAll("input").forEach(i => { 
        i.checked = false; 
        i.disabled = false; 
    });

    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.border = "2px solid transparent";
        // On cache à nouveau l'explication
        const p = q.querySelector(".correction-panel");
        if (p) {
            p.style.display = "none";
            p.style.opacity = "0";
        }
    });

    document.querySelectorAll(".nav-question").forEach(b => b.classList.remove("good", "bad", "missing"));
    
    // On mélange à nouveau pour la prochaine tentative
    mélangerEtRéindexer();
    
    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = "Score : -- / 30";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- INITIALISATION ---
document.addEventListener("DOMContentLoaded", () => {
    mélangerEtRéindexer();
    
    const btnV = document.getElementById("validate-btn");
    const btnR = document.getElementById("reset-btn");
    
    if (btnV) btnV.onclick = corrigerQCM;
    if (btnR) btnR.onclick = resetQCM;

    // Navigation sidebar
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const t = document.getElementById(`question-${btn.dataset.target}`);
            if (t) t.scrollIntoView({ behavior: "smooth", block: "center" });
        };
    });
});