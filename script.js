const ctx = document.getElementById('1').getContext('2d');
let minSize = 0;
let maxSize = 0;
let speed = 0;

ctx.imageSmoothingEnabled = true;
document.body.onresize = resizeCanvas;
resizeCanvas();

let start = getRandomParams();
let next = start;
let stepsLeft = 0;
let step = {};

animate();

function updateValues() {
    const getValue = id => Number(document.getElementById(id).value);
    minSize = getValue('minSize');
    maxSize = getValue('maxSize');
    speed = getValue('speed');
}

function resizeCanvas() {
    const image = getCanvasImage();
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.putImageData(image, 0, 0);
}

function getCanvasImage() {
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getRandomParams() {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

    return {
        x: getRandomInt(0, ctx.canvas.width),
        y: getRandomInt(0, ctx.canvas.height),
        size: getRandomInt(minSize, maxSize),
        r: getRandomInt(0, 256),
        g: getRandomInt(0, 256),
        b: getRandomInt(0, 256)
    };
}

function getStepsCount(from, to) {
    const v = {
        x: to.x - from.x,
        y: to.y - from.y
    };

    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function getDelta(from, to, steps) {
    let step = {};
    Object.keys(from)
        .forEach(key => step[key] = (to[key] - from[key]) / steps);

    return step;
}

function getSum(start, step) {
    let result = {};
    Object.keys(start)
        .forEach(key => result[key] = start[key] + step[key]);

    return result;
}

function decToHex(n) {
    const hex = Number(Math.round(n)).toString(16);
    return hex.length === 2
        ? hex
        : "0" + hex;
}

function rgbToHex(rgb) {
    return '#' + decToHex(rgb.r) + decToHex(rgb.g) + decToHex(rgb.b);
}

function drawCircle(params) {
    ctx.fillStyle = rgbToHex(params);
    ctx.beginPath();
    ctx.arc(params.x, params.y, params.size, 0, 2 * Math.PI);
    ctx.fill();
}

function animate() {
    updateValues();

    const points = [start];
    for (let i = 0; i < speed; i++) {
        if (stepsLeft < 1) {
            next = getRandomParams();
            stepsLeft = getStepsCount(start, next);
            step = getDelta(start, next, stepsLeft);
        }
        start = getSum(start, step);
        points.push(start);
        stepsLeft--;
    }

    points.forEach(p => drawCircle(p));

    ctx.fillStyle = '#ffffff' + decToHex(fade);
    ctx.beginPath();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    requestAnimationFrame(animate);
}
