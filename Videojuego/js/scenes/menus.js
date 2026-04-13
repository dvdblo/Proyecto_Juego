
//MENUS------------------------------------------------------------------------------------------------------------
class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    //Loads images and fonts to use in the menu
    preload() {
        this.load.image('backgroundMenu', '../assets/Fondos/backMenu2.png');
        this.load.image('botonkey', '../assets/sprites/botones/botonLargo.png');
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