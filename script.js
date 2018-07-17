// Constants
const CANVAS = document.getElementById("myCanvas");
const CONTEXT = CANVAS.getContext("2d");
const BALL_RADIUS = 10;
const PADDLE_WIDTH = 75;
const PADDLE_HEIGHT = 10;
const BRICK_ROW_COUNT = 4;
const BRICK_COLUMN_COUNT = 5;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;
const BALL_COLOR = "#0095DD";
const PADDLE_COLOR = "#FF7700";
const BRICK_COLOR = "#AF3131"

// Variables
let x = CANVAS.width/2;
let y = CANVAS.height/2;
let dx = 1;
let dy = -1;
let paddleX = (CANVAS.width - PADDLE_WIDTH) / 2;
let rightPressed = false;
let lefttPressed = false;
let bricks = [];

for(let c = 0; c < BRICK_COLUMN_COUNT; c++){
    bricks[c] = []
    for (let r = 0; r < BRICK_ROW_COUNT; r++){
        bricks[c][r] = {x: 0, y:0, status: 1};
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

/**
 * This function draws the paddle `paddleX` position. The position of the paddle is modified
 * in the 'draw' loop
 */
function drawPaddle(){
    CONTEXT.beginPath();
    CONTEXT.rect(paddleX, CANVAS.height-PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    CONTEXT.fillStyle = PADDLE_COLOR;
    CONTEXT.fill();
    CONTEXT.closePath();
}

/**
 * This function draws the blue ball at every iteration of the `draw` loop.
 */
function drawBall(){
    CONTEXT.beginPath();
    CONTEXT.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    CONTEXT.fillStyle = BALL_COLOR;
    CONTEXT.fill();
    CONTEXT.closePath();
}

function brickBallCollisionDetection(){
    for(let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for(let r = 0; r < BRICK_ROW_COUNT; r++) {
            let brick = bricks[c][r];

            if (x > brick.x &&
                x < brick.x + BRICK_WIDTH &&
                y > brick.y &&
                y < brick.y + BRICK_HEIGHT &&
                brick.status === 1){
                    brick.status = 0;
                    dy = -dy;
            }
        }
    }
}
/**
 * This function draws the bricks at every iteration of the 'draw loop.
 * 
 * It draws the brick column-wise.
 * 
 * The function first finds the coordinates of the brick rectangular based
 * on its position and the padding then it saves in the `bricks` var
 */
function drawBricks() {
    for(let c = 0; c < BRICK_COLUMN_COUNT; c++){
        for(let r = 0; r < BRICK_ROW_COUNT; r++){
            let brickX = ((c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT);
            let brickY = ((r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP);

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            if (bricks[c][r].status === 1){
                CONTEXT.beginPath();
                CONTEXT.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                CONTEXT.fillStyle = BRICK_COLOR;
                CONTEXT.fill();
                CONTEXT.closePath();
            }
        }
    }
}

function ballCollidesPaddle(){
    let collision = false;

    if (x > paddleX && x < paddleX + PADDLE_WIDTH){
        collision = true;
    }

    return collision;
}

function updateBallPosition(){
    // If the ball collides with the wall on the sides
    if (x + dx < BALL_RADIUS || x + dx > CANVAS.width - BALL_RADIUS) {
        dx = -dx;
    }
    // If the ball collides with the top wall
    if (y + dy < BALL_RADIUS) {
        dy = -dy;
    }
    // If the ball collides with the paddle then change the direction
    // else say game over
    else if (y + dy > (CANVAS.height - BALL_RADIUS)) {
        if (ballCollidesPaddle()) {
            dy = -dy;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
        }
    }
    x += dx;
    y += dy;
}

/**
 * Function updates the position of the paddle.
 * 
 * It checks for boundary conditions of if the paddle is not
 * drawn out of the screen.
 */
function updatePaddlePosition(){

    if (rightPressed && (paddleX < CANVAS.width - PADDLE_WIDTH)) {
        paddleX += 3;
    } else if (lefttPressed && paddleX > 0) {
        paddleX -= 3;
    }
}

/**
 * The main draw loop that updates all the elements
 * 
 * The function first clears the window screen to redraw everything.
 * After `clearRect` the loop draws the ball, the paddle and then all
 * bricks. After drawing the ball, paddle, and the bricks the loop then updates the
 * positional parameters of the ball and the paddle. For ball, it does collision
 * detection with the walls and the paddle. For paddle it ensures that it does not
 * draw it beyond the canvas.
 */
function draw(){
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

    drawBall();
    drawPaddle();
    drawBricks();

    updateBallPosition();
    updatePaddlePosition();
    brickBallCollisionDetection();
}

setInterval(draw, 5);