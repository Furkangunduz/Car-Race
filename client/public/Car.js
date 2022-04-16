import data from "./global_vars.js";

export default class Car {
    constructor(x, y, angle, name, ctx, imgsrc, health) {
        this.x = x;
        this.y = y;
        this.playerName = name;
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = imgsrc;
        this.angle = angle;
        this.carWidth = data.CARWIDTH;
        this.carHeight = data.CARHEGIHT;
        this.health = health;
    }
    draw() {
        if (this.x - this.carWidth / 2 <= 0) {
            this.x = this.carWidth / 2;
        }
        if (this.x >= data.WIDTH) {
            this.x = data.WIDTH;
        }
        if (this.y - this.carHeight / 2 <= 0) {
            this.y = this.carHeight / 2;
        }
        if (this.y >= data.HEIGHT) {
            this.y = data.HEIGHT;
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
        this.drawName();
        this.drawHealth();
    }

    drawName() {
        this.ctx.save();
        this.ctx.font = "70px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(
            this.playerName,
            this.x - this.carWidth / 2 - 20,
            this.y - (this.carHeight * 2) / 3
        );
        this.ctx.restore();
    }
    drawHealth() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0 - this.carWidth / 2, this.carHeight / 2, 200, 50);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(
            0 - this.carWidth / 2 + 10,
            this.carHeight / 2 + 10,
            18 * (this.health <= 0 ? 0 : this.health / 10),
            30
        );
        this.ctx.restore();
    }
}
