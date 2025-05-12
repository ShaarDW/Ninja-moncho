import HelloWorldScene from "./scenes/HelloWorldScene.js";
import EndScene from "./scenes/EndScene.js";



const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
  scene: [HelloWorldScene, EndScene], // Registrar las escenas
};

const game = new Phaser.Game(config);

