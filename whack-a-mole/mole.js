let currMoleTile;
let currPlantTile;
let score = 0;
let highScore = 0;
let gameOver = false;
let moleInterval, plantInterval;

document.addEventListener("DOMContentLoaded", () => {
    //const startBtn = document.getElementById("startBtn");
    const gameDialog = document.getElementById("gameDialog");
    const overlay = document.getElementById("overlay");
    const board = document.getElementById("board");
    const scoreText = document.getElementById("score");
    highScore = parseInt(localStorage.getItem("whackHighScore")) || 0;
    updateHighScoreDisplay();

        gameDialog.showModal();
        showStartOverlay();
        createBoard();


    function showStartOverlay() {
        overlay.innerHTML = `
            <h1 class="game-title">Whack A Mole</h1>
            <div id="start-buttons">
                <button id="playBtn">Play</button>
            </div>
        `;
        overlay.style.display = "flex";

        document.getElementById("playBtn").addEventListener("click", startGame);
    }

    function showGameOverOverlay() {
        overlay.innerHTML = `
            <h1 class="game-title">Game Over</h1>
            <p class="final-score">High Score: ${highScore}</p>
            <p class="final-score">Your Score: ${score}</p>
            <div id="start-buttons">
                <button id="restartBtn">Restart</button>                
            </div>
        `;
        overlay.style.display = "flex";

        document.getElementById("restartBtn").addEventListener("click", startGame);
        // document.getElementById("exitBtn").addEventListener("click", () => {
        //     gameDialog.close();
        //     clearIntervals();
        // });
    }

    function createBoard() {
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            let tile = document.createElement("div");
            tile.id = i.toString();
            tile.addEventListener("click", selectTile);
            board.appendChild(tile);
        }
    }

    function startGame() {
        score = 0;
        gameOver = false;
        currMoleTile = null;
        currPlantTile = null;
        scoreText.innerText = "Score: " + score.toString();
        overlay.style.display = "none";

        createBoard();
        clearIntervals();
        moleInterval = setInterval(setMole, 1500);
        plantInterval = setInterval(setPlant, 2500);
    }

    function clearIntervals() {
        clearInterval(moleInterval);
        clearInterval(plantInterval);
    }

    function endGame() {
        gameOver = true;
        clearIntervals();
        showGameOverOverlay();
    }

    function selectTile() {
        if (gameOver) return;

        if (this === currMoleTile) {
            score += 10;
            document.getElementById("score").innerText = "Score: " + score.toString();

            // Show +10 animation
            const gain = document.getElementById("scoreGain");
            gain.innerText = "+10";
            gain.style.animation = "none"; // reset
            void gain.offsetWidth;         // trigger reflow
            gain.style.animation = "gainFade 0.8s ease-out";

            currMoleTile.innerHTML = "";
            currMoleTile = null;

            if (score > highScore) {
                highScore = score;
                localStorage.setItem("whackHighScore", highScore);
                updateHighScoreDisplay();
            }

        }
        else if (this === currPlantTile) {
            endGame();
        }
    }

    function getRandomTile() {
        return Math.floor(Math.random() * 9).toString();
    }

    function setMole() {
        if (gameOver) return;

        if (currMoleTile) currMoleTile.innerHTML = "";

        let mole = document.createElement("img");
        mole.src = "./monty-mole.png";

        let num = getRandomTile();
        if (currPlantTile && currPlantTile.id === num) return;

        currMoleTile = document.getElementById(num);
        currMoleTile.appendChild(mole);
    }

    function setPlant() {
        if (gameOver) return;

        if (currPlantTile) currPlantTile.innerHTML = "";

        let plant = document.createElement("img");
        plant.src = "./piranha-plant.png";

        let num = getRandomTile();
        if (currMoleTile && currMoleTile.id === num) return;

        currPlantTile = document.getElementById(num);
        currPlantTile.appendChild(plant);
    }

    function updateHighScoreDisplay() {
        document.getElementById("high-score").innerText = `High Score: ${highScore}`;
    }
});
