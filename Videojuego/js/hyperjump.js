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
        this.alerted = false;
        this.attackRange = 200;
        this.setupByType();
    }

    setupByType(){
        switch(this.type){
            case "simple":
                this.speed *=1.5;
                this.points = 100;
                break;
            case "torreta":
                this.speed = 0;
                this.lives= 999;
                this.shootCooldown = 2000;
                this.lastShot = 0;
                break;
            case "alerta":
                this.speed *= 0.5;
                this.alertRadius = 150;
                break;
            case "divide":
                this.lives = 1;
                this.isDivisible = true;
                break;
        }
    }
    
    update(deltaTime, game) {
        if(this.type != "torreta"){
            this.position.x += this.speed * this.direction * deltaTime;
            const leftBoundary = this.platform.position.x - this.platform.halfSize.x;
            const rightBoundary = this.platform.position.x + this.platform.halfSize.x;
            if (this.position.x - this.halfSize.x < leftBoundary || this.position.x + this.halfSize.x > rightBoundary) {
                this.direction *= -1; // Reverse direction
            }
        }

        if(this.type == "torreta"){
            this.lastShot += deltaTime;

            if(this.lastShot>=this.shootCooldown){
                this.shot(game);
                this.lastShot = 0;
            }
        }

        if(this.type == "alerta"){
            const dx = game.player.position.x - this.position.x;

            if(Math.abs(dx)<this.alertRadius){
                this.alertEnemies(game);
            }
        }
    }

    shot(game){
        const dx = game.player.position.x - this.position.x;

        if(Math.abs(dx) < this.attackRange){
            console.log("Torreta dispara");

            if(game.player.damageCooldown <=0){
                gameConfig.lives--;
                game.player.damageCooldown = 1000;
            }
        }
    }

    alertEnemies(game){
        console.log("Perro alerta enemigos");

        for (let enemy of game.enemies){
            if(enemy.type == "simple" && !enemy.alerted){
                enemy.alerted= true;
                enemy.speed *= 1.2;
            }
        }
    }

    divide(game){
        console.log("Enemigo se divide");

        for (let i = 0; i<2; i++){
            let newEnemy = new Enemies(this.platform, this.width * 0.7, this.height *0.7, this.color, "simple", this.speed * 1.2, 3);

            if(i == 0){
                 newEnemy.position.x = this.position.x - 10;
            }
            else{
                newEnemy.position.x = this.position.x + 10;
            }

            game.enemies.push(newEnemy);
        }
    }

    receiveDamage(quantity = 1, game){
        this.lives -=quantity;

        if(this.lives<=0){
            if(this.type == "divide"){
                this.divide(game);
            }
            return true;
        }
        return false;
    }
}

class Cards extends AnimatedObject {
    constructor(position, width, height, type, duration) {
        super(position, width, height, type);
        this.duration = duration; // Duration of the power-up effect
        this.type = type; // Type of power-up (e.g., "Esprint N1", "Doble Salto N1")
    }


    applyEffect(player,game) {
        if (this.type == "Esprint") {
            player.setSpeed(player.speed * 1.5);
        setTimeout(() => { /*Had to google what setTimeout was, but it allows to
                            delay the execution of a function, in this case, to set
                            the speed back to normal after the duration of the power-up*/
                player.setSpeed(player.speed / 1.5);
            }, this.duration);
        }
        else if (this.type == "Doble Salto") {
            player.setJumpForce(player.jumpForce * 1.5);
        setTimeout(() => {
                player.setJumpForce(player.jumpForce / 1.5);
            }, this.duration);
        }
        else if (this.type == "Bomba") {
            game.enemies.splice(0, game.enemies.length); //Removes all the enemies in the game, simulating a bomb explosion that kills all the enemies on the screen
        }
        else if (this.type == "Vida Extra") {
            gameConfig.lives += 1;
        }
        else if (this.type == "Escudo") {
            player.damageCooldown = this.duration; //The player will be invulnerable for the duration of the power-up, simulating a shield
        }
        else if (this.type == "Jetpack") {
            player.setJumpForce(player.jumpForce * 1.5);
        setTimeout(() => {
                player.setJumpForce(player.jumpForce / 1.5);
            }, this.duration);
        }
        else if(this.type == "Plataforma Random") {
            //This power-up generates a temporary platform under the player, allowing him to jump again
            addPlatform(
                //game.generation_zones[6].x, 
                //game.generation_zones[6].y, 
                player.position.x + game.mouseX-game.canvasWidth/2,
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
        this.background.setSprite(`../Videojuego/assets/Fondos/back_${gameConfig.actualDiff}.png`,
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

        gameConfig.lives = 3;
        this.lifeSprite =  new Image();
        this.lifeSprite.src = "../sprites/Lives/lives.png";
        gameConfig.maxlives = 6;
        gameConfig.score = 0;
        this.isGameOver = false;
        this.startTime= Date.now();
        gameConfig.elapsedTime = 0;
        this.player.damageCooldown = 0;
        this.scoreApplied = false;
        this.player.setSprite('../Videojuego/assets/sprites/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        this.player.setSpeed(gameConfig.playerSpeed);

        //Actual generation zones
        this.generation_zones = [];
        this.actualPlatforms = [];
        this.enemies = [];
        this.powerUpInventory = [];  //To store the power-ups the player can use
        this.platformInventory = [];  //To store the platforms the player can use

        this.platformSprite = new Image();
        this.platformSprite.src = "../sprites/Plataformas/N1/Plataforma Básica N1.png";
        for(let i = 0; i < 10; i++) {
        this.platform = new Cards(
            new Vector(0, 0),
            10,
            10,
            "Plataforma Random",
            5000 // Duration of the power-up effect
        );
        this.platformInventory.push(this.platform);  //Adds the platform to the inventory, so the player can use it when he wants
        }
        //Funcion to connect front whit API
        //The objects that depends on DB to load, are here.
        const loadMap = async () => {
            this.generation_zones = await initGenerationZones(this.level);
            this.powerUpInventory = await initCards();
            
            this.actualPlatforms = await initPlatforms("true", this.generation_zones, gameConfig.unit);
            this.actualPlatforms.at(-1).setSprite('../Videojuego/assets/sprites/plataformas_auto/Final_Platform.png',
                            new Rect(0, 0, 1566, 688));
            
            const enemiesData = await initEnemies(this.level);
            console.log("ENEMIES DATA:", enemiesData);
            function mapEnemyType(tipo){
                if(!tipo) return "simple";

                tipo = tipo.toLowerCase().trim();

                switch(tipo){
                    case "simple": return "simple";
                    case "torreta": return "torreta";
                    case "alerta": return "alerta";
                    case "divide": return "divide";
                    default: return "simple";
                }
            }

            for(let data of enemiesData) {
                console.log("ENEMY INDIVIDUAL:", data);
                let platform = this.actualPlatforms[Math.floor(Math.random() * this.actualPlatforms.length)];
                if(!platform){
                    continue;
                }
                let enemy = new Enemies(
                    platform,
                    32,
                    32,
                    "red",
                    mapEnemyType(data.tipo),
                    gameConfig.enemySpeed,
                    3
                );
                enemy.lives = data.vida_base;
                enemy.damage = data["daño_base"];
                enemy.attackRange = data.rango_ataque;
                enemy.setSprite("../Videojuego/assets/sprites/blue_alien.png");
                console.log(`Enemigo ${data.tipo} en X:${enemy.position.x} Y:${enemy.position.y}, plataforma en X:${platform.position.x} Y:${platform.position.y}`);
                this.enemies.push(enemy);
                console.log("ENEMY CREADO:", enemy);
            }
    };
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

        for(let i = 0; i < gameConfig.lives; i++){
            ctx.drawImage(
               this.lifeSprite,
               margin + i * (lifeWidth + 5),
               margin,
               lifeWidth,
               lifeHeight
            );
        }
        
        
        for(let i = 0; i < this.powerUpInventory.length; i++) {
            ctx.drawImage(
                this.powerUpInventory[i].sprite,
                this.canvasWidth - margin - cardWidth - (i * (cardWidth + 10)),
                margin,
                cardWidth,
                cardHeight
            );
        }

        if(this.platformInventory.length > 0) {
            ctx.drawImage(
                this.platformSprite,
                this.canvasWidth - margin - cardWidth - (this.powerUpInventory.length * (cardWidth + 10)),
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
        console.log("ENEMIES EN JUEGO:", this.enemies.length);
        for(let enemy of this.enemies) {
            enemy.draw(ctx);
        }

        // ctx.save();
        // ctx.setTransform(1,0,0,1,0,0);
        // if(this.isGameOver){
        //     this.drawGameOver(ctx);
        // }
        // ctx.restore();
    }

    // drawGameOver(ctx){
    //     const centerX = this.canvasWidth / 2;
    //     const centerY =  this.canvasHeight / 2;

    //     ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    //     ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    //     ctx.fillStyle = "white";
    //     ctx.textAlign = "center";
    //     ctx.font = "bold 60px Arial";
    //     ctx.textAlign = "center";
    //     ctx.fillText("GAME OVER", centerX, centerY - 20);

    //     ctx.font = "30px Arial";
    //     ctx.fillText("Score: " + gameConfig.score, centerX, centerY + 20);

    //     ctx.fillText("Time: " + gameConfig.elapsedTime + "s", centerX, centerY + 50);
    // }

    //To update the position, sprites, collisions...
    update(deltaTime) {
        this.player.damageCooldown -= deltaTime;
        //if(this.isGameOver) return;
        //Animate the background
        this.background.updateFrame(deltaTime);

        //Move the player
        this.player.update(deltaTime, {width:this.canvasWidth, height:this.canvasHeight});
        //this.player.onGround = false;   //This can be uncommented when the game over condition related to falling into the void has been implemented
                                          //While not, when player falls from a platform, there is a jump that should not be there

        for(let enemy of this.enemies) {
            enemy.update(deltaTime, this);

            let overlap = boxOverlap(this.player, enemy, deltaTime, 1);
            if(overlap == "top") {
                this.player.position.y = enemy.position.y - enemy.halfSize.y - this.player.halfSize.y;
                this.player.fallSpeed = 0;
                this.player.onGround = true;
                
                if (enemy.receiveDamage(1,this)){
                    gameConfig.score += enemy.points;
                    gameConfig.enemiesKilled += 1;
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                }
            }
            else if (overlap != false && this.player.damageCooldown <= 0){
                gameConfig.lives--;
                this.player.damageCooldown = 1000;
                if(gameConfig.lives <=0){
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

        const canvas = document.querySelector('canvas');

        canvas.addEventListener('click', (event) => {
            if (this.platformInventory.length > 0 && gameConfig.gameLoad == true) {
                this.mouseX = event.offsetX;
                this.mouseY = event.offsetY;
                const powerUpToUse = this.platformInventory.shift() // Remove the first platform from the inventory
                powerUpToUse.applyEffect(this.player,this);
            }
            console.log(`Clic en X: ${event.offsetX}, Y: ${event.offsetY}`);
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