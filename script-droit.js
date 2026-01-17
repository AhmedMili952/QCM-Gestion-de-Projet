

const bonnesReponses = {
    1: "B",
    2: "B",
    3: "B",
    4: "A",
    5: "B",
    6: "C",
    7: "C",
    8: "B",
    9: "B",
    10: "B",
    11: "C",
    12: "B",
    13: "C",
    14: "A",
    15: "C"
};

function mélangerTout() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const container = q.querySelector(".qcm-options");
        const labels = Array.from(container.querySelectorAll("label"));
        for (let i = labels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labels[i], labels[j]] = [labels[j], labels[i]];
        }
        container.innerHTML = "";
        labels.forEach(l => {
            const input = l.querySelector("input");
            input.checked = false; 
            input.disabled = false;
            container.appendChild(l);
        });
    });
}

function corrigerQCM() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        const id = q.dataset.question;
        const panel = q.querySelector(".correction-panel");
        const sideBtn = document.querySelector(`.nav-question[data-target="${id}"]`);
        const solution = bonnesReponses[id];
        
        panel.classList.add("visible");

        const inputs = Array.from(q.querySelectorAll("input"));
        const selectedInput = inputs.find(i => i.checked);
        const userChoice = selectedInput ? selectedInput.value : null;
        
        inputs.forEach(i => i.disabled = true);
        
        sideBtn.classList.remove("good", "bad", "missing");
        
        if (userChoice) {
            const isGood = (userChoice === solution);
            q.style.borderLeft = isGood ? "8px solid #00ff80" : "8px solid #ff5252";
            sideBtn.classList.add(isGood ? "good" : "bad");
        } else {
            sideBtn.classList.add("missing");
            q.style.borderLeft = "8px solid #ff9f43";
        }
    });
    score();
}

function resetQCM() {
    document.querySelectorAll(".qcm-question").forEach(q => {
        q.style.borderLeft = "none";
        const inputs = q.querySelectorAll("input");
        inputs.forEach(i => { i.checked = false; i.disabled = false; });
        q.querySelector(".correction-panel").classList.remove("visible");
    });
    document.querySelectorAll(".nav-question").forEach(btn => {
        btn.classList.remove("good", "bad", "missing");
    });
    document.getElementById("score-result").textContent = "Score : — / 15";
    mélangerTout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function score() {
    const ok = document.querySelectorAll(".nav-question.good").length;
    document.getElementById("score-result").textContent = `Score : ${ok} / ${NbQuestions}`;
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