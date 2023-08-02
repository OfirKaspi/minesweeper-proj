
const MINE = '💣'
var gBoard
var gMines

var gLevel = {
    SIZE: 4,
    MINES: 2
}
   

function onInit(){
    buildBoard()
    renderMines()
    setMinesNegsCount(gBoard)
    renderBoard()
}

function buildBoard() {
    gBoard = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false           
            };
        }
    }
    // gBoard[1][1].isMine = true
    // gBoard[3][3].isMine = true
}       

function renderBoard() {
    var strHTML = "";
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j];
            const className = (cell.isMine) ? 'mine' : ''

            strHTML += `\t <td data-i="${i}" data-j="${j}"
                        class="cell covered ${className}" 
                        onclick="onCellClicked(this, ${i}, ${j})">
                    </td>\n`;
        }
        strHTML += `</tr>\n`;
    }
    const elCells = document.querySelector('.board-cells');
    elCells.innerHTML = strHTML;
}

function setMinesNegsCount(gBoard){
    for( var i = 0; i < gBoard.length; i++){
        for( var j = 0; j < gBoard[0].length; j++){
            currCell = gBoard[i][j]
            currCell.minesAroundCount = checkNeighbors(gBoard, i, j)
            // console.log(currCell)
        }
    }
}

function checkNeighbors(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isMine) {
                count++;
            }
        }
    }
    return count;
}

function onCellClicked(elCell, i, j){
    const cell = gBoard[i][j];
    if (!cell.isShown) {
        cell.isShown = true;
        elCell.classList.remove('covered');
        if(cell.isMine){
            elCell.innerText = MINE    
        }else if(cell.minesAroundCount > 0){
            elCell.innerText = cell.minesAroundCount
        }else{
            expandShown(gBoard,i, j)
        }
    }
}

function expandShown(board,rowIdx, colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue;
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if(!currCell.isMine && !currCell.isShown){
                currCell.isShown = true
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.classList.remove('covered')
                if (currCell.minesAroundCount > 0) {
                    elCell.innerText = currCell.minesAroundCount;
                } else {
                    expandShown(board, i, j);
                }
            }
        }
    }
}

function renderMines(){
    gMines = []
    var positions = []
    var boardSize = gBoard.length * gBoard[0].length

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            positions.push({ i, j })
        }
    }

    for (var n = boardSize - 1; n > 0; n--) {
        var k = Math.floor(Math.random() * (n + 1));
        [positions[n], positions[k]] = [positions[k], positions[n]]
    }

    for (var i = 0; i < gLevel.MINES; i++) {
        var mineLocation = positions[i];
        gBoard[mineLocation.i][mineLocation.j].isMine = true
        gMines.push({ i: mineLocation.i, j: mineLocation.j })
    } 
    console.log(gMines);
}   

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
  