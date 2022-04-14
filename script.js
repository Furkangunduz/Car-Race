import Car from "./Car.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1600;
const HEIGHT = 800;
const CARWIDTH = 100;
const CARHEGIHT = 75;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const car = new Car(
    100,
    100,
    ctx,
    "./cars/white-car2.png",
    "KralDragon",
    CARWIDTH,
    CARHEGIHT
);

function gameloop() {
    car.update();
    requestAnimationFrame(gameloop);
}

gameloop();

document.addEventListener("keydown", (e) => {
    if (e.key === "w" || e.key === "W") {
        car.speedUp();
    }
    if (e.key === "s" || e.key === "S") {
        car.speedDown();
    }
    if (e.key === "a" || e.key === "A") {
        car.turnLeft();
    }
    if (e.key === "d" || e.key === "D") {
        car.turnRight();
    }
});
