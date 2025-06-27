// Board
let board;
let boardHeight = 640;
let boardWidth = 360;
let aspectRatio = 360/640;
let context;

//bg
let background = new Image();
background.src = "./flappybirdbg.png";

//bird
let bird = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
let birdImg = new Image();
birdImg.src = "./flappybird.png";

//pipes
let pipeArray = [];
let pipeWidth = 0;
let pipeHeight = 0;
let pipeX = 0;
let pipeY = 0;
let topPipeImg = new Image();
topPipeImg.src = "./toppipe.png";
let bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png";

//physics
let velocityX = -2;     //pipes moving left velocity
let velocityY = 0;      //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;



window.onload = window.onresize = function() {
    board= document.getElementById("board");
    context = board.getContext("2d");

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    let targetHeight = windowHeight;
    let targetWidth = windowHeight * aspectRatio;

    if (targetWidth > windowWidth) {
        targetWidth = windowWidth;
        targetHeight = windowWidth / aspectRatio;
    }

    board.width = targetWidth;
    board.height = targetHeight;

    bird.width = board.width * (34 / 360);
    bird.height = board.height * (24 / 640);
    bird.x = board.width/8;
    bird.y = board.height/2;

    pipeWidth = board.width * (64/360);
    pipeHeight = board.height * (512/640);
    pipeX = board.width;
    pipeY = 0;

    background.onload = () => draw();
    if (background.complete) draw();        

    requestAnimationFrame(update);
    
    placePipes(); // Place first pipe immediately
    setInterval(placePipes, 1500); // Then repeat every 1500ms
    
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", function(e) {
        velocityY = -6;
    });

    document.getElementById("resetBtn").addEventListener("click", function () {
        // Reset variables
        bird.y = board.height / 2;
        velocityY = 0;
        pipeArray = [];
        score = 0;
        gameOver = false;

        // Hide reset button
        this.style.display = "none";
        document.getElementById("gameOverBox").style.display = "none";
        document.getElementById("scoreTextBox").style.display = "none";

    });

}

function draw() {
    context.drawImage(background, 0, 0, board.width, board.height);

    velocityY += gravity;

    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    //draw pipes
    for (let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        //add score
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;   //teo pipes hence 0.5*2 = 1
            pipe.passed = true;
        }

        if(detectCollision (bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        document.getElementById("resetBtn").style.display = "block";
        return;
    }

    context.clearRect(0, 0, board.width, board.height)
    draw();

    //score
    if (!gameOver) {
        context.font = "45px sans-serif";
        context.lineWidth = 4;
        context.strokeStyle = "black";
        context.strokeText(score, 10, 45);
        context.fillStyle = "white";
        context.fillText(score, 10, 45);
    }       

    if(gameOver){

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("flappyHighScore", highScore);
        }

        // Show game over box
        document.getElementById("gameOverBox").style.display = "block";
        document.getElementById("scoreTextBox").style.display = "block";
        document.getElementById("yourScoreText").innerText = "Your Score: " + score;
        document.getElementById("highScoreText").innerText = "High Score: " + highScore;
            
    }
    
}

function placePipes() {

    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random() * pipeHeight/2;
    let openingSpace = board.height/4;
    
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        velocityY = -6;        
    }
}

function detectCollision(b, p){
    return  b.x < p.x + p.width && 
            b.x + b.width > p.x &&
            b.y < p.y + p.height &&
            b.y + b.height > p.y;
}

