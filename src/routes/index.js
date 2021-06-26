const { Router } = require('express')
const router = Router()

let movimientos = []
let moviContra = []
const heuristica = [
    [120, -20, 20, 5, 5, 20, -20, 120],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [5, -5, 3, 3, 3, 3, -5, 5],
    [20, -5, 15, 3, 3, 15, -5, 20],
    [-20, -40, -5, -5, -5, -5, -40, -20],
    [120, -20, 20, 5, 5, 20, -20, 120],
]

var og_board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
]

const reOrdenar = () => {
    let listaAux = new Set()
    movimientos.forEach(movi => listaAux.add(movi.pos))
    movimientos = []
    listaAux.forEach(item => {
        movimientos.push({
            pos: item,
            h: heuristica[parseInt(item.split("")[0])][parseInt(item.split("")[1])]
        })
    })
    movimientos.sort((a, b) => (a.h > b.h) ? -1 : 1)
}

const newMatrix = () => {
    let array = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            array[i][j] = og_board[i][j]
        }
    }
    return array
}

const miniMaxContra = () => {
    if (moviContra.length == 0)
        return 0

    let contraAux = new Set()
    moviContra.forEach(moviCon => contraAux.add(moviCon.pos))
    moviContra = []
    contraAux.forEach(item => {
        moviContra.push({
            pos: item,
            h: heuristica[parseInt(item.split("")[0])][parseInt(item.split("")[1])]
        })
    })
    moviContra.sort((a, b) => (a.h > b.h) ? -1 : 1)
    return moviContra[0].h
}

const minimax = (turno) => {
    const enemy = turno == "1" ? "0" : "1"
    let map
    let x, y, pos, h
    movimientos = movimientos.slice(0, 4);
    for (let i = 0; i < movimientos.length; i++) {
        moviContra = []
        map = newMatrix()
        pos = movimientos[i].pos
        y = parseInt(pos.split("")[0])
        x = parseInt(pos.split("")[1])
        map[y][x] = turno
        moviContra = []
        find_enemy_spots(enemy, map)
        h = miniMaxContra()
        moviContra[i].h = moviContra[i].h - h
    }
    movimientos.sort((a, b) => (a.h > b.h) ? -1 : 1)
}

const moviBuscando = (move, rival, x, y, board) => {
    let x2 = 0,
        y2 = 0;
    let turno = (rival == "1") ? "0" : "1";
    if (move == 0) {
        x2 = x;
        for (y2 = y - 1; y2 > 0; y2--) {
            x2--;
            if (board[y2][x2] == rival && board[y2 - 1][x2 - 1] == "2") {
                return y2 - 1 + "" + (x2 - 1);
            } else if (board[y2][x2] == rival && board[y2 - 1][x2 - 1] == turno)
                return '99'
        }
    } else if (move == 1) {
        x2 = x;
        for (y2 = y - 1; y2 > 0; y2--) {
            if (board[y2][x2] == rival && board[y2 - 1][x2] == "2") {
                return y2 - 1 + "" + x2;
            } else if (board[y2][x2] == rival && board[y2 - 1][x2] == turno)
                return '99'
        }
    } else if (move == 2) {
        x2 = x;
        for (y2 = y - 1; y2 > 0; y2--) {
            x2++;
            if (board[y2][x2] == rival && board[y2 - 1][x2 + 1] == "2") {
                return y2 - 1 + "" + (x2 + 1);
            } else if (board[y2][x2] == rival && board[y2 - 1][x2 + 1] == turno)
                return '99'
        }
    } else if (move == 3) {
        y2 = y;
        for (x2 = x + 1; x2 < 7; x2++) {
            if (board[y2][x2] == rival && board[y2][x2 + 1] == "2") {
                return y2 + "" + (x2 + 1);
            } else if (board[y2][x2] == rival && board[y2][x2 + 1] == turno)
                return '99'
        }
    } else if (move == 4) {
        x2 = x;
        for (y2 = y + 1; y2 < 7; y2++) {
            x2++;
            if (board[y2][x2] == rival && board[y2 + 1][x2 + 1] == "2") {
                return y2 + 1 + "" + (x2 + 1);
            } else if (board[y2][x2] == rival && board[y2 + 1][x2 + 1] == turno)
                return '99';
        }
    } else if (move == 5) {
        x2 = x;
        for (y2 = y + 1; y2 < 7; y2++) {
            if (board[y2][x2] == rival && board[y2 + 1][x2] == "2") {
                return y2 + 1 + "" + x2;
            } else if (board[y2][x2] == rival && board[y2 + 1][x2] == turno)
                return "99";
        }
    } else if (move == 6) {
        x2 = x;
        for (y2 = y + 1; y2 < 7; y2++) {
            x2--;
            if (board[y2][x2] == rival && board[y2 + 1][x2 - 1] == "2") {
                return y2 + 1 + "" + (x2 - 1);
            } else if (board[y2][x2] == rival && board[y2 + 1][x2 - 1] == turno)
                return "99";
        }
    } else if (move == 7) {
        y2 = y;
        for (x2 = x - 1; x2 > 0; x2--) {
            if (board[y2][x2] == rival && board[y2][x2 - 1] == "2") {
                return y2 + "" + (x2 - 1);
            } else if (board[y2][x2] == rival && board[y2][x2 - 1] == turno)
                return "99";

        }
    }
    return "99";
}

router.get('/reversi', (req, res) => {
    const { turno, estado } = req.query
    let arrayisito = estado.split('')
    fill_board(arrayisito);
    find_spots(turno);
    reOrdenar();
    minimax(turno);
    if (movimientos.length > 1) {
        if (movimientos.length > 3 && movimientos[0].h == movimientos[1].h && movimientos[1].h == movimientos[2].h) {
            let indx = Math.floor(Math.random() * 3)
            res.send(movimientos[indx].pos);
        } else {
            let indx = Math.floor(Math.random() * 2)
            res.send(movimientos[indx].pos);
        }
    } else {
        console.log(movimientos)
        res.send(movimientos[0].pos);
    }
})

module.exports = router