/*
 * Main script for the game "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

"use strict";

// Global variables
const canvasWidth = 1400;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let playerSpeed = 0.5;

// Dictionary for the keys that will control player movement
const keyDirections = {
    w: 'up',
    a: 'left',
    d: 'right',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Space: 'up',
};

// Data structure with the directions a character can move, the
// direction sign and the related animation.
const playerMotion = {
    up: {
        status: false,
        axis: "y",
        sign: -1,
        repeat: true,
        duration: 100,
        moveFrames: [0, 2],
        idleFrames: [1, 1],
    },
    left: {
        status: false,
        axis: "x",
        sign: -1,
        repeat: true,
        duration: 100,
        moveFrames: [9, 11],
        idleFrames: [10, 10],
    },
    right: {
        status: false,
        axis: "x",
        sign: 1,
        repeat: true,
        duration: 100,
        moveFrames: [3, 5],
        idleFrames: [4, 4],
    },
};


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();  //Initializes the event lsiteners
        this.initObjects();   //Initializes the game objects
    }

    //Initializes the game objects (the sprites are temporal)
    initObjects() {
        
        //Background
        this.background = new AnimatedObject(
            new Vector(canvasWidth / 2, canvasHeight / 2),
            canvasWidth,
            canvasHeight,
            "gray",
            "background",
            45
        );
        this.background.setSprite("../assets/sprites/lava_spr_strip45.png",
                                    new Rect(0, 0, 16, 16));
        this.background.setAnimation(0, 44, true, 100);

        //Player
        this.player = new AnimatedPlayer(
            new Vector(30, canvasHeight / 2),
            48,
            64,
            "red",
            3,
            playerMotion
        );
        this.player.setSprite('../assets/sprites/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        this.player.setSpeed(playerSpeed);


        //Actual generation zones
        this.generation_zones = [];                     //Manually until the API is ready
        this.generation_zones.push(new generation_zone(30, canvasHeight/1.2));
        this.generation_zones.push(new generation_zone(canvasWidth/2, canvasHeight/1.2));
        this.generation_zones.push(new generation_zone(canvasWidth - 100, canvasHeight/1.5));
        this.generation_zones.push(new generation_zone(canvasWidth - 200, canvasHeight/1.5));

        //Plaforms (temporal here until DB and API are ready)
        this.platforms = [];
        this.addPlatform(0,0,30,30, this.platforms);
        this.addPlatform(0,0,40,30, this.platforms);
        this.addPlatform(0,0,50,30, this.platforms);
        this.addPlatform(0,0,30,40, this.platforms);
        this.addPlatform(0,0,30,40, this.platforms);
        this.addPlatform(0,0,40,40, this.platforms);
        this.addPlatform(0,0,40,50, this.platforms);
        this.addPlatform(0,0,50,40, this.platforms);
        this.addPlatform(0,0,50,50, this.platforms);

        //Actual platforms
        this.actualPlatforms = [];
        for(let i = 0; i < this.generation_zones.length; i++) {
            let zona = this.generation_zones[i];

            //(temporal until we can read platforms from the DB)
            let plat = this.platforms[randomRange(this.platforms.length-1, 0)];

            this.addPlatform(zona.x, zona.y, plat.size.x, plat.size.y, this.actualPlatforms);
        }
    }

    //To draw the game objects
    draw(ctx) {

        //Background
        this.background.draw(ctx);

        //Actual Platforms
        for(let platform of this.actualPlatforms) {
            platform.draw(ctx);
        }
        
        //Player
        this.player.draw(ctx);
    }

    //Tu update the position, sprites, collisions...
    update(deltaTime) {

        //Animate the background
        this.background.updateFrame(deltaTime);

        //Move the player
        this.player.update(deltaTime, ctx.canvas);
        //this.player.onGround = false;   //This can be uncommented when the game over condition related to falling into the void has been implemented
                                          //While not, when player falls from a platform, there is a jump that should not be there
        
        // Check collision against platforms
        for (let platform of this.actualPlatforms) {
            platform.updateFrame(deltaTime);  //Important to udate the platform first

            if(platform.collision == true) {
                
                let overlap = boxOverlap(this.player, platform, deltaTime); //Checks the direction of the collision

                if (overlap == "top") {
                    this.player.position.y = platform.position.y - platform.halfSize.y - this.player.halfSize.y;
                    this.player.fallSpeed = 0;
                    this.player.onGround = true;  //Activates the jump
                }

                if (overlap == "bottom") {
                    this.player.position.y = platform.position.y + platform.halfSize.y + this.player.halfSize.y;
                    this.player.fallSpeed = 0;
                }

                if (overlap == "left") {
                    this.player.position.x = platform.position.x - platform.halfSize.x - this.player.halfSize.x;
                    this.player.velocity.x = 0;
                }

                if (overlap == "right") {
                    this.player.position.x = platform.position.x + platform.halfSize.x + this.player.halfSize.x;
                    this.player.velocity.x = 0;
                }
            }
        }
    }

    //To add a platform in the game
    addPlatform(x, y, width, height, lst) {

        const box = new AnimatedObject(
            new Vector(x, y),
            width,
            height,
            "gray",
            "obstacle",
            6
        );
        
        box.setSprite('../assets/sprites/RTS_Crate.png',
                              new Rect(64, 0, 64, 64));  // If we want to draw the whole sprite, no need to add a rect
        box.setAnimation(1, 5, true, 200);
        box.destroy = false;
        lst.push(box);
    }

    //To create the parallel events to detect the keys
    createEventListeners() {

        //When pressed
        window.addEventListener('keydown', (event) => {
            //Detect the predefined keys for movement and store the direction
            if (event.key in keyDirections) {
                this.addKey(keyDirections[event.key]);
                this.player.startMovement(keyDirections[event.key]);
            }

            //For "Space"
            if (event.code in keyDirections) {
                this.addKey(keyDirections[event.code]);
                this.player.startMovement(keyDirections[event.code]);
            }
        });

        //When released
        window.addEventListener('keyup', (event) => {
            //Detect the predefined keys for movement and remove the direction
            if (event.key in keyDirections) {
                this.delKey(keyDirections[event.key]);
                this.player.stopMovement(keyDirections[event.key]);
            }

            //For "Space"
            if (event.code in keyDirections) {
                this.delKey(keyDirections[event.code]);
                this.player.startMovement(keyDirections[event.code]);
            }
        });
    }

    //To add and remove the keys that had been pressed
    addKey(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    delKey(direction) {
        if (this.player.keys.includes(direction)) {
            this.player.keys.splice(this.player.keys.indexOf(direction), 1);
        }
    }
}


// Starting function that will be called from the HTML page
function main() {

    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');

    //Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    //Create the "game" object
    game = new Game();

    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}