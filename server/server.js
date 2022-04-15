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

var cars = []

app.get("/", (req, res) => {
    res.send("Server on");
});

io.on("connection", (socket) => {

    console.log("new connection")
    socket.on("connected", (car) => {
        cars.push({ "id": socket.id, car })
        socket.emit("id", socket.id)
    })
    socket.on("update", (x, y, speed, angle) => {
        cars.forEach((car) => {
            if (car.id == socket.id) {
                car.car.x = x;
                car.car.y = y;
                car.car.speed = speed;
                car.car.angle = angle;
            }
        })
        socket.emit("updateFromServer", cars)
    })
    socket.on("disconnect", () => {
        cars.forEach((car, indx) => {
            if (car.id == socket.id) {
                cars.splice(indx, 1)
            }
        })
    })
});
