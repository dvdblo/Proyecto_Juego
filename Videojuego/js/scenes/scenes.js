

class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    //Loads images and fonts to use in the menu
    preload() {
        this.load.image('backgroundMenu', '../assets/Fondos/backMenu.png');
        this.load.image('botonkey', '../assets/sprites/botonLargo.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //Creates the objects/variables
    create() {

        //Main Menu Background         Position X                Position Y              Name to reference
        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundMenu');
        
        //Adjusts the size
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        //Elements: buttons and texts
        const scale = 1/5 //To resize the button using the canvas size                                //To allow detection of cursor
        const boton = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'botonkey').setInteractive();
        
        //Adjusts the size
        boton.setScale(scale);

        //Like CSS but for Phaser
        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#0087fe',
            strokeThickness: 8,
            align: 'center'
        };

        //Text for the button
        const textPlay = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2-scale*gameConfig.canvasHeight/20, 'Empezar juego', textButton).setOrigin(0.5);

        //Detects the selection of the button
        boton.on('pointerover', () => {
            boton.setScale(scale*1.1);
            textPlay.setScale(1.1);
        });

        //Detects the deselection of the button
        boton.on('pointerout', () => {
            boton.setScale(scale);
            textPlay.setScale(1);
        });

        //Button pressed
        boton.on('pointerdown', () => {
            this.scene.start('LoadingGame');   //Changes to this scene
        });

        //Text
        const styteTitle = {
            fontFamily: 'myTextFont',
            fontSize: '90px',
            color: '#ffffff',
            stroke: '#0087fe',
            strokeThickness: 8,
            align: 'center'
        };
        const textTitle = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/4, 'HyperJump', styteTitle).setOrigin(0.5);

    } 
}
 

class LoadingGame extends Phaser.Scene {
    constructor() {
        super('LoadingGame');
    }

    //Initializes the game
    async create() {
        this.add.text(300, 250, 'Cargando...');

        //New game (level)
        const game = new Game(gameConfig.canvasWidth, gameConfig.canvasHeight);

        //Game function to init the game
        await game.init();

        //Next scene
        this.scene.start('Level_1', { game });
    }
}

class Level_1 extends Phaser.Scene {
    constructor() {
        super('Level_1');
    }

    create(data) {
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
    }

    //Main loop for the game (It used to be a function outside of Phaser, but now it's the one that controls the loop)
    update(time, delta) {

    this.ctx.clearRect(0, 0, gameConfig.canvasWidth, gameConfig.canvasHeight);

    //Reset the position oto draw the elements
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    //Updates the game
    this.game.update(delta);

    //We draw the background outside the draw function to maintain it static
    this.game.background.draw(this.ctx);

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
        this.scene.start('WinScreen');
    }
    }
}

class WinLevelScreen extends Phaser.Scene {
    constructor() {
        super('WinScreen');
    }

    preload() {
        this.load.image('backgroundWin', '../assets/Fondos/backMenu.png');
        this.load.image('buttonContinue', '../assets/sprites/botonLargo.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'buttonContinue').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#0087fe',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        //Text
        const styteWinLevel = {
            fontFamily: 'myTextFont',
            fontSize: '90px',
            color: '#ffffff',
            stroke: '#0087fe',
            strokeThickness: 8,
            align: 'center'
        };
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/4, 'YOU WIN', styteWinLevel).setOrigin(0.5);

    } 
}