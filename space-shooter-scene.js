import Phaser from 'phaser';

export class SpaceShooterScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SpaceShooterScene' });
  }

  preload() {
    this.createStarfield();
    this.createPlayerShip();
    this.createEnemyShip();
    this.createBullet();
    this.createSoundEffects();
  }

  createStarfield() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x0a0a1a, 1);
    graphics.fillRect(0, 0, 800, 600);
    
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 1);
      graphics.fillStyle(0xffffff, alpha);
      graphics.fillCircle(x, y, size);
    }
    
    graphics.generateTexture('starfield', 800, 600);
  }

  createPlayerShip() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.beginPath();
    graphics.moveTo(15, 0);
    graphics.lineTo(30, 25);
    graphics.lineTo(22, 25);
    graphics.lineTo(22, 35);
    graphics.lineTo(8, 35);
    graphics.lineTo(8, 25);
    graphics.lineTo(0, 25);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0x4a90d9, 1);
    graphics.beginPath();
    graphics.moveTo(15, 5);
    graphics.lineTo(25, 22);
    graphics.lineTo(15, 22);
    graphics.lineTo(5, 22);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0xff6b6b, 1);
    graphics.fillCircle(8, 30, 3);
    graphics.fillCircle(22, 30, 3);
    
    graphics.fillStyle(0xffff00, 0.6);
    graphics.fillRect(13, 5, 4, 12);
    
    graphics.generateTexture('player', 30, 40);
  }

  createEnemyShip() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(0x2d132c, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(30, 0);
    graphics.lineTo(25, 15);
    graphics.lineTo(30, 35);
    graphics.lineTo(0, 35);
    graphics.lineTo(5, 15);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0xe94560, 1);
    graphics.beginPath();
    graphics.moveTo(5, 5);
    graphics.lineTo(25, 5);
    graphics.lineTo(22, 18);
    graphics.lineTo(8, 18);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0xff6b9d, 0.8);
    graphics.fillCircle(15, 10, 4);
    
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(5, 20, 6, 12);
    graphics.fillRect(19, 20, 6, 12);
    
    graphics.generateTexture('enemy', 30, 40);
  }

  createBullet() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(0xffcc00, 1);
    graphics.fillEllipse(4, 8, 6, 14);
    
    graphics.fillStyle(0xff6600, 1);
    graphics.fillCircle(4, 6, 3);
    
    graphics.fillStyle(0xffffcc, 0.8);
    graphics.fillRect(3, 3, 2, 6);
    
    graphics.generateTexture('bullet', 8, 14);
  }

  createSoundEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.shootSound = this.createSound(audioContext, 'shoot');
    this.explosionSound = this.createSound(audioContext, 'explosion');
    this.hitSound = this.createSound(audioContext, 'hit');
    this.gameOverSound = this.createSound(audioContext, 'gameover');
  }

  createSound(audioContext, type) {
    return {
      play: () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
          case 'shoot':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
          case 'explosion':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
          case 'hit':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
            
          case 'gameover':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1);
            gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
            break;
        }
      }
    };
  }

  create() {
    this.createBackground();
    
    this.player = this.physics.add.sprite(400, 550, 'player');
    this.player.setCollideWorldBounds(true);
    
    this.bullets = this.add.group();
    this.enemies = this.add.group();

    this.score = 0;
    this.lives = 3;
    this.lastFired = 0;
    this.isGameOver = false;

    this.createUI();
    this.setupInputs();
    this.spawnEnemies();
    this.setupCollisions();
    this.enableMouseControl();
    this.createEngineGlow();
  }

  createBackground() {
    this.background = this.add.tileSprite(400, 300, 800, 600, 'starfield');
    this.background.setScrollFactor(0.5);
  }

  createEngineGlow() {
    this.engineGlow = this.add.circle(this.player.x, this.player.y + 10, 8, 0x4a90d9, 0.6);
    this.engineGlow.setScrollFactor(0);
  }

  createUI() {
    const panel = this.add.graphics();
    panel.fillStyle(0x0a0a1a, 0.8);
    panel.fillRect(10, 10, 200, 70);
    panel.lineStyle(2, 0x4a90d9, 1);
    panel.strokeRect(10, 10, 200, 70);
    
    this.scoreText = this.add.text(25, 22, 'Score', {
      fontSize: '12px',
      fill: '#80e9ff',
      fontStyle: 'italic'
    });
    
    this.scoreValue = this.add.text(25, 35, '0', {
      fontSize: '28px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    
    this.livesText = this.add.text(25, 60, '♥♥♥', {
      fontSize: '20px',
      fill: '#ff6b6b'
    });
  }

  setupInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fire: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  enableMouseControl() {
    this.mouseControlEnabled = true;
    this.mouseTargetX = this.player.x;
    this.mouseTargetY = this.player.y;
    this.mouseMoveSpeed = 250;
    this.input.on('pointermove', this.handleMouseMovement, this);
    this.input.on('pointerdown', this.handleMouseClick, this);
  }

  handleMouseMovement(pointer) {
    if (!this.mouseControlEnabled || this.isGameOver) return;
    this.mouseTargetX = pointer.x;
    this.mouseTargetY = pointer.y;
  }

  handleMouseClick(pointer) {
    if (this.isGameOver) return;
    this.fireBullet();
  }

  spawnEnemies() {
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  spawnEnemy() {
    if (this.isGameOver) return;

    const x = Phaser.Math.Between(30, 770);
    const enemy = this.physics.add.sprite(x, 0, 'enemy');
    enemy.setVelocityY(Phaser.Math.Between(100, 200));
    this.enemies.add(enemy);
  }

  setupCollisions() {
    this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
  }

  destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    this.scoreValue.setText(this.score.toString());
    this.explosionSound.play();
  }

  playerHit(player, enemy) {
    enemy.destroy();
    this.hitSound.play();
    this.loseLife();
  }

  loseLife() {
    this.lives--;
    let hearts = '';
    for (let i = 0; i < this.lives; i++) {
      hearts += '♥';
    }
    this.livesText.setText(hearts);

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  update(time, delta) {
    if (this.isGameOver) return;

    this.background.tilePositionY += 0.5;
    
    if (this.engineGlow) {
      this.engineGlow.x = this.player.x;
      this.engineGlow.y = this.player.y + 10;
      this.engineGlow.alpha = 0.4 + Math.sin(time / 200) * 0.2;
    }
    
    this.handlePlayerMovement();
    this.handleShooting(time);
    this.checkEnemiesAtBottom();
  }

  handlePlayerMovement() {
    const speed = 200;

    if (this.mouseControlEnabled) {
      const dx = this.mouseTargetX - this.player.x;
      const dy = this.mouseTargetY - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        const moveSpeed = Math.min(distance, this.mouseMoveSpeed);
        const ratio = moveSpeed / distance;
        this.player.x += dx * ratio;
        this.player.y += dy * ratio;
        this.player.setVelocity(0, 0);
      }
    } else {
      if (this.cursors.left.isDown || this.wasd.left.isDown) {
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
        this.player.setVelocityX(speed);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursors.up.isDown || this.wasd.up.isDown) {
        this.player.setVelocityY(-speed);
      } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
        this.player.setVelocityY(speed);
      } else {
        this.player.setVelocityY(0);
      }
    }
  }

  fireBullet() {
    const bullet = this.physics.add.sprite(this.player.x, this.player.y - 20, 'bullet');
    bullet.setVelocityY(-400);
    this.bullets.add(bullet);
    this.shootSound.play();
  }

  handleShooting(time) {
    if (this.cursors.space.isDown || this.wasd.fire.isDown) {
      if (time > this.lastFired) {
        this.fireBullet();
        this.lastFired = time + 200;
      }
    }
  }

  checkEnemiesAtBottom() {
     this.enemies.children.iterate((enemy) => {
       if (enemy && enemy.y > 635) {
         enemy.destroy();
         this.hitSound.play();
         this.loseLife();
       }
     });
   }

  gameOver() {
    this.isGameOver = true;

    this.physics.pause();
    this.player.setVisible(false);
    
    if (this.engineGlow) {
      this.engineGlow.destroy();
    }

    this.enemies.children.iterate((enemy) => {
      if (enemy) enemy.destroy();
    });

    this.bullets.children.iterate((bullet) => {
      if (bullet) bullet.destroy();
    });

    this.gameOverSound.play();
    this.createGameOverScreen();
  }

  createGameOverScreen() {
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x0a0a1a, 0.9);
    
    const panel = this.add.graphics();
    panel.fillStyle(0x1a1a2e, 1);
    panel.fillRect(200, 150, 400, 300);
    panel.lineStyle(3, 0x4a90d9, 1);
    panel.strokeRect(200, 150, 400, 300);
    
    const gameOverText = this.add.text(400, 200, 'GAME OVER', {
      fontSize: '42px',
      fill: '#ff6b6b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    gameOverText.setStroke('#000000', 4);
    
    const scoreLabel = this.add.text(400, 260, 'Final Score', {
      fontSize: '16px',
      fill: '#80e9ff',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    const finalScoreText = this.add.text(400, 285, this.score.toString(), {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const buttonBg = this.add.rectangle(400, 360, 200, 50, 0x4a90d9);
    this.restartButton = this.add.text(400, 360, 'RESTART', {
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    
    buttonBg.setInteractive({ useHandCursor: true });
    
    this.restartButton.on('pointerover', () => {
      buttonBg.setTint(0x6ab0f0);
    });
    
    this.restartButton.on('pointerout', () => {
      buttonBg.clearTint();
    });
    
    this.restartButton.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}
