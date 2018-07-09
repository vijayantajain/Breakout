var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 0.5;
var dy = 0.5;
var ballRadius = 10;
var randomColor = "#0095DD";

function getRandomColor(){
    var rgb = "rgb(" + Math.floor(Math.random() * 256).toString(); 
    for(let i = 0; i < 2; i++){
        rgb += (',' + Math.floor(Math.random() * 256).toString() )
    }
    rgb += ")";
    return rgb;
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = randomColor;
    ctx.fill();
    ctx.closePath();
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    if (y + dy < ballRadius || y + dy > canvas.height-ballRadius){
        dy = (-1.08) * dy;
        randomColor = getRandomColor();
    }
    if (x + dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = (-1.08)*dx;
        randomColor = getRandomColor();
    }
    x += dx;
    y += dy;
}
setInterval(draw, 5);