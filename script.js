const words = [
  { word: "nebula", hint: ["n"] },
  { word: "galaxy", hint: ["a"] },
  { word: "pulsar", hint: ["p"] },
  { word: "quasar", hint: ["q"] },
  { word: "planet", hint: ["a"] },
  { word: "asteroid", hint: ["s"] },
  { word: "cosmos", hint: ["c"] },
  { word: "supernova", hint: ["s"] },
  { word: "comet", hint: ["c"] },
  { word: "satellite", hint: ["t"] },
  { word: "orbit", hint: ["o"] },
  { word: "meteor", hint: ["m"] },
  { word: "blackhole", hint: ["b"] },
  { word: "eclipse", hint: ["e"] },
  { word: "constellation", hint: ["t"] },
  { word: "spacecraft", hint: ["s"] },
  { word: "telescope", hint: ["t"] },
  { word: "gravity", hint: ["g"] },
  { word: "observer", hint: ["o"] },
  { word: "solstice", hint: ["s"] },
  { word: "astronaut", hint: ["a"] },
  { word: "universe", hint: ["u"] },
  { word: "bigbang", hint: ["b"] },
  { word: "andromeda", hint: ["a"] },
  { word: "milkyway", hint: ["m"] },
  { word: "venus", hint: ["v"] },
  { word: "mars", hint: ["m"] },
  { word: "jupiter", hint: ["j"] },
  { word: "saturn", hint: ["s"] },
  { word: "uranus", hint: ["u"] },
  { word: "neptune", hint: ["n"] },
  { word: "pluto", hint: ["p"] },
  { word: "mercury", hint: ["m"] },
  { word: "asterism", hint: ["a"] },
  { word: "equator", hint: ["e"] },
  { word: "horizon", hint: ["h"] },
  { word: "zenith", hint: ["z"] },
  { word: "aphelion", hint: ["a"] },
  { word: "perihelion", hint: ["p"] },
  { word: "singularity", hint: ["s"] },
  { word: "dimension", hint: ["d"] },
  { word: "lightyear", hint: ["l"] },
  { word: "starlight", hint: ["s"] },
  { word: "moonlight", hint: ["m"] },
  { word: "sunspot", hint: ["s"] },
  { word: "aurora", hint: ["a"] },
  { word: "magnetar", hint: ["m"] },
  { word: "exoplanet", hint: ["e"] },
  { word: "darkmatter", hint: ["d"] },
  { word: "wormhole", hint: ["w"] }
];

const maxWrong = 5;
let answer = "";
let hintLetters = [];
let mistakes = 0;
let guessed = [];
let lastGuess = "";

const guessResultElem = document.getElementById("guess-result");
const triesElem = document.createElement("div");
triesElem.id = "tries-left";
triesElem.style.position = "absolute";
triesElem.style.top = "10px";
triesElem.style.right = "20px";
triesElem.style.fontFamily = "'Press Start 2P', monospace";
triesElem.style.fontSize = "1.2em";
triesElem.style.color = "#FFD700";
triesElem.style.textShadow = "2px 2px 5px #000";
document.getElementById("game-container").appendChild(triesElem);

function updateTries() {
  triesElem.textContent = `Tries Left: ${maxWrong - mistakes}`;
}

function playSound(id) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => {
      console.log("Autoplay blocked:", e);
    });
  }
}

function drawRocket(stage) {
  const rocketImg = document.getElementById('rocket-img');
  const explosionGif = document.getElementById('explosion-gif');

  if (stage < maxWrong) {
    rocketImg.style.display = '';
    if (explosionGif) explosionGif.style.display = 'none';
    rocketImg.src = `images/rocket${stage}.gif`;
  } else {
    rocketImg.style.display = 'none';
    if (explosionGif) {
      explosionGif.style.display = '';
      playSound("audio-explosion");
      pauseBackgroundMusic();  // stop bg music immediately
      setTimeout(() => {
        explosionGif.style.display = 'none';
        showLoseOverlay(answer);
      }, 1500);
    }
  }
}

function randomWord() {
  const item = words[Math.floor(Math.random() * words.length)];
  answer = item.word;
  hintLetters = item.hint.map(l => l.toLowerCase());
  guessed = [];
  mistakes = 0;
  lastGuess = "";
  generateWordDisplay();
  drawRocket(0);
  updateTries();
}

function generateWordDisplay() {
  const wordElem = document.getElementById("word");
  wordElem.innerHTML = "";

  answer.split("").forEach((l) => {
    const span = document.createElement("span");
    span.className = "word-space";

    if (guessed.includes(l) || hintLetters.includes(l)) {
      span.textContent = l.toUpperCase();

      if (hintLetters.includes(l)) {
        span.classList.add("hint-letter");
      }

      if (lastGuess === l) {
        span.classList.add("bounce");
        setTimeout(() => span.classList.remove("bounce"), 400);
      }
    } else {
      span.textContent = "_";
    }

    wordElem.appendChild(span);
  });
}

function winOverlayVisible() {
  return document.getElementById("win-overlay").style.display === "flex";
}

function loseOverlayVisible() {
  return document.getElementById("lose-overlay").style.display === "flex";
}

function handleGuess(letter) {
  if ((!guessed.includes(letter) && !hintLetters.includes(letter))
    && /^[a-z]$/.test(letter)
    && mistakes < maxWrong
    && answer.split("").some(l => !guessed.includes(l) && !hintLetters.includes(l))) {

    guessed.push(letter);
    lastGuess = letter;

    if (!answer.includes(letter)) {
      mistakes++;
      drawRocket(mistakes);
      playSound("audio-wrong");
      showGuessResult(false);
    } else {
      drawRocket(mistakes);
      playSound("audio-correct");
      showGuessResult(true);
    }

    updateGame();
  }
}

function showGuessResult(isCorrect) {
  if (isCorrect) {
    guessResultElem.textContent = "Correct!";
    guessResultElem.classList.remove("wrong");
    guessResultElem.classList.add("correct");
    guessResultElem.style.animation = "none";
    void guessResultElem.offsetHeight;
    guessResultElem.style.animation = null;

    setTimeout(() => {
      guessResultElem.classList.remove("correct");
      guessResultElem.textContent = "";
      guessResultElem.style.animation = "";
    }, 1200);
  } else {
    guessResultElem.textContent = "Wrong!";
    guessResultElem.classList.remove("correct");
    guessResultElem.classList.add("wrong");
    setTimeout(() => {
      guessResultElem.classList.remove("wrong");
      guessResultElem.textContent = "";
      guessResultElem.style.animation = "";
    }, 1200);
  }
}

function updateGame() {
  generateWordDisplay();
  updateTries();

  if (mistakes === maxWrong) {
    drawRocket(maxWrong);
    playSound("audio-lose");
    pauseBackgroundMusic();  // stop immediately on loss
  } else if (answer.split("").every(l => guessed.includes(l) || hintLetters.includes(l))) {
    setTimeout(() => showWinOverlay(answer), 500);
    playSound("audio-win");
    pauseBackgroundMusic();  // stop immediately on win
  }
}

function showLoseOverlay(word) {
  document.getElementById("reveal-word-lose").textContent = `The word was: ${word.toUpperCase()}`;
  document.getElementById("lose-overlay").style.display = "flex";
}

function hideLoseOverlay() {
  document.getElementById("lose-overlay").style.display = "none";
  resumeBackgroundMusic();
}

function showWinOverlay(word) {
  document.getElementById("reveal-word-win").textContent = `The word was: ${word.toUpperCase()}`;
  document.getElementById("win-overlay").style.display = "flex";
}

function hideWinOverlay() {
  document.getElementById("win-overlay").style.display = "none";
  resumeBackgroundMusic();
}

function restart() {
  mistakes = 0;
  guessed = [];
  lastGuess = "";
  guessResultElem.textContent = "";
  guessResultElem.classList.remove("wrong");
  guessResultElem.classList.remove("correct");
  guessResultElem.style.animation = "";

  hideLoseOverlay();
  hideWinOverlay();

  document.getElementById("rocket-img").style.display = "";
  document.getElementById("explosion-gif").style.display = "none";

  drawRocket(0);
  document.getElementById("message").classList.remove("show-message");
  document.getElementById("message").textContent = "";

  randomWord();
  resumeBackgroundMusic();
}

function pauseBackgroundMusic() {
  const bgMusic = document.getElementById("audio-bg-music");
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
  }
}

function resumeBackgroundMusic() {
  const bgMusic = document.getElementById("audio-bg-music");
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch(e => {
      console.log("Background music play was blocked:", e);
    });
  }
}

document.addEventListener("keydown", function(event) {
  if (winOverlayVisible() || loseOverlayVisible()) return;
  let letter = event.key.toLowerCase();
  if (/^[a-z]$/.test(letter) && mistakes < maxWrong) {
    handleGuess(letter);
  }
});

document.getElementById("fullscreen-btn").onclick = function() {
  const gameContainer = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    if (gameContainer.requestFullscreen) {
      gameContainer.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

document.getElementById("restart-btn").onclick = restart;
document.getElementById("lose-restart-btn").onclick = restart;
document.getElementById("win-restart-btn").onclick = restart;

window.onload = function() {
  randomWord();
  const bgMusic = document.getElementById("audio-bg-music");
  if (bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic.play().catch(e => {
      console.log("Background music play was blocked:", e);
    });
  }
};
