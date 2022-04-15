// const socket = io("http://localhost:3001");
import Car from "./Car.js";
import Bullet from "./Bullet.js"

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 1600;
const HEIGHT = 800;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const CARWIDTH = 150;
const CARHEGIHT = 100;

var carActions = new Set();
var bullets = []

const mycar = new Car(
    100,
    100,
    ctx,
    "./cars/white-car.png",
    "kralDragon",
    CARWIDTH,
    CARHEGIHT
);



// socket.emit("connected", mycar)

// socket.on("id", (id) => {
//     mycar.id = id
// })


animate();

function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    bullets.forEach((bullet) => {
        bullet.update();
    })
    mycar.update()
    carActions.forEach((item) => {
        if (item == "speedUp") {
            mycar.speedUp();
        } else if (item == "speedDown") {
            mycar.speedDown();
        } else if (item == "turnLeft") {
            mycar.turnLeft();
        } else if (item == "turnRight") {
            mycar.turnRight();
        }
    });
    // socket.emit("update", mycar.x, mycar.y, mycar.speed, mycar.angle)
    // socket.on("updateFromServer", (cars) => {
    //     cars.forEach((car) => {
    //         let c = car.car
    //         console.log(c.speed)
    //         let carFromServer = new Car(c.x, c.y, ctx, c.src, c.name, c.angle, c.speed)
    //         carFromServer.update();
    //     })
    // })
    requestAnimationFrame(animate);
}

function enemySpawner() {

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
    let radian = mycar.angle * Math.PI / 180;
    let velocity = {
        x: Math.cos(radian) * (10 + mycar.speed),
        y: Math.sin(radian) * (10 + mycar.speed)

    }
    bullets.push(new Bullet(mycar.x + Math.cos(radian) * CARWIDTH / 2, mycar.y + Math.sin(radian) * CARHEGIHT / 2, 10, "red", velocity, ctx))
})