class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    update() {
        this.x += this.velocity.x * 4;
        this.y += this.velocity.y * 4;
    }
}

module.exports = Enemy;
