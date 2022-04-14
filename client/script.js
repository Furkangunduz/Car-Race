import Car from "./Car.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1600;
const HEIGHT = 800;
const CARWIDTH = 150;
const CARHEGIHT = 100;
var actions = new Set();
canvas.width = WIDTH;
canvas.height = HEIGHT;

const car = new Car(
    100,
    100,
    ctx,
    "./cars/white-car.png",
    "kralDragon",
    CARWIDTH,
    CARHEGIHT
);
animate(car);

function animate() {
    car.update();
    actions.forEach((item) => {
        if (item == "speedUp") {
            car.speedUp();
        } else if (item == "speedDown") {
            car.speedDown();
        } else if (item == "turnLeft") {
            car.turnLeft();
        } else if (item == "turnRight") {
            car.turnRight();
        }
    });
    requestAnimationFrame(animate);
}

//eventlisteners
document.addEventListener("keydown", (e) => {
    if (e.key === "w" || e.key === "W") {
        actions.add("speedUp");
    }
    if (e.key === "s" || e.key === "S") {
        actions.add("speedDown");
    }
    if (e.key === "a" || e.key === "A") {
        actions.add("turnLeft");
    }
    if (e.key === "d" || e.key === "D") {
        actions.add("turnRight");
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "W") {
        actions.delete("speedUp");
    }
    if (e.key === "s" || e.key === "S") {
        actions.delete("speedDown");
    }
    if (e.key === "a" || e.key === "A") {
        actions.delete("turnLeft");
    }
    if (e.key === "d" || e.key === "D") {
        actions.delete("turnRight");
    }
});
