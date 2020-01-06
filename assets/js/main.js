let maxWidth = $(window).width() * 0.7;

let gamePiece;
let gameObstacle;
let background;
let gameArea = {
    // Define width (and/or height) here to prevent stretching when drawing
    canvas: $(`<canvas id='display' width='${maxWidth}' height='500px'>`),
    start: function () {
        this.canvas.css("border", "2px solid black");
        this.context = this.canvas[0].getContext('2d');
        $(document.body).prepend(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

$(document).ready(function () {
    // Initialize animations for sprites (GIF frames)

    gameArea.start();
    gamePiece = new component(100, 100, "green", 25, 25);
    gameObstacle = new component(5, 300, "red", 150, 300);
    background = new component(maxWidth, 500, "assets/images/sky.jpg", 0, 0, "image");
    ConfigureButtons();
})

function component(width, height, color, x, y, type) {
    // check if the component is an image, update accordingly
    this.type = type;
    if (type === "image") {
        this.image = new Image();
        this.image.src = color;
    }

    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;
    this.x = x;
    this.y = y;

    this.update = function () {
        ctx = gameArea.context;

        if (type === "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function (otherObj) {

        // Define Current Dimensions
        let myLeft = this.x;
        let myRight = this.x + (this.width);
        let myTop = this.y;
        let myBottom = this.y + (this.height);

        // Define Dimensions for Potential Colliding Object
        let otherLeft = otherObj.x;
        let otherRight = otherObj.x + (otherObj.width);
        let otherTop = otherObj.y;
        let otherBottom = otherObj.y + (otherObj.height);

        // Return 'true' if the current object intersects with the colliding object,
        // false if otherwise
        let collided = true;

        if ((myBottom < otherTop) ||
            (myTop > otherBottom) ||
            (myRight < otherLeft) ||
            (myLeft > otherRight)) { collided = false; }

        return collided;
    }
}

function updateGameArea() {

    // Check for collision before every update
    if (gamePiece.crashWith(gameObstacle)) {
        gamePiece.color = "purple";
    } else {
        gamePiece.color = "darkgreen";
    }

    gameArea.clear();
    background.update();
    gameObstacle.update();
    gamePiece.newPos();
    gamePiece.update();
}

function ConfigureButtons() {
    document.onkeydown = function (event) {
        switch (event.code) {
            case "ArrowLeft":
                Move("left");
                break;
            case "ArrowRight":
                Move("right");
                break;
            case "ArrowUp":
                Move("up");
                break;
            case "ArrowDown":
                Move("down");
                break;
        }
    }

    document.onkeyup = function (event) {
        switch (event.code) {
            case "ArrowLeft":
            case "ArrowRight":
                StopMove("hor");
                break;
            case "ArrowUp":
            case "ArrowDown":
                StopMove("ver");
                break;
        }
    }
}

function Move(direction) {

    switch (direction) {
        case "left":
            gamePiece.speedX = -1;
            break;
        case "right":
            gamePiece.speedX = 1;
            break;
        case "up":
            gamePiece.speedY = -1;
            break;
        case "down":
            gamePiece.speedY = 1;
            break;
    }
}

function StopMove(direction) {

    switch (direction) {
        case "hor":
            gamePiece.speedX = 0;
            break;
        case "ver":
            gamePiece.speedY = 0;
            break;
    }
}