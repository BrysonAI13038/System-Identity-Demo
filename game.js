import * as THREE from "three";


// =====================================================
// ESCAPE
// =====================================================


// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x080808);

scene.fog =
    new THREE.FogExp2(
        0x080808,
        0.015
    );



// =====================================================
// CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        55,
        window.innerWidth /
        window.innerHeight,
        0.1,
        100
    );

camera.position.z = 12;



// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


document.body.appendChild(
    renderer.domElement
);



// =====================================================
// LIGHT
// =====================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1
    );

scene.add(
    ambientLight
);



// =====================================================
// GAME STATE
// =====================================================

let quiet = 0;

let distractionsCleared = 0;

let totalDistractions = 12;

let gameStarted = false;

let gameFinished = false;

let currentInteraction = null;


// Things the player has purchased

const purchased = {

    plant: false,

    light: false,

    bench: false,

    moon: false

};



// =====================================================
// UI
// =====================================================

const startScreen =
    document.getElementById(
        "startScreen"
    );


const startButton =
    document.getElementById(
        "startButton"
    );


const quietDisplay =
    document.getElementById(
        "quiet"
    );


const hint =
    document.getElementById(
        "hint"
    );


const interactionPanel =
    document.getElementById(
        "interactionPanel"
    );


const interactionTitle =
    document.getElementById(
        "interactionTitle"
    );


const interactionText =
    document.getElementById(
        "interactionText"
    );


const choiceOne =
    document.getElementById(
        "choiceOne"
    );


const choiceTwo =
    document.getElementById(
        "choiceTwo"
    );


const message =
    document.getElementById(
        "message"
    );


const ending =
    document.getElementById(
        "ending"
    );


const endingTitle =
    document.getElementById(
        "endingTitle"
    );


const endingText =
    document.getElementById(
        "endingText"
    );


const restartButton =
    document.getElementById(
        "restartButton"
    );



// Shop buttons

const plantButton =
    document.getElementById(
        "plantButton"
    );


const lightButton =
    document.getElementById(
        "lightButton"
    );


const benchButton =
    document.getElementById(
        "benchButton"
    );


const moonButton =
    document.getElementById(
        "moonButton"
    );



// =====================================================
// MOUSE
// =====================================================

const mouse =
    new THREE.Vector2();

let mouseX = 0;

let mouseY = 0;

let smoothMouseX = 0;

let smoothMouseY = 0;


window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        mouseY =
            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1;

    }
);



// =====================================================
// RAYCASTER
// =====================================================

const raycaster =
    new THREE.Raycaster();



// =====================================================
// TEXTURE CREATOR
// =====================================================

function createTextTexture(text) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 512;

    canvas.height = 128;


    const ctx =
        canvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.font =
        "28px Arial";


    ctx.fillStyle =
        "white";


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );


    return new THREE.CanvasTexture(
        canvas
    );

}



// =====================================================
// DIGITAL WORDS
// =====================================================

const words = [

    "MESSAGE",

    "LIKE",

    "FOLLOW",

    "NOTIFICATION",

    "TRENDING",

    "POST",

    "COMMENT",

    "ONLINE",

    "SHARE",

    "WATCH",

    "NEW",

    "CONNECT"

];



// =====================================================
// DISTRACTION TYPES
// =====================================================

const types = [

    "message",

    "like",

    "follow",

    "notification",

    "post",

    "message",

    "follow",

    "like",

    "notification",

    "post",

    "message",

    "like"

];



// =====================================================
// DISTRACTIONS ARRAY
// =====================================================

const distractions = [];



// =====================================================
// CREATE DISTRACTION
// =====================================================

function createDistraction(
    index
) {

    const group =
        new THREE.Group();


    const type =
        types[index];


    // Shape

    let geometry;


    if (index % 3 === 0) {

        geometry =
            new THREE.SphereGeometry(
                0.28,
                16,
                16
            );

    }

    else if (index % 3 === 1) {

        geometry =
            new THREE.BoxGeometry(
                0.45,
                0.45,
                0.45
            );

    }

    else {

        geometry =
            new THREE.TorusGeometry(
                0.28,
                0.07,
                10,
                24
            );

    }


    const material =
        new THREE.MeshBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 0.65

        });


    const shape =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(
        shape
    );


    // Text

    const textMaterial =
        new THREE.SpriteMaterial({

            map:
                createTextTexture(
                    words[index]
                ),

            transparent: true,

            opacity: 0.4

        });


    const text =
        new THREE.Sprite(
            textMaterial
        );


    text.scale.set(
        2.6,
        0.65,
        1
    );


    text.position.y =
        0.6;


    group.add(
        text
    );


    // Position

    group.position.set(

        (Math.random() - 0.5) * 12,

        (Math.random() - 0.5) * 7,

        (Math.random() - 0.5) * 7

    );


    // Data

    group.userData = {

        isDistraction: true,

        type: type,

        index: index,

        cleared: false,

        baseX:
            group.position.x,

        baseY:
            group.position.y,

        baseZ:
            group.position.z,

        rotationSpeed:
            0.002 +
            Math.random() * 0.004,

        floatOffset:
            Math.random() * 100

    };


    scene.add(
        group
    );


    distractions.push(
        group
    );

}



// =====================================================
// CREATE ALL DISTRACTIONS
// =====================================================

for (
    let i = 0;
    i < totalDistractions;
    i++
) {

    createDistraction(i);

}



// =====================================================
// BACKGROUND PARTICLES
// =====================================================

const particleGeometry =
    new THREE.BufferGeometry();


const particlePositions = [];


for (
    let i = 0;
    i < 500;
    i++
) {

    particlePositions.push(

        (Math.random() - 0.5) * 80,

        (Math.random() - 0.5) * 50,

        (Math.random() - 0.5) * 50

    );

}


particleGeometry.setAttribute(

    "position",

    new THREE.Float32BufferAttribute(
        particlePositions,
        3
    )

);


const particleMaterial =
    new THREE.PointsMaterial({

        color: 0xffffff,

        size: 0.025,

        transparent: true,

        opacity: 0.25

    });


const particles =
    new THREE.Points(

        particleGeometry,

        particleMaterial

    );


scene.add(
    particles
);



// =====================================================
// START
// =====================================================

startButton.addEventListener(
    "click",
    () => {

        gameStarted = true;

        startScreen.classList.add(
            "hidden"
        );

        showMessage(
            "you don't have to answer everything"
        );

    }
);



// =====================================================
// SHOW INTERACTION
// =====================================================

function showInteraction(
    object
) {

    currentInteraction =
        object;


    const type =
        object.userData.type;


    interactionPanel.classList.remove(
        "hidden"
    );


    if (type === "message") {

        interactionTitle.textContent =
            "MESSAGE";


        interactionText.textContent =
            "You have a new message. It wants your attention.";


        choiceOne.textContent =
            "LET IT GO";


        choiceTwo.textContent =
            "RESPOND";

    }


    else if (type === "like") {

        interactionTitle.textContent =
            "LIKE";


        interactionText.textContent =
            "Someone liked your post. Do you need to know?";


        choiceOne.textContent =
            "LET IT GO";


        choiceTwo.textContent =
            "CHECK";

    }


    else if (type === "follow") {

        interactionTitle.textContent =
            "FOLLOW";


        interactionText.textContent =
            "Someone is waiting for you to follow them back.";


        choiceOne.textContent =
            "UNFOLLOW";


        choiceTwo.textContent =
            "FOLLOW BACK";

    }


    else if (type === "notification") {

        interactionTitle.textContent =
            "NOTIFICATION";


        interactionText.textContent =
            "You have a notification. It isn't important.";


        choiceOne.textContent =
            "TURN IT OFF";


        choiceTwo.textContent =
            "OPEN";

    }


    else if (type === "post") {

        interactionTitle.textContent =
            "POST";


        interactionText.textContent =
            "A new post is waiting for you to scroll past it.";


        choiceOne.textContent =
            "KEEP SCROLLING";


        choiceTwo.textContent =
            "STOP";

    }

}



// =====================================================
// CLOSE INTERACTION
// =====================================================

function closeInteraction() {

    interactionPanel.classList.add(
        "hidden"
    );

    currentInteraction = null;

}



// =====================================================
// CLEAR DISTRACTION
// =====================================================

function clearDistraction(
    object,
    amount = 1
) {

    if (
        object.userData.cleared
    ) {

        return;

    }


    object.userData.cleared =
        true;


    distractionsCleared++;


    quiet += amount;


    quietDisplay.textContent =
        quiet;


    showMessage(
        "+" + amount + " QUIET"
    );


    // Fade away

    const fadeTime = 700;

    const startTime =
        performance.now();


    function fade() {

        const progress =
            Math.min(
                (
                    performance.now() -
                    startTime
                ) / fadeTime,
                1
            );


        object.scale.setScalar(
            1 - progress
        );


        object.traverse(
            child => {

                if (
                    child.material &&
                    child.material.opacity !== undefined
                ) {

                    child.material.opacity =
                        0.7 *
                        (1 - progress);

                }

            }
        );


        if (progress < 1) {

            requestAnimationFrame(
                fade
            );

        }

        else {

            scene.remove(
                object
            );

        }

    }


    fade();


    closeInteraction();


    updateShop();


    // Change atmosphere

    scene.fog.density =
        Math.max(
            0.007,
            0.015 -
            distractionsCleared *
            0.00045
        );


    if (
        distractionsCleared === 3
    ) {

        showMessage(
            "the noise is getting quieter"
        );

    }


    if (
        distractionsCleared === 6
    ) {

        showMessage(
            "you can make your own space"
        );

    }


    if (
        distractionsCleared === 10
    ) {

        showMessage(
            "almost quiet"
        );

    }


    if (
        distractionsCleared ===
        totalDistractions
    ) {

        setTimeout(
            finishGame,
            2000
        );

    }

}



// =====================================================
// CHOICE ONE
// =====================================================

choiceOne.addEventListener(
    "click",
    () => {

        if (
            !currentInteraction
        ) {

            return;

        }


        clearDistraction(
            currentInteraction,
            1
        );

    }
);



// =====================================================
// CHOICE TWO
// =====================================================

choiceTwo.addEventListener(
    "click",
    () => {

        if (
            !currentInteraction
        ) {

            return;

        }


        showMessage(
            "you chose to stay connected"
        );


        closeInteraction();

    }
);



// =====================================================
// CLICKING THE WORLD
// =====================================================

window.addEventListener(
    "click",
    (event) => {

        if (
            !gameStarted ||
            gameFinished
        ) {

            return;

        }


        // Don't raycast if clicking UI

        if (
            event.target !==
            renderer.domElement
        ) {

            return;

        }


        mouse.x =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        mouse.y =
            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1;


        raycaster.setFromCamera(
            mouse,
            camera
        );


        const objects = [];


        distractions.forEach(
            object => {

                if (
                    !object.userData.cleared
                ) {

                    object.traverse(
                        child => {

                            if (
                                child.isMesh
                            ) {

                                objects.push(
                                    child
                                );

                            }

                        }
                    );

                }

            }
        );


        const hits =
            raycaster.intersectObjects(
                objects
            );


        if (
            hits.length === 0
        ) {

            return;

        }


        let selected =
            hits[0].object;


        while (
            selected &&
            !selected.userData
                ?.isDistraction
        ) {

            selected =
                selected.parent;

        }



        if (selected) {

            const chance = Math.random();

            if (chance < 0.25) {

                showInteraction(
                    selected
                );

            } else {

                clearDistraction(
                    selected,
                    1
                );

            }

        }

    });


    // =====================================================
    // MESSAGE SYSTEM
// =====================================================

let messageTimeout;


function showMessage(
    text
) {

    clearTimeout(
        messageTimeout
    );


    message.textContent =
        text;


    message.classList.add(
        "show"
    );


    messageTimeout =
        setTimeout(
            () => {

                message.classList.remove(
                    "show"
                );

            },
            2200
        );

}



// =====================================================
// SHOP
// =====================================================

function updateShop() {

    plantButton.disabled =
        purchased.plant ||
        quiet < 3;


    lightButton.disabled =
        purchased.light ||
        quiet < 5;


    benchButton.disabled =
        purchased.bench ||
        quiet < 8;


    moonButton.disabled =
        purchased.moon ||
        quiet < 10;

}



// =====================================================
// BUY PLANT
// =====================================================

plantButton.addEventListener(
    "click",
    () => {

        if (
            purchased.plant ||
            quiet < 3
        ) {

            return;

        }


        quiet -= 3;


        quietDisplay.textContent =
            quiet;


        purchased.plant =
            true;


        createPlant();


        showMessage(
            "something is growing"
        );


        updateShop();

    }
);



// =====================================================
// BUY LIGHT
// =====================================================

lightButton.addEventListener(
    "click",
    () => {

        if (
            purchased.light ||
            quiet < 5
        ) {

            return;

        }


        quiet -= 5;


        quietDisplay.textContent =
            quiet;


        purchased.light =
            true;


        createLight();


        showMessage(
            "a little light"
        );


        updateShop();

    }
);



// =====================================================
// BUY BENCH
// =====================================================

benchButton.addEventListener(
    "click",
    () => {

        if (
            purchased.bench ||
            quiet < 8
        ) {

            return;

        }


        quiet -= 8;


        quietDisplay.textContent =
            quiet;


        purchased.bench =
            true;


        createBench();


        showMessage(
            "you made somewhere to rest"
        );


        updateShop();

    }
);



// =====================================================
// BUY MOON
// =====================================================

moonButton.addEventListener(
    "click",
    () => {

        if (
            purchased.moon ||
            quiet < 10
        ) {

            return;

        }


        quiet -= 10;


        quietDisplay.textContent =
            quiet;


        purchased.moon =
            true;


        createMoon();


        showMessage(
            "the world slows down"
        );


        updateShop();

    }
);



// =====================================================
// CREATE PLANT
// =====================================================

function createPlant() {

    const plant =
        new THREE.Group();


    // Stem

    const stemGeometry =
        new THREE.CylinderGeometry(
            0.05,
            0.05,
            1.2,
            8
        );


    const stemMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x7d9b72
        });


    const stem =
        new THREE.Mesh(
            stemGeometry,
            stemMaterial
        );


    stem.position.y =
        0.6;


    plant.add(
        stem
    );


    // Leaves

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const leaf =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.22,
                    8,
                    8
                ),

                new THREE.MeshBasicMaterial({
                    color: 0x9ab58a
                })

            );


        leaf.position.set(

            Math.cos(i * 1.5) * 0.22,

            0.8 + i * 0.15,

            Math.sin(i * 1.5) * 0.22

        );


        leaf.scale.y =
            0.5;


        plant.add(
            leaf
        );

    }


    plant.position.set(
        -3,
        -3,
        0
    );


    scene.add(
        plant
    );


    // Let it grow

    plant.scale.setScalar(
        0
    );


    const start =
        performance.now();


    function grow() {

        const progress =
            Math.min(
                (
                    performance.now() -
                    start
                ) / 1500,
                1
            );


        plant.scale.setScalar(
            progress
        );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                grow
            );

        }

    }


    grow();

}



// =====================================================
// CREATE LIGHT
// =====================================================

function createLight() {

    const light =
        new THREE.PointLight(
            0xffe9bd,
            2,
            12
        );


    light.position.set(
        2,
        2,
        1
    );


    scene.add(
        light
    );


    // Visual glow

    const glow =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.15,
                12,
                12
            ),

            new THREE.MeshBasicMaterial({
                color: 0xffe9bd
            })

        );


    glow.position.copy(
        light.position
    );


    scene.add(
        glow
    );

}



// =====================================================
// CREATE BENCH
// =====================================================

function createBench() {

    const bench =
        new THREE.Group();


    const material =
        new THREE.MeshBasicMaterial({
            color: 0x777777
        });


    // Seat

    const seat =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2,
                0.2,
                0.5
            ),

            material

        );


    seat.position.y =
        0.8;


    bench.add(
        seat
    );


    // Legs

    for (
        let i = 0;
        i < 2;
        i++
    ) {

        const leg =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.15,
                    0.8,
                    0.4
                ),

                material

            );


        leg.position.set(

            i === 0
                ? -0.7
                : 0.7,

            0.4,

            0

        );


        bench.add(
            leg
        );

    }


    bench.position.set(
        3,
        -3,
        0
    );


    scene.add(
        bench
    );

}



// =====================================================
// CREATE MOON
// =====================================================

function createMoon() {

    const moon =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1,
                24,
                24
            ),

            new THREE.MeshBasicMaterial({
                color: 0xdedede
            })

        );


    moon.position.set(
        5,
        3,
        -3
    );


    scene.add(
        moon
    );


    scene.background =
        new THREE.Color(
            0x02030a
        );


    scene.fog.color =
        new THREE.Color(
            0x02030a
        );


    showMessage(
        "goodnight"
    );

}



// =====================================================
// FINISH GAME
// =====================================================

function finishGame() {

    gameFinished =
        true;


    hint.classList.add(
        "hidden"
    );


    setTimeout(
        () => {

            ending.classList.add(
                "show"
            );


            if (
                purchased.plant &&
                purchased.light &&
                purchased.bench &&
                purchased.moon
            ) {

                endingTitle.textContent =
                    "YOUR SPACE";


                endingText.textContent =
                    "You built a place where nothing needs your attention.";

            }

            else if (
                quiet >= 10
            ) {

                endingTitle.textContent =
                    "QUIET";


                endingText.textContent =
                    "You found a little distance from the noise.";

            }

            else {

                endingTitle.textContent =
                    "ESCAPE";


                endingText.textContent =
                    "You chose what deserved your attention.";

            }

        },
        2500
    );

}



// =====================================================
// RESTART
// =====================================================

restartButton.addEventListener(
    "click",
    () => {

        window.location.reload();

    }
);



// =====================================================
// ANIMATION
// =====================================================

function animate(time) {

    requestAnimationFrame(
        animate
    );


    // Smooth mouse

    smoothMouseX +=
        (
            mouseX -
            smoothMouseX
        ) * 0.03;


    smoothMouseY +=
        (
            mouseY -
            smoothMouseY
        ) * 0.03;



    // Camera

    if (
        gameStarted
    ) {

        camera.position.x +=
            (
                smoothMouseX * 0.7 -
                camera.position.x
            ) * 0.02;


        camera.position.y +=
            (
                smoothMouseY * 0.4 -
                camera.position.y
            ) * 0.02;


        camera.lookAt(
            0,
            0,
            0
        );

    }



    // Background

    particles.rotation.y =
        time * 0.00003;


    particles.rotation.x =
        time * 0.00001;



    // Distractions

    distractions.forEach(
        object => {

            if (
                object.userData.cleared
            ) {

                return;

            }


            const data =
                object.userData;


            object.position.y =

                data.baseY +

                Math.sin(

                    time *
                    0.0008 +
                    data.floatOffset

                ) * 0.25;


            object.position.x =

                data.baseX +

                Math.sin(

                    time *
                    0.0005 +
                    data.floatOffset

                ) * 0.3;


            object.rotation.x +=
                data.rotationSpeed;


            object.rotation.y +=
                data.rotationSpeed;

        }
    );


    renderer.render(
        scene,
        camera
    );

}



// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);



// =====================================================
// INITIALIZE
// =====================================================

updateShop();

animate();
