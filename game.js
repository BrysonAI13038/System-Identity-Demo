import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ======================================================
// ESCAPE
//
// A calm 3D experience about disconnecting
// from digital distractions.
// ======================================================



// ======================================================
// 1. BASIC THREE.JS SETUP
// ======================================================

const scene = new THREE.Scene();


// Dark background

scene.background =
    new THREE.Color(0x080808);


// Soft fog makes distant objects fade away

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


// Renderer

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
// 2. LIGHT
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
// 3. GAME VARIABLES
// ======================================================

const objects = [];


// Number of things the player has to remove

const totalObjects = 15;


// Number removed so far

let removedObjects = 0;


// Has the player clicked "enter"?

let gameStarted = false;


// Has the player finished?

let gameFinished = false;


// Mouse position

const mouse =
    new THREE.Vector2();


// Used to detect what the mouse is pointing at

const raycaster =
    new THREE.Raycaster();



// ======================================================
// 4. WORDS
// ======================================================

// These represent digital distractions.

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
// 5. CREATE TEXTURE
// ======================================================

// This creates the little floating words.

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


    texture.needsUpdate =
        true;


    return texture;

}



// ======================================================
// 6. CREATE ONE OBJECT
// ======================================================

function createObject(index) {

    const group =
        new THREE.Group();



    // ----------------------------------------------
    // CHOOSE A SHAPE
    // ----------------------------------------------

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

    if (
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

    if (
        shapeType === "ring"
    ) {

        geometry =
            new THREE.TorusGeometry(
                0.28,
                0.06,
                10,
                24
            );

    }



    // ----------------------------------------------
    // MATERIAL
    // ----------------------------------------------

    const material =
        new THREE.MeshBasicMaterial({

            color:
                0xffffff,

            transparent:
                true,

            opacity:
                0.65

        });



    // ----------------------------------------------
    // CREATE SHAPE
    // ----------------------------------------------

    const shape =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(
        shape
    );



    // ----------------------------------------------
    // CREATE WORD
    // ----------------------------------------------

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



    // ----------------------------------------------
    // POSITION
    // ----------------------------------------------

    group.position.set(

        (Math.random() - 0.5)
        * 13,

        (Math.random() - 0.5)
        * 7,

        (Math.random() - 0.5)
        * 8

    );



    // Keep objects from getting
    // too close to the camera.

    if (
        group.position.z > 5
    ) {

        group.position.z =
            5;

    }



    // ----------------------------------------------
    // ANIMATION DATA
    // ----------------------------------------------

    group.userData = {

        baseX:
            group.position.x,

        baseY:
            group.position.y,

        baseZ:
            group.position.z,

        speed:
            0.0004 +
            Math.random() *
            0.0008,

        offset:
            Math.random() *
            100,

        removed:
            false,

        removing:
            false,

        removeProgress:
            0

    };



    // Add it to the scene

    scene.add(
        group
    );


    // Save it

    objects.push(
        group
    );

}



// ======================================================
// 7. CREATE ALL 15 OBJECTS
// ======================================================

for (
    let i = 0;
    i < totalObjects;
    i++
) {

    createObject(
        i
    );

}



// ======================================================
// 8. GET HTML ELEMENTS
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


// Show total number

total.textContent =
    totalObjects;



// ======================================================
// 9. START THE GAME
// ======================================================

startScreen.addEventListener(
    "click",

    () => {

        if (
            gameStarted
        ) {

            return;

        }


        gameStarted =
            true;


        startScreen.classList.add(
            "hidden"
        );

    }
);



// ======================================================
// 10. MOUSE MOVEMENT
// ======================================================

window.addEventListener(
    "mousemove",

    (event) => {

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
// 11. CLICKING OBJECTS
// ======================================================

window.addEventListener(
    "click",

    () => {

        // Don't do anything
        // before the game starts.

        if (
            !gameStarted
        ) {

            return;

        }


        // Don't allow clicking
        // after finishing.

        if (
            gameFinished
        ) {

            return;

        }



        // Find where the mouse
        // is pointing.

        raycaster.setFromCamera(
            mouse,
            camera
        );



        // Store all clickable shapes.

        const clickableMeshes =
            [];



        objects.forEach(
            (object) => {

                if (
                    object.userData.removed
                    ||
                    object.userData.removing
                ) {

                    return;

                }


                object.traverse(
                    (child) => {

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



        // Find intersections.

        const hits =
            raycaster.intersectObjects(
                clickableMeshes
            );



        // Didn't click anything.

        if (
            hits.length === 0
        ) {

            return;

        }



        // Get the clicked shape.

        let selected =
            hits[0].object;



        // Find its main group.

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



        // Start removing it.

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
// 12. REMOVE OBJECT ANIMATION
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


    // Increase the removal amount.

    data.removeProgress +=
        0.018;



    // Shrink the object.

    const scale =
        1 -
        data.removeProgress;


    object.scale.setScalar(
        Math.max(
            scale,
            0
        )
    );



    // Fade the object.

    object.traverse(
        (child) => {

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



    // Object is completely gone.

    if (
        data.removeProgress >= 1
    ) {

        data.removed =
            true;


        data.removing =
            false;


        removedObjects++;


        // Update counter.

        count.textContent =
            removedObjects;



        // Make the fog slightly lighter
        // as the world becomes emptier.

        scene.fog.density =
            0.012 -
            (
                removedObjects
                * 0.00045
            );



        // Check for ending.

        if (
            removedObjects >=
            totalObjects
        ) {

            finishGame();

        }

    }

}



// ======================================================
// 13. FLOATING ANIMATION
// ======================================================

function animateObjects(
    time
) {

    objects.forEach(
        (object) => {

            const data =
                object.userData;



            // Don't animate
            // removed objects.

            if (
                data.removed
            ) {

                return;

            }



            // Handle disappearing.

            animateRemoval(
                object
            );



            // Don't float while disappearing.

            if (
                data.removing
            ) {

                return;

            }



            // --------------------------------------
            // FLOAT LEFT / RIGHT
            // --------------------------------------

            object.position.x =
                data.baseX
                +
                Math.sin(
                    time
                    *
                    data.speed
                    +
                    data.offset
                )
                *
                0.35;



            // --------------------------------------
            // FLOAT UP / DOWN
            // --------------------------------------

            object.position.y =
                data.baseY
                +
                Math.sin(
                    time
                    *
                    data.speed
                    *
                    1.2
                    +
                    data.offset
                )
                *
                0.25;



            // --------------------------------------
            // FLOAT FORWARD / BACK
            // --------------------------------------

            object.position.z =
                data.baseZ
                +
                Math.cos(
                    time
                    *
                    data.speed
                    +
                    data.offset
                )
                *
                0.25;



            // --------------------------------------
            // ROTATION
            // --------------------------------------

            object.rotation.x +=
                0.001;


            object.rotation.y +=
                0.0015;

        }
    );

}



// ======================================================
// 14. FINISH GAME
// ======================================================

function finishGame() {

    if (
        gameFinished
    ) {

        return;

    }


    gameFinished =
        true;



    // Hide instructions.

    hint.classList.add(
        "hidden"
    );



    // Wait before showing
    // the ending.

    setTimeout(
        () => {

            ending.classList.add(
                "show"
            );

        },

        1800
    );

}



// ======================================================
// 15. RESTART
// ======================================================

restart.addEventListener(
    "click",

    () => {

        window.location.reload();

    }
);



// ======================================================
// 16. RESIZE WINDOW
// ======================================================

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



// ======================================================
// 17. ANIMATION LOOP
// ======================================================

function animate(
    time
) {

    requestAnimationFrame(
        animate
    );



    // Animate floating objects.

    animateObjects(
        time
    );



    // Very subtle camera movement.

    if (
        gameStarted
        &&
        !gameFinished
    ) {

        camera.position.x =
            Math.sin(
                time * 0.00012
            )
            *
            0.35;


        camera.position.y =
            Math.cos(
                time * 0.0001
            )
            *
            0.2;


        camera.lookAt(
            0,
            0,
            0
        );

    }



    // Draw everything.

    renderer.render(
        scene,
        camera
    );

}



// Start the game loop.

animate();