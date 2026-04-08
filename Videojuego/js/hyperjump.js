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
const unit = canvasWidth/28;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;
let gameReady = false;

// Variable to store the time at the previous frame
let oldTime;

let playerSpeed = 0.5;
let enemySpeed = 0.1;

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

class Enemies extends AnimatedObject {
    constructor(platform, width, height, color, type, speed) {
        const position = new Vector(platform.position.x, platform.position.y - platform.halfSize.y - height/2);
        super(position, width, height, color, type);
        this.speed = speed;
        this.direction = 1; // 1 for right, -1 for left
        this.platform = platform;
    }
    
    update(deltaTime) {
        this.position.x += this.speed * this.direction * deltaTime;
        const leftBoundary = this.platform.position.x - this.platform.halfSize.x;
        const rightBoundary = this.platform.position.x + this.platform.halfSize.x;
        if (this.position.x - this.halfSize.x < leftBoundary || this.position.x + this.halfSize.x > rightBoundary) {
            this.direction *= -1; // Reverse direction
        }
    }
}

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
        this.generation_zones = [];
        this.actualPlatforms = [];

        //Funcion to connect front whit API
        //The objects that depends on DB to load, are here.
        const loadMap = async () => {
            this.generation_zones = await initGenerationZones(1);

            this.actualPlatforms = await initPlatforms("true", this.generation_zones, unit);

            gameReady = true; //Allows the start of the game update and draw
        }
        loadMap();
    }

    //To draw the game objects
    draw(ctx) {

        //Background
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.background.draw(ctx);
        ctx.restore();

        //Camera movement
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        let tx = canvas.width / 2 - this.player.position.x;
        let ty = 0;
        ctx.translate(tx,ty);

        //Actual Platforms
        for(let platform of this.actualPlatforms) {
            platform.draw(ctx);
        }
        
        //Player
        this.player.draw(ctx);

        for(let enemy of this.enemies) {
            enemy.draw(ctx);
        }
    }

    //To update the position, sprites, collisions...
    update(deltaTime) {

        //Animate the background
        this.background.updateFrame(deltaTime);

        //Move the player
        this.player.update(deltaTime, ctx.canvas);
        //this.player.onGround = false;   //This can be uncommented when the game over condition related to falling into the void has been implemented
                                          //While not, when player falls from a platform, there is a jump that should not be there

        for(let enemy of this.enemies) {
            enemy.update(deltaTime);

            let overlap = boxOverlap(this.player, enemy, deltaTime);
            if(overlap == "top") {
                this.player.position.y = enemy.position.y - enemy.halfSize.y - this.player.halfSize.y;
                this.player.fallSpeed = 0;
                this.player.onGround = true;
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
        }
        
        // Check collision against platforms
        for (let platform of this.actualPlatforms) {
            platform.updateFrame(deltaTime);  //Important to update the platform first

            if(platform.collision == true) {
                
                const dephase = 3;  //To move the collision with the platform. Allows the player to be in a pleasant visual spot

                let overlap = boxOverlap(this.player, platform, deltaTime, dephase); //Checks the direction of the collision

                if (overlap == "top") {
                    this.player.position.y = platform.position.y - platform.halfSize.y/dephase - this.player.halfSize.y;
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
                this.player.stopMovement(keyDirections[event.code]);
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

    if(gameReady) {
    game.update(deltaTime);
    game.draw(ctx, deltaTime);
    }

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}