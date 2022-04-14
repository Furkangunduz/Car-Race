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

app.get("/", (req, res) => {
    res.send("Server on");
});

io.on("connection", (socket) => {
    console.log("new connecion", socket.id);
});
