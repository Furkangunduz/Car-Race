const data = require("./global_vars.js");

class Car {
    constructor(x, y, src) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 0;
        this.src = src;
        this.maxSpeed = 15;
        this.acc = 0.3;
        this.direction = "forward";
        this.firiction = 0.98;
        this.carWidth = data.CARWIDTH;
        this.carHeight = data.CARHEGIHT;
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
    }
}
module.exports = Car;
