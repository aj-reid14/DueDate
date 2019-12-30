let gamePiece;
let gameArea = {
    canvas: $("<canvas id='display'>"),
    start: function() {
        this.canvas.width("90%");
        this.canvas.height("500px");
        this.canvas.css("border", "2px solid black");
        this.context = this.canvas[0].getContext("2d");
        $(document.body).prepend(this.canvas);
    }
}

$(document).ready(function () {
     alert("ready");
     gameArea.start();
})

function StartGame() {
    gamePiece = new component(30, 30, "red", 10, 120);
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
}