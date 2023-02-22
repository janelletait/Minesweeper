//Minesweeper - Janelle Tait (2023)

//generateArray takes 2 numbers and creates a 2D array of the specified dimensions
function generateArray(rows, cols) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

var grid;   //the 2D array of Cells which makes up the board
var rows;   //the height of the board
var cols;   //the width of the board
var w = 30; //the width of each Cell (in pixels)
var numBombs = 15;  //the number of bombs on the board

function setup() {
    createCanvas(401, 401);
    rows = floor(height / w);
    cols = floor(width / w);

    grid = generateArray(rows, cols);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    //generate random locations for the bombs to be placed on the board
    var min = 0;
    var max = (rows * cols) - 1;    //bomb locations will be represented by a single number
    var bombIndices = new Array();

    for (var i = 0; i < numBombs; i++) {
        bombIndices.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    //make sure all bomb locations are unique
    var uniqueValues = [];

    for (var i = 0; i < bombIndices.length; i++) {

        if (uniqueValues.includes(bombIndices[i])) {
            var newNum = bombIndices[i];

            //if a duplicate bomb location is found, re-genrerate it until it is unique
            while (uniqueValues.includes(newNum)) {
                newNum = Math.floor(Math.random() * (max - min + 1)) + min;
            }

            uniqueValues.push(newNum);
        }

        else {
            uniqueValues.push(bombIndices[i]);
        }
    }

    //convert the bomb locations into coordinates on the grid and plant the bombs
    for (var i = 0; i < uniqueValues.length; i++) {
        var bombRow = floor(uniqueValues[i] / cols);
        var bombCol = uniqueValues[i] - (bombRow * cols);
        grid[bombRow][bombCol].bomb = true;
    }

    //for each cell, determine how many bombs are adjacent to it
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].numSurroundingBombs();
        }
    }
}

//if the player clicks on a bomb, the game is over and all cells will be revealed
function gameOver() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].revealed = true;
        }
    }
}

//if the player clicks their mouse, reveal the Cell that was clicked on
function mousePressed() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                grid[i][j].reveal();

                if (grid[i][j].bomb == true) {
                    gameOver();
                }

            }
        }
    }
}

//this function draws the board when the game first begins
function draw() {
    background(255);

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].show();
        }
    }
}
