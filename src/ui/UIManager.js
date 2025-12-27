import { CalibrationOverlay } from './CalibrationOverlay.js';
import { SettingsDrawer } from './SettingsDrawer.js';

export class UIManager {
    constructor() {
        this.uiLayer = document.getElementById('ui-layer');
        this.createHUD();

        this.settingsDrawer = new SettingsDrawer();
        this.calibrationOverlay = new CalibrationOverlay(() => {
            console.log("Calibration Complete");
            // TODO: Signal game start if needed
        });
    }

    createHUD() {
        this.hudContainer = document.createElement('div');
        this.hudContainer.style.position = 'absolute';
        this.hudContainer.style.top = '20px';
        this.hudContainer.style.left = '20px';
        this.hudContainer.style.color = 'white';
        this.hudContainer.style.fontFamily = 'Inter, sans-serif';
        this.hudContainer.style.fontSize = '24px';
        this.hudContainer.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';

        this.scoreEl = document.createElement('div');
        this.scoreEl.innerText = 'Score: 0';

        this.comboEl = document.createElement('div');
        this.comboEl.innerText = 'Combo: 0';

        this.hudContainer.appendChild(this.scoreEl);
        this.hudContainer.appendChild(this.comboEl);
        this.uiLayer.appendChild(this.hudContainer);
    }



    update(score, combo) {
        this.scoreEl.innerText = `Score: ${score}`;
        this.comboEl.innerText = `Combo: ${combo}`;
    }
}
