const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 1600;
const HEIGHT = 900;
const CAR_WIDTH = 50;
const CAR_HEGIHT = 50;

canvas.width = WIDTH;
canvas.height = HEIGHT;

class Car {
    constructor(x, y, src) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.src = src;
        this.angle = 180;
        this.radian = degreesToRadian(this.angle);
        this.gas = 0;
        this.maximumGas = 7;
        this.velocity = {
            x: 0,
            y: 0,
        };
    }
    draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.drawImage(this.img, this.x, this.y, CAR_WIDTH, CAR_HEGIHT);
    }
    goForward() {
        this.gas =
            this.gas < this.maximumGas ? (this.gas += 0.45) : this.maximumGas;
        this.velocity = {
            x: Math.cos(this.radian) * this.gas,
            y: Math.sin(this.radian) * this.gas,
        };
    }
    goBack() {
        if (this.gas > 0) {
            this.gas -= 0.55;
        } else {
            if (this.gas > -this.maximumGas) {
                this.gas -= 0.25;
            } else {
                this.gas = -this.maximumGas;
            }
        }
        this.velocity = {
            x: Math.cos(this.radian) * this.gas,
            y: Math.sin(this.radian) * this.gas,
        };
    }
    slowDown() {
        this.gas =
            this.gas != 0
                ? this.gas < 0
                    ? (this.gas += 0.4)
                    : (this.gas -= 0.4)
                : null;
        this.velocity = {
            x: Math.cos(this.radian) * this.gas,
            y: Math.sin(this.radian) * this.gas,
        };
    }
    turnLeft() {
        this.angle++;
        this.radian = degreesToRadian(this.angle % 360);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.radian);
        draw();
        ctx.rotate(this.angle - Math.PI / 2.0);
        ctx.translate(-x, -y);
    }
    update() {
        car.x += this.velocity.x;
        car.y += this.velocity.y;
        if (car.x < 0) {
            this.x = 0;
        }
        if (car.x + CAR_WIDTH > WIDTH) {
            this.x = WIDTH - CAR_WIDTH;
        }
        car.draw();
    }
}

const car = new Car(300, 300, './cars/red-car.png');

function gameloop() {
    car.update();
    fillBgDark();
    requestAnimationFrame(gameloop);
}
function fillBgDark() {
    ctx.beginPath();
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fill();
}
function degreesToRadian(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

gameloop();

document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        car.goForward();
    }
    if (e.key === 's' || e.key === 'S') {
        car.goBack();
    }
    if (e.key === 'a' || e.key === 'A') {
        car.turnLeft();
    }
});

document.addEventListener('keyup', (e) => {
    if (!e.key) {
        car.slowDown();
    }
});
