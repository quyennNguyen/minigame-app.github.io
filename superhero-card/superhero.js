// open instructions
const questionBtn = document.getElementById("question-btn");
const instructions = document.getElementById("instructions");
const playground = document.getElementById("playground");
const playbuttons = document.getElementById("playbuttons");
let open = false;

questionBtn.onclick = () => {
  if (!open) {
    instructions.style.display = "block";
    playground.style.display = "none";
    playbuttons.style.display = "none";
    open = true;
  } else {
    instructions.style.display = "none";
    playground.style.display = "flex";
    playbuttons.style.display = "block";
    open = false;
  }
};

// operate game
const compSet = document.getElementById("comp-set");
const yourSet = document.getElementById("your-set");

const compScore = document.getElementById("comp-score");
const yourScore = document.getElementById("your-score");
const result = document.getElementById("result");

const shuffleBtn = document.getElementById("shuffle-btn");
const getCardBtn = document.getElementById("get-card-btn");
const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");

class Hero {
  constructor(fullname = "", image = "", stats = {}) {
    this.fullname = fullname;
    this.image = image;
    this.stats = stats;
  }

  getStats() {
    let result = "";

    for (let x in this.stats) {
      result += `<p>${x}: ${this.stats[x]}</p>`;
    }

    return result;
  }

  sumStats() {
    return Object.values(this.stats).reduce((a, b) => Number(a) + Number(b));
  }

  display() {
    return `<div class="hero-card" style="background:url(${this.image}) no-repeat; background-size:cover;">
    <div class="hero-name">${this.fullname.toUpperCase()}</div>
    <div class="hero-stats">${this.getStats()}</div>
  </div>`;
  }
}

class Player {
  constructor() {
    this.heroSet = [];
    this.score = 0;
  }

  getNumOfHeros() {
    return this.heroSet.length;
  }

  getHero(index) {
    return this.heroSet[index];
  }

  addHero(hero) {
    return this.heroSet.push(hero);
  }

  loseHero(index) {
    this.heroSet.splice(index, 1);
  }

  getScore() {
    return this.score;
  }

  addPoint() {
    this.score++;
  }

  displayHeros() {
    let result = "";

    for (let x of this.heroSet) {
      result += x.display();
    }

    return result;
  }

  reset() {
    this.heroSet.length = 0;
    this.score = 0;
  }
}

class HeroGame {
  constructor(player1, player2) {
    this.doneShuffling = false;
    this.gotCards = true;
    this.endGame = true;
    this.clearGame = true;
    this.player1;
    this.player2;
  }

  shuffle() {
    if (!this.doneShuffling) {
      const numOfCards = 3;
      const ACCESS_TOKEN = 2387982781353807;
      let player1 = new Player();
      let player2 = new Player();

      async function getCardSet1() {
        let i = 0;

        while (i < numOfCards) {
          let myPromise = new Promise((resolve) => {
            let id = Math.floor(Math.random() * 731) + 1;

            fetch(`https://superheroapi.com/api.php/${ACCESS_TOKEN}/${id}`)
              .then((result) => result.json())
              .then((character) => {
                const hero = new Hero(
                  character.name,
                  character.image.url,
                  character.powerstats
                );
                if (isNaN(hero.sumStats())) {
                  resolve(0);
                } else {
                  resolve(Number(player1.addHero(hero)));
                }
              });
          });

          i = await myPromise;
        }
      }

      async function getCardSet2() {
        let i = 0;

        while (i < numOfCards) {
          let myPromise = new Promise((resolve) => {
            let id = Math.floor(Math.random() * 731) + 1;

            fetch(`https://superheroapi.com/api.php/${ACCESS_TOKEN}/${id}`)
              .then((result) => result.json())
              .then((character) => {
                const hero = new Hero(
                  character.name,
                  character.image.url,
                  character.powerstats
                );
                if (isNaN(hero.sumStats())) {
                  resolve(0);
                } else {
                  resolve(Number(player2.addHero(hero)));
                }
              });
          });

          i = await myPromise;
        }
      }

      getCardSet1();
      getCardSet2();

      this.player1 = player1;
      this.player2 = player2;

      this.doneShuffling = true;
      this.gotCards = false;
    }
  }

  getCards() {
    if (!this.gotCards) {
      this.update();

      this.gotCards = true;
      this.endGame = false;
    }
  }

  play() {
    if (!this.endGame) {
      let i = Math.floor(Math.random() * this.player1.getNumOfHeros());
      let x = this.player1.getHero(i).sumStats();

      let j = Math.floor(Math.random() * this.player2.getNumOfHeros());
      let y = this.player2.getHero(j).sumStats();

      if (x > y) {
        this.player1.addPoint();
        this.player2.loseHero(j);
        this.update();
      } else if (x < y) {
        this.player2.addPoint();
        this.player1.loseHero(i);
        this.update();
      } else {
        this.player1.loseHero(i);
        this.player2.loseHero(j);
        this.update();
      }

      if (
        this.player1.getNumOfHeros() == 0 ||
        this.player2.getNumOfHeros() == 0
      ) {
        let a = this.player1.getScore();
        let b = this.player2.getScore();

        if (a > b) {
          result.innerHTML = "DEFEATED!";
        } else if (a < b) {
          result.innerHTML = "EASY WIN!";
        } else {
          result.innerHTML = "TIE!";
        }

        result.style.display = "flex";

        this.endGame = true;
        this.clearGame = false;
      }
    }
  }

  update() {
    compSet.innerHTML = this.player1.displayHeros();
    yourSet.innerHTML = this.player2.displayHeros();

    compScore.innerHTML = this.player1.getScore();
    yourScore.innerHTML = this.player2.getScore();
  }

  reset() {
    if (!this.clearGame) {
      location.reload();
    }
  }
}

const heroGame = new HeroGame();

shuffleBtn.onclick = () => {
  heroGame.shuffle();
};

getCardBtn.onclick = () => {
  heroGame.getCards();
};

playBtn.onclick = () => {
  heroGame.play();
};

resetBtn.onclick = () => {
  heroGame.reset();
};