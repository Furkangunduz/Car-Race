const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT);
const Car = require("./classes/Car.js");
const Bullet = require("./classes/Bullet.js");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

var cars = [];
var bullets = [];

//for removing bullet which is not seeing on canvas
const canvasWIDTH = 3000;
const canvasHEIGHT = 3000;

const updateInterval = setInterval(() => {
    cars.forEach((car) => {
        car.car.update();
    });
    bullets.forEach((bullet, index) => {
        if (
            bullet.x + bullet.radius < 0 ||
            bullet.x - bullet.radius > canvasWIDTH ||
            bullet.y + bullet.radius < 0 ||
            bullet.y - bullet.radius > canvasHEIGHT
        ) {
            bullets.splice(index, 1);
        }

        bullet.update();
    });
}, 1000 / 60);

const broadCastInterval = setInterval(() => {
    io.emit("UPDATED_CARS", cars);
    io.emit("UPDATED_BULLETS", bullets);
}, 1000 / 500);

io.on("connection", (socket) => {
    socket.on("connected", (x, y, img) => {
        let car = new Car(x, y, img);
        cars.push({ id: socket.id, car });
    });

    socket.on("new_bullet", () => {
        cars.forEach((data) => {
            if (data.id === socket.id) {
                let radian = (data.car.angle * Math.PI) / 180;
                let bulletX =
                    data.car.x + (Math.cos(radian) * data.car.carWidth) / 2;
                let bulletY =
                    data.car.y + (Math.sin(radian) * data.car.carHeight) / 2;
                let velocity = {
                    x: Math.cos(radian) * (10 + data.car.speed),
                    y: Math.sin(radian) * (10 + data.car.speed),
                };
                bullets.push(new Bullet(bulletX, bulletY, velocity));
            }
        });
    });

    socket.on("move", (move) => {
        if (move == "speedUp") {
            cars.forEach((data) => {
                if (data.id === socket.id) {
                    data.car.speedUp();
                }
            });
        }
        if (move == "speedDown") {
            cars.forEach((data) => {
                if (data.id === socket.id) {
                    data.car.speedDown();
                }
            });
        }
        if (move == "turnLeft") {
            cars.forEach((data) => {
                if (data.id === socket.id) {
                    data.car.turnLeft();
                }
            });
        }
        if (move == "turnRight") {
            cars.forEach((data) => {
                if (data.id === socket.id) {
                    data.car.turnRight();
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
