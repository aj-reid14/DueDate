let player;
let keymap = {};
let music = new Audio("assets/audio/theme.wav");
let shootaSound = new Audio("assets/audio/shot_fired.wav");
let submitSound = new Audio("assets/audio/submit_sound.wav");
let musicPlaying = false;
let platforms = [];
let shootas = [];
let shootasInterval;
let shootasShooting = false;
let shootasFrequency = 2000;
let projectileSpeed = 7000;
let projectilesActive;
let projectiles = [
    "./assets/images/projectiles/projectile_hw.png",
    "./assets/images/projectiles/projectile_project.png"
];


$(document).ready(function () {
    CreateComponents();
    ConfigureButtons();
    // ConfigureMusic();
    GameLoop();
});

function GameLoop() {

    if (keymap["ArrowLeft"]) {
        player.src = "./assets/images/laptop/walk_right.gif";
        player.move("left");
    }

    if (keymap["ArrowRight"]) {
        player.src = "./assets/images/laptop/walk_left.gif";
        player.move("right");
    }

    if (keymap[" "]) {
        ShootGrade();
    }

    if (player.element.attr("src") !== player.src) {
        player.element.attr("src", player.src);
    }

    setTimeout(GameLoop, 20);
}

function ConfigureMusic() {
    music.loop = true;
    music.addEventListener('ended', function () {
        musicPlaying = false;
        this.currentTime = 0;
        this.play();
        musicPlaying = true;
    }, false);
}

function CreateComponents() {

    // Static Box (Red)
    let playerX = $("#display")[0].getBoundingClientRect().width / 2;
    player = new component("player", "auto", "auto", "./assets/images/laptop/idle.gif", playerX, 0, "image");

    let platformWidth = 125;

    // Create the Shootas
    let shootaSize = 115;
    let shootaDistance = 130;
    let shootaLeft = 25;

    let jonboy = new component("jonathan", shootaSize, shootaSize, "./assets/images/shootas/jonboy/idle.gif", shootaLeft, 0, "image");
    jonboy.element.addClass("shoota");
    shootas.push(jonboy);

    let derry = new component("darian", shootaSize, shootaSize, "./assets/images/shootas/derry/idle.gif", shootaLeft, 0 + shootaDistance, "image");
    derry.element.addClass("shoota");
    shootas.push(derry);

    let charlington = new component("charlie", shootaSize, shootaSize, "./assets/images/shootas/charlington/idle.gif", shootaLeft, 0 + (shootaDistance * 2), "image");
    charlington.element.addClass("shoota");
    shootas.push(charlington);

    // Create the Platforms
    let platformTop = shootaSize;

    for (let i = 0; i < 3; i++) {
        let platform = new component(`platform${i}`, platformWidth, 25, "darkgrey", 0, platformTop, "none");
        platform.element.addClass("platform");
        platform.element.text(`[${shootas[i].id}]`);

        platforms.push(platform);

        platformTop += shootaDistance;
    }
}

function component(id, width, height, color, x, y, type) {
    this.id = id;

    this.width = width;

    this.height = height;

    this.x = x;
    this.speedX = 5;
    this.y = y;
    this.speedY = 0;

    if (type === "image") {
        this.src = color;
        this.element = $(`<img id='${this.id}' src='${this.src}' draggable='false'>`);
        this.element.css({ position: "absolute", width: this.width, height: this.height });
        this.element.css({ top: y, left: x });

        if (this.id === "player") {
            this.shooting = false;
            this.cooldown = 500;
            let displayBottom = $("#display")[0].getBoundingClientRect().bottom - parseInt($("#display").css("margin-top"), 10) - 10;
            let playerHeight = 89;
            this.y = displayBottom - playerHeight;
            this.element.css({ margin: "0px", top: this.y });

            $(window).resize(function () {
                if ($("#player")[0].getBoundingClientRect().left > $("#display")[0].getBoundingClientRect().right) {
                    $("#player").css({ left: $("#display")[0].getBoundingClientRect().width - 150 });
                }

            });
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
            player.x = Math.floor(currLeft - player.speedX);

            if (currLeft > maxLeft) {
                $(`#${id}`).css("left", player.x);
            }
        }
            break;
        case "right": {
            let currLeft = parseInt($(`#${id}`).css("left"), 10);
            let currRight = $(`#${id}`)[0].getBoundingClientRect().right;
            let maxRight = $("#display")[0].getBoundingClientRect().right;
            player.x = Math.floor(currLeft + player.speedX);

            if (currRight < maxRight) {
                $(`#${id}`).css("left", player.x);
            }
        }
            break;
    }
}

function ConfigureMusic() {

    $("#display").click(function () {
        if (!musicPlaying) {
            music.play();
            musicPlaying = true;
        }
    });
}

function ConfigureButtons() {

    document.onkeydown = function(event) {
        if (event.key === "s") {
            ToggleShootas();
        }
    }

    $(document).keydown(function (event) {
        keymap[event.key] = true;
    });

    $(document).keyup(function (event) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            player.src = "./assets/images/laptop/idle.gif";
        }

        delete keymap[event.key];
    });
}

function ToggleShootas() {

    if (!shootasShooting) {
        shootasShooting = true;
        shootasInterval = setInterval(function() {

            let randShoota = Math.floor(Math.random() * shootas.length);
            randShoota = shootas[randShoota];        
            CreateDaBoom(randShoota);

        }, shootasFrequency);
    } else {
        shootasShooting = false;
        clearInterval(shootasInterval);
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

    shootaSound.play();

    $(`#${daBoomID}`).fadeIn(150, function () {
        CreateProjectile(boomLeft, boomTop);
        setTimeout(KillDaBoom, 200, daBoomID);
    });
}

function KillDaBoom(boomID) {
    $(`#${boomID}`).fadeOut(150, function () {
        $(`#${boomID}`).remove();
    });
}

function CreateProjectile(x, y) {

    let randProjectile = Math.floor(Math.random() * projectiles.length);

    let projectile = $(`<img class='projectile' collided='false' src='${projectiles[randProjectile]}'>`);
    projectile.css({
        width: 50,
        height: 60,
        position: "absolute",
        top: y + 12,
        left: x
    });

    $("#display").append(projectile);

    let maxWidth = $("#display")[0].getBoundingClientRect().width - projectile.width() - 6;

    projectile.animate({
        left: maxWidth + 55
    }, {
        duration: projectileSpeed,
        easing: "linear",
        step: function() {
            if (projectile.attr("collided") === "true") {projectile.remove();};
        },
        complete: function () {
            projectile.fadeOut(150, function () {
                projectile.remove();
            });
        }
    });

}

function ShootGrade() {
    
    if (!player.shooting) {
        
        player.shooting = true;

        setTimeout(function() {
            player.shooting = false;
        }, player.cooldown);
      
        let grade = $("<h2 active='true' class='grade'>");
        grade.text("A");
        grade.css({
            position: "absolute",
            display: "none",
            "background-color": "white",
            border: "1px solid black",
            color: "green",
            padding: "2px",
            top: player.y - 10,
            left: player.x  + ($(player.element)[0].getBoundingClientRect().width / 2) - 10
        });
        
        $("#display").append(grade);
    
        grade.fadeIn(150);
        grade.animate({
            top: -60
        }, {
            duration: 1500,
            easing: "linear",
            start: function () {
                projectilesActive = $(".projectile")
            },
            step: function() {
                if (projectilesActive.length !== 0) {
                    for (let i = 0; i < projectilesActive.length; i++) {
                        if (CheckCollision(grade, projectilesActive[i])) {
                            break;
                        };
                    }
                }
            },
            complete: function() {
                submitSound.pause();
                submitSound.currentTime = 0;

                grade.fadeOut(1000, function() {
                    grade.remove();
                });
            }
        });
    }
}

function CheckCollision(grade, projectile) {

    let gradeBox = grade[0].getBoundingClientRect();
    let projectileBox = projectile.getBoundingClientRect();

    let collided = true;
    let gradeActive = $(grade).attr("active");

    if ((gradeBox.bottom < projectileBox.top) ||
        (gradeBox.top > projectileBox.bottom) ||
        (gradeBox.right < projectileBox.left) ||
        (gradeBox.left > projectileBox.right)) { collided = false; }

        if (collided && gradeActive === "true") {
            $(grade).attr("active", "false");
            submitSound.play();
            grade.remove();
            $(projectile).attr("collided", "true");
            CreateHitEffect(gradeBox, projectileBox);
        }

    return collided;
}

function CreateHitEffect(grade, projectile) {

    let x = (grade.right + projectile.left) / 2;
    let y = ((projectile.top + grade.bottom) / 2);
    let effectSize = 100;
    let effectOffset = effectSize + (effectSize * 0.2);

    let hitEffect = $("<img src='./assets/images/hit_boom.gif'>");

    hitEffect.css({
        position: "absolute",
        "z-index": 15,
        top: (y - effectOffset) + (effectSize * 0.25),
        left: x - effectOffset,
        width: effectOffset,
        height: effectOffset
    });

    $("#display").append(hitEffect);

    setTimeout(function() {
        hitEffect.fadeOut(350, function() {
            hitEffect.remove();
        });
    }, 150);
}