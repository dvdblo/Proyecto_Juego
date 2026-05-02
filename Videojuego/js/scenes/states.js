//This js contains all the scenes related to other states, like loading scenes or victory/defeat screens.
//Use of AI: AI was used to learn how to use the scenes in Phaser, and to learn how to configurate them.
//We also used video tutorials from YouTube and official documentation.

//STATE SCREENS------------------------------------------------------------------------------------------------------------
//Scenes where the game is intialized, according to the correct new level
//Loading for difficulty 1
class LoadingGame1 extends Phaser.Scene {
    constructor() {
        super('LoadingGame1');
    }

    preload() {
        this.load.image('backgroundLoad1', '../Videojuego/assets/Fondos/backLoad_1.png');
    }

    //Initializes the game with difficulty 1
    async create() {
        gameConfig.gameLoad = false;
        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundLoad1');
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        //New game (level)
        const game = new Game(gameConfig.canvasWidth, gameConfig.canvasHeight, gameConfig.actualLevel);
        gameConfig.actualDiff =1;

        //Game function to init the game
        await game.init();

        if(gameConfig.actualLevel > 1) {
            await crearNivelPartida();
        }

        //Next scene
        this.scene.start('Level', { game });
    }
}

//Loading for difficulty 2
class LoadingGame2 extends Phaser.Scene {
    constructor() {
        super('LoadingGame2');
    }

    preload() {
        this.load.image('backgroundLoad2', '../Videojuego/assets/Fondos/backLoad_2.png');
    }

    //Initializes the game with difficulty 2
    async create() {
        gameConfig.gameLoad = false;
        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundLoad2');
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        //New game (level)
        const game = new Game(gameConfig.canvasWidth, gameConfig.canvasHeight, gameConfig.actualLevel);
        gameConfig.actualDiff =2;

        //Game function to init the game
        await game.init();

        await crearNivelPartida();

        //Next scene
        this.scene.start('Level', { game });
    }
}

//Loading for difficulty 3
class LoadingGame3 extends Phaser.Scene {
    constructor() {
        super('LoadingGame3');
    }

    preload() {
        this.load.image('backgroundLoad3', '../Videojuego/assets/Fondos/backLoad_3.png');
    }

    //Initializes the game with difficulty 3
    async create() {
        gameConfig.gameLoad = false;
        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundLoad3');
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        //New game (level)
        const game = new Game(gameConfig.canvasWidth, gameConfig.canvasHeight, gameConfig.actualLevel);
        gameConfig.actualDiff =3;

        //Game function to init the game
        await game.init();

        await crearNivelPartida();

        //Next scene
        this.scene.start('Level', { game });
    }
}

//State scenes for winning or losing
//Win scren for difficulty 1
class WinLevelScreen1 extends Phaser.Scene {
    constructor() {
        super('WinScreen1');
    }

    preload() {
        this.load.image('backgroundWin1', '../Videojuego/assets/Fondos/backLevelWin_1.png');
        this.load.image('buttonContinue1', '../Videojuego/assets/sprites/botones/botonLargoWin_1.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('winMusic', '../Videojuego/assets/Musica/musicWin.mp3');
    }

    //At the moment, almost the same as the main menu
    create() {
        this.cameras.main.fadeIn(2000);

        if (!this.winMusic || !this.winMusic.isPlaying) {
            this.winMusic = this.sound.add(`winMusic`, { loop: false });
            this.winMusic.play();
        }

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin1');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, hei(5,6,3.5,1.1), 'buttonContinue1').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#bc2bff',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, hei(5,6,3.5,1.1)-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        this.add.text(gameConfig.canvasWidth/2, hei(0,6,3.5,1.1), `Puntaje: ${gameConfig.score/gameConfig.lastScreenBonus.timeBonus -gameConfig.lastScreenBonus.totalBonus}  Bonus de héroe: ${gameConfig.lastScreenBonus.baseBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(1,6,3.5,1.1), `Bonus por cartas sobrantes: ${gameConfig.lastScreenBonus.powerUpBonus+gameConfig.lastScreenBonus.platformBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(2,6,3.5,1.1), `Multiplicador por tiempo: x${gameConfig.lastScreenBonus.timeBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(3,6,3.5,1.1), `Puntaje total: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(4,6,3.5,1.1), `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', async() => {
            await savePartida(gameConfig.id_partida);
            gameConfig.actualLevel++;
            this.winMusic.stop();
            //To start in the next difficulty
            if (gameConfig.actualLevel > 3) {
                this.scene.start('LoadingGame2');
            } else {this.scene.start('LoadingGame1');}
            
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
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/8, 'NIVEL COMPLETADO', styteWinLevel).setOrigin(0.5);

    } 
}

//Win scren for difficulty 2
class WinLevelScreen2 extends Phaser.Scene {
    constructor() {
        super('WinScreen2');
    }

    preload() {
        this.load.image('backgroundWin2', '../Videojuego/assets/Fondos/backLevelWin_2.png');
        this.load.image('buttonContinue2', '../Videojuego/assets/sprites/botones/botonLargoWin_2.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('winMusic', '../Videojuego/assets/Musica/musicWin.mp3');
    }

    //At the moment, almost the same as the main menu
    create() {
        this.cameras.main.fadeIn(2000);

        if (!this.winMusic || !this.winMusic.isPlaying) {
            this.winMusic = this.sound.add(`winMusic`, { loop: false });
            this.winMusic.play();
        }

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin2');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, hei(5,6,3.5,1.1), 'buttonContinue2').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#ffa72b',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, hei(5,6,3.5,1.1)-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        this.add.text(gameConfig.canvasWidth/2, hei(0,6,3.5,1.1), `Puntaje: ${gameConfig.score/gameConfig.lastScreenBonus.timeBonus -gameConfig.lastScreenBonus.totalBonus}  Bonus de héroe: ${gameConfig.lastScreenBonus.baseBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(1,6,3.5,1.1), `Bonus por cartas sobrantes: ${gameConfig.lastScreenBonus.powerUpBonus+gameConfig.lastScreenBonus.platformBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(2,6,3.5,1.1), `Multiplicador por tiempo: x${gameConfig.lastScreenBonus.timeBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(3,6,3.5,1.1), `Puntaje total: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(4,6,3.5,1.1), `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', async() => {
            await savePartida(gameConfig.id_partida);
            gameConfig.actualLevel++;
            this.winMusic.stop();
            //To start in the next difficulty
            if (gameConfig.actualLevel > 6) {
                this.scene.start('LoadingGame3');
            } else {this.scene.start('LoadingGame2');}
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
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/8, 'NIVEL COMPLETADO', styteWinLevel).setOrigin(0.5);

    } 
}

//Win scren for difficulty 3
class WinLevelScreen3 extends Phaser.Scene {
    constructor() {
        super('WinScreen3');
    }

    preload() {
        this.load.image('backgroundWin3', '../Videojuego/assets/Fondos/backLevelWin_3.png');
        this.load.image('buttonContinue3', '../Videojuego/assets/sprites/botones/botonLargoWin_3.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('winMusic', '../Videojuego/assets/Musica/musicWin.mp3');
    }

    //At the moment, almost the same as the main menu
    create() {
        this.cameras.main.fadeIn(2000);

        if (!this.winMusic || !this.winMusic.isPlaying) {
            this.winMusic = this.sound.add(`winMusic`, { loop: false });
            this.winMusic.play();
        }

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundWin3');
        
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5
        const button = this.add.image(gameConfig.canvasWidth/2, hei(5,6,3.5,1.1), 'buttonContinue3').setInteractive();
        button.setScale(scale);

        const textButton = {
            fontFamily: 'myTextFont',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#ffe32b',
            strokeThickness: 8,
            align: 'center'
        };

        const textContinue = this.add.text(gameConfig.canvasWidth/2, hei(5,6,3.5,1.1)-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);

        this.add.text(gameConfig.canvasWidth/2, hei(0,6,3.5,1.1), `Puntaje: ${gameConfig.score/gameConfig.lastScreenBonus.timeBonus -gameConfig.lastScreenBonus.totalBonus}  Bonus de héroe: ${gameConfig.lastScreenBonus.baseBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(1,6,3.5,1.1), `Bonus por cartas sobrantes: ${gameConfig.lastScreenBonus.powerUpBonus+gameConfig.lastScreenBonus.platformBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(2,6,3.5,1.1), `Multiplicador por tiempo: x${gameConfig.lastScreenBonus.timeBonus}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(3,6,3.5,1.1), `Puntaje total: ${gameConfig.score}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, hei(4,6,3.5,1.1), `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', async() => {
            await savePartida(gameConfig.id_partida);
            gameConfig.actualLevel++;
            this.winMusic.stop();
            //To start the win game scene
            if (gameConfig.actualLevel > 9) {
                await actualizarEstadisticas(true);
                this.scene.start('GoodEnding');
            } else {this.scene.start('LoadingGame3');}
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
        const textWinLevel = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/8, 'NIVEL COMPLETADO', styteWinLevel).setOrigin(0.5);

    } 
}

//Game over screen when fall into the void
class GameOver1Screen extends Phaser.Scene {
    constructor() {
        super('GameOver1Screen');
    }

    preload() {
        this.load.image('backgroundLose', '../Videojuego/assets/Fondos/backGameOver1.png');
        this.load.image('buttonGameOver', '../Videojuego/assets/sprites/botones/botonLargoOver.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('gameOverMusic', '../Videojuego/assets/Musica/musicOver.mp3');
    }

    //At the moment, almost the same as the main menu
    create() {
        this.cameras.main.fadeIn(2000);

        let overMusic = this.sound.get('gameOverMusic');

        if (overMusic) {
            overMusic.destroy();
        }

        overMusic = this.sound.add('gameOverMusic', { loop: true });
        overMusic.play();

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

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje de la partida: ${gameConfig.totalScore}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', async() => {
            await finishPartida(gameConfig.id_partida);
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

//Game over screen when lose all your lifes
class GameOver2Screen extends Phaser.Scene {
    constructor() {
        super('GameOver2Screen');
    }

    preload() {
        this.load.image('backgroundLose2', '../Videojuego/assets/Fondos/backGameOver2.png');
        this.load.image('buttonGameOver', '../Videojuego/assets/sprites/botones/botonLargoOver.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('gameOverMusic2', '../Videojuego/assets/Musica/musicOver.mp3');
    }

    //At the moment, almost the same as the main menu
    create() {
        this.cameras.main.fadeIn(2000);

        let overMusic = this.sound.get('gameOverMusic2');

        if (overMusic) {
            overMusic.destroy();
        }

        overMusic = this.sound.add('gameOverMusic2', { loop: true });
        overMusic.play();

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

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, `Puntaje de la partida: ${gameConfig.totalScore}`, textButton).setOrigin(0.5);
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.6, `Tiempo: ${gameConfig.elapsedTime}s`, textButton).setOrigin(0.5);
        
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });

        button.on('pointerout', () => {
            button.setScale(scale);
            textContinue.setScale(1);
        });

        button.on('pointerdown', async() => {
            await finishPartida(gameConfig.id_partida);
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