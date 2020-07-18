
const createButton = document.getElementById("create");
const gravityCheckbox = document.getElementById("gravity");
const gravity0HighestScoreP = document.getElementById("gravity0HighestScore");
const gravity1HighestScoreP = document.getElementById("gravity1HighestScore");

if(!localStorage.getItem(`highestScore_gravity1`)) {
    localStorage.setItem(`highestScore_gravity0`, 0);
    localStorage.setItem(`highestScore_gravity1`, 0);
}

createButton.addEventListener("click", e => {
    const child = window.open("./child/", "", "width=200,height=200");
    window.addEventListener("message", e => {
        const data = e.data;
        const type = data.type;
        if(type === "INIT") {
            child.postMessage({
                gravity : gravityCheckbox.checked
            }, "*");
        } else if(type === "SCORE") {
            const { options, score } = data;
            const itemId = `highestScore_gravity${options.gravity ? 1 : 0}`;
            const prevMaxScore = parseInt(localStorage.getItem(itemId));
            if(score > prevMaxScore)
                localStorage.setItem(itemId, score);
            updateScoreView();
        }
    });
});

function updateScoreView() {
    gravity0HighestScoreP.innerText = localStorage.getItem(`highestScore_gravity0`);
    gravity1HighestScoreP.innerText = localStorage.getItem(`highestScore_gravity1`);
}

updateScoreView();