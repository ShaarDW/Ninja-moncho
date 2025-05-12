export default class EndScene extends Phaser.Scene {
    constructor() {
      super("end-scene"); // Clave de la escena
    }
  
    init(data) {
      // Recibir el estado del juego y el puntaje
      this.status = data.status; // "win" o "lose"
      this.finalScore = data.score || 0;
    }
  
    create() {
      // Mostrar el mensaje según el estado del juego
      const message = this.status === "win" ? "¡Ganaste!" : "¡Perdiste!";
      const color = this.status === "win" ? "#00ff00" : "#ff0000";
  
      this.add.text(400, 200, message, {
        fontSize: "64px",
        fill: color,
      }).setOrigin(0.5);
  
      // Mostrar el puntaje final
      this.add.text(400, 300, `Puntaje Final: ${this.finalScore}`, {
        fontSize: "32px",
        fill: "#ffffff",
      }).setOrigin(0.5);
  
      // Instrucción para reiniciar el juego
      this.add.text(400, 400, "Presiona ESPACIO para reiniciar", {
        fontSize: "24px",
        fill: "#ffffff",
      }).setOrigin(0.5);
  
      // Detectar la tecla para reiniciar el juego
      this.input.keyboard.once("keydown-SPACE", () => {
        this.scene.start("hello-world"); // Volver a la escena principal
      });
    }
  }