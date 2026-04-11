

class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    //Loads images and fonts to use in the menu
    preload() {
        this.load.image('backgroundMenu', '../assets/Fondos/backMenu2.png');
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
            this.scene.start('Introduction');   //Changes to this scene
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
 

class Introduction extends Phaser.Scene {
    constructor() {
        super('Introduction');
    }

    preload() {
        this.load.image('backgroundIntro', '../assets/Fondos/backIntro.png');
        this.load.image('buttonContinue', '../assets/sprites/botonLargoWin.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundIntro');

        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5;
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonContinue').setInteractive();
        
        //Adjusts the size
        button.setScale(scale);

        //Like CSS but for Phaser
        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#bc2bff',
            strokeThickness: 8,
            align: 'center'
        };

        //Text for the button
        const textPlay = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'Empezar juego', textButton).setOrigin(0.5);

        //Detects the selection of the button
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textPlay.setScale(1.1);
        });

        //Detects the deselection of the button
        button.on('pointerout', () => {
            button.setScale(scale);
            textPlay.setScale(1);
        });

        //Button pressed
        button.on('pointerdown', () => {
            this.scene.start('LoadingGame');   //Changes to this scene
        });

        const styleHistory = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#8546a2',
            strokeThickness: 8,
            align: 'center',
            wordWrap: { width: gameConfig.canvasWidth - gameConfig.canvasWidth/10 }
        };

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/3, 'Era un gran día para la humanidad, la expedición más lejana al espacio profundo, con una duración de 15 años. Después de 3 años de viaje, la nave llegó al planeta "El pastizal", todo el mundo celebraba el arrivo, pero esperen un momento...\n\nRecuperando conexión...', styleHistory).setOrigin(0.5);
        
    }
}




class LoadingGame extends Phaser.Scene {
    constructor() {
        super('LoadingGame');
    }

    //Initializes the game
    async create() {
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'Cargando...').setOrigin(0.5).setScale(4);

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
    if(gameConfig.levelOver1 == true) {
        gameConfig.levelOver1 = false;
        this.scene.start('GameOver1Screen');
    }
    }
}

class WinLevelScreen extends Phaser.Scene {
    constructor() {
        super('WinScreen');
    }

    preload() {
        this.load.image('backgroundWin', '../assets/Fondos/backLevelWin.png');
        this.load.image('buttonContinue', '../assets/sprites/botonLargoWin.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonContinue').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#bc2bff',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', () => {
            this.scene.start('GoodEnding');
        });

        //Text
        const styteWinLevel = {
            fontFamily: 'myTextFont',
            fontSize: '90px',
            color: '#bc2bff',
            stroke: '#ffffff',
            strokeThickness: 12,
            align: 'center'
        };
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/4, 'NIVEL COMPLETADO', styteWinLevel).setOrigin(0.5);

    } 
}

class GoodEnding extends Phaser.Scene {
    constructor() {
        super('GoodEnding');
    }

    preload() {
        this.load.image('backgroundGood', '../assets/Fondos/backGoodEnd.png');
        this.load.image('buttonContinue', '../assets/sprites/botonLargoWin.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundGood');

        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5;
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonContinue').setInteractive();
        
        //Adjusts the size
        button.setScale(scale);

        //Like CSS but for Phaser
        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#bc2bff',
            strokeThickness: 8,
            align: 'center'
        };

        //Text for the button
        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'FIN', textButton).setOrigin(0.5);

        //Detects the selection of the button
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        //Detects the deselection of the button
        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        //Button pressed
        button.on('pointerdown', () => {
            this.scene.start('MainMenu');   //Changes to this scene
        });

        const styleHistory = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#8546a2',
            strokeThickness: 8,
            align: 'center',
            wordWrap: { width: gameConfig.canvasWidth - gameConfig.canvasWidth/10 }
        };

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/3, 'Después de 10 largos y estresantes días, cuando la esperanza estaba pedida, un mensaje de voz llegó a la central de comunicaciones... "Hola mundo, perdón por desaparecerme, mi nave se dañó y tuve que conseguir un nuevo transmisor, por suerte había uno por aquí... tambien encontré algo más, ¿O alguienes?"', styleHistory).setOrigin(0.5);
        
    }
}


class GameOver1Screen extends Phaser.Scene {
    constructor() {
        super('GameOver1Screen');
    }

    preload() {
        this.load.image('backgroundLose', '../assets/Fondos/backGameOver1.png');
        this.load.image('buttonGameOver', '../assets/sprites/botonLargoOver.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundLose');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonGameOver').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#8b8961',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', () => {
            this.scene.start('BadEnding1');
        });

        //Text
        const styteWinLevel = {
            fontFamily: 'myTextFont',
            fontSize: '90px',
            color: '#ffffff',
            stroke: '#8c8b6f',
            strokeThickness: 8,
            align: 'center'
            
        };
        const textGameOver = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/4, 'HAS PERDIDO', styteWinLevel).setOrigin(0.5);

    } 
}

class BadEnding1 extends Phaser.Scene {
    constructor() {
        super('BadEnding1');
    }

    preload() {
        this.load.image('backgroundBad', '../assets/Fondos/backGameOver1.png');
        this.load.image('buttonOver1', '../assets/sprites/botonLargoOver.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundBad');

        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5;
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonOver1').setInteractive();
        
        //Adjusts the size
        button.setScale(scale);

        //Like CSS but for Phaser
        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#8c8b6f',
            strokeThickness: 8,
            align: 'center'
        };

        //Text for the button
        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'FIN', textButton).setOrigin(0.5);

        //Detects the selection of the button
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        //Detects the deselection of the button
        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        //Button pressed
        button.on('pointerdown', () => {
            this.scene.start('MainMenu');   //Changes to this scene
        });

        const styleHistory = {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#8c8b6f',
            strokeThickness: 8,
            align: 'center',
            wordWrap: { width: gameConfig.canvasWidth - gameConfig.canvasWidth/10 }
        };

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/3, '"Hola a todos, si estan escuchado esto, perdónenme, hice todo lo que pude... Es una larga historia, pero lo resumo... Caí al vacío, no se cuanto tiempo dure el oxígeno en mi traje... Si alguien recibe esto, dígale a mi familia que la quiero...\n\nCambio y fuera..."', styleHistory).setOrigin(0.5);
        
    }
}