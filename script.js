var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var dx = 1;
var dy = -1;
var ballRadius = 10;
var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var lefttPressed = false;
var brickRowCount = 4;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 25;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
var ballColor = "#0095DD";
var paddleColor = "#FF7700";
var brickColor = "#AF3131"

for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = []
    for (var r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y:0};
    }
}

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

/**
 * This function handles the event when a key is pressed. It changes the
 * variables 'rightPressed' and 'leftPressed' to true.
 * @param {Event} e The event passed by the addEventListener function
 */
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        lefttPressed = true;
    }
}
/**
 * This function handles the event when the key is released after being pressed
 * It releases
 * @param {Event} e The event passed by the addEventListener function
 */
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        lefttPressed = false;
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            var brickX = ((c * (brickWidth + brickPadding)) + brickOffsetLeft);
            var brickY = ((r * (brickHeight + brickPadding)) + brickOffsetTop);

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = brickColor;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();

    if (x + dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = -dx;
    }

    if (y + dy < ballRadius ) {
        dy = -dy;
    } 
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
        }
    }

    
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 3;
    } else if (lefttPressed && paddleX > 0) {
        paddleX -= 3;
    }

    x += dx;
    y += dy;
}

setInterval(draw, 5);