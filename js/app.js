let numRows = 6;
let numCols = 5;
let collision = false;
let move = true;
let collisionCount = 0;
let starCount = 0;
const heart = document.querySelectorAll('.lives li');
let gameOver = false;
const end = document.querySelector('.game-over');
const youWin = document.querySelector('.game-continue');
const characters = document.querySelector('.characters');
let selected;
let start = document.querySelector('.start');
const charSelect = document.querySelectorAll('.characters li');
let playerSelected = false;
let collected = false;
let starTotal = 0;
const score = document.querySelector('.score');
let win = false;
const cont = document.querySelector('.continue');


//character class. Initial set up inspired by Rodrick's walk through found in the project 3 resouces here: https://www.diigo.com/outliner/fj3m65/Udacity-Classic-Arcade-Game-Project-(project-%233)?key=al7ek43dms
class Character {
  constructor() {
    this.sprite = '';
    this.x = 2;
    this.y = 5;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 100, this.y * 80);
  }
  update(dt) {
    this.currentPos = 0;
    //establish boundaries for player
    this.overX = this.x >= numCols;
    this.overY = this.y >= numRows;
    this.underX = this.x <= -1;
    this.underY = this.y <= 0;
  }
}

class Enemy extends Character {
  constructor(x, y, h, w) {
    super();
    this.sprite = 'images/enemy-bug.png';
    this.x = 5;
    this.y = y;
    this.height = 0.75;
    this.width = 0.75;
  }
  // Update the enemy's position,
  // resets speed at random for each enemy and resets speed when
  // enemy is out of bounds
  update(dt) {
    super.update();
    this.x += this.speed * dt;
    if (this.overX) {
      this.x = -1;
      this.speed = Math.floor(Math.random() * 2.75) + 1;
    }
  }
  //collision detection function found at http://blog.sklambert.com/html5-canvas-game-2d-collision-detection
  // found in the project3 resources file at https://docs.google.com/spreadsheets/d/1W8SR7VSENr-5PHb2ffAT1kuxk1jMtxn8CU8dMHcldIc/edit#gid=0
  collisions() {
    if (player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y) {
      collision = true;
      console.log('smash');
    }
  }
}

//player class with update, handle, and reset methods
class Player extends Character {
  constructor(x, y, w, h) {
    super();
    this.sprite = this.sprite || 'images/char-boy.png';
    this.x;
    this.y;
    this.height = 0.65;
    this.width = 0.45;
  }

  update(dt) {
    super.update();
    if (this.overX && "left") {
      this.x = 4;
    }
    if (this.overY) {
      this.y = 5;
    }
    if (this.underX) {
      this.x = 0;
    }
    if (this.underY) {
      this.y = 0;
      win = true;
    }
    //if player collects 4 stars and makes it to the water,
    // player wins! reset star total and display running star total on the win modal
    if (win === true) {
      winModal();
      starCount = starTotal + starCount;
      win = false;
    }
    //takes away a heart when you lose a life
    // and reset player to starting position
    if (collision === true) {
      collisionCount++;
      console.log(collisionCount);
      this.x = 2;
      this.y = 5;
      collision = false;
    }
    if (collisionCount == 1) {
      heart[0].style.display = 'none';
    }
    if (collisionCount == 2) {
      heart[1].style.display = 'none';
    }
    if (collisionCount === 3) {
      move = false;
      heart[2].style.display = 'none';
      gameOver = true;
      endModal();
    }
  }
  //moves player according to keys pressed
  handleInput(dt) {
    if (move === true) {
      switch (dt) {
        case "left":
          this.x -= 1;
          break;
        case "right":
          this.x += 1;
          break;
        case "up":
          this.y -= 1;
          break;
        case "down":
          this.y += 1;
      }
    }
  }
  //resets player to starting position
  playerReset() {
    this.x = 2;
    this.y = 5;
  }
}

//star class with update and collision methods
class Stars extends Character {
  constructor(x, y, w, h) {
    super();
    this.x = 5;
    this.y = y;
    this.sprite = 'images/Star.png';
    this.height = 0.65;
    this.width = 0.45;
  }
  // set movement of stars at random speeds
  update(dt) {
    super.update();
    this.x += this.speed * dt;
    if (this.overX) {
      this.x = -1;
      this.speed = Math.floor(Math.random() * 1.75) + 0.75;
    }
    //sets position of stars off canvas when player collides
    if (collected === true) {
      starTotal++;
      score.innerHTML = starTotal;
      collected = false;
      console.log(starTotal);
    }
  }
  //collision detection for stars
  collision() {
    if (player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y) {
      collected = true;
      this.x = -1;
      this.y = -2;
    }
  }
}

// instantiates enemies,player, and stars
let allEnemies = [];
let eRows = [0];
let allStars = [];

//instantiates Enemies and pushes them to allEnemies,
// loops through number of enemy rows and generates
// a specific number of enemies per level
let enemiesPerRow = () => {
  eRows.forEach(function(row) {
    for (let i = 0; i <= 3; i++) {
      allEnemies.push(new Enemy(this.x, 0.75 + i));
      console.log('enemy');
    }
  });
};

let player = new Player();

let starsPerRow = () => {
  eRows.forEach(function(row) {
    for (let i = 0; i <= 3; i++) {
      allStars.push(new Stars(this.x + i, 0.75 + i));
      console.log('star');
    }
  });
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//select a character
characters.addEventListener('click', function(e) {
  player.sprite = e.target.getAttribute('src');
});

//start game
start.addEventListener('click', function() {
  enemiesPerRow();
  starsPerRow();
  document.querySelector('.start-screen').style.display = 'none';
  console.log('start');
});

//game reset
const restart = document.querySelector('.restart');

function reset() {
  allEnemies = [];
  allStars = [];
  enemiesPerRow();
  starsPerRow();
  starCount = 0;
  starTotal = 0;
  score.innerHTML = starTotal;
  collisionCount = 0;
  lives();
  end.style.display = 'none';
  player.playerReset();
  console.log('game reset');
}
// restert button
restart.addEventListener('click', function() {
  reset();
  move = true;
});

//continue button
cont.addEventListener('click', function() {
  youWin.style.display = 'none';
  starTotal = 0;
  allStars = [];
  starsPerRow();
  player.playerReset();
  score.innerHTML = starTotal;

});
//add hearts back after end of game
function lives() {
  for (let i = 0; i <= 2; i++) {
    heart[i].style.display = 'inline';
  }
}

//displays game over modal
function endModal() {
  end.style.display = 'grid';
}

//displays continue modal with current star count
const scoreTotal = document.querySelector('.score-total');

function winModal() {
  youWin.style.display = 'grid';
  starCount = starTotal + starCount;
  scoreTotal.innerHTML = starCount;
  starTotal = 0;

}
