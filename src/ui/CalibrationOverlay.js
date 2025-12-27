export class CalibrationOverlay {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        this.overlay.style.display = 'flex';
        this.overlay.style.flexDirection = 'column';
        this.overlay.style.justifyContent = 'center';
        this.overlay.style.alignItems = 'center';
        this.overlay.style.zIndex = '100';
        this.overlay.style.color = 'white';
        this.overlay.style.fontFamily = 'Inter, sans-serif';

        this.message = document.createElement('h2');
        this.message.innerText = 'Calibration Required';
        this.overlay.appendChild(this.message);

        this.instruction = document.createElement('p');
        this.instruction.innerText = 'Show your hand to the camera to begin.';
        this.overlay.appendChild(this.instruction);

        this.startButton = document.createElement('button');
        this.startButton.innerText = 'Start Game (Skip Calibration)';
        this.startButton.style.marginTop = '20px';
        this.startButton.style.padding = '10px 20px';
        this.startButton.style.fontSize = '18px';
        this.startButton.onclick = () => {
            this.hide();
            if (this.onComplete) this.onComplete();
        };
        this.overlay.appendChild(this.startButton);

        document.getElementById('ui-layer').appendChild(this.overlay);
    }

    show() {
        this.overlay.style.display = 'flex';
    }

    hide() {
        this.overlay.style.display = 'none';
    }
}
