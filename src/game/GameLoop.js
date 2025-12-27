import { SkyBackground } from './SkyBackground.js';
import { BalloonManager } from './BalloonManager.js';
import { HandTracker } from '../input/HandTracker.js';
import { UIManager } from '../ui/UIManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AudioManager } from './AudioManager.js';

export class GameLoop {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lastTime = 0;
        this.isRunning = false;

        console.log("GameLoop: Constructor");
        this.resize();
        window.addEventListener('resize', () => this.resize());

        console.log("GameLoop: Init Sky");
        this.sky = new SkyBackground();
        console.log("GameLoop: Init BalloonManager");
        this.balloonManager = new BalloonManager(this.canvas.width, this.canvas.height);

        console.log("GameLoop: Init HandTracker");
        this.handTracker = new HandTracker();
        try {
            this.handTracker.start();
            console.log("GameLoop: HandTracker started");
        } catch (e) {
            console.error("Failed to start HandTracker:", e);
        }

        console.log("GameLoop: Init UI/Audio/Particles");
        this.uiManager = new UIManager();
        this.particleSystem = new ParticleSystem();
        this.audioManager = new AudioManager();

        this.score = 0;
        this.combo = 0;
        this.lastPinchState = false;
        this.pinchCooldown = 0;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.sky) this.sky.resize(this.canvas.width, this.canvas.height);
        if (this.balloonManager) this.balloonManager.resize(this.canvas.width, this.canvas.height);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    stop() {
        this.isRunning = false;
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(deltaTime) {
        this.sky.update(deltaTime);
        this.balloonManager.update(deltaTime);
        this.particleSystem.update(deltaTime);

        // Hand Tracking & Shooting
        const cursor = this.handTracker.getCursorPosition();
        const isPinching = this.handTracker.isPinching();

        if (this.pinchCooldown > 0) {
            this.pinchCooldown -= deltaTime;
        }

        if (cursor) {
            // Draw cursor (debug/visual) - actually we'll draw it in draw()

            // Shooting Logic
            if (isPinching && !this.lastPinchState && this.pinchCooldown <= 0) {
                // Fire!
                this.pinchCooldown = 200; // ms
                const hit = this.balloonManager.checkHit(cursor.x, cursor.y);
                if (hit) {
                    this.score += 10 + (this.combo * 5);
                    this.combo++;
                    this.particleSystem.emit(cursor.x, cursor.y, hit.color); // hit returns balloon obj or true? Need to check BalloonManager
                    this.audioManager.playPop();
                    console.log("Hit! Score:", this.score);
                    this.uiManager.update(this.score, this.combo);
                } else {
                    this.combo = 0;
                    this.uiManager.update(this.score, this.combo);
                }
            }
        }

        this.lastPinchState = isPinching;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sky.draw(this.ctx, this.canvas.width, this.canvas.height);
        this.balloonManager.draw(this.ctx);
        this.particleSystem.draw(this.ctx);

        // Draw Cursor
        const cursor = this.handTracker.getCursorPosition();
        if (cursor) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(cursor.x, cursor.y, 10, 0, Math.PI * 2);
            this.ctx.moveTo(cursor.x - 15, cursor.y);
            this.ctx.lineTo(cursor.x + 15, cursor.y);
            this.ctx.moveTo(cursor.x, cursor.y - 15);
            this.ctx.lineTo(cursor.x, cursor.y + 15);
            this.ctx.stroke();
        }

        // Draw HUD (Handled by UIManager)
    }
}
