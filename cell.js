function Cell(row, col, w) {
    this.x = col * w;   //x coordinate 
    this.y = row * w;   //y coordinate
    this.bomb = false;  //true if the Cell contains a bomb
    this.neighbourBombs = 0;    //the number of bombs surrounding the Cell
    this.w = w;  //the width of the Cell
    this.col = col;     //the column (x coordinate) of the Cell in the grid
    this.row = row;     //the row (y coordinate) of the Cell in the grid
    this.revealed = false;     //whether or not the Cell has been revealed
}

//updates the display of all Cells throughout gameplay
Cell.prototype.show = function () {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);

    if (this.revealed == true) {
        if (this.bomb == true) {    //if the Cell contains a bomb, display a red circle
            fill('red');
            ellipse(this.x + (this.w * 0.5), this.y + (this.w * 0.5), this.w * 0.5);
        }

        else {  //if the Cell doesn't contain a bomb, display the number of surrounding bombs, if any
            fill(200);
            rect(this.x, this.y, this.w, this.w);

            if (this.neighbourBombs > 0) {
                textAlign(CENTER);
                fill(0);
                text(this.neighbourBombs, this.x + (this.w * 0.5), this.y + (this.w * 0.6));
            }
        }
    }
}

//counts the number of bombs surrounding a Cell
Cell.prototype.numSurroundingBombs = function () {
    if (this.bomb == true) {
        this.neighbourBombs = -1;
        return;
    }

    for (var yPtr = this.row - 1; yPtr <= this.row + 1; yPtr++) {
        if (yPtr < 0 || yPtr >= rows) {
            continue;
        }

        for (var xPtr = this.col - 1; xPtr <= this.col + 1; xPtr++) {
            if (xPtr < 0 || xPtr >= cols) {
                continue;
            }

            if (grid[yPtr][xPtr].bomb == true) {
                this.neighbourBombs += 1;
            }
        }
    }
}

//determines if the given screen coordinates fall within the bounds of the Cell
Cell.prototype.contains = function (x, y) {
    var containing = false;

    if (x > this.x && x < (this.x + this.w)) {

        if (y > this.y && y < (this.y + this.w)) {
            containing = true;
        }
    }

    return containing;
}

//sets the Cell to be displayed
Cell.prototype.reveal = function () {
    this.revealed = true;

    //if the Cell is not adjacent to any bombs, reveal all of the surrounding Cells as well
    if (this.neighbourBombs == 0) {
        this.flood();
    }
}

//reveal all of the surrounding Cells
Cell.prototype.flood = function () {
    for (var yPtr = -1; yPtr <= 1; yPtr++) {
        var i = this.row + yPtr;

        if (i < 0 || i >= rows) {
            continue;
        }

        for (var xPtr = -1; xPtr <= 1; xPtr++) {
            var j = this.col + xPtr;

            if (j < 0 || j >= cols) {
                continue;
            }

            var neighbour = grid[i][j];

            if (neighbour.revealed == false) {
                neighbour.reveal();
            }
        }
    }
}