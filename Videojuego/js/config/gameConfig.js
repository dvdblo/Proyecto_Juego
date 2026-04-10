

const gameConfig = {
  canvasWidth: 1400,
  canvasHeight: 600,
  levelLenght: 1400*3,
  unit: 1400 / 28,
  playerSpeed: 0.5,
  enemySpeed: 0.1,
  levelComplete: false,
  levelOver1: false
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
const playerMotion = {
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