const bonnesReponses = {
    1: "B", 2: ["A", "B"], 3: "C", 4: ["B", "D"], 5: "B",
    6: "C", 7: ["A", "C", "D"], 8: "B", 9: "B", 10: "C",
    11: "B", 12: ["A", "B", "D"], 13: "C", 14: "A", 15: ["A", "B", "D"],
    16: "C", 17: "B", 18: ["B", "C"], 19: "A", 20: "C",
    21: ["A", "B", "C"], 22: "B", 23: "B", 24: ["B", "D"], 25: "A",
    26: "C", 27: ["A", "B", "C"], 28: "A", 29: "B", 30: "C"
};

// --- ALGORITHME DE FISHER-YATES AVEC NETTOYAGE ---
function algorithmeDeFisherYates() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const container = q.querySelector(".qcm-options");
        if (!container) return;

        const labels = Array.from(container.querySelectorAll("label"));
        
        // 1. Mélange des éléments
        for (let i = labels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labels[i], labels[j]] = [labels[j], labels[i]];
        }

        // 2. Reconstruction et Nettoyage
        container.innerHTML = "";
        labels.forEach((label) => {
            const input = label.querySelector("input");
            
            // On récupère le texte existant en supprimant d'éventuels préfixes "A. ", "B. " déjà présents
            let texteBrut = label.textContent.replace(/^[A-Z][\.\s]*/i, "").trim();
            
            label.innerHTML = ""; // Vide le label
            label.appendChild(input); // Remet l'input
            
            // Ajoute le texte de l'option (on ne force plus A, B, C visuellement ici pour 
            // ne pas confondre l'utilisateur avec la valeur réelle de l'input)
            label.appendChild(document.createTextNode(` ${texteBrut}`));
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
        
        const inputs = Array.from(q.querySelectorAll(".qcm-options input"));
        const coches = [];
        
        inputs.forEach(input => {
            if (input.checked) {
                coches.push(input.value); // On utilise la VALUE (A, B, C, D) définie dans le HTML
            }
        });

        let pts = 0;
        if (coches.length > 0) {
            if (type === "single") {
                // Pour une question à choix unique
                if (coches[0] === attendu) pts = 1;
            } else {
                // Pour une question à choix multiples
                let trouves = 0;
                let erreurs = 0;
                
                coches.forEach(v => {
                    if (attendu.includes(v)) trouves++;
                    else erreurs++;
                });

                // Calcul proportionnel : (Bonnes réponses cochées / Total attendu) - fautes
                if (erreurs === 0) {
                    pts = trouves / attendu.length;
                } else {
                    pts = 0; // On annule les points si une erreur est cochée (règle stricte)
                }
            }
        }

        // Style visuel
        if (coches.length === 0) {
            q.style.borderLeft = "8px solid #cccccc";
            if (navBtn) navBtn.classList.add("missing");
        } else {
            q.style.borderLeft = pts === 1 ? "8px solid #00ff80" : (pts > 0 ? "8px solid #ffb300" : "8px solid #ff5252");
            if (navBtn) {
                navBtn.classList.remove("good", "bad", "missing");
                navBtn.classList.add(pts === 1 ? "good" : (pts > 0 ? "missing" : "bad"));
            }
        }
        
        // Affichage du panel de correction
        const panel = q.querySelector(".correction-panel");
        if (panel) panel.style.display = "block";
        
        // Désactivation des inputs
        q.querySelectorAll("input").forEach(i => i.disabled = true);
        
        scoreTotal += pts;
    });

    // Mise à jour du score final
    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = `Score : ${scoreTotal.toFixed(1)} / 30`;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- LOGIQUE DE REINITIALISATION ---
function resetQCM() {
    document.querySelectorAll("input").forEach(i => {
        i.checked = false;
        i.disabled = false;
    });

    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.borderLeft = "none";
        const panel = q.querySelector(".correction-panel");
        if (panel) panel.style.display = "none";
    });

    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.classList.remove("good", "bad", "missing");
    });

    const sb = document.getElementById("score-result");
    if (sb) sb.textContent = "Score : — / 30";
    
    // On remélange les questions
    algorithmeDeFisherYates(); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- INITIALISATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Mélange initial
    algorithmeDeFisherYates();
    
    // Boutons de contrôle
    const btnV = document.getElementById("validate-qcm");
    if (btnV) btnV.onclick = corrigerQCM;

    const btnR = document.getElementById("reset-qcm");
    if (btnR) btnR.onclick = resetQCM;

    // Navigation Sidebar
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const targetId = btn.dataset.target;
            const targetElement = document.getElementById(`question-${targetId}`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        };
    });

    // Sidebar mobile toggle (optionnel si vous avez le bouton)
    const toggle = document.getElementById("sidebar-toggle");
    if (toggle) {
        toggle.onclick = () => {
            document.querySelector(".sidebar").classList.toggle("active");
        };
    }
});