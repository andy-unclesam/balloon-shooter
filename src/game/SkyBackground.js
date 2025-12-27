export class SkyBackground {
    constructor() {
        this.clouds = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.initClouds();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    initClouds() {
        // Create some initial clouds
        for (let i = 0; i < 10; i++) {
            this.clouds.push(this.createCloud());
        }
    }

    createCloud() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * (this.height * 0.6), // Top 60% of screen
            size: 50 + Math.random() * 100,
            speed: 0.01 + Math.random() * 0.05,
            opacity: 0.3 + Math.random() * 0.5
        };
    }

    update(deltaTime) {
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed * deltaTime;
            if (cloud.x > this.width + cloud.size) {
                cloud.x = -cloud.size;
                cloud.y = Math.random() * (this.height * 0.6);
            }
        });
    }

    draw(ctx, width, height) {
        // Sky Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#87CEEB'); // Sky Blue
        gradient.addColorStop(1, '#E0F7FA'); // Light Cyan
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Clouds
        this.clouds.forEach(cloud => {
            ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
            ctx.arc(cloud.x - cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
