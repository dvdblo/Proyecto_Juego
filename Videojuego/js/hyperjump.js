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

class Cards extends AnimatedObject {
    constructor(position, width, height, type, duration) {
        super(position, width, height, type);
        this.duration = duration; // Duration of the power-up effect
        this.type = type; // Type of power-up (e.g., "Esprint N1", "Doble Salto N1")
    }


    applyEffect(player,game) {
        if (this.type == "Esprint N1") {
            player.setSpeed(player.speed * 1.5);
        setTimeout(() => { /*Had to google what setTimeout was, but it allows to
                            delay the execution of a function, in this case, to set
                            the speed back to normal after the duration of the power-up*/
                player.setSpeed(player.speed / 1.5);
            }, this.duration);
        }
        else if (this.type == "Doble Salto N1") {
            player.setJumpForce(player.jumpForce * 1.5);
        setTimeout(() => {
                player.setJumpForce(player.jumpForce / 1.5);
            }, this.duration);
        }
        else if(this.type == "Plataforma") {
            //This power-up generates a temporary platform under the player, allowing him to jump again
            addPlatform(
                // game.generation_zones[6].x, 
                // game.generation_zones[6].y, 
                player.position.x + game.mouseX - game.canvasWidth / 2,
                game.mouseY,
                3, 1, 
                game.actualPlatforms, 
                50, 
                true
            );

        }   
    }
}


// Class to keep track of all the events and objects in the game
class Game {
    constructor(width, height, level) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.level = level;
        this.mouseX = 0;
        this.mouseY = 0;
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
        this.background.setSprite(`../assets/Fondos/back_${gameConfig.actualDiff}.png`,
                                    new Rect(1376, 0, 1376, 768));
        //this.background.setAnimation(0, 44, true, 100);

        //Player
        this.player = new AnimatedPlayer(
            new Vector(30, 0),
            48,
            64,
            "red",
            3,
            createPlayerMotion()
        );

        this.player.lives = 3;
        this.lifeSprite =  new Image();
        this.lifeSprite.src = "../../sprites/Lives/lives.png";
        this.player.Maxlives = 6;
        gameConfig.score = 0;
        this.isGameOver = false;
        this.startTime= Date.now();
        gameConfig.elapsedTime = 0;
        this.player.damageCooldown = 0;
        this.scoreApplied = false;
        this.player.setSprite('../assets/sprites/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        this.player.setSpeed(gameConfig.playerSpeed);

        //Actual generation zones
        this.generation_zones = [];
        this.actualPlatforms = [];
        this.enemies = [];
        this.powerUpInventory = [];  //To store the power-ups the player can use
        this.platformInventory = [];  //To store the platforms the player can use

        this.powerUpType = randomRange(2,0) == 0 ? "Esprint N1" : "Doble Salto N1";  //Randomly selects a power-up to generate in the game
        this.powerUpSprite = new Image();
        if(this.powerUpType == "Esprint N1") {
            this.powerUpSprite.src = "../../sprites/PowerUps/Nivel1/Esprint N1.png";
        }
        else {
            this.powerUpSprite.src = "../../sprites/PowerUps/Nivel1/Doble Salto N1.png";
        }

        this.powerUp = new Cards(
            new Vector(0, 0),
            10,
            10,
            this.powerUpType,
            5000 // Duration of the power-up effect
        );
        this.powerUpInventory.push(this.powerUp);  //Adds the power-up to the inventory, so the player can use it when he wants
        

        this.platformSprite = new Image();
        this.platformSprite.src = "../../sprites/Plataformas/N1/Plataforma Básica N1.png";
        for(let i = 0; i < 10; i++) {
        this.platform = new Cards(
            new Vector(0, 0),
            10,
            10,
            "Plataforma",
            5000 // Duration of the power-up effect
        );
        this.platformInventory.push(this.platform);  //Adds the platform to the inventory, so the player can use it when he wants
        }
        //Funcion to connect front whit API
        //The objects that depends on DB to load, are here.
        const loadMap = async () => {
            this.generation_zones = await initGenerationZones(this.level, gameConfig.unit);

            this.actualPlatforms = await initPlatforms("true", this.generation_zones, gameConfig.unit);
            this.actualPlatforms.at(-1).setSprite('../assets/sprites/plataformas_auto/Final_Platform.png',
                            new Rect(0, 0, 1566, 688));
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
    
    getTimeMultiplier() {
        const time = gameConfig.elapsedTime;
        if (time <= 15){
            return 2;
        }       
        if (time <= 30){
            return 1.5;
        }      
        return 1;                       
    }

    //To draw the game objects
    draw(ctx) {
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        const lifeWidth = 32;
        const lifeHeight = 32;
        const cardWidth = 160;
        const cardHeight = 240;
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
        
        
        if(this.powerUpInventory.length > 0) {
            ctx.drawImage(
                this.powerUpSprite,
                this.canvasWidth - margin - cardWidth,
                margin,
                cardWidth,
                cardHeight
            );
        }
        if(this.platformInventory.length > 0) {
            ctx.drawImage(
                this.platformSprite,
                this.canvasWidth - margin - cardWidth*2,
                margin,
                cardWidth,
                cardHeight
            );
        }

        ctx.fillText(
            "Score: " + gameConfig.score,
            margin,
            margin + 50
        );

        ctx.fillText(
            "Time: " + gameConfig.elapsedTime + "s",
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
    }

    //To update the position, sprites, collisions...
    update(deltaTime) {
        this.player.damageCooldown -= deltaTime;

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
                    gameConfig.score += enemy.points;
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                }
            }
            else if (overlap != false && this.player.damageCooldown <= 0){
                this.player.lives--;
                this.player.damageCooldown = 1000;
                if(this.player.lives <=0){
                    //this.gameOver();
                    gameConfig.levelOver2 = true;
                }
            }
        }

        gameConfig.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000); //Time en seconds

        if (gameConfig.levelComplete && !this.scoreApplied) {
            const multiplier = this.getTimeMultiplier();
            gameConfig.score = Math.floor(gameConfig.score * multiplier);
            this.scoreApplied = true;
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

        //For the powerup, when "0" is pressed, the first power-up in the inventory is used
        window.addEventListener('keydown', (event) => {
            if (event.key == "0" && this.powerUpInventory.length > 0) {
                const powerUpToUse = this.powerUpInventory.shift() // Remove the first power-up from the inventory
                powerUpToUse.applyEffect(this.player,this);
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key == "9" && this.platformInventory.length > 0) {
                const powerUpToUse = this.platformInventory.shift() // Remove the first platform from the inventory
                powerUpToUse.applyEffect(this.player,this);
            }
        });

        //For the mouse click
        const canvas = document.querySelector('canvas');

        canvas.addEventListener('mousedown', (event) => {
            if (this.platformInventory.length > 0 && gameConfig.gameLoad == true) {

            //We need this for compatibitily with resolution change
            const rect = canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);

            this.mouseX = mouseX;
            this.mouseY = mouseY;

            const powerUpToUse = this.platformInventory.shift();
            powerUpToUse.applyEffect(this.player, this);
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