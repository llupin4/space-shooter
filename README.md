# Space Shooter Game

A top-down space shooter game built with Phaser 3 and Vite.

**Built by Qwen 3.5 27B using OpenCode**

## Features

### Gameplay
- Player ship with smooth mouse following or keyboard control
- Bullets move upward when fired
- Enemies spawn from top and move downward
- Collision detection (bullet-enemy, player-enemy)
- Score counter (+10 points per enemy destroyed)
- Lives counter (3 lives, displayed as hearts)
- Game over screen with restart button

### Graphics & Visual Effects
- Sleek player ship design with detailed thrusters
- Enemy ships with distinctive red accents
- Glowing bullet projectiles with highlights
- Animated scrolling starfield background
- Pulsating engine glow effect on player ship
- Modern UI panel with semi-transparent background
- Interactive game over screen with hover effects

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the Vite dev server:

```bash
npm run dev
```

The game will be available at http://localhost:5173

### Testing

Run automated browser tests:

```bash
# Start dev server in background
npm run dev > /tmp/vite.log 2>&1 &

# Run basic browser test (checks for console errors)
node test-browser.cjs

# Run comprehensive game test
node test-game.cjs

# Run mouse control test
node test-mouse-controls.cjs

# Run smooth mouse movement test
node test-smooth-mouse.cjs

# Run full validation test
node test-validation.cjs
```

## Workarounds

### Running Dev Server in Background

When running automated tests, start the Vite dev server in the background:

```bash
npm run dev > /tmp/vite.log 2>&1 &
```

This allows test scripts to run while the server is active.

## Controls

### Keyboard
- **WASD** or **Arrow Keys**: Move ship
- **Space**: Shoot bullets

### Mouse
- **Move cursor**: Player smoothly follows mouse (maximum speed limited)
- **Click**: Shoot bullets

## Features

- Player ship with smooth mouse following or keyboard control
- Bullets move upward when fired
- Enemies spawn from top and move downward
- Collision detection (bullet-enemy, player-enemy)
- Score counter (+10 points per enemy destroyed)
- Lives counter (3 lives)
- Game over screen with restart button

## Project Structure

- `index.html` - HTML entry point
- `main.js` - Application entry point
- `phaser-config.js` - Phaser game configuration
- `space-shooter-scene.js` - Game scene logic
- `test-browser.cjs` - Browser console error test
- `test-game.cjs` - Comprehensive game test

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool
- [Phaser 3](https://phaser.io/) - Game framework
- [Puppeteer](https://pptr.dev/) - Browser automation for testing