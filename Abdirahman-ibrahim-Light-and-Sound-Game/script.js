let pattern = [2, 2, 4, 3, 2, 1, 2, 4];
let progress = 0; 
let gamePlaying = true;
let tonePlaying = false; // Keeps track of whether a tone is currently playing
let volume = 0.5;
let guessCounter = 0;


const clueHoldTime = 1000; // Time to hold each clue's light and sound
const cluePauseTime = 333; // Pause time between clues
const nextClueWaitTime = 1000; // Time to wait before starting playback of the next clue



const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

function startGame(){
  progress = 0; 
  gamePlaying = true;
  // swap the Start and Stop buttons
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence();

}
function stopGame(){
  gamePlaying = false;
  // swap the Start and Stop buttons
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");

}
function lightButton(btn) {
  document.getElementById("Button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("Button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}


function playClueSequence(){
  context.resume()
  let delay = nextClueWaitTime; 
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
    guessCounter = 0; // Reset guess counter at the start of each sequence
    context.resume();
  }
}


function loseGame() {
  stopGame();
  alert("Sorry, you lost the game!");
}

function winGame() {
  stopGame();
  alert("Congratulations, you won the game!");
}



function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  if(pattern[guessCounter] === btn){
    // Is the turn over?
    if(guessCounter === progress){
      // Is this the last turn?
      if(progress === pattern.length - 1){
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    // Guess was incorrect
    loseGame();
  }
}





// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)