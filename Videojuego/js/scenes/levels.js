//LEVELS------------------------------------------------------------------------------------------------------------
class Level extends Phaser.Scene {
    constructor() {
        super('Level');
    }

    preload() {
        if(gameConfig.actualDiff == 1) {
            this.load.audio('levelMusic1', `../Videojuego/assets/Musica/music${gameConfig.actualDiff}.mp3`);
        } else if(gameConfig.actualDiff == 2) {
            this.load.audio('levelMusic2', `../Videojuego/assets/Musica/music${gameConfig.actualDiff}.mp3`);
        }else if(gameConfig.actualDiff == 3) {
            this.load.audio('levelMusic3', `../Videojuego/assets/Musica/music${gameConfig.actualDiff}.mp3`);
        }

        this.load.image('contLevel', '../Videojuego/assets/sprites/botones/contLevel.png');
        this.load.image('contScore', '../Videojuego/assets/sprites/botones/contScore.png');
    }

    create(data) {
        gameConfig.pause = false;

        if (!this.levelMusic || !this.levelMusic.isPlaying) {
            this.levelMusic = this.sound.add(`levelMusic${gameConfig.actualDiff}`, { loop: true });
            this.levelMusic.play();
        }

        //Reads the game from the Load scene
        this.game = data.game;

        //Create canvas if it didn´t exists already
        let canvasTexture;

        if (!this.textures.exists('gameCanvas')) {
            canvasTexture = this.textures.createCanvas('gameCanvas', gameConfig.canvasWidth, gameConfig.canvasHeight);
        } else {
            canvasTexture = this.textures.get('gameCanvas');
        }
       
        this.ctx = canvasTexture.getContext();
        this.canvasImage = this.add.image(0, 0, 'gameCanvas').setOrigin(0);

        //Game Interface
        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '20px',
            color: '#ffffff',
            stroke: '#0087fe',
            strokeThickness: 1,
            align: 'center'
        };
        const margin = 10;
        const contScore = this.add.image(gameConfig.canvasWidth/2, margin, 'contScore').setOrigin(0.5, 0);
        contScore.displayWidth = gameConfig.canvasWidth/4;
        contScore.displayHeight = gameConfig.canvasHeight/10;

        const contLevel = this.add.image(0, margin, 'contLevel').setOrigin(0, 0);
        contLevel.displayWidth = gameConfig.canvasWidth/8;
        contLevel.displayHeight = gameConfig.canvasHeight/12;

        const contTime = this.add.image(0, margin*2 + gameConfig.canvasHeight/12, 'contLevel').setOrigin(0, 0);
        contTime.displayWidth = gameConfig.canvasWidth/8;
        contTime.displayHeight = gameConfig.canvasHeight/12;

        this.score = this.add.text(gameConfig.canvasWidth/2, margin+25, `Score: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.time = this.add.text(0, margin+25, `Time: ${gameConfig.elapsedTime}`, textButton).setOrigin(0.5);
        

        

    }

    //Main loop for the game (It used to be a function outside of Phaser, but now it's the one that controls the loop)
    update(time, delta) {
        gameConfig.gameLoad = true;
        gameConfig.letPause = true;

        this.ctx.clearRect(0, 0, gameConfig.canvasWidth, gameConfig.canvasHeight);

        //Reset the position oto draw the elements
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        //Updates the game
        this.game.update(delta);

        //We draw the background outside the draw function to maintain it static
        this.game.background.draw(this.ctx);
        this.game.decoration_floor.draw(this.ctx);

        this.score.setText(`Score: ${gameConfig.score}`);

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
            gameConfig.totalScore += gameConfig.score;
            this.scene.start(`WinScreen${gameConfig.actualDiff}`);
            this.levelMusic.stop();
        }
        if(gameConfig.levelOver1 == true) {
            gameConfig.levelOver1 = false;
            gameConfig.gameLoad = false;
            gameConfig.letPause = false;
            gameConfig.totalScore += gameConfig.score;
            this.scene.start('GameOver1Screen');
            this.levelMusic.stop();
        }
        if(gameConfig.levelOver2 == true) {
            gameConfig.levelOver2 = false;
            gameConfig.gameLoad = false;
            gameConfig.letPause = false;
            gameConfig.totalScore += gameConfig.score;
            this.scene.start('GameOver2Screen');
            this.levelMusic.stop();
        }
        if(gameConfig.pause && gameConfig.letPause) {
            gameConfig.letPause = false;
            gameConfig.gameLoad = false;
            this.scene.pause('Level');
            this.scene.launch('PauseMenu');
            this.scene.bringToTop('PauseMenu');
        }
    }
}