let player;
let platforms = [];
let shootas = [];

$(document).ready(function () {
    CreateComponents();
    ConfigureButtons();
})

function CreateComponents() {

    // Static Box (Red)
    player = new component("player", "auto", "auto", "./assets/images/laptop/idle.gif", 25, 25, "image");
    
    let maxPlatformLeft = $("#display")[0].getBoundingClientRect().right + 5;

    // Create the Shootas
    let shootaDistance = 130;
    let shootaLeft = maxPlatformLeft - 350;
    
    let jonboy = new component("jonboy", 100, 100, "./assets/images/shootas/jonboy/idle.gif", shootaLeft, 0, "image");
    jonboy.element.css("z-index", 1);
    console.log(`${jonboy.id} | Top: ${jonboy.element.css("top")} | Left: ${jonboy.element.css("left")}`);
    shootas.push(jonboy);

    let derry = new component("derry", 100, 100, "./assets/images/shootas/derry/idle.gif", shootaLeft, 0 + shootaDistance, "image");
    derry.element.css("z-index", 1);
    console.log(`${derry.id} | Top: ${derry.element.css("top")} | Left: ${derry.element.css("left")}`);
    shootas.push(derry);

    let charlington = new component("charlington", 100, 100, "./assets/images/shootas/charlington/idle.gif", shootaLeft, 0 + (shootaDistance * 2), "image");
    charlington.element.css("z-index", 1);
    console.log(`${charlington.id} | Top: ${charlington.element.css("top")} | Left: ${charlington.element.css("left")}`);
    shootas.push(charlington);

    // Create the Platforms

    let platformTop = 100;

    for (let i = 0; i < 3; i++) {
        let platform = new component(`platform${i}`, 200, 25, "darkgrey", 0, 0, "none");
        platform.element.css({top: platformTop, left: maxPlatformLeft - (platform.width * 2)});
        platform.element.addClass("platform");
        platforms.push(platform);
        platformTop += shootaDistance;
    }
}

function component(id, width, height, color, x, y, type) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.x = x;
    this.speedX = 4;
    this.y = y;
    this.speedY = 0;

    if (type === "image") {
        this.src = color;
        this.element = $(`<img id='${this.id}' src='${this.src}'>`);
        this.element.css({position: "absolute", width: this.width, height: this.height});
        this.element.css({top: y, left: x});
        $("#display").append(this.element);

        if (this.id === "player") {
            let displayBottom = $("#display")[0].getBoundingClientRect().bottom;
            let playerHeight = 89 + 20;
            this.element.css({top: displayBottom - playerHeight});
        }

    } else {
        this.element = $(`<div id='${this.id}'>`);
        this.color = color;
        this.element.css({position: "absolute", width: this.width, height: this.height});
        this.element.css("background-color", color);
        this.element.css("z-index", 10);
        $("#display").append(this.element);
    }

    this.element = $(`#${this.id}`);

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
                player.src = "./assets/images/laptop/walk_right.gif";
                player.move("left");
                break;
            case "ArrowRight":
                player.src = "./assets/images/laptop/walk_right.gif";
                player.move("right");
                break;
            case "Space":
                CreateDaBoom(shootas[0]);
                CreateDaBoom(shootas[1]);
                CreateDaBoom(shootas[2]);
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

function CreateDaBoom(shoota) {

    let boomTop = shoota.y + (shoota.height * 0.35);
    let boomLeft = shoota.x;
    let daBoomID = `daBoom-${shoota.id}`;

    let daBoom = $(`<img id='${daBoomID}' src='./assets/images/gun_boom.gif'>`);
    daBoom.css({
        display: "none",
        position: "absolute",
        top: boomTop,
        left: boomLeft - 40,
        width: "50px",
        height: "50px",
        transform: "rotate(-90deg)"
    });
    $("#display").append(daBoom);
    $(`#${daBoomID}`).fadeIn(150, function() {
        setTimeout(KillDaBoom, 200, daBoomID);
    });
}

function KillDaBoom(boomID) {
    $(`#${boomID}`).fadeOut(500, function () {
        $(`#${boomID}`).remove();
    });
}