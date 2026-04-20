const STORAGE_KEY = "kickitGameState";

const defaultState = {
  mascot: "lion",
  mascotLabel: "Leeuw",
  mascotImage: "img/leeuw.png",
  playerName: "",
  shirt: "pink",
  number: "10",
  mode: "",
  gameResult: "goal"
};

//INTERACTIVE Start 
function getState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...defaultState };

  try {
    return { ...defaultState, ...JSON.parse(saved) };
  } catch {
    return { ...defaultState };
  }
}

function setState(newValues) {
  const current = getState();
  const updated = { ...current, ...newValues };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function initStartScreen() {
  const startBtn = $("#startBtn");
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    window.location.href = "handen.html";
  });
}

function initHandsScreen() {
  const detectBtn = $("#detectHandsBtn");
  if (!detectBtn) return;

  detectBtn.addEventListener("click", () => {
    window.location.href = "speler-kiezen.html";
  });
}

function initPlayerSelectScreen() {
  const playerCards = $all(".player-card");
  const nextBtn = $("#toProfileBtn");

  if (!playerCards.length || !nextBtn) return;

  playerCards.forEach(card => {
    card.addEventListener("click", () => {
      playerCards.forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");

      setState({
        mascot: card.dataset.mascot,
        mascotLabel: card.dataset.label,
        mascotImage: card.dataset.image
      });

      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener("click", () => {
    window.location.href = "profiel.html";
  });
}

// APPS Profile SCReen 
function initProfileScreen() {
  const state = getState();

  const nameInput = $("#nameInput");
  const numberInput = $("#numberInput");
  const previewName = $("#previewName");
  const previewNumber = $("#previewNumber");
  const previewMascot = $("#previewMascot");
  const previewShirt = $("#previewShirt");
  const shirtButtons = $all(".shirt-card");
  const nextBtn = $("#toModeBtn");

  if (previewMascot) {
    previewMascot.src = state.mascotImage;
  }

  if (nameInput) {
    nameInput.value = state.playerName || "";
  }

  if (numberInput) {
    numberInput.value = state.number || "10";
  }

  if (previewName) {
    previewName.textContent = state.playerName || "JOUW NAAM";
  }

  if (previewNumber) {
    previewNumber.textContent = state.number || "10";
  }

  if (previewShirt) {
    previewShirt.classList.remove("pink", "orange");
    previewShirt.classList.add(state.shirt);
  }

  shirtButtons.forEach(button => {
    if (button.dataset.shirt === state.shirt) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      shirtButtons.forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");

      const chosenShirt = button.dataset.shirt;
      setState({ shirt: chosenShirt });

      previewShirt.classList.remove("pink", "orange");
      previewShirt.classList.add(chosenShirt);
    });
  });

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      const value = nameInput.value.trim();
      setState({ playerName: value });
      previewName.textContent = value || "JOUW NAAM";
    });
  }

  if (numberInput) {
    numberInput.addEventListener("input", () => {
      let value = parseInt(numberInput.value, 10);

      if (isNaN(value)) {
        value = "";
      } else {
        if (value < 1) value = 1;
        if (value > 99) value = 99;
      }

      numberInput.value = value;
      setState({ number: String(value) });
      previewNumber.textContent = value || "10";
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      window.location.href = "speltype.html";
    });
  }
}

//APP ModeScreen Game 
function initModeScreen() {
  const modeCards = $all(".mode-card");
  const nextBtn = $("#toGameBtn");

  if (!modeCards.length || !nextBtn) return;

  modeCards.forEach(card => {
    card.addEventListener("click", () => {
      modeCards.forEach(item => item.classList.remove("selected"));
      card.classList.add("selected");

      setState({ mode: card.dataset.mode });
      nextBtn.disabled = false;
    });
  });

  nextBtn.addEventListener("click", () => {
    window.location.href = "spel.html";
  });
}

function initGameScreen() {
  const state = getState();

  const arena = $("#gameArena");
  const crosshair = $("#crosshair");
  const ball = $("#ball");
  const target = $("#targetZone");
  const overlay = $("#resultOverlay");
  const resultTitle = $("#resultTitle");
  const resultText = $("#resultText");
  const helperMascot = $("#helperMascot");
  const helperText = $("#helperText");
  const toResultBtn = $("#toResultBtn");
  const cheerAudio = $("#cheerAudio");
  const livesDisplay = $("#livesDisplay");

  let lives = 3;

  if (!arena || !crosshair || !ball || !target) return;

  function updateLivesUI(){
    livesDisplay.textContent = "⚽".repeat(lives);
  }

  updateLivesUI();

  if (helperMascot) {
    helperMascot.src = state.mascotImage;
  }

  if (helperText) {
    helperText.textContent = state.mode === "hand"
      ? "Richt en klik om te gooien"
      : "Richt en klik om te schieten";
  }

  function resetBall(){
    ball.style.left = "50%";
    ball.style.top = "auto";
    ball.style.bottom = "5%";
    ball.style.transform = "translateX(-50%)";
  }

function newTarget() {
  const goalFrame = document.querySelector(".goal-frame");
  if (!goalFrame) return;

  const padding = 20;

  const availableWidth = goalFrame.clientWidth - target.offsetWidth - padding * 2;
  const availableHeight = goalFrame.clientHeight - target.offsetHeight - padding * 2;

  const randomX = Math.random() * Math.max(availableWidth, 0);
  const randomY = Math.random() * Math.max(availableHeight, 0);

  target.style.left = `${padding + randomX}px`;
  target.style.top = `${padding + randomY}px`;
}

  // Hit
  target.addEventListener("click", (e) => {
    e.stopPropagation();

    if (overlay.classList.contains("show")) return;

    const rect = arena.getBoundingClientRect();
    const t = target.getBoundingClientRect();

    const x = t.left - rect.left + t.width / 2;
    const y = t.top - rect.top + t.height / 2;

    ball.style.left = `${x - 45}px`;
    ball.style.top = `${y - 45}px`;
    ball.style.bottom = "auto";
    ball.style.transform = "scale(0.35)";

    setTimeout(() => {
      setState({ gameResult: "goal" });

      resultTitle.textContent = "GOAL!";
      resultText.textContent = "Wat goed gedaan!";
      overlay.classList.add("show");

      cheerAudio.currentTime = 0;
      cheerAudio.play().catch(()=>{});

      setTimeout(() => {
        window.location.href = "resultaat.html";
      }, 3000);
    }, 400);
  });

  // Miss
  arena.addEventListener("click", (e) => {
    if (overlay.classList.contains("show")) return;

    const rect = arena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ball.style.left = `${x - 45}px`;
    ball.style.top = `${y - 45}px`;
    ball.style.bottom = "auto";
    ball.style.transform = "scale(0.35)";

    lives--;

    setTimeout(() => {
      if (lives > 0) {
        resultTitle.textContent = "BIJNA!";
        resultText.textContent = `Nog ${lives} kans(en)!`;
        overlay.classList.add("show");

        updateLivesUI();

        setTimeout(() => {
          overlay.classList.remove("show");
          resetBall();
          newTarget();
        }, 1000);

      } else {
        setState({ gameResult: "miss" });

        resultTitle.textContent = "JAMMER!";
        resultText.textContent = "Geen kansen meer!";
        overlay.classList.add("show");

        setTimeout(() => {
          window.location.href = "resultaat.html";
        }, 2500);
      }
    }, 300);
  });

  if (toResultBtn) {
    toResultBtn.addEventListener("click", () => {
      window.location.href = "resultaat.html";
    });
  }

  window.addEventListener("load", newTarget);
  window.addEventListener("resize", newTarget);

  newTarget();
}

function initResultScreen() {
  const state = getState();

  const resultMascot = $("#resultMascot");
  const resultName = $("#resultName");
  const resultNumber = $("#resultNumber");
  const resultShirt = $("#resultShirt");
  const resultSubline = $("#resultSubline");
  const restartBtn = $("#restartBtn");

  if (resultMascot) {
    resultMascot.src = state.mascotImage;
  }

  if (resultName) {
    resultName.textContent = state.playerName || "JOUW NAAM";
  }

  if (resultNumber) {
    resultNumber.textContent = state.number || "10";
  }

  if (resultShirt) {
    resultShirt.classList.remove("pink", "orange");
    resultShirt.classList.add(state.shirt);
  }

  if (resultSubline) {
    resultSubline.textContent = state.gameResult === "goal"
      ? "Jij scoorde een goal!"
      : "Jij deed het super goed!";
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "start") initStartScreen();
  if (page === "handen") initHandsScreen();
  if (page === "speler-kiezen") initPlayerSelectScreen();
  if (page === "profiel") initProfileScreen();
  if (page === "speltype") initModeScreen();
  if (page === "spel") initGameScreen();
  if (page === "resultaat") initResultScreen();
});