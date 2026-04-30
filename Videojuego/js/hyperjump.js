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
        const enemyVisualOffsetY = 8;
        const position = new Vector(platform.position.x, platform.position.y - platform.halfSize.y/dephase - height/2 + enemyVisualOffsetY);
        super(position, width, height, color, type);
        this.speed = speed;
        this.direction = 1; 
        this.platform = platform;
        this.lives = 1;
        this.points = 100;
        this.alerted = false;
        this.attackRange = 0;
        this.detectionRange = 0;
        this.damage = 0;
        this.isImmortal = false;
        this.damageCooldown = 0;
        this.barkCooldown = 0;
    }

    setupByType(){
        switch(this.type){
            case "simple":
                this.points = 200;
                break;
            case "torreta":
                this.speed = 0;
                this.shootCooldown = 2000;
                this.lastShot = 0;
                break;
            case "alerta":
                this.points = 80;
                this.alertRadius = this.detectionRange;
                break;
            case "divide":
                this.isDivisible = true;
                this.hasDivided = false;
                 this.lives = 1; 
                break;
            case "jefe":
                this.points = 1000;
                if(this.detectionRange <= 350){
                    this.shootCooldown = 1200;
                    this.speed *= 0.8;
                }
                else if(this.detectionRange <=450){
                    this.shootCooldown = 1100;
                    this.speed *= 1.1;
                }
                else {
                    this.shootCooldown = 700;
                    this.speed *= 1.4;
                }
                this.lastShot = 0;
                break;

        }
    }
    
    update(deltaTime, game) {
        this.damageCooldown -= deltaTime;
        this.barkCooldown -= deltaTime;
        if(this.type != "torreta"){
            this.position.x += this.speed * this.direction * deltaTime;
            const leftBoundary = this.platform.position.x - this.platform.halfSize.x;
            const rightBoundary = this.platform.position.x + this.platform.halfSize.x;
            if (this.position.x - this.halfSize.x < leftBoundary || this.position.x + this.halfSize.x > rightBoundary) {
                this.direction *= -1;
            }
        }

        if(this.type == "torreta" || this.type == "jefe"){
            if(game.player.position.x < this.position.x){
                this.direction = -1;
                if(this.type == "torreta"){
                    this.setSprite("../Videojuego/assets/sprites/torreta_alien_left.png");
                }
            }
            else{
                this.direction = 1;
                if(this.type == "torreta"){
                    this.setSprite("../Videojuego/assets/sprites/torreta_alien.png");
                }
            }
            this.lastShot += deltaTime;

            if(this.lastShot>=this.shootCooldown){
                this.shot(game);
                this.lastShot = 0;
            }
        }

        if(this.type == "alerta"){
            const dx = game.player.position.x - this.position.x;

            if(Math.abs(dx)<this.alertRadius){
                if(this.barkCooldown <= 0){
                    if(gameConfig.sounds){
                        gameConfig.sounds.bark.play();
                    }
                    this.barkCooldown = 300;
                }
                this.alertEnemies(game);
            }
        }
    }

    shot(game){
        if(this.attackRange <= 0) return;
        const dx = game.player.position.x - this.position.x;
        const dy = game.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < this.attackRange){
            console.log(this.type + " dispara");
            let direction = 1;
            if(game.player.position.x < this.position.x){
                direction = -1;
            }

            let offsetX = this.halfSize.x;
            if(direction == -1){
                offsetX = -this.halfSize.x;
            }
            let bulletWidth = 35;
            let bulletHeight = 25;
            let bulletSpeed = 0.15;
            if(this.type == "jefe"){
                bulletWidth = 50;
                bulletHeight = 25;
                if(this.detectionRange <= 350){
                    bulletSpeed = 0.22;
                }
                else if(this.detectionRange <= 450){
                    bulletSpeed = 0.30;
                }
                else{
                    bulletSpeed = 0.40;
                }
            }
            let bullet = new Bullet(new Vector(this.position.x +offsetX*2, this.position.y),bulletWidth,bulletHeight,"yellow",bulletSpeed,direction);
            game.bullets.push(bullet);
            if(gameConfig.sounds){
                gameConfig.sounds.shoot.play();
            }
            console.log("BALA CREADA:", bullet);
            console.log("TOTAL BALAS:", game.bullets.length);
        }
    }

    alertEnemies(game){
        console.log("Perro alerta enemigos");

        for (let enemy of game.enemies){
            if(enemy.type == "simple" && !enemy.alerted){
                enemy.alerted= true;
                enemy.speed *= 1.5;
                enemy.color = "orange";
            }
        }
    }

    divide(game){
        if(this.hasDivided) return;

        console.log("Enemigo se divide");
        if(gameConfig.sounds){
            gameConfig.sounds.slimeSplit.play();
        }
        this.hasDivided = true;

        for (let i = 0; i<2; i++){
            let newEnemy = new Enemies(this.platform, 36, 36, this.color, "simple", this.speed * 1.2, 16);
            let leftLimit = this.platform.position.x - this.platform.halfSize.x + newEnemy.halfSize.x;
            let rightLimit = this.platform.position.x + this.platform.halfSize.x - newEnemy.halfSize.x;
            let newX;
            if(i == 0){
                newX = this.position.x - 60;
                newEnemy.direction = -1;
            }
            else{
                newX = this.position.x + 60;
                newEnemy.direction = 1;
            }
            if(newX < leftLimit){
                newX = leftLimit;
            }
            if(newX > rightLimit){
                newX = rightLimit;
            }
            newEnemy.position.x = newX;
            newEnemy.position.y = this.platform.position.y - this.platform.halfSize.y / 16 - newEnemy.halfSize.y + 8;
            newEnemy.lives = 1;
            newEnemy.damage = 10;
            newEnemy.points = 50;
            newEnemy.isImmortal = false;
            newEnemy.alerted = false;
            newEnemy.setSprite("../Videojuego/assets/sprites/slime_alien.png");
            game.newEnemies.push(newEnemy);
        }
    }

    receiveDamage(quantity = 1, game){
        if(this.type == "divide" && !this.hasDivided){
            this.divide(game);
            this.hasDivided = true;
            return "divided";
        }
        if(this.isImmortal){
            return false;
        }
        this.lives -=quantity;
        if(this.lives <= 0){
            return "dead";

        }

        return false;
    }
}

class Cards extends AnimatedObject {
    constructor(position, width, height, type, duration) {
        super(position, width, height, type);
        this.duration = duration; // Duration of the power-up effect
        this.type = type; // Type of power-up (e.g., "Esprint N1", "Doble Salto N1")
        this.composicion = null; // For platform cards, this will hold the platform composition data
        this.id_carta = null; // To store the card ID from the database, useful for upgrades
        this.nivel_actual = null; // To store the current level of the card, useful for upgrades
        this.ancho_base = null; // To store the base width of the card, useful for upgrades
        this.alto_base = null; // To store the base height of the card, useful for upgrades
        this.efecto = null;
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
            const maxEnemigos = this.efecto.max_enemigos ?? game.enemies.length; // fallback kills all
            console.log(maxEnemigos);
            game.enemies.splice(0, maxEnemigos);
        }
        else if (this.type == "Vida Extra") {
            gameConfig.lives += 1;
        }
        else if (this.type == "Escudo") {
            player.damageCooldown = this.duration; //The player will be invulnerable for the duration of the power-up, simulating a shield
        }
        else if (this.type == "Jetpack") {
            player.maxJumps = 2;
            player.jumpsRemaining = 2;
            setTimeout(() => {
                player.maxJumps = 1;
                player.jumpsRemaining = Math.min(player.jumpsRemaining, 1);
            }, this.duration);
        }
        else if(this.type == "Plataforma Random") {
            //This power-up generates a temporary platform under the player, allowing him to jump again
            addPlatform(
                // game.generation_zones[6].x, 
                // game.generation_zones[6].y, 
                player.position.x + game.mouseX - game.canvasWidth / 2,
                game.mouseY,
                3, 1, 
                game.actualPlatforms, 
                50, 
                true,
                1,
                IMG[`p1`].xIMG, 
                IMG[`p1`].yIMG,
                this.type
            );

        } 
        else if (this.type == "normal_carta" || this.type == "one-time" || 
            this.type == "hielo" || this.type == "bloquea_proyectiles" || this.type == "turbina" ||
            this.type == "teletransportador") {
    
            for (let forma of this.composicion.formas) {
                let plat = addPlatform(
                player.position.x + game.mouseX - game.canvasWidth / 2,
                game.mouseY + forma.y,
                this.ancho_base,
                this.alto_base,
                game.actualPlatforms,
                gameConfig.unit,
                false,
                1,
                IMG[`p1`].xIMG,
                IMG[`p1`].yIMG,
                this.type
            );
                plat.tipo = this.type; // so the update loop can apply special behavior
                plat.composicion = this.composicion; // to access the special properties of the platform, like the destination of the teletransportador
                if(this.type == "turbina"){
                    plat.baseY = plat.position.y;  // remember starting position
                    plat.timer = 0;
                }
            }
        }
        else if(this.type == "ele_carta"){
            for (let forma of this.composicion.formas) {
                let plat = addPlatform(
                // ADD forma.x HERE to handle horizontal offset
                player.position.x + game.mouseX - game.canvasWidth / 2 + (forma.x || 0), 
                game.mouseY + (forma.y || 0),
                forma.base,
                forma.altura,
                game.actualPlatforms,
                gameConfig.unit,
                false,
                1,
                IMG[`p1`].xIMG,
                IMG[`p1`].yIMG,
                this.type
                );
            plat.tipo = this.type; 
            }
        }


    }
}

class Bullet extends AnimatedObject {
    constructor(position, width, height, color, speed, direction) {
        super(position, width, height, color, "bullet");

        this.speed = speed;
        this.direction = direction;
        this.damage = 1;
        if(direction == -1){
            this.setSprite("../Videojuego/assets/sprites/bullet_left.png");
        }
        else{
            this.setSprite("../Videojuego/assets/sprites/bullet.png");
        }
        if(gameConfig.sounds && gameConfig.sounds.bulletFly){
            this.flySound = gameConfig.sounds.bulletFly;
            this.flySound.loop = true;
            this.flySound.play();
        }
    }

    update(deltaTime) {
        this.position.x += this.speed * this.direction * deltaTime;
    }
    destroy(game){
        if(this.flySound && this.flySound.isPlaying){
            this.flySound.stop();
        }
        this.flySound = null;
        game.bullets.splice(game.bullets.indexOf(this), 1);
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
        this.bullets = [];
        this.newEnemies = [];
        this.finalBossRequired = false;
        this.finalBossDefeated = false;
        this.screenCompleteBonusApplied = false;
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

        this.decoration_floor = new AnimatedObject(
            new Vector(this.canvasWidth / 2, this.canvasHeight / 1.1),
            this.canvasWidth + this.canvasWidth*0.1,
            this.canvasHeight/3,
            "gray",
            "background",
            45
        );
        this.decoration_floor.setSprite(`../Videojuego/assets/Decoracion/decoracion_suelo_${gameConfig.actualDiff}.png`,
                                    new Rect(2027, 0, 2027, 242));

        let decorationS = 0;
        let decorationE = 0;
        if(gameConfig.actualLevel == 1) {
            decorationS = 0;
            decorationE = 1;
        } else if(gameConfig.actualDiff == 1) {
            decorationS = 1;
            decorationE = 1;
        } else if(gameConfig.actualDiff == 2) {
            decorationS = 2;
            decorationE = 2;
        } else if(gameConfig.actualLevel == 9) {
            decorationS = 3;
            decorationE = 4;
        } else {
            decorationS = 3;
            decorationE = 3;
        }

        this.decoration_start =  new Image();
        this.decoration_start.src = `../Videojuego/assets/Decoracion/decoracion_${decorationS}.png`;

        this.decoration_end =  new Image();
        this.decoration_end.src = `../Videojuego/assets/Decoracion/decoracion_${decorationE}.png`;
        
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
        this.contScore = new Image();
        this.contScore.src = "../Videojuego/assets/sprites/botones/contScore.png";
        this.contLevel = new Image();
        this.contLevel.src = "../Videojuego/assets/sprites/botones/contLevel.png";
        gameConfig.maxlives = 6;
        gameConfig.score = 0;
        if (gameConfig.totalEnemiesKilled == undefined) gameConfig.totalEnemiesKilled = 0;
        if (gameConfig.totalCardsUsed == undefined) gameConfig.totalCardsUsed = 0;
        if (gameConfig.totalCardsUpgraded == undefined) gameConfig.totalCardsUpgraded = 0;
        if (gameConfig.totalTime == undefined) gameConfig.totalTime = 0;
        gameConfig.enemiesKilled  = 0;
        gameConfig.cardsUsed      = 0;
        gameConfig.cardsUpgraded  = 0;
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
        this.upgradeCards = []; // To store the platform cards that will be upgraded at the end of the level
        this.screenCompleteBonusApplied = false;
        this.platformSprite = new Image();
        this.platformSprite.src = "../sprites/Plataformas/N1/Plataforma Básica N1.png";
        //Funcion to connect front whit API
        //The objects that depends on DB to load, are here.
        const loadMap = async () => {
            this.generation_zones = await initGenerationZones(this.level, gameConfig.unit);
            console.log("ZONAS DE GENERACION:", this.generation_zones);
            this.powerUpInventory = await initPowerUps();
            console.log("POWER-UPS:", this.powerUpInventory);
            this.platformInventory = await initPlatformCards();
            console.log("plat:", this.platformInventory);

            this.actualPlatforms = await initPlatforms("true", this.generation_zones, gameConfig.unit);
            let finalPlatform = this.actualPlatforms.at(-1);
            finalPlatform.isFinalPlatform = true;
            finalPlatform.setSprite('../Videojuego/assets/sprites/plataformas_auto/Final_Platform.png',
                            new Rect(0, 0, 1566, 688));
            this.winPlat = this.actualPlatforms.at(-1);
            
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
                    case "jefe": return "jefe";
                    default: return "simple";
                }
            }
            function getEnemySprite(tipo){
                switch(tipo){
                    case "simple":
                        return "../Videojuego/assets/sprites/blue_alien.png";
                    case "torreta":
                        return "../Videojuego/assets/sprites/torreta_alien.png";
                    case "alerta":
                        return "../Videojuego/assets/sprites/alien_perro.png";
                    case "divide":
                        return "../Videojuego/assets/sprites/slime_alien.png";
                    case "jefe":
                        return "../Videojuego/assets/sprites/jefe_alien.png";
                    default:
                        return "../Videojuego/assets/sprites/blue_alien.png";
                }
            }

            let hostilPlatforms = this.actualPlatforms.filter(platform => platform.hostil == true);
            let availablePlatforms = [...hostilPlatforms];
            let enemyCounter = 0;
            while(availablePlatforms.length > 0){
                let createdInRound = false;
                for(let data of enemiesData) {
                    console.log("ENEMY INDIVIDUAL:", data);
                    if(data.cantidad_maxima <=0){
                        continue;
                    }
                    if(availablePlatforms.length == 0){
                        break;
                    }
                    let randomIndex = Math.floor(Math.random() * availablePlatforms.length);
                    let platform = availablePlatforms[randomIndex];
                    availablePlatforms.splice(randomIndex, 1);
                    let enemyType = mapEnemyType(data.tipo);
                    let width = 32;
                    let height = 32;
                    if(enemyType == "torreta"){
                        width = 80;
                        height = 80;
                    }
                    else if(enemyType == "alerta"){
                        width = 80;
                        height = 80;
                    }
                    else if(enemyType == "divide"){
                        width = 60;
                        height = 60;
                    }
                    else if(enemyType=="jefe"){
                        width = 140;
                        height=140;
                    }
                    let enemy = new Enemies(
                        platform,
                        width,
                        height,
                        "red",
                        enemyType,
                        gameConfig.enemySpeed,
                        (platform.size.y/gameConfig.unit < 12) ? 4 : 1.3
                    );
                    enemy.lives = data.vida_base;
                    enemy.damage = data["daño_base"];
                    enemy.isImmortal = data.es_inmortal;
                    if(data.rango_ataque == 1){
                        enemy.attackRange = data.rango_deteccion;
                    }
                    else{
                        enemy.attackRange = 0;
                    }
                    enemy.detectionRange = data.rango_deteccion;
                    enemy.setupByType();
                    enemy.setSprite(getEnemySprite(enemyType));
                    console.log(`Enemigo ${data.tipo} en X:${enemy.position.x} Y:${enemy.position.y}, plataforma en X:${platform.position.x} Y:${platform.position.y}`);
                    this.enemies.push(enemy);
                    console.log("ENEMY CREADO:", enemy);
                    enemyCounter++;
                    data.cantidad_maxima--;
                    createdInRound = true;
                }
                if(!createdInRound){
                    break;
                }
            }
            const bossData = await initBoss(this.level);
            if(bossData.length > 0){
                let data = bossData[0];
                let bossPlatform = this.actualPlatforms[this.actualPlatforms.length - 2];
                let boss = new Enemies(
                    bossPlatform,
                    140,
                    140,
                    "red",
                    "jefe",
                    gameConfig.enemySpeed,
                    (bossPlatform.size.y / gameConfig.unit < 12) ? 4 : 1.3
                );
                boss.lives = data.vida_base;
                boss.damage = data["daño_base"];
                boss.isImmortal = data.es_inmortal;
                if(data.rango_ataque == 1){
                    boss.attackRange = data.rango_deteccion;
                }
                else{
                    boss.attackRange = 0;
                }
                boss.detectionRange = data.rango_deteccion;
                boss.points = 1000;
                boss.isFinalBoss = this.level == 9;
                if(boss.isFinalBoss){
                    this.finalBossRequired = true;
                    this.finalBossDefeated = false;
                }
                boss.setupByType();
                boss.setSprite(getEnemySprite("jefe"));
                this.enemies.push(boss);
            }
        };
        await loadMap();
    }
    canFinishLevel(){
        if(this.finalBossRequired && !this.finalBossDefeated){
            return false;
        }
        return true;
    }
    applyScreenCompleteBonus(){
        if(this.screenCompleteBonusApplied || gameConfig.levelOver1 || gameConfig.levelOver2){
            return;
        }
        let baseBonus = 500;
        let unusedPowerUps = this.powerUpInventory.length;
        let unusedPlatforms = this.platformInventory.length;
        let powerUpBonus = unusedPowerUps * 150;
        let platformBonus = unusedPlatforms * 100;
        let timeBonus = 0;
        if(gameConfig.elapsedTime <= 30){
        timeBonus = 2;
        }
        else if(gameConfig.elapsedTime <= 60){
        timeBonus = 1.5;
        }
        let totalBonus = baseBonus + powerUpBonus + platformBonus;
        gameConfig.score += totalBonus;
        gameConfig.score *= timeBonus;
        console.log("Bonus ganado:", totalBonus);
        console.log("PowerUps sin usar:", unusedPowerUps);
        console.log("Plataformas sin usar:", unusedPlatforms);
        gameConfig.totalEnemiesKilled += gameConfig.enemiesKilled;
        gameConfig.totalCardsUsed += gameConfig.cardsUsed;
        gameConfig.totalCardsUpgraded += gameConfig.cardsUpgraded;
        gameConfig.totalTime += gameConfig.elapsedTime;
        this.screenCompleteBonusApplied = true;
        gameConfig.lastScreenBonus = {
            baseBonus: baseBonus,
            unusedPowerUps: unusedPowerUps,
            powerUpBonus: powerUpBonus,
            unusedPlatforms: unusedPlatforms,
            platformBonus: platformBonus,
            timeBonus: timeBonus,
            totalBonus: totalBonus
        };
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

        //Background now is loaded from the Phaser scene


        //Level decoration
        ctx.drawImage(
            this.decoration_start,
            -gameConfig.canvasWidth/1.3,
            0,
            1355,
            739
        );

        ctx.drawImage(
            this.decoration_end,
            gameConfig.levelLenght-1355/8,
            0,
            1355,
            739
        );

        //Actual Platforms
        for(let platform of this.actualPlatforms) {
            platform.draw(ctx);
        }
        
        //Player
        this.player.draw(ctx);

        //Enemies
        console.log("ENEMIES EN JUEGO:", this.enemies.length);
        for(let enemy of this.enemies) {
            enemy.draw(ctx);
        }

        //Bullets
        for(let bullet of this.bullets){
            bullet.draw(ctx);
        }

        //Interface
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        const lifeWidth = 32;
        const lifeHeight = 32;
        const cardWidth = 80;
        const cardHeight = 120;
        const margin = 10;
        
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.textAlign = "left";

        for(let i = 0; i < gameConfig.lives; i++){
            ctx.drawImage(
               this.lifeSprite,
               margin + i * (lifeWidth + 5),
               margin*3 + 2*gameConfig.canvasHeight/12,
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

        for(let i = 0; i < this.platformInventory.length; i++) {
            ctx.drawImage(
                this.platformInventory[i].sprite,
                this.canvasWidth - margin - cardWidth - (i * (cardWidth + 10)),
                margin * 2 +  cardHeight,
                cardWidth,
                cardHeight
            );
        }
        ctx.restore();
    }

    //To update the position, sprites, collisions...
    update(deltaTime) {
        this.player.damageCooldown -= deltaTime;

        //Animate the background
        this.background.updateFrame(deltaTime);
        this.decoration_floor.updateFrame(deltaTime);

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
                
                if(enemy.damageCooldown <= 0){
                    let damageResult = enemy.receiveDamage(1, this);
                    enemy.damageCooldown = 500;
                    if (damageResult == "divided"){
                        gameConfig.score += enemy.points;
                        gameConfig.enemiesKilled += 1;
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    }
                    else if(damageResult == "dead"){
                        if(enemy.isFinalBoss){
                            this.finalBossDefeated = true;
                        }
                        if(enemy.type == "alerta"){
                            if(gameConfig.sounds && gameConfig.sounds.bark){
                                gameConfig.sounds.bark.stop();
                            }
                        }
                        gameConfig.score += enemy.points;
                        gameConfig.enemiesKilled += 1;
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                        if(gameConfig.sounds){
                            gameConfig.sounds.enemyDead.play();
                        }
                    }
                }
            }
            else if(overlap != false && enemy.type == "jefe"){
                gameConfig.lives = 0;
                gameConfig.levelOver2 = true;
            }
            else if (overlap != false && this.player.damageCooldown <= 0){
                if(gameConfig.sounds){
                    gameConfig.sounds.hit.play();
                }
                if(enemy.type != "torreta"){
                    gameConfig.lives -= 1;
                    this.player.damageCooldown = 1000;
                } 
                if(gameConfig.lives <=0){
                    //this.gameOver();
                    gameConfig.levelOver2 = true;
                }
            }
        }
        for(let bullet of this.bullets){
            bullet.update(deltaTime);
            let overlap = boxOverlap(this.player, bullet, deltaTime, 1);
            if(overlap != false && this.player.damageCooldown <= 0){
                if(gameConfig.sounds){
                    gameConfig.sounds.hit.play();
                }
                gameConfig.lives -= bullet.damage;
                this.player.damageCooldown = 1000;
                bullet.destroy(this);
                if(gameConfig.lives<=0){
                    gameConfig.levelOver2=true;
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
            this.player.onIce = false;  //Reset the ice state, it will be set to true again if the player is still on the ice platform after the collision check

            if (platform.tipo == "turbina" && platform.baseY !== undefined) {
                platform.timer += (deltaTime * platform.composicion.velocidad) /500;
                const newY = platform.baseY + Math.sin(platform.timer) * (platform.composicion.amplitud * gameConfig.unit);
                let dephase = (platform.size.y/gameConfig.unit < 12) ? 4 : 1.3;  //To move the collision with the platform. Allows the player to be in a pleasant visual spot
                platform.deltaY = newY - platform.position.y;
                if (this.player.onGround && boxOverlap(this.player, platform, deltaTime, dephase) == "top") {
                    this.player.position.y += platform.deltaY;
                }
                platform.position.y = newY;

            }

            if(platform.collision == true) {
                
                let dephase = (platform.size.y/gameConfig.unit < 12) ? 4 : 1.3;  //To move the collision with the platform. Allows the player to be in a pleasant visual spot

                let overlap = boxOverlap(this.player, platform, deltaTime, dephase); //Checks the direction of the collision

                if (overlap == "top") {
                    this.player.position.y = platform.position.y - platform.halfSize.y / dephase - this.player.halfSize.y;
                    this.player.fallSpeed = 0;
                    this.player.onGround = true;  //Activates the jump

                    // Special platform effects on landing
                    if (platform.tipo == "one-time") {
                        this.actualPlatforms.splice(this.actualPlatforms.indexOf(platform), 1);
                    }
                    else if (platform.tipo == "hielo") {   
                        this.player.onIce = true;      
                    }
                    else if (platform.tipo == "bloquea_proyectiles") {
                        this.player.damageCooldown = 2000; //The player will be invulnerable for the duration of the power-up, simulating a shield
                    }
                    else if (platform.tipo == "teletransportador" && !platform.teleportCooldown) {
                        for(let destination of this.actualPlatforms) {
                            if(destination.position.x > this.player.position.x) {
                                this.player.position.x = destination.position.x;
                                this.player.position.y = 0;
                                platform.teleportCooldown = 2000;
                                break;
                            }
                        }
                        // this.player.position.x += platform.composicion.destino_x * gameConfig.unit;
                        // this.player.position.y += platform.composicion.destino_y * gameConfig.unit;
                        // platform.teleportCooldown = 2000;
                    }

                    if(platform.isFinalPlatform == true){
                        if(this.canFinishLevel()){
                            this.applyScreenCompleteBonus();
                            gameConfig.levelComplete = true;
                        }
                        else{
                            console.log("Debes eliminar al jefe final");
                        }
                }
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
        for(let newEnemy of this.newEnemies){
            this.enemies.push(newEnemy);
        }
        this.newEnemies = [];
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

        //Select which platform or power-up to use with the number keys, 1-4 for platforms and 5-7 for power-ups
        window.addEventListener('keydown', (event) => {
            const num = parseInt(event.key);
            if (isNaN(num)) return; // Ignore non-number keys immediately

            // Handle Platforms (0-4)
            if (num >= 0 && num <= 6) {
                if (num < this.platformInventory.length) {
                    this.selectedPlatformIndex = num;
                }
            } 
    
            // Handle Power-ups (7-9)
            else if (num >= 7 && num <= 9) {
                this.selectedPowerUpIndex = num - 7;
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key == "p" && this.powerUpInventory.length > 0) {
                if (this.selectedPowerUpIndex >= this.powerUpInventory.length) {
                this.selectedPowerUpIndex = 0;
                }
            const powerUpToUse = this.powerUpInventory.splice(this.selectedPowerUpIndex, 1)[0];
            powerUpToUse.applyEffect(this.player, this);
            this.selectedPowerUpIndex = 0;
            gameConfig.cardsUsed++;
            }
        });

        window.addEventListener('keydown', async (event) => {
            if (event.key == "u" && this.platformInventory.length > 0 && this.upgradeCards.length < 1) {
                if (this.selectedPlatformIndex >= this.platformInventory.length) {
                    this.selectedPlatformIndex = 0;
                }
                const card = this.platformInventory.splice(this.selectedPlatformIndex, 1)[0];
                this.upgradeCards.push(card.id_carta); // mark for upgrade at level end

                await upgradeCard(gameConfig.id_jugador, card.id_carta);
                console.log("Card with ID " + card.id_carta + " marked for upgrade");
                console.log("Jugador: " + gameConfig.id_jugador);
                console.log("Database updated successfully");

                this.selectedPlatformIndex = 0;
            }
        });

        window.addEventListener('keydown', async (event) => {
            if (event.key == "i" && this.powerUpInventory.length > 0 && this.upgradeCards.length < 1) {
                if (this.selectedPowerUpIndex >= this.powerUpInventory.length) {
                    this.selectedPowerUpIndex = 0;
                }
                const card = this.powerUpInventory.splice(this.selectedPowerUpIndex, 1)[0];
                this.upgradeCards.push(card.id_carta);
                await upgradeCard(gameConfig.id_jugador, card.id_carta);
                console.log("Card with ID " + card.id_carta + " marked for upgrade");
                console.log("Jugador: " + gameConfig.id_jugador);
                console.log("Database updated successfully");

                this.selectedPowerUpIndex = 0;
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
            
            if (this.selectedPlatformIndex >= this.platformInventory.length) {
                this.selectedPlatformIndex = 0;
            }

            const powerUpToUse = this.platformInventory.splice(this.selectedPlatformIndex, 1)[0]; // Remove the selected platform from the inventory
            powerUpToUse.applyEffect(this.player, this);
            gameConfig.cardsUsed++;
            this.selectedPlatformIndex = 0; // reset to first after placing
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