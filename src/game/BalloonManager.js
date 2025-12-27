export class BalloonManager {
    constructor(gameWidth, gameHeight) {
        this.balloons = [];
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.spawnTimer = 0;
        this.spawnInterval = 1000; // ms
        this.wind = 0;
        this.windTimer = 0;
    }

    resize(width, height) {
        this.gameWidth = width;
        this.gameHeight = height;
    }

    update(deltaTime) {
        // Spawning
        this.spawnTimer += deltaTime;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnBalloon();
            this.spawnTimer = 0;
            // Randomize next interval slightly
            this.spawnInterval = 800 + Math.random() * 500;
        }

        // Wind logic
        this.windTimer += deltaTime;
        if (this.windTimer > 5000) {
            this.wind = (Math.random() - 0.5) * 0.1; // Random wind shift
            this.windTimer = 0;
        }

        // Update balloons
        for (let i = this.balloons.length - 1; i >= 0; i--) {
            const b = this.balloons[i];
            b.y -= b.speed * deltaTime;
            b.x += Math.sin(b.y * 0.01 + b.wobbleOffset) * 0.5 + this.wind * deltaTime;

            // Remove if off screen
            if (b.y < -b.radius * 2) {
                this.balloons.splice(i, 1);
            }
        }
    }

    spawnBalloon() {
        const radius = 20 + Math.random() * 30;
        // Smaller = faster
        const speed = 0.1 + (50 - radius) * 0.005;

        const balloon = {
            x: Math.random() * this.gameWidth,
            y: this.gameHeight + radius,
            radius: radius,
            speed: speed,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            wobbleOffset: Math.random() * Math.PI * 2,
            popped: false
        };
        this.balloons.push(balloon);
    }

    draw(ctx) {
        this.balloons.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();

            // Shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
            ctx.fill();

            // String
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + b.radius);
            ctx.lineTo(b.x, b.y + b.radius + 20);
            ctx.stroke();
        });
    }

    checkHit(x, y) {
        for (let i = this.balloons.length - 1; i >= 0; i--) {
            const b = this.balloons[i];
            const dx = b.x - x;
            const dy = b.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < b.radius) {
                this.balloons.splice(i, 1);
                return b; // Return the balloon object
            }
        }
        return null;
    }
}
