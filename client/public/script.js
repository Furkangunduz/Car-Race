//const socket = io("https://kdragonserver.herokuapp.com/");
const socket = io("http://localhost:8888");

import Car from "./Car.js";
import Bullet from "./Bullet.js";
import data from "./global_vars.js";
import Enemy from "./Enemy.js";

//login elements
const whiteCar = document.getElementById("white-car");
const leftcard = document.getElementById("left-card");
const rightcard = document.getElementById("right-card");

const blueCar = document.getElementById("blue-car");
const userName = document.getElementById("name");
const startBtn = document.getElementById("start");
const login = document.querySelector(".login");
//login elementss

var selectedCar = "";
var playerName = "";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const bg = new Image();
bg.src = "./cars/bg3.jpeg";

const WIDTH = data.WIDTH;
const HEIGHT = data.HEIGHT;
canvas.width = data.WIDTH;
canvas.height = data.HEIGHT;

var carActions = new Set();
var allbullets = [];
var allcars = [];
var allenemies = [];
var isGameStarted = false;
//this function calling from login js when player select car and write player name
//then game will began
function StartGame(carImgSrc, name) {
    const mycar = new Car(100, 100, 0, name, ctx, carImgSrc);
    socket.emit("connected", mycar.x, mycar.y, carImgSrc, name);
    isGameStarted = true;
}

socket.on("UPDATED_CARS", (cars) => {
    let newCars = [];
    cars.forEach((i) => {
        let car = new Car(
            i.car.x,
            i.car.y,
            i.car.angle,
            i.car.name,
            ctx,
            i.car.src,
            i.car.health
        );
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

socket.on("UPDATED_ENEMIES", (enemies) => {
    let newenemies = [];
    enemies.forEach((i) => {
        let enemy = new Enemy(i.x, i.y, i.radius, i.color, ctx);
        newenemies.push(enemy);
    });
    allenemies = newenemies;
});

animate();

function animate() {
    setInterval(() => {
        ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(-10, -10, WIDTH + 10, HEIGHT + 10);
        ctx.restore();
        allcars.forEach((car) => {
            car.draw();
        });
        allbullets.forEach((bullet) => {
            bullet.draw();
        });
        allenemies.forEach((enemy) => {
            enemy.draw();
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
            } else if (item == "newBullet") {
                socket.emit("move", "newBullet");
                carActions.delete("newBullet");
            }
        });
    }, 1000 / 60);
}

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
    if (e.key === " ") {
        carActions.add("newBullet");
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

blueCar.addEventListener("click", (e) => {
    if (!selectedCar) {
        selectedCar = "./cars/blue-car.png";
        leftcard.classList.add("selected");
    }
});
whiteCar.addEventListener("click", (e) => {
    if (!selectedCar) {
        selectedCar = "./cars/white-car.png";
        rightcard.classList.add("selected");
    }
});
userName.addEventListener("input", (e) => {
    playerName = e.target.value.slice(0, 7);
});

startBtn.addEventListener("click", () => {
    if (selectedCar && playerName) {
        login.style.display = "none";
        StartGame(selectedCar, playerName);
    }
});
