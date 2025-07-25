const listContainer = document.getElementById('word-list');
const board = document.getElementById('board');
const submitButton = document.getElementById("submitButton");

// const input = document.getElementById('guess-input');

let wordList = [];
let currentGuess = '';
let currentRow = 0;
let targetWord = '';



async function loadWords() {
    const cached = localStorage.getItem('WordsList');

    if (cached){
        wordList = JSON.parse(cached);
        return wordList;
    }

    try{
        const res = await fetch('https://raw.githubusercontent.com/tabatkins/wordle-list/main/words');
        const text = await res.text();
        wordList = text.split('\n');
        localStorage.setItem('WordsList', JSON.stringify(wordList));
        return wordList;
    }
    catch(err){
        console.error("Error loading words: ", err);
        return [];
    }
}

async function getRandomWord(){
    if(wordList.length === 0){
        console.log("Words list not loaded yet.");
        return null;
    }

    let isWord = false;
    let randomIndex = 0;

    while(!isWord){
        randomIndex = Math.floor(Math.random() * wordList.length);
        isWord = await checkIsWord(wordList[randomIndex]);
    }
    
    return wordList[randomIndex];
}

async function checkIsWord(randomWord){
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        return res.ok;
    }   
    catch(error) {
        console.error(error);
        return false;
    }
}


loadWords().then(async () => {
    targetWord = (await getRandomWord()).toUpperCase();
    createBoard();
    // submitButton.disabled = false;
});


function createBoard(rows = 6, cols = 5){
    for (let i = 0; i < rows; i++){
        const row = document.createElement('div');
        row.classList.add("row");

        for(let j = 0; j < cols; j++){            

            const input = document.createElement("input");
            input.setAttribute("maxLength", 1);
            input.classList.add("box");
            input.dataset.row = i;
            input.dataset.col = j;

            input.addEventListener("keydown", (e) => {
                const key = e.key;

                if (!/^[a-zA-Z]$/.test(key) && key !== "Backspace" && key !== "Tab") {
                    e.preventDefault(); 
                }
            });


            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.toUpperCase();
                const next = e.target.nextElementSibling;
                if(next && next.tagName === "INPUT"){
                    next.focus();
                }

                checkRowCompletion();
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !e.target.value) {
                    const prev = e.target.previousElementSibling;
                    if (prev && prev.tagName === "INPUT") {
                        prev.focus();
                        prev.value = ""; // optionally clear the previous box too
                        e.preventDefault(); // prevent default backspace behavior
                    }
                }
            });        

            row.appendChild(input);
        }
        board.appendChild(row);
    }
}

function checkRowCompletion() {
    const rowInputs = [...board.children[currentRow].children];
    const isComplete = rowInputs.every(input => input.value.trim() !== "");
    submitButton.disabled = !isComplete;
}

async function SubmitGuess() {
    
    const rowInputs = [...board.children[currentRow].children];
    const guess = rowInputs.map(input => input.value.toUpperCase()).join("");

    if(!(await checkIsWord(guess))){
        alert('Not a valid word');
        rowInputs.forEach(input => input.value = '')
        rowInputs[0].focus();
        return;
    }

    const row = board.children[currentRow];
    for(i = 0; i < 5; i++){
        /** @type {HTMLElement} */
        const input = rowInputs[i];

        if(guess[i] === targetWord[i]){
            input.style.backgroundColor = "#538d4e";
        } else if(targetWord.includes(guess[i])){
            input.style.backgroundColor = "#b59f3b";
        } else {
            input.style.backgroundColor = "#68686cff";
        }
        input.disabled = true;
    }

    currentRow++;

    if(currentRow < 6){
        const nextRowInputs = board.children[currentRow].children;
        nextRowInputs[0].focus();
    }
    else{
        submitButton.disabled = true;
    }

    if(guess === targetWord){
        alert("Correct word!!!");
    }
    else if(currentRow === 6) {
        alert("Out of guesses. Word was: "+ targetWord);
    }


}