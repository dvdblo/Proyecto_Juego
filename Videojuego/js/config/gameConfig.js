

const gameConfig = {
  canvasWidth: 1400,
  canvasHeight: 600,
  levelSize: 4,
  levelLenght: 1400*4,
  unit: 50,
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