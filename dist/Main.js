"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Dom Elements
const infoContainer = document.querySelector(".info-container");
const wrongTriesSpan = document.querySelector(".tries span");
const memoryBlocksContainer = document.querySelector(".memory-blocks-container");
const gameStartContainer = document.querySelector(".game-start-container");
const gameStartBtn = document.querySelector(".game-start-container .start-game-btn");
let inputFieldOfBlocksNum = document.getElementById("different-shapes-number");
let timeSpan = document.querySelector(".time span");
let timeInputField = document.getElementById("time-limit");
let previousGameWrongs = document.querySelector(".previous-game-wrongs span");
let succussSound = document.querySelector(".success");
let wrongSound = document.querySelector(".fail");
// Global Variables
let numberOfDifferentBlocks;
let duration = 1000;
let wrongAttempts = 0;
let timeRemaning;
///////////////////////////////////////////////////////////////////
let previousWrongAttempts = localStorage.getItem("previousWrongs");
if (previousGameWrongs) {
    previousGameWrongs.innerHTML = previousWrongAttempts !== null && previousWrongAttempts !== void 0 ? previousWrongAttempts : "0";
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
            const animalData = data;
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
const fetchurl = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "animal.json";
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            return data.animals;
        }
        catch (error) {
            console.error("Error fetching JSON:", error);
        }
    });
};
// Create the blocks function and shuffle them
const createBlocks = (animalData) => {
    let showedAnimals = [];
    for (let i = 0; i < numberOfDifferentBlocks; i++) {
        let randdomAnimalIndex = Math.floor(Math.random() * animalData.length);
        let randomAnimal = animalData[randdomAnimalIndex];
        if (showedAnimals.includes(randomAnimal)) {
            i--;
            continue;
        }
        showedAnimals.push(randomAnimal);
    }
    const shuffleArray = (array) => {
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
        <div class="face back"><img src=".Images/${animal}.png" alt="" /></div>
      </div>`;
    });
};
///////////////////////////////////////////////////////////////////////////////////////
memoryBlocksContainer.onclick = (e) => {
    const parentElement = e.target.parentElement;
    if (parentElement === null || parentElement === void 0 ? void 0 : parentElement.classList.contains("game-block")) {
        parentElement.classList.add("flipped");
    }
    let allFlippedBlocks = document.querySelectorAll(".game-block.flipped");
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
        }
        else {
            setTimeout(() => {
                wrongAttempts++;
                wrongSound.play();
                wrongTriesSpan.textContent = wrongAttempts.toString();
                firstBlock.classList.remove("flipped");
                secondBlock.classList.remove("flipped");
            }, duration);
        }
        if (document.querySelectorAll(".game-block.checked").length ===
            numberOfDifferentBlocks * 2) {
            setTimeout(() => {
                alert("Congratulations you won");
                localStorage.setItem("previousWrongs", wrongAttempts.toString());
                location.reload();
            }, duration);
        }
    }
};
const preventClicking = () => {
    memoryBlocksContainer.style.pointerEvents = "none";
    setTimeout(() => {
        memoryBlocksContainer.style.pointerEvents = "auto";
    }, duration);
};
///////////////////////////////////////////////////////////////////////////////////////
let lightDarkModeIcon = document.querySelector(".dark-light-toggle img");
// Initialize lightMode from localStorage
let darkMode = localStorage.getItem("darkMode") === "true";
// Function to toggle light and dark mode
const setLightDark = function () {
    if (darkMode) {
        lightDarkModeIcon.src = "dark-light/moon.png";
        document.body.classList.add("dark-theme");
    }
    else {
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
