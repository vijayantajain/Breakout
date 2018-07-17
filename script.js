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
let y = CANVAS.height - 50;
let dx = 1;
let dy = -1;
let paddleX = (CANVAS.width - PADDLE_WIDTH) / 2;
let rightPressed = false;
let lefttPressed = false;
let bricks = [];
let score = 0;

//Initialize the bricks array
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
 * This function detects collision with all the bricks
 * 
 * It loops through all the bricks and then compares if the
 * center of the ball is within the bounding area of the brick.
 * If it is then it considers a collision. After detecting collision
 * it changes the status of the brick and increases the score.
 * In case all the bricks have been hit it displays a "You have won"
 * message.
 */

function brickBallCollisionDetection() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            let brick = bricks[c][r];

            if (ballCollidesBrick(brick)) {
                    brick.status = 0;
                    dy = -dy;
                    score += 2;

                    if (score === BRICK_COLUMN_COUNT * BRICK_ROW_COUNT * 2){
                        alert("You won! Congratulations");
                        document.location.reload();
                    }
            }
        }
    }
}

/**
 * This function compares detects collision between a given brick
 * and the ball
 * @param {BRICK} brick The brick object
 * 
 * It compares if the center of the ball is within the bounding box
 * of the brick, if it is then it is considered a collision.
 */
function ballCollidesBrick(brick){
    let collision = false;
    if (x > brick.x &&
        x < brick.x + BRICK_WIDTH &&
        y > brick.y &&
        y < brick.y + BRICK_HEIGHT &&
        brick.status === 1) {
            collision = true;
        }
    
    return collision;
}

/**
 * This function draws the blue ball at every iteration of the `draw` loop.
 */
function drawBall() {
    CONTEXT.beginPath();
    CONTEXT.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    CONTEXT.fillStyle = BALL_COLOR;
    CONTEXT.fill();
    CONTEXT.closePath();
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

/**
 * A simple collision detection function for ball and paddle
 * where it checks if the center of the ball is within the left
 * and right edge of the paddle. If it is then it does collide
 * with the paddle
 */
function ballCollidesPaddle(){
    let collision = false;

    if (x > paddleX && x < paddleX + PADDLE_WIDTH){
        collision = true;
    }

    return collision;
}

/**
 * Detects collision with the walls
 * 
 * The first condition checks for collision with the side walls
 * The second checks for collision with the top wall and the last
 * one checks for collision with the floor and paddle
 */
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
 * Draw the score
 */
function drawScore(){
    CONTEXT.font = "16px Arial";
    CONTEXT.fillStyle = "#0095DD";
    CONTEXT.fillText("Score: " + score, 8, 20);
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
    drawScore();

    updateBallPosition();
    updatePaddlePosition();
    brickBallCollisionDetection();
    requestAnimationFrame(draw);
}

draw();