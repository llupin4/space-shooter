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
    this.createEnemyTexture('enemy1', 0x2d132c, 0xe94560, 0xff6b9d);
    this.createEnemyTexture('enemy2', 0x1a3a5c, 0x4a90d9, 0x80e9ff);
    this.createEnemyTexture('enemy3', 0x3d1f1f, 0xc92a2a, 0xff6b6b);
    this.createEnemyTexture('enemy4', 0x2d3d1f, 0x4a904a, 0x80e980);
    this.createEnemyTexture('enemy5', 0x3d1f3d, 0xc92a80, 0xff6b9d);
    this.createTriangleEnemy('enemyTri1', 0x1a4a2e, 0x4a904a);
    this.createTriangleEnemy('enemyTri2', 0x4a2e1a, 0x904a4a);
    this.createCylinderEnemy('enemyCyl1', 0x2e1a4a, 0x4a4a90);
    this.createCylinderEnemy('enemyCyl2', 0x1a2e4a, 0x4a904a);
    this.createMultiAngledEnemy('enemyMulti1', 0x4a1a2e, 0x904a4a);
    this.createMultiAngledEnemy('enemyMulti2', 0x2e4a1a, 0x4a904a);
  }
  
  createEnemyTexture(name, hullColor, cockpitColor, glowColor) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(hullColor, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(30, 0);
    graphics.lineTo(25, 15);
    graphics.lineTo(30, 35);
    graphics.lineTo(0, 35);
    graphics.lineTo(5, 15);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(cockpitColor, 1);
    graphics.beginPath();
    graphics.moveTo(5, 5);
    graphics.lineTo(25, 5);
    graphics.lineTo(22, 18);
    graphics.lineTo(8, 18);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(glowColor, 0.8);
    graphics.fillCircle(15, 10, 4);
    
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(5, 20, 6, 12);
    graphics.fillRect(19, 20, 6, 12);
    
    graphics.generateTexture(name, 30, 40);
  }
  
  createTriangleEnemy(name, hullColor, glowColor) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(hullColor, 1);
    graphics.beginPath();
    graphics.moveTo(15, 0);
    graphics.lineTo(30, 35);
    graphics.lineTo(0, 35);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(glowColor, 1);
    graphics.beginPath();
    graphics.moveTo(15, 8);
    graphics.lineTo(22, 28);
    graphics.lineTo(8, 28);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0xffff00, 0.8);
    graphics.fillCircle(15, 20, 5);
    
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(8, 30, 4, 5);
    graphics.fillRect(18, 30, 4, 5);
    
    graphics.generateTexture(name, 30, 40);
  }
  
  createCylinderEnemy(name, hullColor, glowColor) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(hullColor, 1);
    graphics.fillRect(8, 0, 14, 40);
    
    graphics.fillStyle(glowColor, 1);
    graphics.fillCircle(15, 10, 6);
    graphics.fillCircle(15, 30, 6);
    
    graphics.fillStyle(0xffff00, 0.8);
    graphics.fillRect(12, 12, 6, 16);
    
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(6, 35, 4, 5);
    graphics.fillRect(20, 35, 4, 5);
    
    graphics.generateTexture(name, 30, 40);
  }
  
  createMultiAngledEnemy(name, hullColor, glowColor) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    graphics.fillStyle(hullColor, 1);
    graphics.beginPath();
    graphics.moveTo(15, 0);
    graphics.lineTo(28, 8);
    graphics.lineTo(30, 20);
    graphics.lineTo(22, 30);
    graphics.lineTo(25, 38);
    graphics.lineTo(15, 35);
    graphics.lineTo(5, 38);
    graphics.lineTo(8, 30);
    graphics.lineTo(0, 20);
    graphics.lineTo(2, 8);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(glowColor, 1);
    graphics.beginPath();
    graphics.moveTo(15, 5);
    graphics.lineTo(20, 12);
    graphics.lineTo(18, 22);
    graphics.lineTo(12, 22);
    graphics.lineTo(10, 12);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0xffff00, 0.8);
    graphics.fillCircle(15, 15, 4);
    
    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(12, 32, 3, 3);
    graphics.fillRect(15, 35, 3, 3);
    graphics.fillRect(18, 32, 3, 3);
    
    graphics.generateTexture(name, 30, 40);
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
    this.waveJingleSound = this.createSound(audioContext, 'wavejingle');
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
            
          case 'wavejingle':
            const jingleFrequencies = [523, 659, 784, 1047];
            jingleFrequencies.forEach((freq, index) => {
              const jingleOsc = audioContext.createOscillator();
              const jingleGain = audioContext.createGain();
              
              jingleOsc.connect(jingleGain);
              jingleGain.connect(audioContext.destination);
              
              const startTime = audioContext.currentTime + index * 0.15;
              
              jingleOsc.type = 'sine';
              jingleOsc.frequency.setValueAtTime(freq, startTime);
              jingleGain.gain.setValueAtTime(0.4, startTime);
              jingleGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
              
              jingleOsc.start(startTime);
              jingleOsc.stop(startTime + 0.1);
            });
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
    this.enemies = this.physics.add.group();
    this.bossBullets = null;

    this.score = 0;
    this.lives = 3;
    this.lastFired = 0;
    this.isGameOver = false;
    
this.currentWave = 1;
    this.enemiesKilledInWave = 0;
    this.waveEnemies = 5;
    this.waveActive = true;
    this.enemiesOnScreen = 0;
    this.waveTransitionTimer = null;
    this.currentWaveEnemyTexture = null;
    this.isBossActive = false;
    this.boss = null;
    this.bossHealthBar = null;
    this.bossHealthBarBg = null;
    this.bossMaxHealth = 0;
    this.bossCurrentHealth = 0;
    this.bossBullets = null;
    this.bossEnemyTimer = null;
    this.bossSpawnWaveTimer = null;
    this.enemySpawnTimer = null;

    this.createUI();
    this.setupInputs();
    this.spawnEnemies();
    this.setupCollisions();
    this.createEngineGlow();
    this.setWaveEnemyTexture();
  }

  createBackground() {
    this.background = this.add.tileSprite(400, 300, 800, 600, 'starfield');
    this.background.setScrollFactor(0.5);
    this.background.setDepth(-2);
  }

  createEngineGlow() {
    this.engineGlow = this.add.circle(this.player.x, this.player.y + 10, 8, 0x4a90d9, 0.6);
    this.engineGlow.setScrollFactor(0);
  }

  createUI() {
    const uiPanel = this.add.graphics();
    uiPanel.fillStyle(0x0a0a1a, 0.6);
    uiPanel.fillRoundedRect(10, 10, 200, 70, 15);
    uiPanel.lineStyle(2, 0x4a90d9, 0.8);
    uiPanel.strokeRoundedRect(10, 10, 200, 70, 15);
    uiPanel.setDepth(-1);
    
    this.scoreText = this.add.text(25, 22, 'Score', {
      fontSize: '12px',
      fill: '#80e9ff',
      fontStyle: 'italic'
    });
    this.scoreText.setDepth(-1);
    
    this.scoreValue = this.add.text(25, 35, '0', {
      fontSize: '28px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    this.scoreValue.setDepth(-1);
    
    this.livesText = this.add.text(25, 60, '♥♥♥', {
      fontSize: '20px',
      fill: '#ff6b6b'
    });
    this.livesText.setDepth(-1);
  }

  setupInputs() {
    this.mouseControlEnabled = true;
    this.mouseTargetX = this.player.x;
    this.mouseTargetY = this.player.y;
    this.mouseMoveSpeed = 750;
    this.input.on('pointermove', this.handleMouseMovement, this);
    this.input.on('pointerdown', this.handleMouseClick, this);
    
    this.cursors = this.input.keyboard.createCursorKeys();
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
    if (this.isGameOver || !this.waveActive) return;
    if (this.isBossActive) return;
    if (this.enemiesKilledInWave >= this.waveEnemies) return;

    const x = Phaser.Math.Between(50, 750);
    const enemyTexture = this.currentWaveEnemyTexture;
    const enemy = this.physics.add.sprite(x, -20, enemyTexture);
    enemy.setCollideWorldBounds(true);
    
    const speedMultiplier = 1 + (this.currentWave - 1) * 0.1;
    const baseSpeed = Phaser.Math.Between(100, 150);
    const velocity = baseSpeed * speedMultiplier;
    
    enemy.setVelocity(0, velocity);
    enemy.initialVelocityY = velocity;
    
    enemy.wavePattern = this.getWavePatternForWave(this.currentWave);
    if (enemy.wavePattern) {
      enemy.initialX = enemy.x;
    }
    
    this.enemies.add(enemy);
    this.enemiesOnScreen++;
  }
  
  getRandomEnemyTexture() {
    const enemyTextures = [
      'enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5',
      'enemyTri1', 'enemyTri2',
      'enemyCyl1', 'enemyCyl2',
      'enemyMulti1', 'enemyMulti2'
    ];
    const textureIndex = Phaser.Math.Between(0, enemyTextures.length - 1);
    return enemyTextures[textureIndex];
  }
  
  setWaveEnemyTexture() {
    const enemyTextures = [
      'enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5',
      'enemyTri1', 'enemyTri2',
      'enemyCyl1', 'enemyCyl2',
      'enemyMulti1', 'enemyMulti2'
    ];
    const textureIndex = Phaser.Math.Between(0, enemyTextures.length - 1);
    this.currentWaveEnemyTexture = enemyTextures[textureIndex];
  }
  
  getWavePatternForWave(waveNumber) {
    const pattern = waveNumber % 5;
    
    switch (pattern) {
      case 0:
        return { type: 'straight', maxDisplacement: 0 };
      case 1:
        return { type: 'sine', amplitude: 30, frequency: 0.002, phase: 0 };
      case 2:
        return { type: 'sine', amplitude: 40, frequency: 0.003, phase: Math.PI / 2 };
      case 3:
        return { type: 'sine', amplitude: 25, frequency: 0.0025, phase: Math.PI };
      case 4:
        return { type: 'sine', amplitude: 35, frequency: 0.0028, phase: Math.PI * 1.5 };
    }
  }

  setupCollisions() {
    this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
  }
  
  setupBossCollisions() {
    if (this.boss) {
      this.physics.add.overlap(this.bullets, this.boss, this.bossHit, null, this);
      this.physics.add.overlap(this.player, this.boss, this.playerHitBoss, null, this);
    }
    
    if (this.bossBullets) {
      this.physics.add.overlap(this.player, this.bossBullets, this.playerHitBossBullet, null, this);
    }
  }
  
  playerHitBossBullet(player, bullet) {
    bullet.destroy();
    this.hitSound.play();
    this.loseLife();
  }
  
  playerHitBoss(player, boss) {
    this.hitSound.play();
    this.loseLife();
  }

  destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    this.score += 10;
    this.enemiesKilledInWave++;
    this.enemiesOnScreen--;
    this.scoreValue.setText(this.score.toString());
    this.explosionSound.play();
  }

  playerHit(player, enemy) {
    enemy.destroy();
    this.enemiesOnScreen--;
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

    this.lastPlayerX = this.lastPlayerX || this.player.x;
    this.lastPlayerY = this.lastPlayerY || this.player.y;
    
    const playerDeltaX = this.player.x - this.lastPlayerX;
    const playerDeltaY = this.player.y - this.lastPlayerY;
    
    this.background.tilePositionX += playerDeltaX * 0.02;
    this.background.tilePositionY -= 0.3 + playerDeltaY * 0.02;
    
    this.lastPlayerX = this.player.x;
    this.lastPlayerY = this.player.y;
    
    if (this.engineGlow) {
      this.engineGlow.x = this.player.x;
      this.engineGlow.y = this.player.y + 10;
      this.engineGlow.alpha = 0.4 + Math.sin(time / 200) * 0.2;
    }
    
    this.handlePlayerMovement();
    this.handleShooting(time);
    this.updateEnemyWavePatterns(time);
    this.checkEnemiesAtBottom();
    this.checkWaveProgress();
    this.updateBossMovement(time);
    this.cleanUpBossBullets();
  }
  
  updateEnemyWavePatterns(time) {
    this.enemies.children.iterate((enemy) => {
      if (!enemy || enemy.y > 635) return;
      
      const pattern = enemy.wavePattern;
      if (!pattern) return;
      
      const currentVelocityY = enemy.initialVelocityY || 100;
      let velocityX = 0;
      
      switch (pattern.type) {
        case 'sine':
          velocityX = pattern.amplitude * pattern.frequency * 100 * Math.cos(time * pattern.frequency + pattern.phase);
          enemy.setVelocity(Math.max(-100, Math.min(100, velocityX)), currentVelocityY);
          break;
        case 'straight':
        default:
          velocityX = enemy.initialVelocityX || 0;
          enemy.setVelocity(velocityX, currentVelocityY);
          break;
      }
    });
  }
  
  updateBossMovement(time) {
    if (!this.isBossActive || !this.boss || this.bossCurrentHealth <= 0) return;
    
    const bossX = 400 + Math.sin(time / 2000) * 250;
    this.boss.x = Phaser.Math.Clamp(bossX, 120, 680);
    
    this.boss.setVelocity(0, 0);
  }
  
  cleanUpBossBullets() {
    // Boss bullets disabled
  }
  
  checkWaveProgress() {
    if (!this.waveActive) return;
    
    if (this.enemiesKilledInWave >= this.waveEnemies && this.enemiesOnScreen === 0) {
      if (this.currentWave === 3 && !this.isBossActive) {
        this.spawnBoss();
      } else if (!this.isBossActive) {
        this.startWaveTransition();
      }
    }
  }
  
  startWaveTransition() {
    this.waveActive = false;
    
    this.time.delayedCall(2000, () => {
      this.lives = 3;
      this.livesText.setText('♥♥♥');
      this.currentWave++;
      this.enemiesKilledInWave = 0;
      this.waveEnemies = 5 + this.currentWave;
      this.enemiesOnScreen = 0;
      this.waveActive = true;
      this.setWaveEnemyTexture();
      this.waveJingleSound.play();
      this.createWaveNotification(this.currentWave);
    });
  }
  
  createWaveNotification(waveNumber) {
    const waveText = this.add.text(400, 200, `WAVE ${waveNumber}`, {
      fontSize: '36px',
      fill: '#4a90d9',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    waveText.setAlpha(1);
    
    this.tweens.add({
      targets: waveText,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      onComplete: () => waveText.destroy()
    });
  }
  
  spawnBoss() {
    this.isBossActive = true;
    
    const bossGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    bossGraphics.fillStyle(0x8b0000, 1);
    bossGraphics.beginPath();
    bossGraphics.moveTo(60, 0);
    bossGraphics.lineTo(120, 40);
    bossGraphics.lineTo(140, 80);
    bossGraphics.lineTo(120, 120);
    bossGraphics.lineTo(60, 140);
    bossGraphics.lineTo(0, 120);
    bossGraphics.lineTo(-20, 80);
    bossGraphics.lineTo(0, 40);
    bossGraphics.closePath();
    bossGraphics.fillPath();
    
    bossGraphics.fillStyle(0xff0000, 1);
    bossGraphics.fillCircle(60, 70, 30);
    
    bossGraphics.fillStyle(0xffff00, 1);
    bossGraphics.fillCircle(60, 70, 15);
    
    bossGraphics.generateTexture('boss', 180, 180);
    
    this.boss = this.physics.add.sprite(400, -100, 'boss');
    this.boss.setCollideWorldBounds(true);
    this.boss.setVelocity(0, 0);
    
    this.bossMaxHealth = 100;
    this.bossCurrentHealth = 100;
    
    this.tweens.add({
      targets: this.boss,
      y: 100,
      duration: 2000,
      ease: 'Power2'
    });
    
    this.createBossHealthBar();
    
    this.bossEnemyTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnBossEnemy,
      callbackScope: this,
      loop: true
    });
    
    // this.bossShootTimer = this.time.addEvent({
//   delay: 2000,
//   callback: this.bossShoot,
//   callbackScope: this,
//   loop: true
// });
    
    this.bossSpawnWaveTimer = this.time.addEvent({
      delay: 5000,
      callback: this.bossSpawnWave,
      callbackScope: this,
      loop: true
    });
    
    this.enemySpawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
    
    const bossText = this.add.text(400, 300, 'BOSS BATTLE', {
      fontSize: '42px',
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: bossText,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      onComplete: () => bossText.destroy()
    });
    
    this.setupBossCollisions();
  }
  
  createBossHealthBar() {
    this.bossHealthBarBg = this.add.rectangle(400, 30, 400, 25, 0x0a0a1a, 0.9);
    this.bossHealthBarBg.setDepth(-1);
    
    this.bossHealthBar = this.add.rectangle(400, 30, 400, 25, 0xff0000, 1);
    this.bossHealthBar.setDepth(-1);
  }
  
  updateBossHealthBar() {
    const healthPercent = this.bossCurrentHealth / this.bossMaxHealth;
    this.bossHealthBar.width = 400 * healthPercent;
    this.bossHealthBar.x = 400;
  }
  
  spawnBossEnemy() {
    if (!this.isBossActive || !this.boss || this.bossCurrentHealth <= 0) return;
    
    const x = Phaser.Math.Between(this.boss.x - 100, this.boss.x + 100);
    const enemy = this.physics.add.sprite(x, this.boss.y + 100, this.currentWaveEnemyTexture);
    enemy.setCollideWorldBounds(true);
    
    const velocity = Phaser.Math.Between(80, 120);
    enemy.setVelocity(0, velocity);
    enemy.initialVelocityX = 0;
    enemy.initialVelocityY = velocity;
    enemy.wavePattern = { type: 'straight' };
    
    this.enemies.add(enemy);
    this.enemiesOnScreen++;
  }
  
  // Boss bullets disabled
// bossShoot() { }
  
  // Boss bullets disabled
// bossShootStraight() { }
// bossShootSpread() { }
// bossShootCircle() { }
  
  bossSpawnWave() {
    if (!this.isBossActive || !this.boss || this.bossCurrentHealth <= 0) return;
    
    for (let i = 0; i < 6; i++) {
      this.time.delayedCall(i * 200, () => {
        if (!this.isBossActive || !this.boss || this.bossCurrentHealth <= 0) return;
        const angle = (i / 6) * Math.PI * 2;
        const radius = 120;
        const x = this.boss.x + Math.cos(angle) * radius;
        const y = this.boss.y + Math.sin(angle) * radius;
        
        const enemy = this.physics.add.sprite(x, y, this.currentWaveEnemyTexture);
        enemy.setCollideWorldBounds(true);
        
        const speed = 100;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed + speed;
        enemy.setVelocity(velocityX, velocityY);
        enemy.initialVelocityX = velocityX;
        enemy.initialVelocityY = velocityY;
        enemy.wavePattern = { type: 'straight' };
        
        this.enemies.add(enemy);
        this.enemiesOnScreen++;
      });
    }
  }
  
  bossHit(bullet, boss) {
    bullet.destroy();
    this.bossCurrentHealth -= 1;
    this.updateBossHealthBar();
    
    if (this.bossCurrentHealth <= 0) {
      this.defeatBoss();
    }
  }
  
  defeatBoss() {
    this.isBossActive = false;
    this.boss.destroy();
    this.bossHealthBar.destroy();
    this.bossHealthBarBg.destroy();
    
    if (this.bossEnemyTimer) this.bossEnemyTimer.remove();
    if (this.bossSpawnWaveTimer) this.bossSpawnWaveTimer.remove();
    if (this.enemySpawnTimer) this.enemySpawnTimer.remove();
    
    this.explosionSound.play();
    
    this.time.delayedCall(1000, () => {
      this.startWaveTransition();
    });
  }

  handlePlayerMovement() {
    const dx = this.mouseTargetX - this.player.x;
    const dy = this.mouseTargetY - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      const moveSpeed = Math.min(distance, this.mouseMoveSpeed);
      const ratio = moveSpeed / distance;
      this.player.setVelocity(dx * ratio, dy * ratio);
    }
  }

  fireBullet() {
    const bullet = this.physics.add.sprite(this.player.x, this.player.y - 20, 'bullet');
    bullet.setVelocity(0, -400);
    this.bullets.add(bullet);
    this.playVariableShootSound();
  }
  
  playVariableShootSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const baseFreq = Phaser.Math.Between(700, 900);
    const endFreq = Phaser.Math.Between(150, 300);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  handleShooting(time) {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.fireBullet();
    }
  }

  checkEnemiesAtBottom() {
    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.y > 635) {
        enemy.destroy();
        this.enemiesOnScreen--;
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

    if (this.bossEnemyTimer) this.bossEnemyTimer.remove();
    if (this.bossSpawnWaveTimer) this.bossSpawnWaveTimer.remove();
    if (this.enemySpawnTimer) this.enemySpawnTimer.remove();

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
  
  resetGameState() {
    this.score = 0;
    this.lives = 3;
    this.lastFired = 0;
    this.isGameOver = false;
    this.currentWave = 1;
    this.enemiesKilledInWave = 0;
    this.waveEnemies = 5;
    this.waveActive = true;
    this.enemiesOnScreen = 0;
    this.currentWaveEnemyTexture = null;
    this.isBossActive = false;
    this.boss = null;
    this.bossHealthBar = null;
    this.bossHealthBarBg = null;
    this.bossMaxHealth = 0;
    this.bossCurrentHealth = 0;
    this.bossBullets = null;
    this.bossEnemyTimer = null;
    this.bossShootTimer = null;
    this.bossSpawnWaveTimer = null;
    this.enemySpawnTimer = null;
    this.scoreValue.setText('0');
    this.livesText.setText('♥♥♥');
  }
}
