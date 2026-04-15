
//STATE SCREENS------------------------------------------------------------------------------------------------------------

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

class WinLevelScreen1 extends Phaser.Scene {
    constructor() {
        super('WinScreen1');
    }

    preload() {
        this.load.image('backgroundWin1', '../assets/Fondos/backLevelWin_1.png');
        this.load.image('buttonContinue1', '../assets/sprites/botones/botonLargoWin_1.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin1');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonContinue1').setInteractive();
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

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
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

class WinLevelScreen2 extends Phaser.Scene {
    constructor() {
        super('WinScreen2');
    }

    preload() {
        this.load.image('backgroundWin2', '../assets/Fondos/backLevelWin_2.png');
        this.load.image('buttonContinue2', '../assets/sprites/botones/botonLargoWin_2.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin2');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonContinue2').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#ffa72b',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
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
            color: '#ffa72b',
            stroke: '#ffffff',
            strokeThickness: 12,
            align: 'center'
        };
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/4, 'NIVEL COMPLETADO', styteWinLevel).setOrigin(0.5);

    } 
}

class WinLevelScreen3 extends Phaser.Scene {
    constructor() {
        super('WinScreen3');
    }

    preload() {
        this.load.image('backgroundWin3', '../assets/Fondos/backLevelWin_3.png');
        this.load.image('buttonContinue3', '../assets/sprites/botones/botonLargoWin_3.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin3');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonContinue3').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#ffe32b',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
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
            color: '#ffe32b',
            stroke: '#ffffff',
            strokeThickness: 12,
            align: 'center'
        };
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/4, 'NIVEL COMPLETADO', styteWinLevel).setOrigin(0.5);

    } 
}

class GameOver1Screen extends Phaser.Scene {
    constructor() {
        super('GameOver1Screen');
    }

    preload() {
        this.load.image('backgroundLose', '../assets/Fondos/backGameOver1.png');
        this.load.image('buttonGameOver', '../assets/sprites/botones/botonLargoOver.png');
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

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
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

class GameOver2Screen extends Phaser.Scene {
    constructor() {
        super('GameOver2Screen');
    }

    preload() {
        this.load.image('backgroundLose2', '../assets/Fondos/backGameOver2.png');
        this.load.image('buttonGameOver', '../assets/sprites/botones/botonLargoOver.png');
        this.load.font('myTextFont', '../assets/fuentesLetra/WakeboardStudio.ttf');
    }

    //At the moment, almost the same as the main menu
    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundLose2');
        
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

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', () => {
            this.scene.start('BadEnding2');
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