const WIDTH = 1600;
const HEIGHT = 800;
export default class Car {
    constructor(x, y, ctx, src, Name, carWidth = 150, carHeight = 100) {
        this.x = x;
        this.y = y;
        this.playerName = Name;
        this.ctx = ctx;
        this.carWidth = carWidth;
        this.carHeight = carHeight;
        this.src = src
        this.img = new Image();
        this.img.src = this.src;
        this.angle = 0;
        this.speed = 0;
        this.maxSpeed = 15;
        this.acc = 0.3;
        this.direction = "forward";
        this.firiction = 0.98;
    }
    draw() {

        if (this.x - this.carWidth / 2 <= 0) {
            this.x = this.carWidth / 2;
        }
        if (this.x >= WIDTH) {
            this.x = WIDTH;
        }
        if (this.y - this.carHeight / 2 <= 0) {
            this.y = this.carHeight / 2;
        }
        if (this.y >= HEIGHT) {
            this.y = HEIGHT;
        }

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((Math.PI * this.angle) / 180);
        this.ctx.drawImage(
            this.img,
            0 - this.carWidth / 2,
            0 - this.carHeight / 2,
            this.carWidth,
            this.carHeight
        );
        this.ctx.restore();
    }

    speedUp() {

        this.speed = Math.min(
            this.maxSpeed,
            this.speed < 0
                ? (this.speed += this.acc * 2)
                : (this.speed += this.acc)
        );
        this.direction = "forward";
    }

    speedDown() {
        this.speed = Math.max(
            -10,
            this.speed > 0
                ? (this.speed -= this.acc * 2)
                : (this.speed -= this.acc)
        );
        this.direction = "backward";
    }
    turnLeft() {
        if (this.direction == "forward") this.angle = (this.angle - 3) % 360;
        else this.angle = (this.angle + 3) % 360;
    }
    turnRight() {
        if (this.direction == "forward") this.angle = (this.angle + 3) % 360;
        else this.angle = (this.angle - 3) % 360;
    }

    update() {

        this.x += Math.cos((this.angle * Math.PI) / 180) * this.speed;
        this.y += Math.sin((this.angle * Math.PI) / 180) * this.speed;
        this.speed *= this.firiction;
        this.drawName();
        this.draw();
    }
    drawName() {
        this.ctx.font = "30px Arial";
        this.ctx.fillText(
            this.playerName,
            this.x - this.carWidth / 2 - 20,
            this.y - this.carHeight
        );
    }
}
