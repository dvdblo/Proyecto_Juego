/*
 * Sript to initialize the game, and control the scenes
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 * 
 * Use of AI: AI was used to learn how to use the scenes in Phaser, and to learn how to configurate them.
 *            We also used video tutorials from YouTube and official documentation.
 */

//Config for the Phaser scenes tool
const config = {
  type: Phaser.CANVAS,
  width: gameConfig.canvasWidth,
  height: gameConfig.canvasHeight,
  backgroundColor: '#4e4751',
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MainMenu, Settings, PauseMenu, Introduction, LoadingGame1, LoadingGame2, LoadingGame3, Level, WinLevelScreen1, WinLevelScreen2, WinLevelScreen3, GoodEnding, GameOver1Screen, BadEnding1, GameOver2Screen, BadEnding2]
};

//Starts a Phaser game
const game = new Phaser.Game(config);
window.game = game;

//To modify the properties of the html container for the game
const container = document.getElementById('game-container');

container.style.width = gameConfig.canvasWidth + 'px';
container.style.height = gameConfig.canvasHeight + 'px';
container.style.position = 'absolute';
container.style.left = '50%';
container.style.top = '50%';
container.style.transform = 'translate(-50%, -50%)';