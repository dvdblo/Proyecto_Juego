/*
 * Sript that contains the global variables for the game, and some global fucntions
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 * 
 * Use of AI: AI was used to know how to achieve the full screen.
 */

//Canvas base dimensions
let cWidth = 1400;
let cHeight = 600;

// Global game configuration object
const gameConfig = {
  canvasWidth: cWidth, 
  canvasHeight: cHeight,
  levelSize: 4,
  levelLenght: cWidth*4,
  unit: cWidth/28,
  playerSpeed: 0.5,
  enemySpeed: 0.1,
  levelComplete: false,
  levelOver1: false,
  levelOver2: false,
  score: 0,
  lives: 3,
  maxlives: 6,
  enemiesKilled: 0,
  elapsedTime: 0,
  actualLevel: 1,
  actualDiff : 1,
  gameLoad: false,
  letPause: false,
  pause: false,
  totalScore: 0,
  musicVolume: 0.5,
  id_jugador: null,
  id_partida: null
};

// Dictionary for the keys that will control player movement
const keyDirections = {
    w: 'up',
    a: 'left',
    d: 'right',
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Space: 'up',
};

// Sprite sheet source coordinates for each platform type
const IMG = {
    p1: {xIMG: 1399, yIMG: 893},
    p2: {xIMG: 1024, yIMG: 450},
    p3: {xIMG: 1229, yIMG: 245},
    p4: {xIMG: 2048, yIMG: 230},
    p5: {xIMG: 659, yIMG: 1799},
    p6: {xIMG: 445, yIMG: 442},
    p7: {xIMG: 1229, yIMG: 245}
};

// Data structure with the directions a character can move, the
// direction sign and the related animation.
function createPlayerMotion() {
    return {
        up: {
            status: false,
            axis: "y",
            sign: -1,
            repeat: true,
            duration: 100,
            moveFrames: [0, 2],
            idleFrames: [1, 1],
        },
        left: {
            status: false,
            axis: "x",
            sign: -1,
            repeat: true,
            duration: 100,
            moveFrames: [9, 11],
            idleFrames: [10, 10],
        },
        right: {
            status: false,
            axis: "x",
            sign: 1,
            repeat: true,
            duration: 100,
            moveFrames: [3, 5],
            idleFrames: [4, 4],
        },
    };
}

//Pause Menu (it is with TAB and not with ESC, so there are no problems with the auto assignation of ESC for go out of the full screen)
document.addEventListener('keydown', (event) => {
            //For "Tab" (pause)
            if (event.key === "Tab") {
                event.preventDefault();
                gameConfig.pause = !gameConfig.pause;
            }
});

//Full Screen
window.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            container.requestFullscreen(); //Enter fullscreen
        } else {
            document.exitFullscreen(); //Exit fullscreen
        }
    }
});

//Resizes the canvas and updates Phasers renderer
window.setResolution = function (width, height) {
  gameConfig.canvasWidth = width;
  gameConfig.canvasHeight = height;

//Apply new size to the Phaser game instance
  game.scale.resize(width, height);

};

//Function to obtain the position in Y automaticaly for elements
//AI was used to obtain the formula
function hei(i, n, pInitial, pFinal) {
            const posInitial = gameConfig.canvasHeight/pInitial;
            const posFinal = gameConfig.canvasHeight/pFinal;
            const paso = (posFinal - posInitial) / (n - 1);
            return posInitial + paso * i;
        }