const whiteCar = document.getElementById("white-car");
const leftcard = document.getElementById("left-card");
const rightcard = document.getElementById("right-card");

const blueCar = document.getElementById("blue-car");
const userName = document.getElementById("name");
const startBtn = document.getElementById("start");
const login = document.querySelector(".login");

var selectedCar = "";
var playerName = "";

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
        startGame();
    }
});
