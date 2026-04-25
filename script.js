function generateBoard(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        let tempArr = [];
        for (let j = 0; j < size; j++) tempArr.push("");
        arr.push(tempArr);
    }
    return arr;
}
/*
7 0 1
6 * 2
5 4 3
*/
const DIRECTIONS = [{ "x": -1, "y": 0 }, { "x": -1, "y": 1 }, { "x": 0, "y": 1 }, { "x": 1, "y": 1 }, { "x": 1, "y": 0 }, { "x": 1, "y": -1 }, { "x": 0, "y": -1 }, { "x": -1, "y": -1 }];
function generateAnswer(size) {
    let board = generateBoard(size);
    let addedPositions = [];
    let positionsAvailable = getPositionsAvailable(board);
    while (positionsAvailable.length) {
        let selectedPosition = positionsAvailable[Math.floor(Math.random() * positionsAvailable.length)];
        addedPositions.push(selectedPosition);
        board[selectedPosition.x][selectedPosition.y] = "a";
        board[selectedPosition.x + DIRECTIONS[selectedPosition.dir].x][selectedPosition.y + DIRECTIONS[selectedPosition.dir].y] = "+";
        board[selectedPosition.x + DIRECTIONS[selectedPosition.dir].x * 2][selectedPosition.y + DIRECTIONS[selectedPosition.dir].y * 2] = "b";
        positionsAvailable = getPositionsAvailable(board);
    }
    let str = "";
    for (let i of board) {
        for (let j = 0; j < i.length; j++) {
            if (!i[j]) i[j] = " ";
            str += i[j];
        }
        str += "\r\n";
    }
    console.log(str);
    return {
        "board": board,
        "positions": addedPositions
    };
}
function getPositionsAvailable(board) {
    let positionsAvailable = [];
    for (let i = 0; i < board.length; i++) for (let j = 0; j < board.length; j++) for (let dirIndex = 0; dirIndex < DIRECTIONS.length; dirIndex++) {
        if (checkAvailability("a", i, j, board) && checkAvailability("+", i + DIRECTIONS[dirIndex].x, j +
            DIRECTIONS[dirIndex].y, board) && checkAvailability("b", i + DIRECTIONS[dirIndex].x * 2, j +
                DIRECTIONS[dirIndex].y * 2, board)) {
            positionsAvailable.push({
                "x": i,
                "y": j,
                "dir": dirIndex
            });
        }
    }
    return positionsAvailable;
}
function checkAvailability(char, x, y, board) {
    if (x < 0 || x >= board.length || y < 0 || y >= board.length || board[x][y]) return false;
    else if (char == " ") return true;
    else return !((x - 1 >= 0 && board[x - 1][y] == char) || (x + 1 < board.length && board[x + 1][y] == char) || (y - 1 >= 0
        && board[x][y - 1] == char) || (y + 1 < board.length && board[x][y + 1] == char));
}
function generatePuzzle(answer) {
    let solution = generateBoard(answer.size);
}
function solve(puzzle, x, y) {
    let solutionPositions = [], possiblePositions = [], tempPuzzle = puzzle;
    for (let i = 0; i < puzzle.length; i++) {
        possiblePositions.push([]);
        for (let j = 0; j < puzzle.length; j++) possiblePositions[i].push([]);
    }

    for (let i = 0; i < puzzle.length; i++) for (let j = 0; j < puzzle.length; j++) {
        if (puzzle[i][j] == "a") {
            for (let dirIndex = 0; dirIndex < DIRECTIONS.length; dirIndex++) {
                if (checkAvailability("+", i + DIRECTIONS[dirIndex].x, j + DIRECTIONS[dirIndex].y, puzzle) && checkAvailability("b", i + DIRECTIONS[dirIndex].x * 2, j + DIRECTIONS[dirIndex].y * 2, puzzle)) {
                    possiblePositions[i][j].push({
                        "x": i,
                        "y": j,
                        "dir": dirIndex
                    });
                }
            }
        } else if (puzzle[i][j] == "+") {
            for (let dirIndex = 0; dirIndex < DIRECTIONS.length; dirIndex++) {
                if (checkAvailability("a", i - DIRECTIONS[dirIndex].x, j - DIRECTIONS[dirIndex].y, puzzle) && checkAvailability("b", i + DIRECTIONS[dirIndex].x, j + DIRECTIONS[dirIndex].y, puzzle)) {
                    possiblePositions[i][j].push({
                        "x": i - DIRECTIONS[dirIndex].x,
                        "y": j - DIRECTIONS[dirIndex].y,
                        "dir": dirIndex
                    });
                }
            }
        } else if (puzzle[i][j] == "b") {
            for (let dirIndex = 0; dirIndex < DIRECTIONS.length; dirIndex++) {
                if (checkAvailability("a", i - DIRECTIONS[dirIndex].x * 2, j - DIRECTIONS[dirIndex].y * 2, puzzle) && checkAvailability("+", i - DIRECTIONS[dirIndex].x, j - DIRECTIONS[dirIndex].y, puzzle)) {
                    possiblePositions[i][j].push({
                        "x": i - DIRECTIONS[dirIndex].x * 2,
                        "y": j - DIRECTIONS[dirIndex].y * 2,
                        "dir": dirIndex
                    });
                }
            }
        }
    }
    for (let i = 0; i < puzzle.length; i++) for (let j = 0; j < puzzle.length; j++) {
        if (possiblePositions[i][j].length) {
            addChild(solutionPositions, possiblePositions[i][j]);
        }
    }
    
    let currentBranch = solutionPositions;
    while (currentBranch.length) {
        let i = currentBranch[0].position;
        tempPuzzle[i.x][i.y] = "a";
        tempPuzzle[i.x + DIRECTIONS[i.dir].x][i.y + DIRECTIONS[i.dir].y] = "+";
        tempPuzzle[i.x + DIRECTIONS[i.dir].x * 2][i.y + DIRECTIONS[i.dir].y * 2] = "b";
        currentBranch = currentBranch[0].branches;
    }
    return tempPuzzle;
}
function addChild(tree, positions) {
    if (tree.length) {
        for (let i of tree) {
            addChild(i.branches, positions);
        }
    } else {
        let tempPositions = [];
        for (let position of positions) {
            tempPositions.push({
                "position": position,
                "branches": []
            });
        }
        tree.push(...tempPositions);
    }
}
document.getElementById("startScreen").addEventListener("click",function(){
    document.getElementById("startScreen").classList.remove("show")
    document.getElementById("menu").classList.add("show")
})
document.getElementById("tutorialButton").addEventListener("click",function(){
    document.getElementById("menu").classList.remove("show")
    document.getElementById("tutorial").classList.add("show")
})