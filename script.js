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
function generatePuzzle(size) {
    let answer = generateAnswer(size);
    let answerPositions = answer.positions;
    let tempBoard = generateBoard(size);
    console.log(answerPositions.length);
    for (let i = 0; i < 3 ** answerPositions.length - 1; i++) {
        tempBoard = generateBoard(size);
        for (let j = 0; j < answerPositions.length; j++) {
            if (Math.floor((i / (3 ** j)) % (3 ** j)) == 0) tempBoard[answerPositions[j].x][answerPositions[j].y] = "a";
            if (Math.floor((i / (3 ** j)) % (3 ** j)) == 1) tempBoard[answerPositions[j].x + DIRECTIONS[answerPositions[j].dir].x][answerPositions[j].y + DIRECTIONS[answerPositions[j].dir].y] = "+";
            if (Math.floor((i / (3 ** j)) % (3 ** j)) == 2) tempBoard[answerPositions[j].x + DIRECTIONS[answerPositions[j].dir].x * 2][answerPositions[j].y + DIRECTIONS[answerPositions[j].dir].y * 2] = "b";
        }
        console.log(solve(tempBoard));
    }

}
//0 1 2 3 4 5 6 7 8
//0 1 2 0 1 2 0 1 2 (0)
//0 0 0 1 1 1 2 2 2 (1)
function solve(puzzle, x, y) {
    let possiblePositions = [], tempPuzzle = puzzle;
    let solutionPositions = {
        "board": puzzle,
        "branches": []
    };
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
    let targetDepth = 0, finalDepth = 0;
    for (let i = 0; i < puzzle.length; i++) for (let j = 0; j < puzzle.length; j++) {
        if (possiblePositions[i][j].length) {
            finalDepth++;
        }
    }
    for (let i = 0; i < puzzle.length; i++) for (let j = 0; j < puzzle.length; j++) {
        if (possiblePositions[i][j].length) {
            targetDepth++;
            addChild(solutionPositions, possiblePositions[i][j], 1, targetDepth, finalDepth);
            if (finalDepth == targetDepth) return solutionBoard;
        }
    }
}
let solutionBoard = [];
function addChild(node, positions, depth, targetDepth, finalDepth) {
    if (node.branches.length) {
        for (let i of node.branches) {
            addChild(i, positions, depth + 1, targetDepth, finalDepth);
        }
    } else if (depth == targetDepth) {
        let tempPositions = [];
        for (let position of positions) {
            let tempBoard = structuredClone(node.board);
            if (!((tempBoard[position.x][position.y] == "a" || checkAvailability("a", position.x, position.y, tempBoard))
                && (tempBoard[position.x + DIRECTIONS[position.dir].x][position.y + DIRECTIONS[position.dir].y] == "+" || checkAvailability("+", position.x + DIRECTIONS[position.dir].x, position.y + DIRECTIONS[position.dir].y, tempBoard))
                && (tempBoard[position.x + DIRECTIONS[position.dir].x * 2][position.y + DIRECTIONS[position.dir].y * 2] == "b" || checkAvailability("b", position.x + DIRECTIONS[position.dir].x * 2, position.y + DIRECTIONS[position.dir].y * 2, tempBoard)))) continue;
            tempBoard[position.x][position.y] = "a";
            tempBoard[position.x + DIRECTIONS[position.dir].x][position.y + DIRECTIONS[position.dir].y] = "+";
            tempBoard[position.x + DIRECTIONS[position.dir].x * 2][position.y + DIRECTIONS[position.dir].y * 2] = "b";

            tempPositions.push({
                "board": tempBoard,
                "position": position,
                "branches": []
            });
        }
        node.branches.push(...tempPositions);
        if (targetDepth == finalDepth && node.branches.length) {
            solutionBoard = node.branches[0].board;
        }
    }
}
document.getElementById("startScreen").addEventListener("click", function () {
    document.getElementById("startScreen").classList.remove("show");
    document.getElementById("menu").classList.add("show");
});
document.getElementById("tutorialButton").addEventListener("click", function () {
    document.getElementById("menu").classList.remove("show");
    document.getElementById("tutorial").classList.add("show");
});
document.getElementById("freePlay").addEventListener("click", function () {
    document.getElementById("menu").classList.remove("show");
    document.getElementById("freePlayMenu").classList.add("show");
});
document.getElementById("todaysPuzzles").addEventListener("click", function () {
    document.getElementById("menu").classList.remove("show");
    document.getElementById("todaysPuzzlesMenu").classList.add("show");
});