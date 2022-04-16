export default class Enemy {
    constructor(x, y, radius, color, ctx) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.alpha = 1;
        this.ctx = ctx;
    }
    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.restore();
    }
}
