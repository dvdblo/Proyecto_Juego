//This js contains all the scenes related to history screens.
//Use of AI: AI was used to learn how to use the scenes in Phaser, and to learn how to configurate them.
//We also used video tutorials from YouTube and official documentation.
 
//HISTORY------------------------------------------------------------------------------------------------------------
//Introduction scene with some context of why are you in that situation
class Introduction extends Phaser.Scene {
    constructor() {
        super('Introduction');
    }

    preload() {
        this.load.image('backgroundIntro', '../Videojuego/assets/Fondos/backIntro.png');
        this.load.image('buttonContinue', '../Videojuego/assets/sprites/botones/botonLargoWin_1.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('introMusic', '../Videojuego/assets/Musica/musicIntro.mp3');
    }

    create() {
        //Fade in effect
        this.cameras.main.fadeIn(2000);
        if (!this.introMusic || !this.introMusic.isPlaying) {
            this.introMusic = this.sound.add(`introMusic`, { loop: true });
            this.introMusic.play();
        }

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
            this.introMusic.stop();
            this.scene.start('LoadingGame1');   //Changes to this scene
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

//Good ending scene at the end of the game
class GoodEnding extends Phaser.Scene {
    constructor() {
        super('GoodEnding');
    }

    preload() {
        this.load.image('backgroundGood', '../Videojuego/assets/Fondos/backGoodEnd.png');
        this.load.image('buttonContinue', '../Videojuego/assets/sprites/botones/botonLargoWin_1.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('endMusic', '../Videojuego/assets/Musica/musicEnd.mp3');
    }

    create() {
        this.cameras.main.fadeIn(2000);

        if (!this.endMusic || !this.endMusic.isPlaying) {
            this.endMusic = this.sound.add(`endMusic`, { loop: true });
            this.endMusic.play();
        }

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
            this.endMusic.stop();
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

//Bad ending scene for the case when you fall into the void
class BadEnding1 extends Phaser.Scene {
    constructor() {
        super('BadEnding1');
    }

    preload() {
        this.load.image('backgroundBad1', '../Videojuego/assets/Fondos/backGameOver1.png');
        this.load.image('buttonOver1', '../Videojuego/assets/sprites/botones/botonLargoOver.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
    }

    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundBad1');

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
            this.cameras.main.fadeOut(3000);
                const overMusic = this.sound.get('gameOverMusic');
                if (overMusic && overMusic.isPlaying) {
                    this.tweens.add({
                        targets: overMusic,
                        volume: 0,
                        duration: 3000,
                        onComplete: () => {
                            this.scene.start('MainMenu');
                            overMusic.stop();
                        }
                    });
                } else {this.scene.start('MainMenu');}
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

//Bad ending scene for the case when you lose all your lifes
class BadEnding2 extends Phaser.Scene {
    constructor() {
        super('BadEnding2');
    }

    preload() {
        this.load.image('backgroundBad2', '../Videojuego/assets/Fondos/backGameOver2.png');
        this.load.image('buttonOver2', '../Videojuego/assets/sprites/botones/botonLargoOver.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
    }

    create() {

        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundBad2');

        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        const scale = 1/5;
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonOver2').setInteractive();
        
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
            this.cameras.main.fadeOut(3000);
                const overMusic = this.sound.get('gameOverMusic2');
                if (overMusic && overMusic.isPlaying) {
                    this.tweens.add({
                        targets: overMusic,
                        volume: 0,
                        duration: 3000,
                        onComplete: () => {
                            this.scene.start('MainMenu');
                            overMusic.stop();
                        }
                    });
                } else {this.scene.start('MainMenu');}
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

        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/3, '"ESTAS ESCUCHANDO EL NOTICIERO MILAGROS... ¿Cómo se encuentran el día de hoy fieles seguidores?, como seguro ya sabrán, hoy se cumple un año desde que se perdió la comunicación con la nave "El pastor"... no se sabe que es lo que pasó, pero todos debemos de estar unidos en conmemoración a Frédéric y en apoyo a su famiia... digamos todos: hoy, en esta día..."', styleHistory).setOrigin(0.5);
        
    }
}