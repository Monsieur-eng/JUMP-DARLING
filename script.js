class UndertaleRunner {
  constructor() {
    this.gameArea = document.getElementById("gameArea")
    this.character = document.getElementById("character")
    this.scoreElement = document.getElementById("score")
    this.gameOverElement = document.getElementById("gameOver")
    this.finalScoreElement = document.getElementById("finalScore")
    this.jumpBtn = document.getElementById("jumpBtn")
    this.restartBtn = document.getElementById("restartBtn")

    this.isJumping = false
    this.isGameRunning = false
    this.score = 0
    this.obstacles = []
    this.gameSpeed = 3000 // Vitesse d'apparition des obstacles (ms)
    this.obstacleSpeed = 3 // Vitesse de déplacement des obstacles (s)

    this.loveMessages = [
      "Je vous aime",
      "Je t'aime",
      "Love you",
      "♥ LOVE ♥",
      "Mon amour",
      "Ti amo",
      "Te amo",
      "Ich liebe dich",
    ]

    this.init()
  }

  init() {
    this.bindEvents()
    this.startGame()
  }

  bindEvents() {
    // Contrôles clavier
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        this.jump()
      }
    })

    // Contrôles bouton
    this.jumpBtn.addEventListener("click", () => {
      this.jump()
    })

    // Bouton restart
    this.restartBtn.addEventListener("click", () => {
      this.restartGame()
    })
  }

  jump() {
    if (!this.isJumping && this.isGameRunning) {
      this.isJumping = true
      this.character.classList.add("jumping")

      // Son de saut (simulation)
      this.playJumpSound()

      setTimeout(() => {
        this.character.classList.remove("jumping")
        this.isJumping = false
      }, 600)
    }
  }

  playJumpSound() {
    // Simulation d'un son de saut avec une vibration sur mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  createObstacle() {
    if (!this.isGameRunning) return

    const obstacle = document.createElement("div")
    obstacle.className = "obstacle"
    obstacle.textContent = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)]
    obstacle.style.animationDuration = `${this.obstacleSpeed}s`

    this.gameArea.appendChild(obstacle)
    this.obstacles.push(obstacle)

    // Supprimer l'obstacle après animation
    setTimeout(() => {
      if (obstacle.parentNode) {
        obstacle.parentNode.removeChild(obstacle)
        this.obstacles = this.obstacles.filter((obs) => obs !== obstacle)
      }
    }, this.obstacleSpeed * 1000)

    // Vérifier les collisions
    this.checkCollisions(obstacle)
  }

  checkCollisions(obstacle) {
    const collisionInterval = setInterval(() => {
      if (!this.isGameRunning || !obstacle.parentNode) {
        clearInterval(collisionInterval)
        return
      }

      const characterRect = this.character.getBoundingClientRect()
      const obstacleRect = obstacle.getBoundingClientRect()

      // Vérifier la collision
      if (
        characterRect.left < obstacleRect.right &&
        characterRect.right > obstacleRect.left &&
        characterRect.bottom > obstacleRect.top &&
        characterRect.top < obstacleRect.bottom
      ) {
        this.gameOver()
        clearInterval(collisionInterval)
      }
    }, 10)
  }

  updateScore() {
    if (!this.isGameRunning) return

    this.score += 10
    this.scoreElement.textContent = this.score

    // Augmenter la difficulté
    if (this.score % 100 === 0 && this.gameSpeed > 1000) {
      this.gameSpeed -= 100
      this.obstacleSpeed -= 0.1
    }
  }

  startGame() {
    this.isGameRunning = true
    this.score = 0
    this.scoreElement.textContent = this.score
    this.gameOverElement.classList.remove("show")

    // Créer des obstacles
    this.obstacleInterval = setInterval(() => {
      this.createObstacle()
    }, this.gameSpeed)

    // Mettre à jour le score
    this.scoreInterval = setInterval(() => {
      this.updateScore()
    }, 500)
  }

  gameOver() {
    this.isGameRunning = false

    // Arrêter les intervalles
    clearInterval(this.obstacleInterval)
    clearInterval(this.scoreInterval)

    // Supprimer tous les obstacles
    this.obstacles.forEach((obstacle) => {
      if (obstacle.parentNode) {
        obstacle.parentNode.removeChild(obstacle)
      }
    })
    this.obstacles = []

    // Afficher l'écran de game over
    this.finalScoreElement.textContent = this.score
    this.gameOverElement.classList.add("show")

    // Effet de vibration
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
  }

  restartGame() {
    // Réinitialiser les valeurs
    this.gameSpeed = 3000
    this.obstacleSpeed = 3
    this.isJumping = false

    // Supprimer la classe jumping si elle existe
    this.character.classList.remove("jumping")

    // Redémarrer le jeu
    this.startGame()
  }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener("DOMContentLoaded", () => {
  new UndertaleRunner()
})

// Empêcher le défilement avec la barre d'espace
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault()
  }
})