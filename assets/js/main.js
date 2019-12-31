let maxWidth = $(window).width() * 0.7;

let gamePiece;
let gameObstacle;
let gameArea = {
    // Define width (and/or height) here to prevent stretching when drawing
    canvas: $(`<canvas id='display' width='${maxWidth}' height='500px'>`),
    start: function() {
        this.canvas.css("border", "2px solid black");
        this.context = this.canvas[0].getContext('2d');
        $(document.body).prepend(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    }
}

$(document).ready(function () {
     gameArea.start();
     gamePiece = new component(10, 10, "darkgreen", 25, 25);
     gameObstacle = new component(5, 300, "red", 150, 300);
     ConfigureButtons();
})

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
    this.x = x;
    this.y = y;

    this.update = function() {
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    gameArea.clear();
    gameObstacle.update();
    gamePiece.newPos();
    gamePiece.update();
}

function ConfigureButtons() {
    document.onkeydown = function(event) {
        switch (event.code) {
            case "ArrowLeft":
                MoveLeft();
                break;
            case "ArrowRight":
                MoveRight();
                break;
            case "ArrowUp":
                MoveUp();
                break;
            case "ArrowDown":
                MoveDown();
                break;
        }
    }

    document.onkeyup = function(event) {
        switch (event.code) {
            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowUp":
            case "ArrowDown":
                StopMove();
                break;
        }
    }
}

function MoveLeft() {
    gamePiece.speedX -= 1;
}

function MoveRight() {
    gamePiece.speedX += 1;
}

function MoveUp() {
    gamePiece.speedY -= 1;
}

function MoveDown() {
    gamePiece.speedY += 1;
}

function StopMove() {
    gamePiece.speedX = 0;
    gamePiece.speedY = 0;
}