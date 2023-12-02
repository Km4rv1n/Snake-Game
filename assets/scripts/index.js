const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const resetBtn = document.getElementById("resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const unitSize = 25;
const gameOverModal = document.getElementById("gameOverModal");
const pauseBtn = document.getElementById("pauseBtn");
const pauseGameModal = document.getElementById("pauseGameModal");
const highScoreSpn = document.getElementById("highScoreSpn");
const scoreSpn = document.getElementById("scoreSpn");
const resumeBtn = document.getElementById("resumeBtn");

let timeoutId;
let speed = 100; // default speed is medium
let running = false;
let paused = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);


function gameStart(){
    gameOverModal.hidden = true;
    
    let preferredSpeed = JSON.parse(localStorage.getItem("speed")); 
    if(preferredSpeed != null)
       speed = preferredSpeed;


   pauseBtn.style.display = "block";

    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

function nextTick(){

     if(running){
        timeoutId =  setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, speed);
    }

    else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);

    snake.forEach(snakePart =>{
        if(snakePart.x == foodX && snakePart.y == foodY){
            createFood();
        }
    });
};

function drawFood(){
    ctx.fillStyle = "red";
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    ctx.strokeRect(foodX,foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }     
};

function drawSnake(){
    ctx.fillStyle = "rgb(6, 169, 6)";
    ctx.strokeStyle = "black";

    ctx.fillRect(snake[0].x, snake[0].y, unitSize, unitSize);
    ctx.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize);

    ctx.fillStyle = "white";
    ctx.fillRect(snake[0].x+20, snake[0].y-2, unitSize-20, unitSize-20);
    ctx.fillRect(snake[0].x, snake[0].y-2, unitSize-20, unitSize-20);



    for(let i = 1; i < snake.length; i+=1){
        if(i%2 == 1)
        ctx.fillStyle = "rgb(126, 197, 126)";

        else
        ctx.fillStyle = "rgb(99, 156, 99)";

        ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
        ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize);
    }
};

function changeDirection(event){
    const keyPressed = event.keyCode;

    if(!running){ //to prevent input when the game is not running
        return;
    }

    if(keyPressed != 80 && paused){ //to prevent changing direction when the game is paused
        return
    }
    // LEFT = 37; a = 65
    // UP = 38; w = 87 
    // RIGHT = 39; d = 68
    //  DOWN = 40; s = 83

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == 80):
             pauseGame();
             break;
        case((keyPressed == 37 || keyPressed == 65) && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case((keyPressed == 38 || keyPressed == 87) && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case((keyPressed == 39 || keyPressed == 68) && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case((keyPressed == 40 || keyPressed == 83) && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }
    //check for overlapping body parts
    for(let i = 1; i < snake.length; i+=1){ // not starting from head
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){ //overlap occurs
            running = false;
        }
    }
};

function displayGameOver(){
   
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    const highScore = Math.max(...scores);
   
    if(highScore === score){
        highScoreSpn.textContent = "New High Score!";
        highScoreSpn.style.color = "red";
    }
    
    else{
        highScoreSpn.textContent = "Score to beat: "+ highScore.toString();
        highScoreSpn.style.color = "#39FF14";
    }

    scoreSpn.textContent = "Final Score: "+score.toString();

    //resetBtn.hidden = false;
    gameOverModal.hidden = false;
    pauseBtn.style.display = "none";
    localStorage.setItem('scores', JSON.stringify(scores));
    highScoreSpn.hidden = true;
    running = false;
};

function resetGame(){
    resetBtn.style.display = "none";
    pauseBtn.style.display = "none";

    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};

function pauseGame(){
    paused = !paused;

    if(paused){
        clearTimeout(timeoutId);
        pauseGameModal.hidden = false;
    }

    else
       resumeGame();

}

function resumeGame(){
    pauseGameModal.hidden = true;
        nextTick();
}


const mainMenuButtons = document.querySelectorAll(".mainMenuBtn");
mainMenuButtons.forEach(btn =>{
btn.addEventListener("click",function(){
    window.location.href = "menu.html";
});
});

const restartGameButtons = document.querySelectorAll(".restartGameBtn");
restartGameButtons.forEach(btn =>{
btn.addEventListener("click",function(){
    clearBoard();
    paused = false;
    pauseBtn.style.display = "none";
    gameOverModal.hidden = true;
    pauseGameModal.hidden = true;
    scoreText.textContent = "0";
    resetBtn.style.display = "block";
});
});

resumeBtn.addEventListener("click",function(){
    paused = false;
    resumeGame();
});

pauseBtn.addEventListener("click",pauseGame);