const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

canvas.width =
    window.innerWidth;

canvas.height =
    window.innerHeight;



// -----------------------
// GAME
// -----------------------

let quiet = 0;

let started = false;

let backgroundColor = 6;



// -----------------------
// UI
// -----------------------

const quietDisplay =
    document.getElementById("quiet");

const message =
    document.getElementById("message");

const startScreen =
    document.getElementById("startScreen");

const startBtn =
    document.getElementById("startBtn");



// -----------------------
// START
// -----------------------

startBtn.onclick = () => {

    started = true;

    startScreen.classList.add(
        "hidden"
    );

};



// -----------------------
// DISTRACTIONS
// -----------------------

const words = [

    "MESSAGE",
    "LIKE",
    "FOLLOW",
    "NOTIFICATION",
    "POST",
    "ONLINE"

];

const distractions = [];



for (let i = 0; i < 12; i++) {

    distractions.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        vx: (Math.random() - 0.5) * 1,

        vy: (Math.random() - 0.5) * 1,

        word:
            words[
                Math.floor(
                    Math.random() *
                    words.length
                )
            ],

        size: 50,

        gone: false

    });

}



// -----------------------
// CLICK
// -----------------------

canvas.addEventListener(
    "click",
    (e) => {

        if (!started) return;

        const mx = e.clientX;
        const my = e.clientY;

        distractions.forEach(
            item => {

                if (item.gone) return;

                const dx =
                    mx - item.x;

                const dy =
                    my - item.y;

                const dist =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (dist < 40) {

                    item.gone = true;

                    quiet++;

                    quietDisplay.textContent =
                        quiet;

                    // occasional message

                    if (Math.random() < 0.25) {

                        showMessage(
                            "you let it go"
                        );

                    }

                    backgroundColor += 3;
                }

            }
        );

    }
);



// -----------------------
// MESSAGES
// -----------------------

function showMessage(text) {

    message.textContent =
        text;

    message.classList.add(
        "show"
    );

    setTimeout(() => {

        message.classList.remove(
            "show"
        );

    }, 2000);

}



// -----------------------
// SHOP
// -----------------------

document.getElementById(
    "plantBtn"
).onclick = () => {

    if (quiet >= 3) {

        quiet -= 3;

        quietDisplay.textContent =
            quiet;

        showMessage(
            "🌱 something is growing"
        );
    }
};

document.getElementById(
    "lightBtn"
).onclick = () => {

    if (quiet >= 5) {

        quiet -= 5;

        quietDisplay.textContent =
            quiet;

        showMessage(
            "💡 a little light"
        );
    }
};

document.getElementById(
    "moonBtn"
).onclick = () => {

    if (quiet >= 8) {

        quiet -= 8;

        quietDisplay.textContent =
            quiet;

        showMessage(
            "🌙 goodnight"
        );
    }
};



// -----------------------
// DRAW
// -----------------------

function draw() {

    requestAnimationFrame(
        draw
    );

    ctx.fillStyle =
        `rgb(
            ${backgroundColor},
            ${backgroundColor},
            ${backgroundColor}
        )`;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // particles

    for (let i = 0; i < 100; i++) {

        ctx.fillStyle =
            "rgba(255,255,255,0.1)";

        ctx.beginPath();

        ctx.arc(

            (i * 123) %
            canvas.width,

            (i * 73) %
            canvas.height,

            1,

            0,

            Math.PI * 2

        );

        ctx.fill();

    }



    // ONE 3D LOOKING ORB

    let gradient =
        ctx.createRadialGradient(

            canvas.width / 2 - 40,

            canvas.height / 2 - 40,

            10,

            canvas.width / 2,

            canvas.height / 2,

            120

        );

    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        1,
        "#444444"
    );

    ctx.fillStyle =
        gradient;

    ctx.beginPath();

    ctx.arc(

        canvas.width / 2,

        canvas.height / 2,

        100,

        0,

        Math.PI * 2

    );

    ctx.fill();



    // distractions

    distractions.forEach(
        item => {

            if (item.gone) return;

            item.x += item.vx;
            item.y += item.vy;

            if (
                item.x < 0 ||
                item.x > canvas.width
            )
                item.vx *= -1;

            if (
                item.y < 0 ||
                item.y > canvas.height
            )
                item.vy *= -1;

            ctx.strokeStyle =
                "rgba(255,255,255,0.5)";

            ctx.beginPath();

            ctx.arc(
                item.x,
                item.y,
                25,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.fillStyle =
                "white";

            ctx.font =
                "12px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                item.word,
                item.x,
                item.y + 4
            );

        });

}

draw();



window.addEventListener(
    "resize",
    () => {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

    }
);