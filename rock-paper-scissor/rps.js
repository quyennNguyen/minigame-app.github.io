const compChoices = document.getElementById("comp-set").children;
const compRock = document.getElementById("comp-rock");
const compPaper = document.getElementById("comp-paper");
const compScissor = document.getElementById("comp-scissor");

const yourRock = document.getElementById("your-rock");
const yourPaper = document.getElementById("your-paper");
const yourScissor = document.getElementById("your-scissor");

const compScore = document.getElementById("comp-score");
const yourScore = document.getElementById("your-score");
const result = document.getElementById("result");

const increaseRound = document.getElementById("increase");
const decreaseRound = document.getElementById("decrease");
const numOfRounds = document.getElementById("num-of-rounds");

const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");

class RPSGame {
  constructor() {
    this.compScore = 0;
    this.yourScore = 0;
    this.numOfRounds = 1;
    this.count = 0;
    this.start = false;
    this.end = false;
  }

  increase() {
    if (!this.start) {
      this.numOfRounds++;
      numOfRounds.innerHTML = this.numOfRounds;
    }
  }

  decrease() {
    if (!this.start) {
      if (this.numOfRounds < 2) {
        return;
      }
  
      this.numOfRounds--;
      numOfRounds.innerHTML = this.numOfRounds;
    }
  }

  rock() {
    if (this.start) {
      let num = Math.floor(Math.random() * 3);

      switch (num) {
        case 0:
          compChoices[0].style.visibility = "visible";
          compChoices[1].style.visibility = "hidden";
          compChoices[2].style.visibility = "hidden";
          this.compScore++;
          this.yourScore++;
          break;
        case 1:
          compChoices[0].style.visibility = "hidden";
          compChoices[1].style.visibility = "visible";
          compChoices[2].style.visibility = "hidden";
          this.compScore++;
          break;
        case 2:
          compChoices[0].style.visibility = "hidden";
          compChoices[1].style.visibility = "hidden";
          compChoices[2].style.visibility = "visible";
          this.yourScore++;
          break;
      }

      this.count++;  
      this.updateScore();
      this.checkWinner();
    }
  }

  paper() {
    if (this.start) {
      let num = Math.floor(Math.random() * 3);

      switch (num) {
        case 0:
          compChoices[0].style.visibility = "visible";
          compChoices[1].style.visibility = "hidden";
          compChoices[2].style.visibility = "hidden";
          this.yourScore++;
          break;
        case 1:
          compChoices[0].style.visibility = "hidden";
          compChoices[1].style.visibility = "visible";
          compChoices[2].style.visibility = "hidden";
          this.compScore++;
          this.yourScore++;
          break;
        case 2:
          compChoices[0].style.visibility = "hidden";
          compChoices[1].style.visibility = "hidden";
          compChoices[2].style.visibility = "visible";
          this.compScore++;
          break;
      }
      
      this.count++;
      this.updateScore();
      this.checkWinner();
    }
  }

  scissor() {
    if (this.start) {
      let num = Math.floor(Math.random() * 3);

      switch (num) {
        case 0:
          compChoices[0].style.visibility = "visible";
          compChoices[1].style.visibility = "hidden";
          compChoices[2].style.visibility = "hidden";
          this.compScore++;
          break;
        case 1:
          compChoices[0].style.visibility = "hidden";
          compChoices[1].style.visibility = "visible";
          compChoices[2].style.visibility = "hidden";
          this.yourScore++;
          break;
        case 2:
          compChoices[0].style.visibility = "hidden";
          compChoices[1].style.visibility = "hidden";
          compChoices[2].style.visibility = "visible";
          this.compScore++;
          this.yourScore++;
          break;
      }

      this.count++;
      this.updateScore();
      this.checkWinner();
    }
  }

  play() {
    if (!this.end) {
      this.start = true;
    }
  }

  updateScore() {
    compScore.innerHTML = this.compScore;
    yourScore.innerHTML = this.yourScore;
  }

  checkWinner() {
    if (this.count == this.numOfRounds) {
      this.start = false;
      this.end = true;

      if (this.compScore > this.yourScore) {
        result.innerHTML = "DEFEATED!";
      } else if (this.compScore < this.yourScore) {
        result.innerHTML = "EASY WIN!";
      } else {
        result.innerHTML = "TIE!";
      }

      result.style.display = "flex";
    }
  }

  reset() {
    if (!this.start) {
      location.reload();
    }
  }
}

const rpsGame = new RPSGame();

yourRock.onclick = () => {
  rpsGame.rock();
};

yourPaper.onclick = () => {
  rpsGame.paper();
};

yourScissor.onclick = () => {
  rpsGame.scissor();
};

increaseRound.onclick = () => {
  rpsGame.increase();
}

decreaseRound.onclick = () => {
  rpsGame.decrease();
}

playBtn.onclick = () => {
  rpsGame.play();
}

resetBtn.onclick = () => {
  rpsGame.reset();
}