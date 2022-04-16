// const socket = io("https://kdragonserver.herokuapp.com/");
import Car from "./Car.js";
import Bullet from "./Bullet.js";
import data from "./global_vars.js";

const socket = io("http://localhost:3001");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = data.WIDTH;
const HEIGHT = data.HEIGHT;
canvas.width = data.WIDTH;
canvas.height = data.HEIGHT;

const carImg = "./cars/white-car.png";

const mycar = new Car(100, 100, 0, ctx, carImg);

var carActions = new Set();
var allbullets = [];
var allcars = [];

socket.emit("connected", mycar.x, mycar.y, carImg);

socket.on("UPDATED_CARS", (cars) => {
    let newCars = [];
    cars.forEach((i) => {
        let car = new Car(i.car.x, i.car.y, i.car.angle, ctx, i.car.src);
        newCars.push(car);
    });
    allcars = newCars;
});

socket.on("UPDATED_BULLETS", (bullets) => {
    let newbullets = [];
    bullets.forEach((i) => {
        let bullet = new Bullet(i.x, i.y, i.radius, "red", ctx);
        newbullets.push(bullet);
    });
    allbullets = newbullets;
});
animate();

function animate() {
    setInterval(() => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        allcars.forEach((car) => {
            car.draw();
            car.drawName();
        });
        allbullets.forEach((bullet) => {
            bullet.draw();
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
    socket.emit("new_bullet");
});
