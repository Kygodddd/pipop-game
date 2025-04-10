// Elemen penting
const image = document.getElementById("image");
const highScoreDisplay = document.getElementById("high-score");
const clickCountDisplay = document.getElementById("click-count");
const coinCountDisplay = document.getElementById("coin-count");
const gachaBtn = document.getElementById("gacha-btn");
const gachaResult = document.createElement("div");
gachaResult.id = "gacha-result";
image.insertAdjacentElement("afterend", gachaResult);

// Suara
const openMouthSound = new Audio("./sound/buka.mp3");
const closeMouthSound = new Audio("./sound/tutup.mp3");

// Variabel utama
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let selectedCharacter = localStorage.getItem("selectedCharacter") || "kucing";
let unlockedCharacters = JSON.parse(
  localStorage.getItem("unlockedCharacters")
) || ["kucing"];

// Update UI awal
highScoreDisplay.textContent = highScore;
coinCountDisplay.textContent = coins;

function getImagePath(state) {
  return `./image/${selectedCharacter}_${state}.png`;
}

function updateCharacterImage(state) {
  image.src = getImagePath(state);
}

function openMouth() {
  updateCharacterImage("buka");
  openMouthSound.play();
}

function closeMouth() {
  updateCharacterImage("tutup");
  closeMouthSound.play();
}

function updateScore() {
  score++;
  clickCountDisplay.textContent = score;

  if (score % 10 === 0) {
    coins++;
    localStorage.setItem("coins", coins);
    coinCountDisplay.textContent = coins;
  }

  // Tambahkan animasi shake
  clickCountDisplay.classList.add("shake");
  setTimeout(() => clickCountDisplay.classList.remove("shake"), 400);

  if (score % 10 === 0) {
    coins++;
    localStorage.setItem("coins", coins);
    coinCountDisplay.textContent = coins;
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

image.addEventListener("mousedown", () => {
  openMouth();
  updateScore();
});
image.addEventListener("mouseup", () => closeMouth());

image.addEventListener("touchstart", function (e) {
  e.preventDefault();
  openMouth();
  updateScore();
});
image.addEventListener("touchend", function (e) {
  e.preventDefault();
  closeMouth();
});

// Ganti karakter saat "Equip" diklik
function updateCharacterButtons() {
  document.querySelectorAll(".character").forEach((el) => {
    const img = el.querySelector("img");
    const name = img.src.split("/").pop().split("_")[0];
    const button = el.querySelector("button");

    if (unlockedCharacters.includes(name)) {
      button.disabled = false;
      el.classList.remove("locked");
      img.style.filter = "none";
      button.textContent = "Equip";
    } else {
      button.disabled = true;
      el.classList.add("locked");
      img.style.filter = "grayscale(100%) brightness(0.5)";
      button.textContent = "Terkunci";
    }
  });
}

updateCharacterButtons();

// Equip karakter
const characterButtons = document.querySelectorAll(".character button");
characterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const karakterImg = button.parentElement.querySelector("img");
    const karakterNama = karakterImg
      .getAttribute("src")
      .split("/")[2]
      .split("_")[0];

    if (!unlockedCharacters.includes(karakterNama)) return;

    selectedCharacter = karakterNama;
    localStorage.setItem("selectedCharacter", selectedCharacter);
    updateCharacterImage("tutup");
  });
});

// Gacha
const allCharacters = [
  "anjing",
  "hamster",
  "kucing",
  "lebah",
  "marmut",
  "pucing",
  "rucing",
  "tucing",
];

gachaBtn.addEventListener("click", () => {
  if (coins < 5) {
    alert("Koin tidak cukup untuk gacha!");
    return;
  }

  coins -= 5;
  localStorage.setItem("coins", coins);
  coinCountDisplay.textContent = coins;

  const randomIndex = Math.floor(Math.random() * allCharacters.length);
  const newChar = allCharacters[randomIndex];
  const newImg = `./image/${newChar}_tutup.png`;

  gachaResult.innerHTML = `
    <p>Kamu mendapatkan karakter:</p>
    <img id="gacha-img" src="${newImg}" alt="${newChar}" style="display:block; width:100px;">`;

  if (!unlockedCharacters.includes(newChar)) {
    unlockedCharacters.push(newChar);
    localStorage.setItem(
      "unlockedCharacters",
      JSON.stringify(unlockedCharacters)
    );
    updateCharacterButtons();
  }
});

// Toggle karakter list
const toggleButton = document.getElementById("toggleButton");
const characterList = document.getElementById("characterList");
toggleButton.addEventListener("click", function () {
  const isHidden =
    characterList.style.display === "none" ||
    characterList.style.display === "";
  characterList.style.display = isHidden ? "grid" : "none";
  toggleButton.textContent = isHidden
    ? "Sembunyikan Karakter"
    : "Tampilkan Karakter";
});

// Saat load
window.addEventListener("load", () => {
  coins = parseInt(localStorage.getItem("coins")) || 0;
  coinCountDisplay.textContent = coins;
  updateCharacterImage("tutup");
  updateCharacterButtons();
});
