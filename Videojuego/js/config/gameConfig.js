let cWidth = 1400;
let cHeight = 600;

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
  elapsedTime: 0,
  actualLevel: 1,
  actualDiff : 1,
  gameLoad: false,
  letPause: false,
  pause: false,
  totalScore: 0,
  musicVolume: 0
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
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

window.setResolution = function (width, height) {
  // 1. Actualizas config
  gameConfig.canvasWidth = width;
  gameConfig.canvasHeight = height;

  // 2. Phaser (acceso global al juego)
  game.scale.resize(width, height);

};