/*
 * Main script for the game "HyperJump"
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

"use strict";

class Enemies extends AnimatedObject {
    constructor(platform, width, height, color, type, speed, dephase) {
        const position = new Vector(platform.position.x, platform.position.y - platform.halfSize.y/dephase - height/2);
        super(position, width, height, color, type);
        this.speed = speed;
        this.direction = 1; // 1 for right, -1 for left
        this.platform = platform;
        this.lives = 1;
        this.points = 100;
    }
    
    update(deltaTime) {
        this.position.x += this.speed * this.direction * deltaTime;
        const leftBoundary = this.platform.position.x - this.platform.halfSize.x;
        const rightBoundary = this.platform.position.x + this.platform.halfSize.x;
        if (this.position.x - this.halfSize.x < leftBoundary || this.position.x + this.halfSize.x > rightBoundary) {
            this.direction *= -1; // Reverse direction
        }
    }

    receiveDamage(quantity = 1){
        this.lives -=quantity;
        return this.lives <=0;
    }
}

// Class to keep track of all the events and objects in the game
class Game {
    constructor(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.createEventListeners();  //Initializes the event lsiteners
    }

    //Initializes the game objects (the sprites are temporal)
    //This function is async so it can load the objects in the scene before the game starts
    async init() {
        
        //Background
        this.background = new AnimatedObject(
            new Vector(this.canvasWidth / 2, this.canvasHeight / 2),
            this.canvasWidth,
            this.canvasHeight,
            "gray",
            "background",
            45
        );
        this.background.setSprite("../../sprites/Background/Background N1.png",
                                    new Rect(1376, 0, 1376, 768));
        //this.background.setAnimation(0, 44, true, 100);

        //Player
        this.player = new AnimatedPlayer(
            new Vector(30, this.canvasHeight / 2),
            48,
            64,
            "red",
            3,
            playerMotion
        );
        this.player.lives = 3;
        this.lifeSprite =  new Image();
        this.lifeSprite.src = "../../sprites/Lives/lives.png";
        this.player.Maxlives = 6;
        this.score = 0;
        this.isGameOver = false;
        this.startTime= Date.now();
        this.elapsedTime = 0;
        this.player.setSprite('../assets/sprites/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        this.player.setSpeed(gameConfig.playerSpeed);

        //Actual generation zones
        this.generation_zones = [];
        this.actualPlatforms = [];
        this.enemies = [];

        //Funcion to connect front whit API
        //The objects that depends on DB to load, are here.
        const loadMap = async () => {
            this.generation_zones = await initGenerationZones(1);

            this.actualPlatforms = await initPlatforms("true", this.generation_zones, gameConfig.unit);

            //Enemies
            for(let i = 0; i < this.actualPlatforms.length; i++) {

                if(this.actualPlatforms[i].hostile == true) { //If the platform is hostile, an enemy is generated
                    let platform = this.actualPlatforms[i];
                    let enemy = new Enemies(
                        platform,
                        32,
                        32,
                        "red",
                        "basic_enemy",
                        gameConfig.enemySpeed,
                        3
                    );
                    enemy.setSprite("../assets/sprites/blue_alien.png");
                    this.enemies.push(enemy);
                }
            }
        }
        await loadMap();
    }

    gameOver(){
            this.isGameOver=true;

            this.player.velocity.x = 0;
            this.player.velocity.y = 0;
        }

    //To draw the game objects
    draw(ctx) {
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        const lifeWidth = 32;
        const lifeHeight = 32;
        const margin = 10;
        
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "left";

        for(let i = 0; i < this.player.lives; i++){
            ctx.drawImage(
               this.lifeSprite,
               margin + i * (lifeWidth + 5),
               margin,
               lifeWidth,
               lifeHeight
            );
        }

        ctx.fillText(
            "Score: " + this.score,
            margin,
            margin + 50
        );

        ctx.fillText(
            "Time: " + this.elapsedTime + "s",
            margin,
            margin + 80
        );
        ctx.restore();

        //Background now is loaded from the Phaser scene

        //Actual Platforms
        for(let platform of this.actualPlatforms) {
            platform.draw(ctx);
        }
        
        //Player
        this.player.draw(ctx);

        for(let enemy of this.enemies) {
            enemy.draw(ctx);
        }

        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        if(this.isGameOver){
            this.drawGameOver(ctx);
        }
        ctx.restore();
    }

    drawGameOver(ctx){
        const centerX = this.canvasWidth / 2;
        const centerY =  this.canvasHeight / 2;

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "bold 60px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", centerX, centerY - 20);

        ctx.font = "30px Arial";
        ctx.fillText("Score: " + this.score, centerX, centerY + 20);

        ctx.fillText("Time: " + this.elapsedTime + "s", centerX, centerY + 50);
    }

    //To update the position, sprites, collisions...
    update(deltaTime) {

        if(this.isGameOver) return;
        //Animate the background
        this.background.updateFrame(deltaTime);

        //Move the player
        this.player.update(deltaTime, {width:this.canvasWidth, height:this.canvasHeight});
        //this.player.onGround = false;   //This can be uncommented when the game over condition related to falling into the void has been implemented
                                          //While not, when player falls from a platform, there is a jump that should not be there

        for(let enemy of this.enemies) {
            enemy.update(deltaTime);

            let overlap = boxOverlap(this.player, enemy, deltaTime, 1);
            if(overlap == "top") {
                this.player.position.y = enemy.position.y - enemy.halfSize.y - this.player.halfSize.y;
                this.player.fallSpeed = 0;
                this.player.onGround = true;
                
                if (enemy.receiveDamage()){
                    this.score += enemy.points;
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                }
            }
            else if (overlap == "left" || overlap == "right" || overlap== "bottom"){
                this.player.lives--;

                if(this.player.lives <=0){
                    this.gameOver();
                }
            }
        }

        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000); //Time en seconds
        
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
// function main() {

//     // Get a reference to the object with id 'canvas' in the page
//     const canvas = document.getElementById('canvas');

//     //Resize the element
//     canvas.width = canvasWidth;
//     canvas.height = canvasHeight;

//     // Get the context for drawing in 2D
//     ctx = canvas.getContext('2d');

//     //Create the "game" object
//     game = new Game();

//     drawScene(0);
// }

// Main loop function to be called once per frame
// function drawScene(newTime) {
//     if (oldTime == undefined) {
//         oldTime = newTime;
//     }
//     let deltaTime = newTime - oldTime;

//     // Clean the canvas so we can draw everything again
//     ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//     if(gameReady) {
//     game.update(deltaTime);
//     game.draw(ctx, deltaTime);
//     }

//     oldTime = newTime;
//     requestAnimationFrame(drawScene);
// }