const config = {
  type: Phaser.CANVAS,
  width: gameConfig.canvasWidth,
  height: gameConfig.canvasHeight,
  backgroundColor: '#222',
  parent: 'game-container',
  scene: [MainMenu, LoadingGame, Level_1, WinLevelScreen, GameOver1Screen]
};

const game = new Phaser.Game(config);

const container = document.getElementById('game-container');

container.style.width = gameConfig.canvasWidth + 'px';
container.style.height = gameConfig.canvasHeight + 'px';
container.style.position = 'absolute';
container.style.left = '50%';
container.style.top = '50%';
container.style.transform = 'translate(-50%, -50%)';