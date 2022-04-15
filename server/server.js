const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

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
var cars = [];

const updateInterval = setInterval(() => {
    cars.forEach((car) => {
        car.car.update();
    });
}, 1000 / 60);

const broadCastInterval = setInterval(() => {
    io.emit("UPDATED_DATA", cars);
}, 1000 / 60);

io.on("connection", (socket) => {
    socket.on("connected", (x, y, img) => {
        let car = new Car(x, y, img);
        cars.push({ id: socket.id, car });
    });
    socket.on("move", (move) => {
        if (move == "speedUp") {
            cars.forEach((car) => {
                if (car.id == socket.id) {
                    car.car.speedUp();
                }
            });
        }
        if (move == "speedDown") {
            cars.forEach((car) => {
                if (car.id == socket.id) {
                    car.car.speedDown();
                }
            });
        }
        if (move == "turnLeft") {
            cars.forEach((car) => {
                if (car.id == socket.id) {
                    car.car.turnLeft();
                }
            });
        }
        if (move == "turnRight") {
            cars.forEach((car) => {
                if (car.id == socket.id) {
                    car.car.turnRight();
                }
            });
        }
    });

    socket.on("disconnect", () => {
        cars.forEach((car, indx) => {
            if (car.id == socket.id) {
                cars.splice(indx, 1);
            }
        });
    });
});

app.get("/", (req, res) => {
    res.send("Server on");
});
