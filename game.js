// ======================================================
// ESCAPE
// ======================================================
//
// A calm 3D experience about disconnecting
// from digital distractions.
//
// ======================================================



// ======================================================
// 1. CHECK THAT THREE.JS LOADED
// ======================================================

if (typeof THREE === "undefined") {

    alert(
        "Three.js could not load. Please make sure you are connected to the internet."
    );

    throw new Error(
        "Three.js did not load."
    );

}



// ======================================================
// 2. BASIC THREE.JS SETUP
// ======================================================

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x080808
    );


// Soft fog

scene.fog =
    new THREE.FogExp2(
        0x080808,
        0.012
    );


// Camera

const camera =
    new THREE.PerspectiveCamera(

        55,

        window.innerWidth /
        window.innerHeight,

        0.1,

        200

    );


camera.position.set(
    0,
    0,
    12
);



// ======================================================
// 3. RENDERER
// ======================================================

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



// ======================================================
// 4. LIGHT
// ======================================================

const ambientLight =
    new THREE.AmbientLight(

        0xffffff,

        1

    );


scene.add(
    ambientLight
);



// ======================================================
// 5. GAME VARIABLES
// ======================================================

const objects = [];


const totalObjects = 15;


let removedObjects = 0;


let gameStarted = false;


let gameFinished = false;


// Mouse position

const mouse =
    new THREE.Vector2();


// Used to find objects
// underneath the mouse

const raycaster =
    new THREE.Raycaster();



// ======================================================
// 6. WORDS
// ======================================================

const words = [

    "LIKE",

    "MESSAGE",

    "ONLINE",

    "NEW",

    "FOLLOW",

    "WATCH",

    "SHARE",

    "...",

    "?",

    "NOTIFICATION",

    "TRENDING",

    "POST",

    "VIEW",

    "COMMENT",

    "CONNECT"

];



// ======================================================
// 7. CREATE TEXT
// ======================================================

function createTextTexture(text) {


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width = 512;

    canvas.height = 128;


    const context =
        canvas.getContext(
            "2d"
        );


    context.clearRect(

        0,
        0,

        canvas.width,
        canvas.height

    );


    context.font =
        "28px Arial";


    context.fillStyle =
        "white";


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    context.fillText(

        text,

        canvas.width / 2,

        canvas.height / 2

    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    return texture;

}



// ======================================================
// 8. CREATE OBJECT
// ======================================================

function createObject(index) {


    const group =
        new THREE.Group();



    // --------------------------------------------
    // CHOOSE SHAPE
    // --------------------------------------------

    const shapeTypes = [

        "sphere",

        "box",

        "ring"

    ];


    const shapeType =
        shapeTypes[
            index %
            shapeTypes.length
        ];



    let geometry;



    // Sphere

    if (
        shapeType === "sphere"
    ) {

        geometry =
            new THREE.SphereGeometry(

                0.25,

                16,

                16

            );

    }



    // Cube

    else if (
        shapeType === "box"
    ) {

        geometry =
            new THREE.BoxGeometry(

                0.4,

                0.4,

                0.4

            );

    }



    // Ring

    else {

        geometry =
            new THREE.TorusGeometry(

                0.28,

                0.06,

                10,

                24

            );

    }



    // --------------------------------------------
    // MATERIAL
    // --------------------------------------------

    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xffffff,

            transparent:
                true,

            opacity:
                0.65

        });



    // --------------------------------------------
    // SHAPE
    // --------------------------------------------

    const shape =
        new THREE.Mesh(

            geometry,

            material

        );


    group.add(
        shape
    );



    // --------------------------------------------
    // TEXT
    // --------------------------------------------

    const textMaterial =
        new THREE.SpriteMaterial({

            map:
                createTextTexture(
                    words[index]
                ),

            transparent:
                true,

            opacity:
                0.35

        });


    const text =
        new THREE.Sprite(
            textMaterial
        );


    text.scale.set(

        2.7,

        0.68,

        1

    );


    text.position.y =
        0.55;


    group.add(
        text
    );



    // --------------------------------------------
    // RANDOM POSITION
    // --------------------------------------------

    group.position.set(

        (Math.random() - 0.5) * 13,

        (Math.random() - 0.5) * 7,

        (Math.random() - 0.5) * 8

    );



    // --------------------------------------------
    // ANIMATION DATA
    // --------------------------------------------

    group.userData = {

        baseX:
            group.position.x,

        baseY:
            group.position.y,

        baseZ:
            group.position.z,

        speed:
            0.0004 +
            Math.random() * 0.0008,

        offset:
            Math.random() * 100,

        removed:
            false,

        removing:
            false,

        removeProgress:
            0

    };



    // Add to scene

    scene.add(
        group
    );


    // Save object

    objects.push(
        group
    );

}



// ======================================================
// 9. CREATE 15 OBJECTS
// ======================================================

for (
    let i = 0;
    i < totalObjects;
    i++
) {

    createObject(i);

}



// ======================================================
// 10. GET HTML ELEMENTS
// ======================================================

const startScreen =
    document.getElementById(
        "startScreen"
    );


const hint =
    document.getElementById(
        "hint"
    );


const count =
    document.getElementById(
        "count"
    );


const total =
    document.getElementById(
        "total"
    );


const ending =
    document.getElementById(
        "ending"
    );


const restart =
    document.getElementById(
        "restart"
    );



total.textContent =
    totalObjects;



// ======================================================
// 11. START GAME
// ======================================================

startScreen.addEventListener(

    "click",

    function () {


        console.log(
            "ESCAPE started!"
        );


        gameStarted =
            true;


        startScreen.classList.add(
            "hidden"
        );


    }

);



// ======================================================
// 12. MOUSE MOVEMENT
// ======================================================

window.addEventListener(

    "mousemove",

    function (event) {


        mouse.x =

            (
                event.clientX /
                window.innerWidth
            )
            * 2
            - 1;


        mouse.y =

            -(
                event.clientY /
                window.innerHeight
            )
            * 2
            + 1;


    }

);



// ======================================================
// 13. CLICK OBJECT
// ======================================================

window.addEventListener(

    "click",

    function () {


        // Game hasn't started yet

        if (
            !gameStarted
        ) {

            return;

        }


        // Game already finished

        if (
            gameFinished
        ) {

            return;

        }



        // Tell Three.js where
        // the mouse is looking.

        raycaster.setFromCamera(

            mouse,

            camera

        );



        const clickableMeshes =
            [];



        // Find all visible shapes

        objects.forEach(

            function (object) {


                if (
                    object.userData.removed
                    ||
                    object.userData.removing
                ) {

                    return;

                }


                object.traverse(

                    function (child) {


                        if (
                            child.isMesh
                        ) {

                            clickableMeshes.push(
                                child
                            );

                        }

                    }

                );

            }

        );



        // Check for a click

        const hits =
            raycaster.intersectObjects(

                clickableMeshes

            );



        // Didn't click an object

        if (
            hits.length === 0
        ) {

            return;

        }



        // Find clicked object

        let selected =
            hits[0].object;



        // Move up to the main group

        while (
            selected.parent
        ) {


            if (

                selected.parent.userData
                &&
                selected.parent.userData
                    .hasOwnProperty(
                        "removing"
                    )

            ) {


                selected =
                    selected.parent;


                break;

            }


            selected =
                selected.parent;

        }



        // Start disappearing

        if (

            selected.userData
            &&
            !selected.userData.removed

        ) {

            selected.userData.removing =
                true;

        }


    }

);



// ======================================================
// 14. REMOVE OBJECT
// ======================================================

function animateRemoval(
    object
) {


    const data =
        object.userData;


    if (
        !data.removing
    ) {

        return;

    }


    // Slowly disappear

    data.removeProgress +=
        0.018;


    const scale =
        1 -
        data.removeProgress;


    object.scale.setScalar(

        Math.max(
            scale,
            0
        )

    );


    // Fade materials

    object.traverse(

        function (child) {


            if (

                child.material
                &&
                child.material.opacity
                !== undefined

            ) {


                child.material.opacity =

                    Math.max(

                        0,

                        scale * 0.7

                    );

            }

        }

    );



    // Completely gone

    if (
        data.removeProgress >= 1
    ) {


        data.removed =
            true;


        data.removing =
            false;


        removedObjects++;


        // Update counter

        count.textContent =
            removedObjects;



        // Make world calmer

        scene.fog.density =

            0.012 -

            (
                removedObjects *
                0.00045
            );



        // All objects removed

        if (

            removedObjects >=
            totalObjects

        ) {

            finishGame();

        }

    }

}



// ======================================================
// 15. FLOATING OBJECTS
// ======================================================

function animateObjects(
    time
) {


    objects.forEach(

        function (object) {


            const data =
                object.userData;


            // Don't animate removed objects

            if (
                data.removed
            ) {

                return;

            }


            // Handle disappearing

            animateRemoval(
                object
            );


            // Don't float while disappearing

            if (
                data.removing
            ) {

                return;

            }



            // Floating left and right

            object.position.x =

                data.baseX +

                Math.sin(

                    time *
                    data.speed +
                    data.offset

                ) *

                0.35;



            // Floating up and down

            object.position.y =

                data.baseY +

                Math.sin(

                    time *
                    data.speed *
                    1.2 +
                    data.offset

                ) *

                0.25;



            // Floating forward/backward

            object.position.z =

                data.baseZ +

                Math.cos(

                    time *
                    data.speed +
                    data.offset

                ) *

                0.25;



            // Slowly rotate

            object.rotation.x +=
                0.001;


            object.rotation.y +=
                0.0015;


        }

    );

}



// ======================================================
// 16. FINISH GAME
// ======================================================

function finishGame() {


    if (
        gameFinished
    ) {

        return;

    }


    gameFinished =
        true;


    // Hide instructions

    hint.classList.add(
        "hidden"
    );



    // Wait before showing ending

    setTimeout(

        function () {


            ending.classList.add(
                "show"
            );


        },

        1800

    );

}



// ======================================================
// 17. RESTART
// ======================================================

restart.addEventListener(

    "click",

    function () {


        window.location.reload();


    }

);



// ======================================================
// 18. WINDOW RESIZE
// ======================================================

window.addEventListener(

    "resize",

    function () {


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



// ======================================================
// 19. ANIMATION LOOP
// ======================================================

function animate(
    time
) {


    requestAnimationFrame(
        animate
    );


    // Animate objects

    animateObjects(
        time
    );



    // Very subtle camera movement

    if (

        gameStarted
        &&
        !gameFinished

    ) {


        camera.position.x =

            Math.sin(

                time *
                0.00012

            ) *

            0.35;



        camera.position.y =

            Math.cos(

                time *
                0.0001

            ) *

            0.2;



        camera.lookAt(

            0,
            0,
            0

        );

    }



    // Draw scene

    renderer.render(

        scene,

        camera

    );

}



// ======================================================
// 20. START ANIMATION
// ======================================================

animate();