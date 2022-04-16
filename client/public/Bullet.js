export default class Bullet {
    constructor(x, y, radius, color, ctx) {
        this.x = x;
        this.y = y;
        this.c = ctx;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        this.c.save();
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.c.fillStyle = this.color;
        this.c.fill();
        this.c.restore();
    }
}
