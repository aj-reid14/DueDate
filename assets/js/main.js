let gamePiece;
let gameArea = {
    canvas: $("<canvas id='display'>"),
    start: function() {
        this.canvas.width("90%");
        this.canvas.height("500px");
        this.canvas.css("border", "2px solid black");
        this.context = this.canvas[0].getContext("2d");
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
     ConfigureButtons();
})

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
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
    }
}

function updateGameArea() {
    gameArea.clear();
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
        }
    }
}

function MoveLeft() {
    gamePiece.speedX -= 1;
}

function MoveRight() {
    gamePiece.speedX += 1;
}