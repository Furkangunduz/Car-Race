class Bullet {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = 15;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
module.exports = Bullet;
