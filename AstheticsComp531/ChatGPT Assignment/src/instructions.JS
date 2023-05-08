const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.querySelector("body").appendChild(canvas);

canvas.width = 1000;
canvas.height = 1000;

let hue = 0; //0 to 360 changes in the x change the hue
let saturation = 100;//0 to 100% changes in the y change the saturation
let lightness = 50;//0 to 100%

let currentDirection = [5, 0];
let currentPosition = [500, 500];

const stepsBeforeDirChange = 5;

const squareSize = 10;//each square will be 10x10;

const tranformPerStep = squareSize / 2;

const numberOfIterartions = 1000;

const chosenColor = 360*Math.random()
function drawSquare() {
    let sqWidth = squareSize;
    let sqHeight = squareSize;
    ctx.fillStyle = `hsl(${chosenColor},${saturation}%,${lightness}%)`;
    ctx.fillRect(currentPosition[0], currentPosition[1], sqWidth, sqHeight);
    console.log(currentPosition);
}

function draw() {
    for (let x = 0; x < numberOfIterartions; x++) {

        drawSquare();
        const randomValue = Math.floor(Math.random() * 4);
        if (randomValue === 0) {
            //moving up
            let tempPos = currentPosition;
            currentDirection = [currentDirection[0], 5];
            currentPosition = [tempPos[0] + currentDirection[0], tempPos[1] + currentDirection[1]];
        }
        else if (randomValue === 1) {
            //moving down
            let tempPos = currentPosition;
            currentDirection = [currentDirection[0], -5];
            currentPosition = [tempPos[0] + currentDirection[0], tempPos[1] + currentDirection[1]];
        }
        else if (randomValue === 2) {
            //moving left
            let tempPos = currentPosition;
            currentDirection = [-5, currentDirection[1]];
            currentPosition = [tempPos[0] + currentDirection[0], tempPos[1] + currentDirection[1]];
        }
        else if (randomValue === 3) {
            //moving right
            let tempPos = currentPosition;
            currentDirection = [5, currentDirection[1]];
            currentPosition = [tempPos[0] + currentDirection[0], tempPos[1] + currentDirection[1]];
        }
        lightness = Math.abs(currentPosition[0] % 100);
        saturation = Math.abs(currentPosition[1] % 100);

    }
}

draw();


//chat GPT version 
// const canvas = document.createElement('canvas');
// const ctx = canvas.getContext('2d');
// document.querySelector("body").appendChild(canvas);

// // Set canvas dimensions
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// // Set initial square parameters
// let x = canvas.width / 2;
// let y = canvas.height / 2;
// let hue = Math.floor(Math.random() * 360);
// let saturation = 50;
// let lightness = 50;
// let xDirection = Math.random() > 0.5 ? 1 : -1;
// let yDirection = Math.random() > 0.5 ? 1 : -1;

// function drawSquare() {
//   // Change position randomly
//   if (x < 0 || x > canvas.width) {
//     xDirection *= -1;
//   }
//   if (y < 0 || y > canvas.height) {
//     yDirection *= -1;
//   }
//   x += xDirection * Math.random() * 10;
//   y += yDirection * Math.random() * 10;

//   // Change saturation and lightness based on position
//   saturation = Math.abs(y - canvas.height / 2) / (canvas.height / 2) * 100;
//   lightness = Math.abs(x - canvas.width / 2) / (canvas.width / 2) * 100;

//   // Set fill style to HSLA color
//   ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;

//   // Draw square
//   ctx.fillRect(x, y, 50, 50);
// }

// function animate() {
//   // Clear canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw square
//   drawSquare();

//   // Request next animation frame
//   requestAnimationFrame(animate);
// }

// // Start animation loop
// animate();


