const matrix = document.getElementById("matrix");
const board = document.getElementById("board");
const cells = document.getElementsByClassName("cell");
const playmatrix = {
  3: {
    playboard: Array.from(Array(9).keys()),
    winPatterns: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
  },
  5: {
    playboard: Array.from(Array(25).keys()),
    winPatterns: [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ],
  },
};
let playboard = playmatrix[3].playboard;
let winPatterns = playmatrix[3].winPatterns;

const weapon = document.getElementById("weapon");
const weapons = [
  `<i class="fa-solid fa-x"></i>`,
  `<i class="fa-solid fa-o"></i>`,
  `<i class="fa-solid fa-bomb"></i>`,
  `<i class="fa-solid fa-heart"></i>`,
  `<i class="fa-solid fa-drumstick-bite"></i>`,
  `<i class="fa-solid fa-brain"></i>`,
  `<i class="fa-solid fa-wand-magic-sparkles"></i>`,
  `<i class="fa-solid fa-wrench"></i>`,
  `<i class="fa-solid fa-money-bill-wave"></i>`,
  `<i class="fa-solid fa-square-root-variable"></i>`,
  `<i class="fa-solid fa-truck"></i>`,
];
const compWeapon = document.getElementById("comp-weapon");
const yourWeapon = document.getElementById("your-weapon");
let comp = weapons[1];
let you = weapons[0];

const result = document.getElementById("result");
const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");

let endGame = true;

matrix.onchange = () => {
  setMatrix();
};

weapon.onchange = () => {
  chooseYourWeapon();
};

playBtn.onclick = () => {
  matrix.disabled = true;
  weapon.disabled = true;
  endGame = false;

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", play);
  }
};

resetBtn.onclick = () => {
  if (endGame) {
    location.reload();
  }
};

const setMatrix = () => {
  let num = Number(matrix.value);

  board.innerHTML = createCells(num);

  playboard = playmatrix[num].playboard;
  winPatterns = playmatrix[num].winPatterns;

  for (let i = 0; i < cells.length; i++) {
    cells[i].setAttribute("id", i);
  }
};

const createCells = (num) => {
  let content = "";

  for (let i = 0; i < num; i++) {
    content += `<tr>`;

    for (let j = 0; j < num; j++) {
      content += `<td class="cell"></td>`;
    }

    content += `</tr>`;
  }

  return content;
};

setMatrix();

const chooseYourWeapon = () => {
  let x = Number(weapon.value);
  let y;

  if (x == 0) {
    y = 1;
  } else if (x == 1) {
    y = 0;
  } else {
    do {
      y = Math.floor(Math.random() * 9) + 2;
    } while (y == x);
  }

  comp = weapons[y];
  you = weapons[x];
  compWeapon.innerHTML = weapons[y];
  yourWeapon.innerHTML = weapons[x];
};

const play = (cell) => {
  if (isNaN(playboard[cell.target.id])) {
    return;
  }

  let x = move(cell.target.id, you);
  let y;
  let checkTie = playboard.every((e) => isNaN(e));

  if (!x && !checkTie) {
    y = move(minimax(comp).index, comp);
  }

  if (x || y || checkTie) {
    endGame = true;

    if (x) {
      displayResult(x);
    } else if (y) {
      displayResult(y);
    } else {
      result.innerHTML = "TIE!";
    }

    result.style.display = "flex";

    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", play);
    }
  }
};

const move = (id, player) => {
  document.getElementById(id).innerHTML = player;
  playboard[id] = player;

  return checkWin(player);
};

const minimax = (player) => {
  let availableCells = playboard.filter((e) => !isNaN(e));

  if (checkWin(you)) {
    return { score: -10 };
  } else if (checkWin(comp)) {
    return { score: 10 };
  } else if (availableCells.length == 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availableCells.length; i++) {
    let move = {};

    move.index = availableCells[i];
    playboard[availableCells[i]] = player;

    if (player == you) {
      let result = minimax(comp);
      move.score = result.score;
    } else if (player == comp) {
      let result = minimax(you);
      move.score = result.score;
    }

    playboard[availableCells[i]] = move.index;
    moves.push(move);
  }

  let bestMove;

  if (player == you) {
    let bestScore = 1000;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else if (player == comp) {
    let bestScore = -1000;

    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

const checkWin = (player) => {
  let takenCells = playboard.reduce(
    (a, e, i) => (e == player ? a.concat(i) : a),
    []
  );

  for (let x of winPatterns) {
    if (x.every((e) => takenCells.includes(e))) {
      return { pattern: x, player: player };
    }
  }

  return 0;
};

const displayResult = (who) => {
  who.pattern.forEach(
    (e) => (document.getElementById(e).style.background = "#37465b")
  );

  if (who.player == comp) {
    result.innerHTML = "DEFEATED!";
  } else if (who.player == you) {
    result.innerHTML = "EASY WIN!";
  }
};