const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");


// =====================================================
// SCREEN
// =====================================================

let W = window.innerWidth;
let H = window.innerHeight;

let dpr = Math.min(
    window.devicePixelRatio || 1,
    2
);


function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    resize
);

resize();


// =====================================================
// GAME VARIABLES
// =====================================================

let started = false;

let quiet = 0;

let cleared = 0;

let modal = null;

let toast = "";

let toastUntil = 0;

let pulse = 0;


// =====================================================
// MOUSE
// =====================================================

const mouse = {

    x: W / 2,

    y: H / 2

};


window.addEventListener(
    "mousemove",
    function (event) {

        mouse.x = event.clientX;

        mouse.y = event.clientY;

    }
);


// =====================================================
// REWARDS
// =====================================================

const purchases = {

    plant: false,

    light: false,

    bench: false,

    moon: false

};


// =====================================================
// DISTRACTIONS
// =====================================================

const distractions = [];

const labels = [

    "MESSAGE",

    "LIKE",

    "FOLLOW",

    "NOTIFICATION",

    "POST",

    "TRENDING"

];


for (
    let i = 0;
    i < 12;
    i++
) {

    distractions.push({

        x:
            80 +
            Math.random() *
            Math.max(
                200,
                W - 160
            ),

        y:
            120 +
            Math.random() *
            Math.max(
                180,
                H - 260
            ),

        vx:
            (Math.random() - 0.5) *
            0.32,

        vy:
            (Math.random() - 0.5) *
            0.28,

        r:
            25 +
            Math.random() * 7,

        label:
            labels[
                i % labels.length
            ],

        gone: false,

        phase:
            Math.random() *
            Math.PI *
            2,

        special:
            Math.random() < 0.28

    });

}


// =====================================================
// STARS
// =====================================================

const stars = [];

for (
    let i = 0;
    i < 170;
    i++
) {

    stars.push({

        x: Math.random(),

        y: Math.random(),

        r:
            0.4 +
            Math.random() * 1.3,

        alpha:
            0.15 +
            Math.random() * 0.5,

        phase:
            Math.random() *
            Math.PI *
            2

    });

}


// =====================================================
// START BUTTON
// =====================================================

canvas.addEventListener(
    "click",
    function (event) {

        handleClick(
            event.clientX,
            event.clientY
        );

    }
);


// =====================================================
// TEXT FUNCTION
// =====================================================

function drawText(
    text,
    x,
    y,
    size,
    alpha = 1,
    align = "left",
    spacing = 0
) {

    ctx.save();

    ctx.fillStyle =
        `rgba(
            235,
            240,
            245,
            ${alpha}
        )`;

    ctx.font =
        `${size}px Arial`;

    ctx.textAlign =
        align;

    ctx.textBaseline =
        "middle";


    if (spacing === 0) {

        ctx.fillText(
            text,
            x,
            y
        );

    }

    else {

        let total = 0;

        for (
            const character
            of text
        ) {

            total +=
                ctx.measureText(
                    character
                ).width +
                spacing;

        }


        let start =
            x -
            total / 2;


        for (
            const character
            of text
        ) {

            ctx.fillText(
                character,
                start,
                y
            );

            start +=
                ctx.measureText(
                    character
                ).width +
                spacing;

        }

    }


    ctx.restore();

}


// =====================================================
// ROUNDED RECTANGLE
// =====================================================

function roundedRect(
    x,
    y,
    width,
    height,
    radius
) {

    const r =
        Math.min(
            radius,
            width / 2,
            height / 2
        );

    ctx.beginPath();

    ctx.moveTo(
        x + r,
        y
    );

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        r
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        r
    );

    ctx.closePath();

}


// =====================================================
// BACKGROUND
// =====================================================

function drawBackground(time) {

    const calm =
        Math.min(
            cleared / 12,
            1
        );


    const top =
        8 +
        calm * 8;

    const bottom =
        14 +
        calm * 12;


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );


    gradient.addColorStop(
        0,
        `rgb(
            ${top},
            ${top + 5},
            ${top + 14}
        )`
    );


    gradient.addColorStop(
        1,
        `rgb(
            ${bottom - 5},
            ${bottom},
            ${bottom + 8}
        )`
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // Stars

    for (
        const star
        of stars
    ) {

        const alpha =
            star.alpha +
            Math.sin(
                time * 0.001 +
                star.phase
            ) *
            0.12;


        ctx.fillStyle =
            `rgba(
                220,
                235,
                255,
                ${Math.max(
                    0.03,
                    alpha +
                    calm * 0.18
                )}
            )`;


        ctx.beginPath();

        ctx.arc(
            star.x * W,
            star.y * H,
            star.r,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // Center glow

    const glow =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            20,
            W / 2,
            H / 2,
            Math.min(W, H) * 0.48
        );


    glow.addColorStop(
        0,
        `rgba(
            160,
            190,
            220,
            ${0.08 + calm * 0.08}
        )`
    );


    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        glow;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );

}


// =====================================================
// CENTER ORB
// This is the ONE 3D-LOOKING IMAGE/OBJECT
// =====================================================

function drawOrb(time) {

    const centerX =
        W / 2;

    const centerY =
        H / 2 +
        Math.sin(
            time * 0.001
        ) *
        5;


    const base =
        Math.min(
            W,
            H
        ) *
        0.105;


    const radius =
        base +
        Math.sin(
            time * 0.002
        ) *
        3;


    // Outer ring

    ctx.save();

    ctx.globalAlpha =
        0.18 +
        pulse * 0.12;

    ctx.strokeStyle =
        "rgba(190,220,255,0.6)";

    ctx.lineWidth = 1;


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius + 22 +
        Math.sin(
            time * 0.0015
        ) * 4,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();


    // 3D lighting

    const gradient =
        ctx.createRadialGradient(

            centerX -
                radius * 0.38,

            centerY -
                radius * 0.42,

            radius * 0.08,

            centerX,

            centerY,

            radius

        );


    gradient.addColorStop(
        0,
        "#ffffff"
    );


    gradient.addColorStop(
        0.25,
        "#dce8f2"
    );


    gradient.addColorStop(
        0.62,
        "#71808d"
    );


    gradient.addColorStop(
        1,
        "#202831"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "rgba(255,255,255,0.16)";

    ctx.lineWidth = 1;

    ctx.stroke();


    drawText(
        "PAUSE",
        centerX,
        centerY - 4,
        10,
        0.72,
        "center",
        3
    );


    drawText(
        "click the noise",
        centerX,
        centerY + 16,
        9,
        0.42,
        "center",
        1
    );

}


// =====================================================
// PLANT
// =====================================================

function drawPlant() {

    if (
        !purchases.plant
    ) return;


    const x = 90;

    const y =
        H - 120;


    ctx.strokeStyle =
        "rgba(150,190,145,0.85)";

    ctx.lineWidth = 4;


    ctx.beginPath();

    ctx.moveTo(
        x,
        y + 45
    );

    ctx.lineTo(
        x,
        y
    );

    ctx.stroke();


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const angle =
            i * 1.6;


        ctx.fillStyle =
            "rgba(155,195,150,0.82)";


        ctx.beginPath();

        ctx.ellipse(
            x +
                Math.cos(angle) *
                15,

            y +
                8 +
                Math.sin(angle) *
                12,

            13,
            7,
            angle,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    drawText(
        "GROW",
        x,
        y + 66,
        8,
        0.35,
        "center",
        2
    );

}


// =====================================================
// BENCH
// =====================================================

function drawBench() {

    if (
        !purchases.bench
    ) return;


    const x =
        W - 115;

    const y =
        H - 100;


    ctx.fillStyle =
        "rgba(180,185,190,0.55)";


    roundedRect(
        x - 45,
        y,
        90,
        9,
        4
    );


    ctx.fill();


    ctx.fillRect(
        x - 32,
        y + 8,
        7,
        30
    );


    ctx.fillRect(
        x + 25,
        y + 8,
        7,
        30
    );


    drawText(
        "REST",
        x,
        y + 54,
        8,
        0.35,
        "center",
        2
    );

}


// =====================================================
// MOON
// =====================================================

function drawMoon() {

    if (
        !purchases.moon
    ) return;


    const x =
        W - 90;

    const y = 90;

    const radius = 27;


    ctx.fillStyle =
        "rgba(235,240,245,0.85)";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "rgb(12,16,24)";


    ctx.beginPath();

    ctx.arc(
        x + 12,
        y - 8,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// =====================================================
// LIGHT
// =====================================================

function drawLight() {

    if (
        !purchases.light
    ) return;


    const x =
        W / 2 + 150;

    const y =
        H / 2 - 100;


    const glow =
        ctx.createRadialGradient(
            x,
            y,
            2,
            x,
            y,
            95
        );


    glow.addColorStop(
        0,
        "rgba(255,235,180,0.22)"
    );


    glow.addColorStop(
        1,
        "rgba(255,235,180,0)"
    );


    ctx.fillStyle =
        glow;


    ctx.fillRect(
        x - 100,
        y - 100,
        200,
        200
    );


    ctx.fillStyle =
        "rgba(255,235,180,0.9)";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// =====================================================
// DISTRACTIONS
// =====================================================

function drawDistractions(time) {

    for (
        const item
        of distractions
    ) {

        if (
            item.gone
        ) continue;


        item.x +=
            item.vx;

        item.y +=
            item.vy;


        item.phase +=
            0.01;


        if (
            item.x < 45 ||
            item.x > W - 45
        ) {

            item.vx *= -1;

        }


        if (
            item.y < 90 ||
            item.y > H - 100
        ) {

            item.vy *= -1;

        }


        const bob =
            Math.sin(
                time * 0.0015 +
                item.phase
            ) *
            4;


        const x =
            item.x;

        const y =
            item.y +
            bob;


        ctx.save();


        ctx.globalAlpha =
            0.38 +
            Math.sin(
                time * 0.002 +
                item.phase
            ) *
            0.08;


        ctx.strokeStyle =
            item.special
                ? "rgba(220,235,255,0.75)"
                : "rgba(210,220,230,0.42)";


        ctx.lineWidth =
            item.special
                ? 1.5
                : 1;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            item.r,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.fillStyle =
            item.special
                ? "rgba(225,238,250,0.85)"
                : "rgba(215,225,235,0.62)";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        drawText(
            item.label,
            x,
            y + item.r + 13,
            9,
            item.special
                ? 0.72
                : 0.45,
            "center",
            1.5
        );


        ctx.restore();

    }

}


// =====================================================
// HUD
// =====================================================

function drawHUD() {

    drawText(
        "ESCAPE",
        28,
        30,
        12,
        0.62,
        "left",
        4
    );


    drawText(
        "QUIET",
        W - 92,
        26,
        9,
        0.42,
        "left",
        2
    );


    drawText(
        String(quiet),
        W - 28,
        28,
        16,
        0.92,
        "right"
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.08)";


    ctx.beginPath();

    ctx.moveTo(
        28,
        52
    );

    ctx.lineTo(
        128,
        52
    );

    ctx.stroke();


    drawText(
        "let the noise go",
        W / 2,
        H - 25,
        9,
        0.3,
        "center",
        2
    );

}


// =====================================================
// REWARD SHOP
// =====================================================

function drawShop() {

    const items = [

        [
            "plant",
            "PLANT",
            3
        ],

        [
            "light",
            "LIGHT",
            5
        ],

        [
            "bench",
            "BENCH",
            8
        ],

        [
            "moon",
            "MOON",
            10
        ]

    ];


    const x = 22;

    const y =
        H - 185;


    drawText(
        "YOUR SPACE",
        x,
        y - 15,
        9,
        0.4,
        "left",
        2
    );


    items.forEach(
        function (item, index) {

            const key =
                item[0];

            const label =
                item[1];

            const cost =
                item[2];


            const yy =
                y +
                index * 31;


            const bought =
                purchases[key];


            const affordable =
                quiet >= cost;


            ctx.fillStyle =
                bought
                    ? "rgba(150,190,160,0.10)"
                    : "rgba(255,255,255,0.045)";


            roundedRect(
                x,
                yy,
                145,
                24,
                6
            );


            ctx.fill();


            ctx.strokeStyle =
                bought
                    ? "rgba(160,200,170,0.35)"
                    : "rgba(255,255,255,0.10)";


            ctx.stroke();


            drawText(
                label,
                x + 10,
                yy + 12,
                9,
                bought
                    ? 0.7
                    : 0.48,
                "left",
                1
            );


            drawText(
                bought
                    ? "OWNED"
                    : cost + " QUIET",

                x + 135,

                yy + 12,

                8,

                affordable ||
                bought
                    ? 0.55
                    : 0.22,

                "right"
            );

        }
    );

}


// =====================================================
// START SCREEN
// =====================================================

function drawStart() {

    ctx.fillStyle =
        "rgba(3,5,8,0.96)";


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    const glow =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            10,
            W / 2,
            H / 2,
            Math.min(W, H) * 0.5
        );


    glow.addColorStop(
        0,
        "rgba(130,160,190,0.10)"
    );


    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        glow;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    drawText(
        "ESCAPE",
        W / 2,
        H / 2 - 45,
        48,
        0.92,
        "center",
        11
    );


    drawText(
        "a small place away from the noise",
        W / 2,
        H / 2 + 10,
        11,
        0.42,
        "center",
        2
    );


    drawText(
        "CLICK TO ENTER",
        W / 2,
        H / 2 + 72,
        10,
        0.72,
        "center",
        3
    );


    ctx.strokeStyle =
        `rgba(
            230,
            240,
            250,
            ${0.18 +
            Math.sin(
                performance.now() *
                0.003
            ) *
            0.06}
        )`;


    roundedRect(
        W / 2 - 80,
        H / 2 + 48,
        160,
        45,
        8
    );


    ctx.stroke();

}


// =====================================================
// POPUP
// =====================================================

function drawModal() {

    if (!modal) return;


    ctx.fillStyle =
        "rgba(0,0,0,0.55)";


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    const modalWidth =
        Math.min(
            430,
            W - 40
        );


    const modalHeight = 230;


    const x =
        W / 2 -
        modalWidth / 2;


    const y =
        H / 2 -
        modalHeight / 2;


    ctx.fillStyle =
        "rgba(10,14,19,0.96)";


    roundedRect(
        x,
        y,
        modalWidth,
        modalHeight,
        14
    );


    ctx.fill();


    ctx.strokeStyle =
        "rgba(220,235,245,0.18)";


    ctx.stroke();


    drawText(
        modal.title,
        W / 2,
        y + 38,
        11,
        0.7,
        "center",
        3
    );


    drawText(
        modal.text,
        W / 2,
        y + 82,
        13,
        0.65,
        "center",
        1
    );


    const buttonWidth = 150;

    const gap = 15;

    const buttonY =
        y + 135;


    for (
        let i = 0;
        i < 2;
        i++
    ) {

        const buttonX =
            W / 2 -
            buttonWidth -
            gap / 2 +
            i *
            (buttonWidth + gap);


        ctx.fillStyle =
            "rgba(255,255,255,0.05)";


        roundedRect(
            buttonX,
            buttonY,
            buttonWidth,
            42,
            8
        );


        ctx.fill();


        ctx.strokeStyle =
            "rgba(255,255,255,0.15)";


        ctx.stroke();


        drawText(
            modal.buttons[i],
            buttonX +
                buttonWidth / 2,
            buttonY + 21,
            9,
            0.72,
            "center",
            1.5
        );

    }

}


// =====================================================
// TOAST
// =====================================================

function drawToast(time) {

    if (
        !toast ||
        time > toastUntil
    ) return;


    const fade =
        Math.min(
            1,
            (toastUntil - time) /
            500
        );


    drawText(
        toast,
        W / 2,
        H / 2 + 145,
        11,
        fade * 0.7,
        "center",
        3
    );

}


// =====================================================
// MESSAGE
// =====================================================

function showToast(text) {

    toast = text;

    toastUntil =
        performance.now() +
        1800;

}


// =====================================================
// ADD QUIET
// =====================================================

function addQuiet(
    amount = 1
) {

    quiet += amount;

    cleared++;

    pulse = 1;

    showToast(
        "+" +
        amount +
        " QUIET"
    );

}


// =====================================================
// MODAL CONTENT
// =====================================================

function openModal(item) {

    const data = {

        MESSAGE: [

            "MESSAGE",

            "You have a new message. Does it need you?",

            [
                "LET IT GO",
                "RESPOND"
            ]

        ],

        LIKE: [

            "LIKE",

            "Someone liked your post. Do you need to look?",

            [
                "LET IT GO",
                "CHECK"
            ]

        ],

        FOLLOW: [

            "FOLLOW",

            "Someone is waiting for you to follow back.",

            [
                "UNFOLLOW",
                "FOLLOW BACK"
            ]

        ],

        NOTIFICATION: [

            "NOTIFICATION",

            "Something wants your attention. It can wait.",

            [
                "TURN IT OFF",
                "OPEN"
            ]

        ],

        POST: [

            "POST",

            "A new post is waiting for you.",

            [
                "LET IT PASS",
                "OPEN"
            ]

        ],

        TRENDING: [

            "TRENDING",

            "Everyone is looking at this right now.",

            [
                "LET IT PASS",
                "LOOK"
            ]

        ]

    };


    const choice =
        data[item.label];


    modal = {

        item: item,

        title: choice[0],

        text: choice[1],

        buttons: choice[2]

    };

}


// =====================================================
// CLEAR DISTRACTION
// =====================================================

function clearDistraction(
    item
) {

    if (
        item.gone
    ) return;


    item.gone = true;


    addQuiet(1);


    if (
        cleared === 4
    ) {

        showToast(
            "the noise is getting quieter"
        );

    }


    if (
        cleared === 8
    ) {

        showToast(
            "you are making space"
        );

    }

}


// =====================================================
// BUY REWARD
// =====================================================

function spend(
    key,
    cost,
    message
) {

    if (
        purchases[key]
    ) return;


    if (
        quiet < cost
    ) {

        showToast(
            "not enough quiet"
        );

        return;

    }


    quiet -= cost;

    purchases[key] =
        true;


    showToast(
        message
    );

}


// =====================================================
// COLLISION
// =====================================================

function hit(
    x,
    y,
    rx,
    ry,
    width,
    height
) {

    return (

        x >= rx &&

        x <= rx + width &&

        y >= ry &&

        y <= ry + height

    );

}


// =====================================================
// CLICK HANDLING
// =====================================================

function handleClick(
    x,
    y
) {

    // START SCREEN

    if (
        !started
    ) {

        if (
            hit(
                x,
                y,
                W / 2 - 100,
                H / 2 + 35,
                200,
                75
            )
        ) {

            started = true;

            showToast(
                "you don't have to answer everything"
            );

        }

        return;

    }


    // POPUP

    if (
        modal
    ) {

        const modalWidth =
            Math.min(
                430,
                W - 40
            );


        const modalHeight =
            230;


        const modalX =
            W / 2 -
            modalWidth / 2;


        const modalY =
            H / 2 -
            modalHeight / 2;


        const buttonWidth =
            150;


        const gap =
            15;


        const buttonY =
            modalY + 135;


        for (
            let i = 0;
            i < 2;
            i++
        ) {

            const buttonX =
                W / 2 -
                buttonWidth -
                gap / 2 +
                i *
                (buttonWidth + gap);


            if (
                hit(
                    x,
                    y,
                    buttonX,
                    buttonY,
                    buttonWidth,
                    42
                )
            ) {

                if (
                    i === 0
                ) {

                    clearDistraction(
                        modal.item
                    );

                    modal = null;

                }

                else {

                    showToast(
                        "you chose to stay connected"
                    );

                    modal = null;

                }

                return;

            }

        }

        return;

    }


    // REWARD SHOP

    const shopX = 22;

    const shopY =
        H - 185;


    const shop = [

        [
            "plant",
            3,
            "something is growing"
        ],

        [
            "light",
            5,
            "a little light"
        ],

        [
            "bench",
            8,
            "somewhere to rest"
        ],

        [
            "moon",
            10,
            "goodnight"
        ]

    ];


    for (
        let i = 0;
        i < shop.length;
        i++
    ) {

        const key =
            shop[i][0];

        const cost =
            shop[i][1];

        const message =
            shop[i][2];


        const yy =
            shopY +
            i * 31;


        if (
            hit(
                x,
                y,
                shopX,
                yy,
                145,
                24
            )
        ) {

            spend(
                key,
                cost,
                message
            );

            return;

        }

    }


    // DISTRACTIONS

    for (
        const item
        of distractions
    ) {

        if (
            item.gone
        ) continue;


        const distance =
            Math.hypot(
                x - item.x,
                y - item.y
            );


        if (
            distance <
            item.r + 12
        ) {

            // Only some shapes create
            // a decision.

            if (
                item.special &&
                Math.random() < 0.72
            ) {

                openModal(
                    item
                );

            }

            else {

                clearDistraction(
                    item
                );

            }

            return;

        }

    }

}


// =====================================================
// END SCREEN
// =====================================================

function drawEnding() {

    ctx.fillStyle =
        "rgba(2,4,7,0.92)";


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    drawText(
        "ESCAPE",
        W / 2,
        H / 2 - 40,
        42,
        0.9,
        "center",
        9
    );


    let line =
        "You made a little distance from the noise.";


    if (
        purchases.plant &&
        purchases.light &&
        purchases.bench &&
        purchases.moon
    ) {

        line =
            "You built a place where nothing needs your attention.";

    }

    else if (
        quiet >= 8
    ) {

        line =
            "You found some quiet. That was enough.";

    }


    drawText(
        line,
        W / 2,
        H / 2 + 15,
        12,
        0.48,
        "center",
        1
    );


    drawText(
        "CLICK TO BEGIN AGAIN",
        W / 2,
        H / 2 + 75,
        9,
        0.55,
        "center",
        2
    );

}


// =====================================================
// GAME LOOP
// =====================================================

let lastTime =
    performance.now();


function animate(
    currentTime
) {

    lastTime =
        currentTime;


    // START

    if (
        !started
    ) {

        drawBackground(
            currentTime
        );

        drawStart();

        requestAnimationFrame(
            animate
        );

        return;

    }


    // END

    if (
        cleared >=
        distractions.length &&
        !modal
    ) {

        drawEnding();

        requestAnimationFrame(
            animate
        );

        return;

    }


    // NORMAL GAME

    drawBackground(
        currentTime
    );


    drawLight();


    drawOrb(
        currentTime
    );


    drawDistractions(
        currentTime
    );


    drawPlant();


    drawBench();


    drawMoon();


    drawHUD();


    drawShop();


    drawToast(
        currentTime
    );


    drawModal();


    pulse *=
        0.94;


    requestAnimationFrame(
        animate
    );

}


requestAnimationFrame(
    animate
);