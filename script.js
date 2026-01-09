/* ===========================================================
   CONFIGURATION & DONNÉES (CORRESPONDANCE EXACTE)
   =========================================================== */
const bonnesReponses = {
    1: "Coût, Délai, Qualité",
    2: "Planification",
    3: "C",
    4: "B",
    5: "A",
    6: "A",
    7: "D",
    8: "B",
    9: "A",
    10: ["Environnement", "Économique", "Social"],
    11: "GIEC",
    12: "1988",
    13: "A",
    14: "9",
    15: "Conséquences",
    16: "2015",
    17: "Risque",
    18: "DIC",
    19: "B",
    20: "Disponibilité",
    21: "A",
    22: "Impacts",
    23: "B",
    24: "Yes",
    25: "C",
    26: "C",
    27: "5R",
    28: "Obsolescence",
    29: "Cycle",
    30: "Ethique",
    31: "RSE",
    32: "IA",
    33: "Rectitude",
    34: "Philosophie"
};

const LETTRES = ["A", "B", "C", "D", "E", "F"];

/* ===========================================================
   FONCTION DE MÉLANGE (Version SANS LETTRES)
   =========================================================== */
function mélangerTout() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        if (q.dataset.type === "text") return;

        const container = q.querySelector(".qcm-options");
        const labels = Array.from(container.querySelectorAll("label"));
        
        // Mélange de Fisher-Yates
        for (let i = labels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labels[i], labels[j]] = [labels[j], labels[i]];
        }

        container.innerHTML = "";
        labels.forEach((label) => {
            const input = label.querySelector("input");
            
            // On récupère le texte en nettoyant les anciens préfixes (lettres ou chiffres)
            let texteBrut = label.textContent.replace(/^[A-F0-9][\.\s-]*/gi, "").trim();
            
            input.checked = false; 
            input.disabled = false; 
            
            label.innerHTML = ""; 
            label.appendChild(input); 
            
            // MODIFICATION ICI : On ajoute juste le texte, sans le <strong>A. </strong>
            label.appendChild(document.createTextNode(" " + texteBrut));
            
            container.appendChild(label);
        });
    });
}

/* ===========================================================
   LOGIQUE DE CORRECTION
   =========================================================== */
function corrigerQCM() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const type = q.dataset.type;
        const panel = q.querySelector(".correction-panel");
        const sideBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        const solution = bonnesReponses[id];

        panel.classList.add("visible");

        if (type === "text") {
            const area = q.querySelector("textarea");
            area.disabled = true;
            if (!q.querySelector(".manual-validation")) {
                const divVal = document.createElement("div");
                divVal.className = "manual-validation";
                divVal.innerHTML = `
                    <button class="btn-juste" onclick="validerManuel('${id}', true)">J'ai juste</button>
                    <button class="btn-faux" onclick="validerManuel('${id}', false)">J'ai faux</button>
                `;
                panel.appendChild(divVal);
            }
            if (area.value.trim() === "" && sideBtn) sideBtn.classList.add("missing");
        } 
        else if (type === "single") {
            const check = q.querySelector('input:checked');
            const inputs = q.querySelectorAll('input');
            inputs.forEach(i => i.disabled = true);

            if (check) {
                if (check.value === solution) {
                    q.style.borderLeft = "8px solid #00ff80";
                    if (sideBtn) sideBtn.classList.add("good");
                } else {
                    q.style.borderLeft = "8px solid #ff5252";
                    if (sideBtn) sideBtn.classList.add("bad");
                }
            } else {
                if (sideBtn) sideBtn.classList.add("missing");
            }
        }
        else if (type === "multiple") {
            const checks = Array.from(q.querySelectorAll('input:checked')).map(i => i.value);
            const inputs = q.querySelectorAll('input');
            inputs.forEach(i => i.disabled = true);

            const estJuste = solution.every(val => checks.includes(val)) && checks.length === solution.length;

            if (checks.length > 0) {
                if (estJuste) {
                    q.style.borderLeft = "8px solid #00ff80";
                    if (sideBtn) sideBtn.classList.add("good");
                } else {
                    q.style.borderLeft = "8px solid #ff5252";
                    if (sideBtn) sideBtn.classList.add("bad");
                }
            } else {
                if (sideBtn) sideBtn.classList.add("missing");
            }
        }
    });
    actualiserScore();
}

window.validerManuel = function(id, estJuste) {
    const sideBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
    const q = document.getElementById(`question-${id}`);
    sideBtn.classList.remove("missing", "bad", "good");
    if (estJuste) {
        sideBtn.classList.add("good");
        q.style.borderLeft = "8px solid #00ff80";
    } else {
        sideBtn.classList.add("bad");
        q.style.borderLeft = "8px solid #ff5252";
    }
    actualiserScore();
};

function actualiserScore() {
    const total = document.querySelectorAll(".qcm-question").length;
    const ok = document.querySelectorAll(".nav-question.good").length;
    const scoreEl = document.getElementById("score-result");
    if (scoreEl) scoreEl.textContent = `Score : ${ok} / ${total}`;
}

function resetQCM() {
    document.querySelectorAll("input").forEach(i => { i.checked = false; i.disabled = false; });
    document.querySelectorAll("textarea").forEach(t => { t.value = ""; t.disabled = false; });
    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.borderLeft = "none";
        const panel = q.querySelector(".correction-panel");
        if (panel) panel.classList.remove("visible");
        const manual = q.querySelector(".manual-validation");
        if (manual) manual.remove();
    });
    document.querySelectorAll(".nav-question").forEach(btn => btn.classList.remove("good", "bad", "missing"));
    document.getElementById("score-result").textContent = "Score : — / 34";
    mélangerTout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
    mélangerTout();
    document.getElementById("validate-qcm").onclick = corrigerQCM;
    document.getElementById("reset-qcm").onclick = resetQCM;
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.onclick = () => {
            const target = document.getElementById(`question-${btn.dataset.target}`);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        };
    });
});

