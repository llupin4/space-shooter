import Phaser from 'phaser';
import { SpaceShooterScene } from './space-shooter-scene.js';

export class PhaserConfig {
  constructor() {
    this.width = 800;
    this.height = 600;
    this.pixelRatio = window.devicePixelRatio;
  }

  init() {
    console.log('Phaser config initialized');
  }

  getConfig() {
    return {
      type: Phaser.AUTO,
      width: this.width,
      height: this.height,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      parent: 'game-container',
      scene: [SpaceShooterScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 }
        }
      }
    };
  }
}
