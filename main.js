import Phaser from 'phaser';
import { PhaserConfig } from './phaser-config.js';

const config = new PhaserConfig();
config.init();

const game = new Phaser.Game(config.getConfig());
