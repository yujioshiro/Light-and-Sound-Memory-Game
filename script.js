const randomSequence = [];
const playerSequence = [];
let playerCanContinue = true;
let difficulty;
let tonePlaying = false;
let volume = 0.5;
let clueHoldTime = 1000;
let cluePauseTime = 333;
let nextClueWaitTime = 1000;

const buttonCollection = document.getElementsByClassName("gameplay-button");

function startNextRound(difficulty) {

  playerSequence.splice(0, playerSequence.length);
  // program will add a new number to sequence if the player has not yet lost
  randomSequence.push(Math.floor(Math.random() * (difficulty * 2)) + 1);
  console.clear();
  console.log(randomSequence);

  // program will light up the buttons in the sequence
  randomSequenceClue();

  makeAllButtonsClickable();
}

function randomSequenceClue() {
  if (playerCanContinue) {
    context.resume()
    let delay = nextClueWaitTime; //set delay to initial wait time
    for (let i = 0; i <= randomSequence.length; i++) { // for each clue that is revealed so far
      console.log("play single clue: " + randomSequence[i] + " in " + delay + "ms")
      setTimeout(playSingleClue, delay, randomSequence[i]) // set a timeout to play that clue
      delay += clueHoldTime
      delay += cluePauseTime;
    }
  }
}

function playSingleClue(btn){
  if(playerCanContinue){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function lightButton(btn){
  document.getElementById("button-"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button-"+btn).classList.remove("lit")
}

function addPlayerInput(buttonInput) {
  playerSequence.push(buttonInput);
  console.log(playerSequence);


  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] == randomSequence[i]) {
      playerCanContinue = true;
    } else {
      playerCanContinue = false;
    }
  }

  if ((playerCanContinue == true) && (playerSequence.length >= 8)) {
    playWinningScreen();
  } else if ((playerCanContinue == true) && (playerSequence.length >= randomSequence.length)) {
    startNextRound(difficulty);
  }

  if (playerCanContinue == false) {
    playLosingScreen();
  }
}

function playWinningScreen() {
  alert("You guessed correctly 8 times. You win!")
  makeAllButtonsUnclickable();
}

function playLosingScreen() {
  alert("Wrong sequence. You lose!")
  makeAllButtonsUnclickable();
}

function makeAllButtonsUnclickable() {
  for (let item of buttonCollection) {
    item.classList.add("disabledButton");
  }
}

function makeAllButtonsClickable() {
  for (let item of buttonCollection) {
    item.classList.remove("disabledButton");
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 520,
  6: 590
}

function playTone(btn, len) {
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function() {
    stopTone()
  }, len)
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)



function startGame(easyOrHard) {
  playerCanContinue = true;
  makeAllButtonsClickable();
  difficulty = easyOrHard;
  stopTone();
  randomSequence.splice(0, randomSequence.length);
  startNextRound(difficulty);
}

function stopGame() {
  makeAllButtonsUnclickable();
  stopTone();
  clearButton(1);
  clearButton(2);
  clearButton(3);
  clearButton(4);
  clearButton(5);
  clearButton(6);
  playerSequence.splice(0, playerSequence.length);
  randomSequence.splice(0, randomSequence.length);
  playerCanContinue = false;
}
