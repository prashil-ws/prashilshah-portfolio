const listContainer = document.getElementById('word-list');
const board = document.getElementById('board');
const submitButton = document.getElementById("submitButton");
let gameOver = false;

const keyLayout = [
  [...'QWERTYUIOP'],
  [...'ASDFGHJKL'],
  ['ENTER', ...'ZXCVBNM', '←']
];
// const input = document.getElementById('guess-input');

let wordList = [];
let currentGuess = '';
let currentRow = 0;
let targetWord = '';
let enterButton;
let wordMeaning = '';
let tempWordMeaning = '';
let audioURL = '';
let tempAudioURL = '';

document.getElementById("submitButton").addEventListener("click", SubmitGuess);

async function loadWords() {
    const cached = localStorage.getItem('WordsList');

    if (cached){
        wordList = JSON.parse(cached);
        return wordList;
    }

    try{
        const res = await fetch('https://raw.githubusercontent.com/prashilshah98/wordle-list/refs/heads/main/words.txt');
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
    
    wordMeaning = tempWordMeaning;
    if(tempAudioURL){
        document.getElementById('playSound').style.display = "inline";
        audioURL = tempAudioURL;
    }
    return wordList[randomIndex];
}

async function checkIsWord(randomWord){
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        if(!wordMeaning){
            const data = await res.json();
            tempWordMeaning = data[0]?.meanings[0]?.definitions[0]?.definition;
            tempAudioURL = data[0]?.phonetics[0]?.audio;
        }        
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
    createKeyboard();
    focusFirstBox(currentRow);

    // submitButton.disabled = false;
});


function createBoard(rows = 6, cols = 5){
    for (let i = 0; i < rows; i++){
        const row = document.createElement('div');
        row.classList.add("row");

        for(let j = 0; j < cols; j++){            

            const input = document.createElement("input");
            input.setAttribute("maxLength", 1);
            input.setAttribute('readonly', 'readonly');
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
    if (enterButton) {
        enterButton.disabled = !isComplete;
    }
}

async function SubmitGuess() {
    
    const rowInputs = [...board.children[currentRow].children];
    const guess = rowInputs.map(input => input.value.toUpperCase()).join("");

    if(!(await checkIsWord(guess))){
        // alert('Not a valid word');
        showNotification('Not a valid word');
        // rowInputs.forEach(input => input.value = '')
        rowInputs[guess.length-1].focus();
        return;
    }

    const targetArray = targetWord.split('');
    const guessArray = guess.split('');
    const letterStatus = Array(5).fill('');
    const targetLetterUsed = Array(5).fill(false);

    for (let i = 0; i < 5; i++){
        if(guessArray[i] === targetArray[i]){
            letterStatus[i] = 'green';
            targetLetterUsed[i] = 'true';
        }
    }

    for(let i = 0; i< 5; i++){
        if(letterStatus[i] === ''){
            for(let j = 0; j < 5; j++){
                if(!targetLetterUsed[j] && guessArray[i] === targetArray[j]){
                    letterStatus[i] = 'yellow';
                    targetLetterUsed[j] = 'true';
                    break;
                }                
            }
            if(letterStatus[i] === '') letterStatus[i] = 'gray';
        }
    }

    // const row = board.children[currentRow];
    for(i = 0; i < 5; i++){
        /** @type {HTMLElement} */
        const input = rowInputs[i];
        const letter = guessArray[i];
        const keyBtn = document.querySelector(`.key[data-key="${letter.toUpperCase()}"]`);

        if (letterStatus[i] === 'green') {
            input.style.backgroundColor = "#538d4e";
            if (keyBtn) keyBtn.style.backgroundColor = "#538d4e";
        } else if (letterStatus[i] === 'yellow') {
            input.style.backgroundColor = "#b59f3b";
            if (keyBtn && keyBtn.style.backgroundColor !== "rgb(83, 141, 78)") {
                keyBtn.style.backgroundColor = "#b59f3b";
            }
        } else {
            input.style.backgroundColor = "#68686c";
            if (
                keyBtn &&
                keyBtn.style.backgroundColor !== "rgb(83, 141, 78)" &&
                keyBtn.style.backgroundColor !== "rgb(181, 159, 59)"
            ) {
                keyBtn.style.backgroundColor = "#68686c";
            }
        }
        input.disabled = true;
    }

    currentRow++;
    
    if(guess === targetWord){
        // alert("Correct word!!!");
        showResultDialog("Correct word!!", targetWord, wordMeaning);        
    }
    else if(currentRow === 6) {
        // alert("Out of guesses. Word was: "+ targetWord);
        showResultDialog("Oops! You lost", targetWord, wordMeaning);
    }

    if(currentRow < 6 && !gameOver){
        const nextRowInputs = board.children[currentRow].children;
        nextRowInputs[0].focus();
    }
    else{
        submitButton.disabled = true;
    }    

    if(!gameOver) focusFirstBox(currentRow);
    
    checkRowCompletion();

}

function createKeyboard() {
  const keyboardDiv = document.getElementById("keyboard");

  keyLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    row.forEach(key => {
        const button = document.createElement("button");
        button.textContent = key;
        if(key === "ENTER"){
            button.innerHTML = `<span class="enter-text">ENTER</span>`;
            button.classList.add("key", "key-enter");
            enterButton = button;
            enterButton.disabled = true;
        }
        else if (key === "←") {
            // button.innerHTML = `<span class="backspace-icon">⌫</span>`;
            button.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="game-icon" data-testid="icon-backspace"><path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>`
            button.classList.add("key", "key-backspace");
        } 
        else{
            button.textContent = key;
            button.classList.add("key");    
        }        
        button.setAttribute("data-key", key);    
        button.addEventListener("click", () => handleKeyPress(key));
        rowDiv.appendChild(button);
    });

    keyboardDiv.appendChild(rowDiv);
  });
}

function handleKeyPress(key){
    const row = board.children[currentRow];
    const inputs = [...row.querySelectorAll("input")];
    const currentInput = inputs.find(i => !i.value);
    
    if(!gameOver){
        if(key === "ENTER"){
            submitButton.click();
        }    
        else if(key === "←"){
            const filledInputs = inputs.filter(i => i.value);
            const lastFilled = filledInputs[filledInputs.length - 1];
            if(lastFilled){
                lastFilled.value = "";
                lastFilled.focus();
                
            }        
        }
        else if(/^[A-Z]$/.test(key)){
            if(currentInput){
                currentInput.value = key;
                currentInput.focus();
                const next  = currentInput.nextElementSibling;
                if(next && next.tagName === "INPUT"){
                    next.focus();
                }
            }
        }
        checkRowCompletion();
    }    
}

function showNotification(message){
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

function focusFirstBox(rowIndex) {
    const inputs = document.querySelectorAll(".box");

    inputs.forEach((input, index) => {
        const row = Math.floor(index / 5); // Assuming 5 letters per row
        input.disabled = row !== rowIndex;
    });

    const firstBox = inputs[rowIndex * 5];
    if (firstBox) firstBox.focus();
}

function showResultDialog(title, word, meaning) {
    gameOver = true;
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("correctWord").textContent = word.toUpperCase();
    document.getElementById("wordMeaning").textContent = meaning;
    document.getElementById("resultDialog").classList.remove("hidden");
    document.getElementById("reset-btn").style.display = "block";
}

function closeDialog() {
    document.getElementById("resultDialog").classList.add("hidden");
}

document.getElementById("new-word-btn").addEventListener("click", () => {
  location.reload(); 
});

document.getElementById("reset-btn").addEventListener("click", () => {
  location.reload(); 
});

function playSound(){
    const audio = new Audio(audioURL);
    audio.play();
}