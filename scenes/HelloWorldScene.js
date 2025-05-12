// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

//------------------------------------------INIT-------------------------------------------------------------//

  init() {
    // this is called before the scene is created
    // init variables
    // variable game over
    this.gameOver = false;
    // variable score
    this.score = 0;
    //variable para el kunai
    this.kunai = null;
    //variable para saber si esta sobre una plataforma
    this.isOnPlatform = false;
    //array para guardar las formas agarradas
    this.FormasAgarradas = [];
    // take data passed from other scenes
    // data object param {}
  }

//------------------------------------------PRELOAD-------------------------------------------------------------//

  preload() {
    // load assets
    this.load.image ("cielo", "public/assets/cielo.webp");
    this.load.image ("Ninja", "public/assets/Ninja.png");
    this.load.image ("platform", "public/assets/platform.png");
    this.load.image ("square", "public/assets/square.png");
    this.load.image ("diamond", "public/assets/diamond.png");
    this.load.image ("triangle", "public/assets/triangle.png");
    this.load.image ("kunai", "public/assets/kunai.webp");
  }

//------------------------------------------CREATE-------------------------------------------------------------//

  create() {
    // create game objects
    

    this.add.image(0, 0, "cielo")  .setOrigin(0, 0)  .setScale(2); 

    this.platforms = this.physics.add.staticGroup(); //crear grupo de plataformas estaticas

    this.platforms.create(400, 568, "platform").setScale(2).refreshBody();

    // this.platforms.create(600, 400, "platform");
    this.platforms.create(0, 380, "platform");
    this.platforms.create(750, 380, "platform");
    
   this.jugador = this.physics.add.sprite(400, 450, "Ninja").setScale(0.1);
    this.jugador.setCollideWorldBounds(true); // no salir de la pantalla
  
    this.physics.add.collider(this.jugador, this.platforms, () => {
      this.isOnPlatform = true; // El ninja está en contacto con las plataformas
    }, null, this); // colision entre el jugador y las plataformas
    this.cursors = this.input.keyboard.createCursorKeys(); // crear las teclas de movimiento

    //contador de puntos
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#000",
    });
    
    //contador
    this.initialTime = 30;
    this.timeText = this.add.text(
      this.cameras.main.width - 16, 16,
      `Tiempo: ${this.initialTime}`,
      {
        fontSize: '32px',
        fill: '#000'
      }
    ).setOrigin(1, 0);

    //time event para el contador
    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.contador,
      callbackScope: this,
      loop: true 
    });

    //time event para el spawn de objetos geometricos
    this.time.addEvent({
      delay: 500,
      callback: this.spawnObjGeometrico,
      callbackScope: this,
      loop: true
    });
    this.geometricos = this.physics.add.group();

   

    // Temporizador para spawnear el kunai
    this.time.addEvent({
    delay: 1500, // 1,5 segundos
    callback: this.spawnKunai,
    callbackScope: this,
    loop: true,
    });
  }

//------------------------------------------UPDATE-------------------------------------------------------------//

  update() {
    // update game objects
    //movimiento del jugador
    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(300);
    } else {
      this.jugador.setVelocityX(0);
    } 
    //salto del jugador
    if (this.cursors.up.isDown && this.isOnPlatform) {
      this.jugador.setVelocityY(-390);
    }
    //verificar si el jugador esta en contacto con la plataforma
    if (!this.jugador.body.touching.down) {
      this.isOnPlatform = false;
    }
    //el personaje gira como animacion
    if (this.jugador.body.velocity.x < 0) {
      this.jugador.angle -= 9;
    } else if (this.jugador.body.velocity.x > 0) {
      this.jugador.angle += 9;
    } else {
      this.jugador.angle = 0;
    }
    
    this.WinGame(); // llamar a la funcion para ganar el juego
    this.LoseGame(); // llamar a la funcion para perder el juego


  }

//------------------------------------------FUNCIONES-------------------------------------------------------------//

  // funcion para el contador de tiempo
  contador() {
    if (!this.gameOver) {
      this.initialTime -= 1;
      this.timeText.setText('Tiempo: ' + this.initialTime);
      }
    }

  // funcion para spawnear objetos geometricos  
  spawnObjGeometrico() {
    if (!this.gameOver) {
      const objetos = ["square", "triangle", "diamond"];
      const spriteKey = objetos[Math.floor(Math.random() * objetos.length)];
      const x = Phaser.Math.Between(50, 750); // Posición inicial aleatoria en X
      const y = 0;

      const valores = {
        triangle: 7,
        diamond: 4,
        square: 3
      };

      // Crear el objeto geométrico
      const obj = this.physics.add.sprite(x, y, spriteKey).setScale(0.5);

      // Asignar color según el tipo de figura
      if (spriteKey === "square") {
        obj.setTint(0xff0000); // rojo
      } else if (spriteKey === "triangle") {
        obj.setTint(0x00ff00); // verde
      } else if (spriteKey === "diamond") {
        obj.setTint(0x0000ff); // azul
      }

      // Asignar velocidad horizontal y vertical
      obj.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(100, 300)); // Velocidad en X e Y

      // Guardar los puntos en los datos del objeto
      obj.setData('puntos', valores[spriteKey]);

      // Agregar el objeto al grupo
      this.geometricos.add(obj);

      // Colisión con plataformas
      this.physics.add.collider(obj, this.platforms, (objetoGeometrico, plataformas) => {
        let puntos = objetoGeometrico.getData('puntos');
        
        // Reducir puntos
        puntos--;
        objetoGeometrico.setData('puntos', puntos);

        // Destruir el objeto si los puntos llegan a 0
        if (puntos <= 0) {
          objetoGeometrico.destroy();
        }
      }, null, this);

        // Configurar rebote y colisiones
        obj.setBounce(Phaser.Math.FloatBetween(0.5, 1)); // Rebote aleatorio entre 0.5 y 1
        obj.setCollideWorldBounds(true); // Que no se salga de la pantalla
        obj.setVelocityX(Phaser.Math.Between(-200, 200)); // Velocidad horizontal aleatoria 

      // Colisión con el jugador
      this.physics.add.overlap(this.jugador, obj, () => {
        if (obj.active) {
          const spriteKey = obj.texture.key; //obtener el tipo de forma
          // Agregar la forma al array de formas agarradas
          this.FormasAgarradas.push(spriteKey);
          const puntosGanados = obj.getData('puntos');
          this.score += puntosGanados;
          this.scoreText.setText('Puntos: ' + this.score);
          obj.destroy();
        }
      }, null, this);
    }
  }
    //crear un kunai que este rebotando por la pantalla
    spawnKunai() {
      if (!this.gameOver && !this.kunai) {
        const x = Phaser.Math.Between(50, 750); // Posición inicial aleatoria en X
        const y = 0;
    
        // Crear el kunai como un sprite dinámico
        this.kunai = this.physics.add.sprite(x, y, "kunai").setScale(0.12);
        // que el kunai este dando vueltas sobre si mismo constantemente
        this.kunai.setAngularVelocity(800); // Velocidad angular constante
        // Asignar velocidad horizontal y vertical aleatoria
        this.kunai.setVelocity(Phaser.Math.Between(-400, 400), Phaser.Math.Between(200, 400)); // Velocidad en X e Y
    
        // Configurar rebote y colisiones
        this.kunai.setBounce(1); // Rebote completo
        this.kunai.setCollideWorldBounds(true); // Que no se salga de la pantalla
    
        // Colisión con plataformas
        this.physics.add.collider(this.kunai, this.platforms);
    
        // Colisión con el jugador
        this.physics.add.overlap(this.jugador, this.kunai, () => {
          if (this.kunai.active) {
            this.score -= 5; // Restar puntos al jugador
            this.scoreText.setText('Puntos: ' + this.score);
            this.kunai.destroy(); // Destruir el kunai
            this.kunai = null; // Reiniciar la variable para permitir que aparezca otro
          }
        }, null, this);
      }
    }
  //cuando llega a 100 puntos, se acaba el juego
  WinGame() {
    // Contar cuántas veces se recolectó cada forma
    const RecuentoFormas = {
      square: this.FormasAgarradas.filter(shape => shape === "square").length,
      triangle: this.FormasAgarradas.filter(shape => shape === "triangle").length,
      diamond: this.FormasAgarradas.filter(shape => shape === "diamond").length,
    };
  
    // Verificar si hay al menos dos de cada tipo
    const RecolectoSuficientesFormas = Object.values(RecuentoFormas).every(cantidad => cantidad >= 2);
  
    if (this.score >= 100) {
      this.gameOver = true;
      this.physics.pause();
  
      if (RecolectoSuficientesFormas) {
        // Pasar a la escena de fin con estado "win"
        this.scene.start("end-scene", { status: "win", score: this.score });
      } else {
        // Pasar a la escena de fin con estado "lose"
        this.scene.start("end-scene", { status: "lose", score: this.score });
      }
    }
  }

  LoseGame() {
    if (this.initialTime <= 0) {
      this.gameOver = true;
      this.physics.pause();
      this.scene.start("end-scene", { status: "lose", score: this.score });
    }
  }
}



