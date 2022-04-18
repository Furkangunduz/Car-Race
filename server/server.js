const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 8888;
const server = app.listen(PORT);
const Car = require("./classes/Car.js");
const Bullet = require("./classes/Bullet.js");
const Enemy = require("./classes/Enemy.js");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

var cars = [];
var bullets = [];
var enemies = [];

//for removing bullet which is not seeing on canvas
const canvasWIDTH = 3000;
const canvasHEIGHT = 3000;

const updateInterval = setInterval(() => {
    cars.forEach((car, cIndex) => {
        enemies.forEach((enemy, eIndex) => {
            let dist = Math.hypot(car.car.x - enemy.x, car.car.y - enemy.y);
            if (dist - car.car.carWidth / 2 - enemy.radius < 0) {
                enemies.splice(eIndex, 1);
                cars[cIndex].car.health -= 10;
            }
        });
        if (car.car.health == 0) {
            car.car.x = 100;
            car.car.y = 100;
            car.car.health = 100;
            car.car.speed = 0;
            car.car.angle = 0;
        }
        car.car.update();
    });
    bullets.forEach((bullet, bIndex) => {
        if (
            bullet.x + bullet.radius < 0 ||
            bullet.x - bullet.radius > canvasWIDTH ||
            bullet.y + bullet.radius < 0 ||
            bullet.y - bullet.radius > canvasHEIGHT
        ) {
            bullets.splice(bIndex, 1);
        }
        enemies.forEach((enemy, eIndex) => {
            let dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist - bullet.radius - enemy.radius < 0) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
        bullet.update();
    });

    enemies.forEach((enemy, index) => {
        if (
            enemy.x + enemy.radius < 0 ||
            enemy.x - enemy.radius > canvasWIDTH ||
            enemy.y + enemy.radius < 0 ||
            enemy.y - enemy.radius > canvasHEIGHT
        ) {
            enemies.splice(index, 1);
        }

        enemy.update();
    });
}, 1000 / 60);

const broadCastInterval = setInterval(() => {
    io.emit("UPDATED_CARS", cars);
    io.emit("UPDATED_BULLETS", bullets);
    io.emit("UPDATED_ENEMIES", enemies);
}, 1000 / 60);

spawnEnemies();

function spawnEnemies() {
    setInterval(() => {
        if (cars.length > 0) {
            let x;
            let y;
            let randomRadius = 100 * Math.random();
            let radius = randomRadius < 50 ? 50 : randomRadius;
            let randomCar = cars[Math.floor(Math.random() * cars.length)].car;
            if (Math.random() > 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : 3000 + radius;
                y = Math.random() * 2000;
            } else {
                x = Math.random() * 3000;
                y = Math.random() < 0.5 ? 0 - radius : 2000 + radius;
            }

            const angle = Math.atan2(randomCar.y - y, randomCar.x - x);
            let color = `rgb(${Math.random() * 255},${Math.random() * 255},${
                Math.random() * 255
            })`;
            let random = Math.random() * 3;
            var enemySpeed = random < 2 ? 2 : random;
            const velocity = {
                x: Math.cos(angle) * enemySpeed,
                y: Math.sin(angle) * enemySpeed,
            };
            const enemy = new Enemy(x, y, radius, color, velocity);
            enemies.push(enemy);
        }
    }, 750);
}

io.on("connection", (socket) => {
    socket.on("connected", (x, y, img, name) => {
        let car = new Car(x, y, img, name);
        cars.push({ id: socket.id, car });
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
        if (move == "newBullet") {
            cars.forEach((data) => {
                if (data.id === socket.id) {
                    let radian = (data.car.angle * Math.PI) / 180;
                    let bulletX =
                        data.car.x + (Math.cos(radian) * data.car.carWidth) / 2;
                    let bulletY =
                        data.car.y +
                        (Math.sin(radian) * data.car.carHeight) / 2;
                    let velocity = {
                        x: Math.cos(radian) * (10 + data.car.speed),
                        y: Math.sin(radian) * (10 + data.car.speed),
                    };
                    bullets.push(new Bullet(bulletX, bulletY, velocity));
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
