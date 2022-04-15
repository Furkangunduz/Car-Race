export default class Projectile {
    constructor(x, y, radius, color, velocity, ctx) {
        this.x = x;
        this.y = y;
        this.c = ctx
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        this.c.save()
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.c.fillStyle = this.color;
        this.c.fill();
        this.c.restore()
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}