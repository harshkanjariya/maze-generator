const current = {
    x: 0,
    y: 0,
};
const size = 40;
let stack = [];
let cells = [];
const borderWidth = 2;

function start() {
    angleMode(DEGREES);
    frameRate(parseInt(frameSelector.value));
    cells = [];
    for (let i = 0; i < 800 / size; i++) {
        const ar = [];
        for (let j = 0; j < 800 / size; j++) {
            ar.push({l: true, r: true, t: true, b: true, visited: false});
        }
        cells.push(ar);
    }
    stack = [];
    current.x = 0;
    current.y = 0;
}
function setup() {
    createCanvas(800, 800);
    start();
}


function rectangle(x, y, borders) {
    x *= size;
    y *= size;
    fill(200);
    rect(x, y, size, size);
    if (borders.visited)
        fill(255);
    let xn = borders.l ? x + borderWidth : x;
    let yn = borders.t ? y + borderWidth : y;
    let wn = borders.r ? (borders.l ? size - 2 * borderWidth : size - borderWidth) : (borders.l ? size - borderWidth : size);
    let hn = borders.b ? (borders.t ? size - 2 * borderWidth : size - borderWidth) : (borders.t ? size - borderWidth : size);
    rect(xn, yn, wn, hn);
}

function draw() {
    if (!allCellsVisited()) {
        updateCurrent();
    }
    cells.forEach((line, i) => {
        line.forEach((cell, j) => {
            rectangle(i, j, cell);
        });
    });
    fill('red');
    noStroke();
    rect(current.x * size, current.y * size, size, size);
}

function allCellsVisited() {
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (!cells[i][j].visited)
                return false;
        }
    }
    return true;
}

function updateCurrent() {
    cells[current.x][current.y].visited = true;
    let v = Math.ceil(Math.random() * 4);
    while (!isValidDirection(v)) {
        v = Math.ceil(Math.random() * 4);
    }
    const lastPos = getPreviousPosition();
    switch (v) {
        case 1:
            if (cells[current.x + 1][current.y].visited &&
                (current.x + 1 === lastPos.x && current.y === lastPos.y)) {
                stack.pop();
            } else {
                stack.push({
                    x: current.x,
                    y: current.y,
                });
            }
            break;
        case 2:
            if (cells[current.x][current.y + 1].visited &&
                (current.x === lastPos.x && current.y + 1 === lastPos.y)) {
                stack.pop();
            } else {
                stack.push({
                    x: current.x,
                    y: current.y,
                });
            }
            break;
        case 3:
            if (cells[current.x - 1][current.y].visited &&
                (current.x - 1 === lastPos.x && current.y === lastPos.y)) {
                stack.pop();
            } else {
                stack.push({
                    x: current.x,
                    y: current.y,
                });
            }
            break;
        case 4:
            if (cells[current.x][current.y - 1].visited &&
                (current.x === lastPos.x && current.y - 1 === lastPos.y)) {
                stack.pop();
            } else {
                stack.push({
                    x: current.x,
                    y: current.y,
                });
            }
            break;
    }
    switch (v) {
        case 1:
            cells[current.x][current.y].r = false;
            current.x += 1;
            cells[current.x][current.y].l = false;
            break;
        case 2:
            cells[current.x][current.y].b = false;
            current.y += 1;
            cells[current.x][current.y].t = false;
            break;
        case 3:
            cells[current.x][current.y].l = false;
            current.x -= 1;
            cells[current.x][current.y].r = false;
            break;
        case 4:
            cells[current.x][current.y].t = false;
            current.y -= 1;
            cells[current.x][current.y].b = false;
            break;
    }
}

function getPreviousPosition() {
    return stack.length ? stack[stack.length - 1] : {};
}

function isValidDirection(direction) {
    if (direction === 1 && current.x === cells.length - 1) {
        return false;
    } else if (direction === 2 && current.y === cells.length - 1) {
        return false;
    } else if (direction === 3 && current.x === 0) {
        return false;
    } else if (direction === 4 && current.y === 0) {
        return false;
    }
    const lastPos = getPreviousPosition();
    const allDirectionVisited = (current.x === cells.length - 1 || cells[current.x + 1][current.y].visited) &&
        (current.y === cells.length - 1 || cells[current.x][current.y + 1].visited) &&
        (current.x === 0 || cells[current.x - 1][current.y].visited) &&
        (current.y === 0 || cells[current.x][current.y - 1].visited);
    switch (direction) {
        case 1:
            if (cells[current.x + 1][current.y].visited &&
                !(allDirectionVisited && current.x + 1 === lastPos.x && current.y === lastPos.y)) {
                return false;
            }
            break;
        case 2:
            if (cells[current.x][current.y + 1].visited &&
                !(allDirectionVisited && current.x === lastPos.x && current.y + 1 === lastPos.y)) {
                return false;
            }
            break;
        case 3:
            if (cells[current.x - 1][current.y].visited &&
                !(allDirectionVisited && current.x - 1 === lastPos.x && current.y === lastPos.y)) {
                return false;
            }
            break;
        case 4:
            if (cells[current.x][current.y - 1].visited &&
                !(allDirectionVisited && current.x === lastPos.x && current.y - 1 === lastPos.y)) {
                return false;
            }
            break;
    }
    return true;
}