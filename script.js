/* ===========================================================
   SCRIPT FINAL — Gestion QCM
   -----------------------------------------------------------
   ✔ Bloque les réponses après validation
   ✔ Colore VERT ou ROUGE la réponse sélectionnée
   ✔ Affiche toutes les explications automatiquement
   ✔ Score animé au centre en haut
   ✔ Reset complet
   =========================================================== */

document.getElementById("validate-btn").addEventListener("click", validateQCM);
document.getElementById("reset-btn").addEventListener("click", resetQCM);

function validateQCM() {
    let score = 0;
    const total = 30;

    // parcourt toutes les questions
    for (let i = 1; i <= total; i++) {

        const questionName = "q" + i;
        const selected = document.querySelector(`input[name=${questionName}]:checked`);
        const correctionPanel = document.querySelector(`#q${i}-block .correction-panel`);

        // récupère la bonne réponse (dans le panel)
        const good = correctionPanel.querySelector("p b").innerText.replace("Bonne réponse :", "").trim();

        // colore les réponses
        const labels = document.querySelectorAll(`#q${i}-block .qcm-options label`);

        labels.forEach(label => label.classList.remove("correct-answer", "wrong-answer"));

        if (selected) {
            const value = selected.value;

            if (value === good) {
                score++;
                selected.parentElement.classList.add("correct-answer");
            } else {
                selected.parentElement.classList.add("wrong-answer");

                // met la bonne réponse en vert
                labels.forEach(l => {
                    if (l.innerText.trim().startsWith(good)) {
                        l.classList.add("correct-answer");
                    }
                });
            }
        }

        // bloque les boutons radio
        const radios = document.querySelectorAll(`#q${i}-block input[type=radio]`);
        radios.forEach(r => r.disabled = true);

        // affiche le panneau d’explication
        correctionPanel.classList.add("visible");
    }

    // affiche le score
    const scoreBox = document.getElementById("score-result");
    scoreBox.innerText = `Score : ${score} / ${total}`;
    scoreBox.classList.add("visible");
}


function resetQCM() {
    const total = 30;

    for (let i = 1; i <= total; i++) {

        const block = document.getElementById(`q${i}-block`);
        const labels = block.querySelectorAll(".qcm-options label");
        const radios = block.querySelectorAll("input[type=radio]");
        const panel = block.querySelector(".correction-panel");

        // reset radio
        radios.forEach(r => {
            r.checked = false;
            r.disabled = false;
        });

        // reset couleurs
        labels.forEach(l => l.classList.remove("correct-answer", "wrong-answer"));

        // cacher explications
        panel.classList.remove("visible");
    }

    // cacher score
    const scoreBox = document.getElementById("score-result");
    scoreBox.classList.remove("visible");
    scoreBox.innerText = "";
}
