$(document).ready(function () {
    CreateComponents();
})

function CreateComponents() {

    // Static Box (Red)
    player = new component(50, 85, "./assets/images/laptop/idle.gif", 25, 25, "image");
}

function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.speedX = 0;
    this.y = y;
    this.speedY = 0;

    if (type === "image") { this.src = color; }
    else { this.color = color; }

    if (type === "image") {
        this.element = $(`<img src=${this.src} width=${width} height=${height}>`);
        $("#display").append(this.element);
    }
}