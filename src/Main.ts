// Dom Elements
const infoContainer = document.querySelector(
  ".info-container"
) as HTMLDivElement;
const wrongTriesSpan = document.querySelector(".tries span") as HTMLSpanElement;
const memoryBlocksContainer = document.querySelector(
  ".memory-blocks-container"
) as HTMLDivElement;
const gameStartContainer = document.querySelector(
  ".game-start-container"
) as HTMLDivElement;
const gameStartBtn = document.querySelector(
  ".game-start-container .start-game-btn"
) as HTMLButtonElement;
let inputFieldOfBlocksNum = document.getElementById(
  "different-shapes-number"
) as HTMLInputElement;
let timeSpan = document.querySelector(".time span") as HTMLSpanElement;
let timeInputField = document.getElementById("time-limit") as HTMLInputElement;
let previousGameWrongs = document.querySelector(
  ".previous-game-wrongs span"
) as HTMLSpanElement;
let succussSound = document.querySelector(".success") as HTMLAudioElement;
let wrongSound = document.querySelector(".fail") as HTMLAudioElement;
// Global Variables
let numberOfDifferentBlocks: number;
let duration: number = 1000;
let wrongAttempts: number = 0;
let timeRemaning: number;
///////////////////////////////////////////////////////////////////
let previousWrongAttempts = localStorage.getItem("previousWrongs");
if (previousGameWrongs) {
  previousGameWrongs.innerHTML = previousWrongAttempts ?? "0";
}

gameStartBtn.addEventListener("click", () => {
  if (inputFieldOfBlocksNum.value === "") {
    alert("Please Enter Number in blocks field");
    return;
  }
  if (inputFieldOfBlocksNum.valueAsNumber > 20) {
    alert("the max for number of different shapes is 20");
  }
  if (timeInputField.value === "" || timeInputField.valueAsNumber < 10) {
    alert("Please Enter applicable Time For The Game more than 10 sec");
    return;
  }
  if (timeInputField.valueAsNumber > 240) {
    alert("It is very long time reduce it to less than 4 min (240 sec)");
    return;
  }
  memoryBlocksContainer.innerHTML = "";
  numberOfDifferentBlocks = inputFieldOfBlocksNum.valueAsNumber;
  timeRemaning = timeInputField.valueAsNumber;

  // Fetch json file of animals then start the game function
  fetchurl().then((data) => {
    if (data !== undefined) {
      const animalData: string[] = data;

      createBlocks(animalData);
      // Timer function
      let timer = setInterval(() => {
        timeRemaning--;
        timeSpan.textContent = timeRemaning.toString();
        if (timeRemaning === 10) {
          timeSpan.style.color = "red";
        }
        if (timeRemaning === 0) {
          clearInterval(timer);
          alert("Time is up, you lost");
          location.reload();
        }
      }, 1000);
      gameStartContainer.style.display = "none";
    }
  });
});
// Fetch function
const fetchurl = async function (): Promise<string[] | void> {
  const url = "./animal.json";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.animals as string[];
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
};

// Create the blocks function and shuffle them
const createBlocks = (animalData: string[]): void => {
  let showedAnimals: string[] = [];
  for (let i = 0; i < numberOfDifferentBlocks; i++) {
    let randdomAnimalIndex = Math.floor(Math.random() * animalData.length);
    let randomAnimal = animalData[randdomAnimalIndex];
    if (showedAnimals.includes(randomAnimal)) {
      i--;
      continue;
    }
    showedAnimals.push(randomAnimal);
  }
  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  showedAnimals = shuffleArray(showedAnimals.concat(showedAnimals));
  showedAnimals.forEach((animal) => {
    memoryBlocksContainer.innerHTML += `
    <div class="game-block" data-animals="${animal}">
        <div class="face front"></div>
        <div class="face back"><img src="../Images/${animal}.png" alt="" /></div>
      </div>`;
  });
};
///////////////////////////////////////////////////////////////////////////////////////
memoryBlocksContainer.onclick = (e) => {
  const parentElement = (e.target as HTMLElement).parentElement;
  if (parentElement?.classList.contains("game-block")) {
    parentElement.classList.add("flipped");
  }

  let allFlippedBlocks = document.querySelectorAll(
    ".game-block.flipped"
  ) as unknown as HTMLDivElement[];

  if (allFlippedBlocks.length === 2) {
    let firstBlock = allFlippedBlocks[0];
    let secondBlock = allFlippedBlocks[1];

    preventClicking();
    if (firstBlock.dataset.animals === secondBlock.dataset.animals) {
      firstBlock.classList.add("checked");
      secondBlock.classList.add("checked");
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
      succussSound.play();
    } else {
      setTimeout(() => {
        wrongAttempts++;
        wrongSound.play();
        wrongTriesSpan.textContent = wrongAttempts.toString();
        firstBlock.classList.remove("flipped");
        secondBlock.classList.remove("flipped");
      }, duration);
    }
    if (
      document.querySelectorAll(".game-block.checked").length ===
      numberOfDifferentBlocks * 2
    ) {
      setTimeout(() => {
        alert("Congratulations you won");
        localStorage.setItem("previousWrongs", wrongAttempts.toString());
        location.reload();
      }, duration);
    }
  }
};

const preventClicking = (): void => {
  memoryBlocksContainer.style.pointerEvents = "none";

  setTimeout(() => {
    memoryBlocksContainer.style.pointerEvents = "auto";
  }, duration);
};
///////////////////////////////////////////////////////////////////////////////////////
let lightDarkModeIcon = document.querySelector(
  ".dark-light-toggle img"
) as HTMLImageElement;

// Initialize lightMode from localStorage
let darkMode: boolean = localStorage.getItem("darkMode") === "true";

// Function to toggle light and dark mode
const setLightDark = function () {
  if (darkMode) {
    lightDarkModeIcon.src = "./dark-light/moon.png";
    document.body.classList.add("dark-theme");
  } else {
    lightDarkModeIcon.src = "../dark-light/sun.png";
    document.body.classList.remove("dark-theme");
  }
};

// Event listener for light/dark mode toggle
lightDarkModeIcon.addEventListener("click", () => {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", darkMode.toString());
  setLightDark();
});

// Initial call to set the correct mode on page load
setLightDark();
