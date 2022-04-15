const socket = io("http://localhost:3001");
// import Car from "./Car.js";
import Bullet from "./Bullet.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1600;
const HEIGHT = 800;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const CARWIDTH = 150;
const CARHEGIHT = 100;
const carImg = "./cars/white-car.png";

var carActions = new Set();
var bullets = [];

class Car {
    constructor(x, y, angle, ctx) {
        this.x = x;
        this.y = y;
        this.playerName = "kraldragon";
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = carImg;
        this.angle = angle;
    }
    draw() {
        if (this.x - CARWIDTH / 2 <= 0) {
            this.x = CARWIDTH / 2;
        }
        if (this.x >= WIDTH) {
            this.x = WIDTH;
        }
        if (this.y - CARHEGIHT / 2 <= 0) {
            this.y = CARHEGIHT / 2;
        }
        if (this.y >= HEIGHT) {
            this.y = HEIGHT;
        }

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((Math.PI * this.angle) / 180);
        this.ctx.drawImage(
            this.img,
            0 - CARWIDTH / 2,
            0 - CARHEGIHT / 2,
            CARWIDTH,
            CARHEGIHT
        );
        this.ctx.restore();
    }

    drawName() {
        this.ctx.font = "30px Arial";
        this.ctx.fillText(
            this.playerName,
            this.x - CARWIDTH / 2 - 20,
            this.y - CARHEGIHT
        );
    }
}

const mycar = new Car(100, 100, ctx, carImg);
var allcars = [];

socket.emit("connected", mycar.x, mycar.y, carImg);

socket.on("UPDATED_DATA", (cars) => {
    let newCars = [];
    cars.forEach((i) => {
        let car = new Car(i.car.x, i.car.y, i.car.angle, ctx);
        newCars.push(car);
    });
    allcars = newCars;
});

animate();

function animate() {
    setInterval(() => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        bullets.forEach((bullet) => {
            bullet.update();
        });

        allcars.forEach((car) => {
            car.draw();
            car.drawName();
        });

        carActions.forEach((item) => {
            if (item == "speedUp") {
                socket.emit("move", "speedUp");
            } else if (item == "speedDown") {
                socket.emit("move", "speedDown");
            } else if (item == "turnLeft") {
                socket.emit("move", "turnLeft");
            } else if (item == "turnRight") {
                socket.emit("move", "turnRight");
            }
        });
    }, 1000 / 60);
}

function enemySpawner() {}

//eventlisteners
document.addEventListener("keydown", (e) => {
    if (e.key === "w" || e.key === "W") {
        carActions.add("speedUp");
    }
    if (e.key === "s" || e.key === "S") {
        carActions.add("speedDown");
    }
    if (e.key === "a" || e.key === "A") {
        carActions.add("turnLeft");
    }
    if (e.key === "d" || e.key === "D") {
        carActions.add("turnRight");
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "W") {
        carActions.delete("speedUp");
    }
    if (e.key === "s" || e.key === "S") {
        carActions.delete("speedDown");
    }
    if (e.key === "a" || e.key === "A") {
        carActions.delete("turnLeft");
    }
    if (e.key === "d" || e.key === "D") {
        carActions.delete("turnRight");
    }
});

const rect = canvas.getBoundingClientRect();
canvas.addEventListener("click", () => {
    let radian = (mycar.angle * Math.PI) / 180;
    let velocity = {
        x: Math.cos(radian) * (10 + mycar.speed),
        y: Math.sin(radian) * (10 + mycar.speed),
    };
    bullets.push(
        new Bullet(
            mycar.x + (Math.cos(radian) * CARWIDTH) / 2,
            mycar.y + (Math.sin(radian) * CARHEGIHT) / 2,
            10,
            "red",
            velocity,
            ctx
        )
    );
});
