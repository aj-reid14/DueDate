let player;
let platforms = [];
let shootas = [];
let projectiles = [
    "./assets/images/projectiles/projectile_hw.png",
    "./assets/images/projectiles/projectile_project.png"
]

$(document).ready(function () {
    CreateComponents();
    ConfigureButtons();
})

function CreateComponents() {

    // Static Box (Red)
    let playerX = $("#display")[0].getBoundingClientRect().width / 2;
    player = new component("player", "auto", "auto", "./assets/images/laptop/idle.gif", playerX, 0, "image");

    let platformWidth = 150;
    let maxPlatformLeft = $("#display")[0].getBoundingClientRect().left;
    console.log(maxPlatformLeft);

    // Create the Shootas
    let shootaDistance = 130;
    let shootaLeft = 25;

    let jonboy = new component("jonboy", 100, 100, "./assets/images/shootas/jonboy/idle.gif", shootaLeft, 0, "image");
    jonboy.element.addClass("shoota");
    console.log(`${jonboy.id} | Top: ${jonboy.element.css("top")} | Left: ${jonboy.element.css("left")}`);
    shootas.push(jonboy);

    let derry = new component("derry", 100, 100, "./assets/images/shootas/derry/idle.gif", shootaLeft, 0 + shootaDistance, "image");
    derry.element.addClass("shoota");
    console.log(`${derry.id} | Top: ${derry.element.css("top")} | Left: ${derry.element.css("left")}`);
    shootas.push(derry);

    let charlington = new component("charlington", 100, 100, "./assets/images/shootas/charlington/idle.gif", shootaLeft, 0 + (shootaDistance * 2), "image");
    charlington.element.addClass("shoota");
    console.log(`${charlington.id} | Top: ${charlington.element.css("top")} | Left: ${charlington.element.css("left")}`);
    shootas.push(charlington);

    // Create the Platforms

    let platformTop = 100;

    for (let i = 0; i < 3; i++) {
        let platform = new component(`platform${i}`, platformWidth, 25, "darkgrey", 0, platformTop, "none");
        platform.element.addClass("platform");
        platforms.push(platform);
        console.log(`Platform ${i} [width]: ` + $(`#platform${i}`)[0].getBoundingClientRect().width);

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
        this.element.css({ position: "absolute", width: this.width, height: this.height });
        this.element.css({ top: y, left: x });

        if (this.id === "player") {
            let displayBottom = $("#display")[0].getBoundingClientRect().bottom - 20;
            let playerHeight = 89;
            this.element.css({ margin: "0px", top: displayBottom - playerHeight });

            $(window).resize(function () {
                if ($("#player")[0].getBoundingClientRect().left > $("#display")[0].getBoundingClientRect().right) {
                    $("#player").css({ left: $("#display")[0].getBoundingClientRect().width - 150 });
                }

            })
        }

    } else {
        this.element = $(`<div id='${this.id}'>`);
        this.color = color;
        this.element.css({ position: "absolute", width: this.width, height: this.height, top: this.y, left: this.x });
        this.element.css("background-color", color);
        this.element.css("z-index", 10);
    }

    $("#display").append(this.element);
    this.element = $(`#${this.id}`);

    this.move = function (direction) {
        Move(this.id, direction);
    }
}

function Move(id, direction) {

    switch (direction) {
        case "left": {
            let currLeft = parseInt($(`#${id}`).css("left"), 10);
            let maxLeft = platforms[0].width;

            if (currLeft > maxLeft) {
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
                CreateDaBoom(shootas[1]);
                break;
        }

        if (player.element.attr("src") !== player.src) {
            player.element.attr("src", player.src);
        }
    }

    document.onkeyup = function (event) {
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
    let boomLeft = shoota.x + shoota.width;
    let daBoomID = `daBoom-${shoota.id}`;

    let daBoom = $(`<img id='${daBoomID}' src='./assets/images/gun_boom.gif'>`);
    daBoom.css({
        display: "none",
        position: "absolute",
        "z-index": 15,
        top: boomTop,
        left: boomLeft - 10,
        width: "50px",
        height: "50px",
        transform: "rotate(90deg)"
    });

    $("#display").append(daBoom);

    $(`#${daBoomID}`).fadeIn(150, function () {
        CreateProjectile(boomLeft, boomTop);
        setTimeout(KillDaBoom, 200, daBoomID);
    });
}

function CreateProjectile(x, y) {

    let randProjectile = Math.floor(Math.random() * 2);

    let projectile = $(`<img class='projectile' src='${projectiles[randProjectile]}'>`);
    projectile.css({
        width: 35,
        height: 45,
        position: "absolute",
        top: y + 10,
        left: x
    });

    $("#display").append(projectile);

    let maxWidth = $("#display")[0].getBoundingClientRect().width - projectile.width() - 6;

    projectile.animate({
        left: maxWidth,
        transform: "scaleX(3)"
    }, {
        duration: 5000,
        easing: "linear",
        complete: function() {
            projectile.fadeOut(500, function() {
                projectile.remove();
            })
        }
    });

}

function KillDaBoom(boomID) {
    $(`#${boomID}`).fadeOut(150, function () {
        $(`#${boomID}`).remove();
    });
}