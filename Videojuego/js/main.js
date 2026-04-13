const config = {
  type: Phaser.CANVAS,
  width: gameConfig.canvasWidth,
  height: gameConfig.canvasHeight,
  backgroundColor: '#43005e',
  parent: 'game-container',
  scene: [MainMenu, Introduction, LoadingGame, Level_1, WinLevelScreen1, WinLevelScreen2, WinLevelScreen3, GoodEnding, GameOver1Screen, BadEnding1, GameOver2Screen, BadEnding2]
};

const game = new Phaser.Game(config);

const container = document.getElementById('game-container');

container.style.width = gameConfig.canvasWidth + 'px';
container.style.height = gameConfig.canvasHeight + 'px';
container.style.position = 'absolute';
container.style.left = '50%';
container.style.top = '50%';
container.style.transform = 'translate(-50%, -50%)';