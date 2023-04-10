let timer = null;
let currentNumberIndex = 0;
let announcer = null;

const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    //Toma la variable numero de cartas y la parsea a Int
    var contenidoSpan = document.querySelector("span").innerText;
    // Convierte el contenido del span a un número
    var numero = parseInt(contenidoSpan);

    const numberOfCards = parseInt(numero, 10);
    const cards = generateCards(numberOfCards);

    const cardsTableContainer = document.querySelector(".cards");

    cards.forEach((card) => {
        cardsTableContainer.appendChild(card.table);
    });

    // Selecciona el elemento de la página donde se mostrará el número anunciado
    announcer = document.querySelector(".number-announcer");
    announcer.innerHTML = "";

    // Genera una matriz de números aleatorios del 1 al 75
    const numbers = generateAllNumbers();
    // Inicializa el índice de números y muestra el primer número en la página
    currentNumberIndex = 0;
    // Inicializa la variable que indica si el juego está pausado
    let isPaused = false;

    const playANumber = () => {
        announcer.innerHTML = numbers[currentNumberIndex];
        crossOutNumber(cards, numbers[currentNumberIndex]);
        currentNumberIndex++;
    };

    announcer.innerText = "Atentos, ¡El juego va a comenzar!";

    // Configura un temporizador que mostrará números cada 5 segundos
    const timer = setInterval(() => {
        // Si el juego está pausado, no muestra el siguiente número
        if (isPaused) {
            return;
        }

        // Muestra el siguiente número
        playANumber();

        // Si se han mostrado todos los números, detiene el temporizador y muestra un mensaje de "Bingo"
        if (isGameWon(cards)) {
            clearInterval(timer);
            announcer.innerText = "¡Bingo!";
            return;
        }
    }, 5000);

    // Selecciona el botón de pausa y lo configura para que pause o reanude el juego
    const pauseButton = document.querySelector("#pause-btn");
    pauseButton.addEventListener("click", () => {
        isPaused = !isPaused;
        pauseButton.innerHTML = isPaused ? "Continuar" : "Pausar juego";
    });

    // Selecciona el botón de parada y lo configura para detener el juego y borrar todas las cartas
    const stopButton = document.querySelector("#stop-btn");
    stopButton.addEventListener("click", () => {
        // Detiene el temporizador, reinicia el índice y borra el número anunciado
        clearInterval(timer);
        currentNumberIndex = 0;
        announcer.innerHTML = "";

        // Selecciona el contenedor de las cartas y borra todas las cartas generadas
        const cardsElement = document.querySelector(".cards");
        while (cardsElement.firstChild) {
            cardsElement.removeChild(cardsElement.firstChild);
        }
    });
});

/**
 *
 * @param {Array<>} cardTables
 * @returns {boolean}
 */
function isGameWon(cardTables) {
    let hasWon = false;
    for (let index = 0; index < cardTables.length; index++) {
        const element = cardTables[index];
        if (hasLineCombination(element.numbers)) return true;
    }
    return false;
}

/**
 *
 * @param {Array<>} numArr
 * @return {boolean}
 */
function hasLineCombination(numArr) {
    let continuousDiagonalA = 0;
    let continuousDiagonalB = 0;
    for (let indexA = 0; indexA < 5; indexA++) {
        let continuousX = 0;
        let continuousY = 0;

        for (let indexB = 0; indexB < 5; indexB++) {
            if (numArr[indexA * 5 + indexB] == 0) {
                continuousX += 1;
            }

            if (numArr[indexB * 5 + indexA] == 0) {
                continuousY += 1;
            }
        }
        if (continuousX == 5) {
            console.log("eplota en X");
            return true;
        }
        if (continuousY == 5) {
            console.log("eplota en Y");
            return true;
        }

        if (numArr[indexA + indexA * 5] == 0) {
            continuousDiagonalA += 1;
        }
        if (numArr[(1 + indexA) * 4] == 0) {
            continuousDiagonalB += 1;
        }
        if (continuousX == 5 || continuousY == 5) return true;
    }
    if (continuousDiagonalA == 5 || continuousDiagonalB == 5) return true;

    return false;
}

function generateCards(numberOfCards) {
    // Crea una matriz vacía para almacenar las cartas de bingo.
    const cards = [];

    // Genera el número de cartas solicitado.
    for (let i = 0; i < numberOfCards; i++) {
        cards.push(generateCard());
    }

    // Devuelve la matriz de cartas de bingo.
    return cards;
}

function generateCardNumberMatrix() {
    // Agrega números aleatorios a la matriz, la del medio tiene solo 4
    const cardNumbers = [];
    cardNumbers.push(...generateShuffledNumbers(1, 15).slice(0, 5));
    cardNumbers.push(...generateShuffledNumbers(16, 30).slice(0, 5));
    cardNumbers.push(...generateShuffledNumbers(31, 45).slice(0, 5)); // Contains free?
    cardNumbers.push(...generateShuffledNumbers(46, 60).slice(0, 5));
    cardNumbers.push(...generateShuffledNumbers(61, 75).slice(0, 5));
    return cardNumbers;
}

function generateCard() {
    // Crea una matriz vacía para almacenar los números de la carta.
    const cardNumbers = generateCardNumberMatrix();
    return { numbers: cardNumbers, table: makeCardTable(cardNumbers) };
}

function makeCardTable(cardNumbers) {
    // Crea la estructura HTML para la carta de bingo.
    const cardTable = document.createElement("table");
    cardTable.classList.add("bingo-card");

    for (let i = 0; i < 5; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("td");
            const number = document.createTextNode(cardNumbers[j * 5 + i]);
            cell.appendChild(number);
            row.appendChild(cell);
        }
        cardTable.appendChild(row);
    }

    // Devuelve la carta de bingo.
    return cardTable;
}

function generateNumbers(start, finish) {
    // Crear un array vacío donde se guardarán los números del 1 al 75
    const generated = [];
    // Agrega los numeros al array
    for (let i = start; i <= finish; i++) {
        generated.push(i);
    }
    // Retornar el array con los números mezclados

    return generated;
}

/**
 *
 * @param {*} inputList
 * @returns {Array}
 */
function shuffleList(inputList) {
    // Usa un algoritmo de shuffle para mezclar los numeros
    for (let i = inputList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [inputList[i], inputList[j]] = [inputList[j], inputList[i]];
    }
    // Devuelve la misma lista
    return inputList;
}

/**
 *
 * @param {number} start
 * @param {number} finish
 * @returns
 */
function generateShuffledNumbers(start, finish) {
    return shuffleList(generateNumbers(start, finish));
}

function generateAllNumbers() {
    return generateShuffledNumbers(0, 75);
}

/**
 *
 * @param {Array} allCardTables
 * @param {*} number
 */
function crossOutNumber(allCardTables, number) {
    allCardTables.forEach((it) => {
        const foundIndex = it.numbers.indexOf(number);
        if (foundIndex != -1) {
            it.numbers[foundIndex] = 0;
        }
    });

    // Obtener todas las celdas de las cartas
    const cells = document.querySelectorAll(".bingo-card td");

    // Añadir la clase announced a las celdas que contengan el número anunciado
    cells.forEach((cell) => {
        if (cell.textContent == number) {
            cell.classList.add("announced");
        }
    });
}
