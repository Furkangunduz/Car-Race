import data from "./global_vars.js";

export default class Car {
    constructor(x, y, angle, ctx, imgsrc) {
        this.x = x;
        this.y = y;
        this.playerName = "kraldragon";
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = imgsrc;
        this.angle = angle;
        this.carWidth = data.CARWIDTH;
        this.carHeight = data.CARHEGIHT;
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
    }

    drawName() {
        this.ctx.font = "50px Arial";
        this.ctx.fillText(
            this.playerName,
            this.x - this.carWidth / 2 - 20,
            this.y - (this.carHeight * 2) / 3
        );
    }
}
