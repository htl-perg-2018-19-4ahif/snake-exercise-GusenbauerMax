var ansi = require('ansi');
var keypress = require('keypress');

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

var heigth = 15;
var length = 40;
var cursor = ansi(process.stdout);
var snekX = 0;  
var snekY = 0;
var appleX = 0;
var appleY = 0;
var direction = 1;
var speed = 5;
var score = 0;

process.stdout.write('\x1Bc');
process.stdout.write('\x1B[?25l');

cursor.bg.grey();
drawLine (0, 1, 1);
drawLine (1, 1, 1);
drawLine (0, 1, heigth);
drawLine (1, length, 1);

process.stdin.on('keypress', handleInput);

drawApple();

createSnake();

startGame();


function startGame(){
    moveSnake();

    snakeEats();

    printScore("Score: " + score.toString());
    
    if (notDead()){
        setTimeout(startGame, 1000 / speed);
    }
}

function printScore(text){
    cursor.goto(0, 0).write(text);
}

function handleInput(chunk, key){
    switch(key.name) {
        case 'a':
            direction = 3;
            break;
        case 'w':
            direction = 4;
            break;
        case 's':
            direction = 2;
            break;
        case 'd':
            direction = 1;
            break;
        case 'q':
            exit();
    }
}

function snakeEats(){
    if (snekX == appleX && snekY == appleY){
        speed++;
        score += 10;
        drawApple();
    }

}

function notDead(){
    if (snekX == 1 || snekY == 1 || snekX == length || snekY == heigth){
        exit();
    }else{
        return true;
    }
}

function drawLine(type, posX, posY){
    if (type == 0){
        for (var i = 0; i < length; i++){
            cursor.goto(posX + i, posY).write(' ');
        }
    }else{
        for (var i = 0; i < heigth; i++){
            cursor.goto(posX, posY + i).write(' ');
        }
    }
}

function printPoint  (posX, posY){
    cursor.goto(posX, posY).write(' ');
}

function drawApple(){
    cursor.bg.red();
    appleX = Math.floor((Math.random() * (length-2)) + 2);
    appleY = Math.floor((Math.random() * (heigth-2)) + 2);
    cursor.goto(appleX, appleY).write(' ');
    cursor.reset();
}

function createSnake(){
    cursor.bg.green();
    do{
        snekX = Math.floor((Math.random() * (length-8)) + 8);
        snekY = Math.floor((Math.random() * (heigth-8)) + 8);
    }while(snekX != appleX && snekY != appleY);
    cursor.goto(snekX, snekY).write(' ');
    cursor.reset();
}

function moveSnake(){
    deleteSnake();
    getCoordinates();
    drawSnake();
}

function getCoordinates(){
    switch(direction) {
        case 1:
            snekX += 1;
            break;
        case 2:
            snekY += 1;
            break;
        case 3:
            snekX -= 1;
            break;
        case 4:
            snekY -= 1;
            break;
    }
}

function drawSnake(){
    cursor.bg.green();
    drawPoint(snekX, snekY);
    cursor.reset();
}

function deleteSnake(){
    cursor.bg.black();
    drawPoint(snekX, snekY);
    cursor.reset();
}

function drawPoint(x, y){
    cursor.goto(x, y).write(' ');
}

function exit(){
    cursor.goto(0, heigth+1);
    process.exit();
}