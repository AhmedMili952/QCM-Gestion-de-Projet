/* ===========================================================
   SCRIPT FINAL — QCM
   =========================================================== */

const validateBtn = document.getElementById("validateBtn");
const resetBtn = document.getElementById("resetBtn");
const openAllBtn = document.getElementById("openAllBtn");
const scoreBox = document.getElementById("scoreBox");

let validated = false;

/* ============================ */
/*  LISTE DES BONNES RÉPONSES   */
/* ============================ */

const answers = {
    q1: "B",
    q2: "B",
    q3: "C",
    q4: "A",
    q5: "B",
    q6: "B",
    q7: "C",
    q8: "C",
    q9: "D",
    q10:"B",
    q11:"A",
    q12:"C",
    q13:"D",
    q14:"B",
    q15:"C",
    q16:"A",
    q17:"D",
    q18:"B",
    q19:"A",
    q20:"C",
    q21:"B",
    q22:"D",
    q23:"A",
    q24:"C",
    q25:"B",
    q26:"B",
    q27:"C",
    q28:"A",
    q29:"B",
    q30:"B"
};

/* ============================ */
/*       VALIDATION QCM        */
/* ============================ */

validateBtn.addEventListener("click", () => {
    if (validated) return;

    validated = true;
    let score = 0;

    Object.keys(answers).forEach(q => {
        const correct = answers[q];
        const inputs = document.querySelectorAll(`input[name="${q}"]`);
        const explanation = document.querySelector(`#${q} .explanation`);

        inputs.forEach(input => {
            const parent = input.parentElement;

            parent.style.pointerEvents = "none";

            if (input.value === correct) {
                parent.classList.add("correct");
            }

            if (input.checked && input.value === correct) {
                parent.classList.add("selected-correct");
                score++;
            }

            if (input.checked && input.value !== correct) {
                parent.classList.add("wrong");
            }
        });

        explanation.style.display = "block";
    });

    scoreBox.textContent = `Score : ${score} / 30`;
});

/* ============================ */
/*     RÉINITIALISATION         */
/* ============================ */

resetBtn.addEventListener("click", () => {
    location.reload();
});

/* ============================ */
/*   AFFICHER TOUTES LES EXPL   */
/* ============================ */

openAllBtn.addEventListener("click", () => {
    document.querySelectorAll(".explanation").forEach(exp => {
        exp.style.display = "block";
    });
});
