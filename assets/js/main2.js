$(document).ready(function () {
    CreateComponents();
    ConfigureButtons();
})

function CreateComponents() {

    // Static Box (Red)
    player = new component("player", 100, 125, "./assets/images/laptop/idle.gif", 25, 25, "image");
}

function component(id, width, height, color, x, y, type) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.x = x;
    this.speedX = 4;
    this.y = y;
    this.speedY = 0;

    if (type === "image") { this.src = color; }
    else { this.color = color; }

    if (type === "image") {
        this.element = $(`<img id='${this.id}' src='${this.src}' width=${width} height=${height}>`);
        this.element.css({position: "absolute"});
        this.element.css({top: 0, left: 0});
        $("#display").append(this.element);
    }

    this.move = function (direction) {
        Move(this.id, direction);
    }
}

function Move(id, direction) {

    switch (direction) {
        case "left": {
            let currLeft = parseInt($(`#${id}`).css("left"), 10);

            if (currLeft > 0) {
                $(`#${id}`).css("left", currLeft - player.speedX);
            }
        }
            break;
        case "right": {
            let currLeft = parseInt($(`#${id}`).css("left"), 10);
            let currRight = $(`#${id}`)[0].getBoundingClientRect().right;
            let maxRight = $("#display")[0].getBoundingClientRect().right;

            if (currRight < maxRight) {
                $(`#${id}`).css("left", currLeft + player.speedX);
            }
        }
            break;
        case "up":
            break;
        case "down":
            break;
    }
}

function ConfigureButtons() {
    document.onkeydown = function (event) {
        switch (event.code) {
            case "ArrowLeft":
                player.src = "./assets/images/laptop/walk_left.gif";
                player.move("left");
                break;
            case "ArrowRight":
                player.src = "./assets/images/laptop/walk_right.gif";
                player.move("right");
                break;
        }

        if (player.element.attr("src") !== player.src) {
            player.element.attr("src", player.src);
        }
    }

    document.onkeyup = function(event) {
        switch (event.code) {
            case "ArrowLeft":
            case "ArrowRight":
                player.src = "./assets/images/laptop/idle.gif";
                break;
        }

        if (player.element.attr("src") !== player.src) {
            player.element.attr("src", player.src);
        }
    }
}