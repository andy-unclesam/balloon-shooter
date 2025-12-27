import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export class HandTracker {
    constructor() {
        console.log("HandTracker: Initializing...");
        this.hands = new Hands({
            locateFile: (file) => {
                console.log(`HandTracker: Loading ${file}`);
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults(this.onResults.bind(this));

        this.videoElement = document.createElement('video');
        this.videoElement.style.display = 'none';
        document.body.appendChild(this.videoElement);

        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.hands.send({ image: this.videoElement });
            },
            width: 640,
            height: 480
        });

        this.latestLandmarks = null;

        // Mouse Fallback
        this.useMouse = false;
        this.mousePos = { x: 0, y: 0 };
        this.isMouseDown = false;

        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        window.addEventListener('mousedown', () => this.isMouseDown = true);
        window.addEventListener('mouseup', () => this.isMouseDown = false);

        // Toggle with 'M' key for testing
        window.addEventListener('keydown', (e) => {
            if (e.key === 'm') {
                this.useMouse = !this.useMouse;
                console.log("Mouse Mode:", this.useMouse);
            }
        });
    }

    start() {
        this.camera.start();
    }

    onResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.latestLandmarks = results.multiHandLandmarks[0];
        } else {
            this.latestLandmarks = null;
        }
    }

    getCursorPosition() {
        if (this.useMouse) {
            return { ...this.mousePos };
        }

        if (!this.latestLandmarks) return null;

        // Index finger tip is landmark 8
        const tip = this.latestLandmarks[8];

        // Mirror x since it's a webcam
        return {
            x: (1 - tip.x) * window.innerWidth,
            y: tip.y * window.innerHeight
        };
    }

    isPinching() {
        if (this.useMouse) {
            return this.isMouseDown;
        }

        if (!this.latestLandmarks) return false;

        const indexTip = this.latestLandmarks[8];
        const thumbTip = this.latestLandmarks[4];

        const dx = indexTip.x - thumbTip.x;
        const dy = indexTip.y - thumbTip.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Threshold for pinch (normalized coordinates)
        return dist < 0.05;
    }
}
