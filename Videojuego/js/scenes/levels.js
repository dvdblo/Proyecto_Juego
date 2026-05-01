//LEVELS------------------------------------------------------------------------------------------------------------
//Phaser Scene that handles the active gameplay loop
class Level extends Phaser.Scene {
    constructor() {
        super('Level');
    }
    //Loads all assets needed before the scene starts
    preload() {
        //Load the correct background music track based on current difficulty
        if(gameConfig.actualDiff == 1) {
            this.load.audio('levelMusic1', `../Videojuego/assets/Musica/music${gameConfig.actualDiff}.mp3`);
        } else if(gameConfig.actualDiff == 2) {
            this.load.audio('levelMusic2', `../Videojuego/assets/Musica/music${gameConfig.actualDiff}.mp3`);
        }else if(gameConfig.actualDiff == 3) {
            this.load.audio('levelMusic3', `../Videojuego/assets/Musica/music${gameConfig.actualDiff}.mp3`);
        }
        //UI images
        this.load.image('contLevel', '../Videojuego/assets/sprites/botones/contLevel.png');
        this.load.image('contScore', '../Videojuego/assets/sprites/botones/contScore.png');

        //Sound effects
        this.load.audio('shootSound', '../Videojuego/assets/sprites/shoot.mp3');
        this.load.audio('hitSound', '../Videojuego/assets/sprites/hit.mp3');
        this.load.audio('enemyDeadSound', '../Videojuego/assets/sprites/enemy_dead.mp3');
        this.load.audio('slimeSplitSound', '../Videojuego/assets/sprites/slime_split.mp3');
        this.load.audio('dogBarkSound', '../Videojuego/assets/sprites/dog_bark.mp3');
        this.load.audio('bulletFlySound', '../Videojuego/assets/sprites/bullet_fly.mp3');
    }
    //Initializes the scene once assets are ready
    create(data) {
        gameConfig.pause = false; //Game starts unpaused
        //Start music only if it is not already playing
        if (!this.levelMusic || !this.levelMusic.isPlaying) {
            this.levelMusic = this.sound.add(`levelMusic${gameConfig.actualDiff}`, { loop: true });
            this.levelMusic.play();
        }

        //Reads the game from the Load scene
        this.game = data.game;

        //Register all sound effects into the global config for the used in the classes
        gameConfig.sounds = {
            shoot: this.sound.add('shootSound', { volume: 1}),
            hit: this.sound.add('hitSound', { volume: 1}),
            enemyDead: this.sound.add('enemyDeadSound', { volume: 1}),
            slimeSplit: this.sound.add('slimeSplitSound', { volume: 1}),
            bark: this.sound.add('dogBarkSound', { volume: 1}),
            bulletFly: this.sound.add('bulletFlySound', { volume: 1})
        };

        //Create canvas if it didn´t exists already
        let canvasTexture;

        if (!this.textures.exists('gameCanvas')) {
            canvasTexture = this.textures.createCanvas('gameCanvas', gameConfig.canvasWidth, gameConfig.canvasHeight);
        } else {
            canvasTexture = this.textures.get('gameCanvas');
        }
       
        this.ctx = canvasTexture.getContext();
        this.canvasImage = this.add.image(0, 0, 'gameCanvas').setOrigin(0); //Display the canvas as a Phaser image

        //Game Interface styles
        const textScore = {
            fontFamily: 'myTextFont',
            fontSize: '25px',
            color: '#ffffff',
            stroke: '#faca0b',
            strokeThickness: 1,
            align: 'center'
        };
        const texts = {
            fontFamily: 'myTextFont',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#faca0b',
            strokeThickness: 1,
            align: 'center'
        };

        const margin = 10;
        //Score container image centered at top
        const contScore = this.add.image(gameConfig.canvasWidth/2, margin, 'contScore').setOrigin(0.5, 0);
        contScore.displayWidth = gameConfig.canvasWidth/4;
        contScore.displayHeight = gameConfig.canvasHeight/10;
        //Level container image top left
        const contLevel = this.add.image(0, margin, 'contLevel').setOrigin(0, 0);
        contLevel.displayWidth = gameConfig.canvasWidth/8;
        contLevel.displayHeight = gameConfig.canvasHeight/12;
        //Timer container image below level container
        const contTime = this.add.image(0, margin*2 + gameConfig.canvasHeight/12, 'contLevel').setOrigin(0, 0);
        contTime.displayWidth = gameConfig.canvasWidth/8;
        contTime.displayHeight = gameConfig.canvasHeight/12;
        //Game Interface text elements
        this.score = this.add.text(gameConfig.canvasWidth/2, margin+gameConfig.canvasHeight/10/2, `Score: ${gameConfig.score}`, textScore).setOrigin(0.5);
        this.actLevel = this.add.text(gameConfig.canvasWidth/8/2-margin, margin+gameConfig.canvasHeight/12/2, `Level ${gameConfig.actualDiff}-${(gameConfig.actualLevel-1)%3 +1}`, texts).setOrigin(0.5);
        this.time = this.add.text(gameConfig.canvasWidth/8/2-margin, margin*2+gameConfig.canvasHeight/12+gameConfig.canvasHeight/12/2, `Time: ${gameConfig.elapsedTime}s`, texts).setOrigin(0.5);
        

        

    }

    //Main loop for the game (It used to be a function outside of Phaser, but now it's the one that controls the loop)
    update(time, delta) {
        gameConfig.gameLoad = true; //Level is fully running
        gameConfig.letPause = true; //Allow the pause menu to be opened

        //Clear the canvas each frame before redrawing
        this.ctx.clearRect(0, 0, gameConfig.canvasWidth, gameConfig.canvasHeight);

        //Reset the position oto draw the elements
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        //Updates the game
        this.game.update(delta);

        //We draw the background outside the draw function to maintain it static
        this.game.background.draw(this.ctx);
        this.game.decoration_floor.draw(this.ctx);

        //Refresh text with current values
        this.score.setText(`Score: ${gameConfig.score}`);
        this.time.setText(`Time: ${gameConfig.elapsedTime}s`);

        //Calculates the position of the camera (implemented like a dephase of the drawing)
        const cameraX = gameConfig.canvasWidth / 2 - this.game.player.position.x;
        const cameraY = 0;

        //Translates where the objects are drawn to simulate camera
        this.ctx.translate(cameraX, cameraY);

        //Draws the game
        this.game.draw(this.ctx);

        //Updates the canvas
        this.canvasImage.texture.refresh();

        //If the level was completed, it changes to the win scene
        if(gameConfig.levelComplete == true) {
            gameConfig.levelComplete = false;
            gameConfig.gameLoad = false;
            gameConfig.letPause = false;
            usarCartaPartida(gameConfig.cardsUsed_id);
            actualizarNivelPartida(true);
            this.sound.stopAll();
            if(gameConfig.sounds && gameConfig.sounds.bark){
                gameConfig.sounds.bark.stop();
            }
            gameConfig.totalScore += gameConfig.score;
            this.scene.start(`WinScreen${gameConfig.actualDiff}`);
            this.levelMusic.stop();
        }
        //Game over type 1, time out or fell into void
        if(gameConfig.levelOver1 == true) {
            gameConfig.levelOver1 = false;
            gameConfig.gameLoad = false;
            gameConfig.letPause = false;
            // Accumulate run wide totals before leaving
            gameConfig.totalEnemiesKilled += gameConfig.enemiesKilled;
            gameConfig.totalCardsUsed += gameConfig.cardsUsed;
            gameConfig.totalCardsUpgraded += gameConfig.cardsUpgraded;
            gameConfig.totalTime += gameConfig.elapsedTime;
            gameConfig.totalScore += gameConfig.score;
            savePartida(gameConfig.id_partida);
            actualizarEstadisticas(false);
            usarCartaPartida(gameConfig.cardsUsed_id);
            actualizarNivelPartida(false);
            this.sound.stopAll();
            this.scene.start('GameOver1Screen');
            this.levelMusic.stop();
        }
        // Game over type 2, lost all lives
        if(gameConfig.levelOver2 == true) {
            gameConfig.levelOver2 = false;
            gameConfig.gameLoad = false;
            gameConfig.letPause = false;
            // Accumulate run wide totals before leaving
            gameConfig.totalEnemiesKilled += gameConfig.enemiesKilled;
            gameConfig.totalCardsUsed += gameConfig.cardsUsed;
            gameConfig.totalCardsUpgraded += gameConfig.cardsUpgraded;
            gameConfig.totalTime += gameConfig.elapsedTime;
            gameConfig.totalScore += gameConfig.score;
            savePartida(gameConfig.id_partida);
            actualizarEstadisticas(false);
            usarCartaPartida(gameConfig.cardsUsed_id);
            actualizarNivelPartida(false);
            this.sound.stopAll();
            this.scene.start('GameOver2Screen');
            this.levelMusic.stop();
        }
        //Player pressed Tab, it meaans pause the Level scene and overlay the PauseMenu scene
        if(gameConfig.pause && gameConfig.letPause) {
            gameConfig.letPause = false;
            gameConfig.gameLoad = false;
            this.scene.pause('Level'); //Freeze this scene
            this.scene.launch('PauseMenu'); 
            this.scene.bringToTop('PauseMenu');
        }
    }
}