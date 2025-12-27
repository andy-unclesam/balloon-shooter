export class SettingsDrawer {
    constructor(gameLoop) {
        this.gameLoop = gameLoop;
        this.drawer = document.createElement('div');
        this.drawer.style.position = 'absolute';
        this.drawer.style.top = '0';
        this.drawer.style.right = '-300px'; // Hidden
        this.drawer.style.width = '300px';
        this.drawer.style.height = '100%';
        this.drawer.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
        this.drawer.style.transition = 'right 0.3s ease';
        this.drawer.style.padding = '20px';
        this.drawer.style.boxSizing = 'border-box';
        this.drawer.style.color = 'white';
        this.drawer.style.fontFamily = 'Inter, sans-serif';
        this.drawer.style.zIndex = '90';
        this.drawer.style.pointerEvents = 'auto';

        this.createControls();

        document.getElementById('ui-layer').appendChild(this.drawer);

        // Toggle Button
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.innerText = '⚙️';
        this.toggleBtn.style.position = 'absolute';
        this.toggleBtn.style.top = '20px';
        this.toggleBtn.style.right = '20px';
        this.toggleBtn.style.zIndex = '91';
        this.toggleBtn.style.background = 'none';
        this.toggleBtn.style.border = 'none';
        this.toggleBtn.style.fontSize = '24px';
        this.toggleBtn.style.cursor = 'pointer';
        this.toggleBtn.style.pointerEvents = 'auto';
        this.toggleBtn.onclick = () => this.toggle();
        document.getElementById('ui-layer').appendChild(this.toggleBtn);

        this.isOpen = false;
    }

    createControls() {
        const title = document.createElement('h2');
        title.innerText = 'Settings';
        this.drawer.appendChild(title);

        // Sensitivity
        this.addSlider('Sensitivity', 0.1, 2.0, 1.0, (val) => {
            // TODO: Apply to HandTracker
            console.log('Sensitivity:', val);
        });

        // Spawn Rate
        this.addSlider('Spawn Rate', 0.5, 3.0, 1.0, (val) => {
            // TODO: Apply to BalloonManager
            console.log('Spawn Rate:', val);
        });
    }

    addSlider(label, min, max, initial, onChange) {
        const container = document.createElement('div');
        container.style.marginBottom = '20px';

        const labelEl = document.createElement('label');
        labelEl.innerText = label;
        labelEl.style.display = 'block';
        labelEl.style.marginBottom = '5px';
        container.appendChild(labelEl);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = 0.1;
        slider.value = initial;
        slider.style.width = '100%';
        slider.oninput = (e) => onChange(e.target.value);
        container.appendChild(slider);

        this.drawer.appendChild(container);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.drawer.style.right = this.isOpen ? '0' : '-300px';
    }
}
