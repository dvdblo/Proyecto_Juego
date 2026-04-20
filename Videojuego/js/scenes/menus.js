
//MENUS------------------------------------------------------------------------------------------------------------
class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    //Loads images and fonts to use in the menu
    preload() {
        this.load.image('backgroundMenu', '../Videojuego/assets/Fondos/backMenu2.png');
        this.load.image('buttonPlay', '../Videojuego/assets/sprites/botones/botonLargo.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
        this.load.audio('menuMusic', '../Videojuego/assets/Musica/musicMenu.mp3');
    }

    //Creates the objects/variables
    create() {
        gameConfig.actualLevel = 1;
        gameConfig.actualDiff = 1;
        gameConfig.gameLoad = false;

        if (!this.menuMusic || !this.menuMusic.isPlaying) {
            this.menuMusic = this.sound.add('menuMusic', { loop: true });
            this.menuMusic.play();
        }

        //Main Menu Background         Position X                Position Y              Name to reference
        const back = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'backgroundMenu');
        
        //Adjusts the size
        back.displayWidth = gameConfig.canvasWidth;
        back.displayHeight = gameConfig.canvasHeight;

        //Elements: buttons and texts
        const scale = 1/5 //To resize the button using the canvas size
        //To adjust the position in Y automatically
        function hei(i) {
            const n = 4;
            const posInicial = gameConfig.canvasHeight/2;
            const posFinal = gameConfig.canvasHeight/1.1;
            const paso = (posFinal - posInicial) / (n - 1);
            return posInicial + paso * i;
        }
        const buttonNew = this.add.image(gameConfig.canvasWidth/2, hei(0), 'buttonPlay').setInteractive(); //To allow detection of cursor
        const buttonContinue = this.add.image(gameConfig.canvasWidth/2, hei(1), 'buttonPlay').setInteractive();
        const buttonSettings = this.add.image(gameConfig.canvasWidth/2, hei(2), 'buttonPlay').setInteractive();
        const buttonTutorial = this.add.image(gameConfig.canvasWidth/2, hei(3), 'buttonPlay').setInteractive();
        
        //Adjusts the size
        buttonNew.setScale(scale);
        buttonContinue.setScale(scale);
        buttonSettings.setScale(scale);
        buttonTutorial.setScale(scale);

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
        const textNew = this.add.text(gameConfig.canvasWidth/2, hei(0)-scale*gameConfig.canvasHeight/20, 'Empezar juego', textButton).setOrigin(0.5);
        const textContinue = this.add.text(gameConfig.canvasWidth/2, hei(1)-scale*gameConfig.canvasHeight/20, 'Continuar', textButton).setOrigin(0.5);
        const textSettings = this.add.text(gameConfig.canvasWidth/2, hei(2)-scale*gameConfig.canvasHeight/20, 'Configuración', textButton).setOrigin(0.5);
        const textTutorial = this.add.text(gameConfig.canvasWidth/2, hei(3)-scale*gameConfig.canvasHeight/20, 'Tutorial', textButton).setOrigin(0.5);

        //Detects the selection of the button
        buttonNew.on('pointerover', () => {
            buttonNew.setScale(scale*1.1);
            textNew.setScale(1.1);
        });
        buttonContinue.on('pointerover', () => {
            buttonContinue.setScale(scale*1.1);
            textContinue.setScale(1.1);
        });
        buttonSettings.on('pointerover', () => {
            buttonSettings.setScale(scale*1.1);
            textSettings.setScale(1.1);
        });
        buttonTutorial.on('pointerover', () => {
            buttonTutorial.setScale(scale*1.1);
            textTutorial.setScale(1.1);
        });

        //Detects the deselection of the button
        buttonNew.on('pointerout', () => {
            buttonNew.setScale(scale);
            textNew.setScale(1);
        });
        buttonContinue.on('pointerout', () => {
            buttonContinue.setScale(scale);
            textContinue.setScale(1);
        });
        buttonSettings.on('pointerout', () => {
            buttonSettings.setScale(scale);
            textSettings.setScale(1);
        });
        buttonTutorial.on('pointerout', () => {
            buttonTutorial.setScale(scale);
            textTutorial.setScale(1);
        });

        //Button pressed
        buttonNew.on('pointerdown', async() => {

            if (!gameConfig.id_jugador) {
                alert('Debes iniciar sesión primero');
                return; // stops the function here
            }

            if(gameConfig.id_partida) {
                await finishPartida(gameConfig.id_partida);
            }
            
            gameConfig.id_partida = await createPartida(gameConfig.id_jugador);
            
            this.cameras.main.fadeOut(2000);
            this.tweens.add({
                targets: this.menuMusic,
                volume: 0,
                duration: 2000,
                onComplete: () => {
                    this.scene.start('Introduction');  //Changes to this scene
                    this.menuMusic.stop();
                }
            });
        });

        buttonContinue.on('pointerdown', async() => {
            const data = await continuarPartida(gameConfig.id_jugador);

            if (!data.found) {
                alert("No hay partida guardada");
                return;
            }

            gameConfig.id_partida = data.partida.id_partida;
            gameConfig.actualLevel = data.partida.niveles_completados + 1;

            this.cameras.main.fadeOut(1000);

            this.tweens.add({
            targets: this.menuMusic,
            volume: 0,
            duration: 1000,
            onComplete: () => {
                this.scene.start('Introduction'); // or GameScene
                this.menuMusic.stop();
            }
            });
        });

        buttonSettings.on('pointerdown', () => {
            this.scene.start('Settings');
        });
        buttonTutorial.on('pointerdown', () => {
            //this.scene.start('Introduction')
            //this.menuMusic.stop();
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

class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }

    preload() {
        //this.load.image('backgroundIntro', '../assets/Fondos/backIntro.png');
        this.load.image('buttonReturnMenu', '../Videojuego/assets/sprites/botones/botonLargoOver.png');
        this.load.font('myTextFont', '../Videojuego/assets/fuentesLetra/WakeboardStudio.ttf');
    }

    create () {
        this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/2, 'Aqui van settings').setOrigin(0.5);

        const scale = 1/5;
        const button = this.add.image(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2, 'buttonReturnMenu').setInteractive();
        
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
        const textReturn = this.add.text(gameConfig.canvasWidth/2, gameConfig.canvasHeight/1.2-scale*gameConfig.canvasHeight/20, 'Regresar', textButton).setOrigin(0.5);

        //Detects the selection of the button
        button.on('pointerover', () => {
            button.setScale(scale*1.1);
            textReturn.setScale(1.1);
        });

        //Detects the deselection of the button
        button.on('pointerout', () => {
            button.setScale(scale);
            textReturn.setScale(1);
        });

        //Button pressed
        button.on('pointerdown', () => {
            this.scene.start('MainMenu');   //Changes to this scene
        });
    }
}