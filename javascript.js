let timer = null;
let currentNumberIndex = 0;
let announcer = null;

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  //Toma la variable numero de cartas y la parsea a Int
  var contenidoSpan = document.querySelector('span').innerText;
  // Convierte el contenido del span a un número
  var numero = parseInt(contenidoSpan);

  const numberOfCards = parseInt(numero, 10);
  const cards = generateCards(numberOfCards);

  const cardsElement = document.querySelector('.cards');

  cards.forEach((card) => {
    cardsElement.appendChild(card);
  }); 

  // Genera una matriz de números aleatorios del 1 al 75
  const numbers = generateNumbers();

  // Selecciona el elemento de la página donde se mostrará el número anunciado
  announcer = document.querySelector('.number-announcer');
  announcer.innerHTML = '';

  // Inicializa el índice de números y muestra el primer número en la página
  currentNumberIndex = 0;
  announcer.innerHTML = numbers[currentNumberIndex];
  crossOutNumber(numbers[currentNumberIndex]);
  currentNumberIndex++;

  // Inicializa la variable que indica si el juego está pausado
  let isPaused = false;
  // Configura un temporizador que mostrará números cada 5 segundos
  const timer = setInterval(() => {
      // Si el juego está pausado, no muestra el siguiente número
    if (isPaused) {
      return;
    }

    // Si se han mostrado todos los números, detiene el temporizador y muestra un mensaje de "Bingo"
    if (currentNumberIndex === numbers.length) {
      clearInterval(timer);
      announcer.innerHTML = '¡Bingo!';
      return;
    }

    // Muestra el siguiente número
    announcer.innerHTML = numbers[currentNumberIndex];
	crossOutNumber(numbers[currentNumberIndex]);
    currentNumberIndex++;
  }, 5000);

  // Selecciona el botón de pausa y lo configura para que pause o reanude el juego
  const pauseButton = document.querySelector('#pause-btn');
  pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.innerHTML = isPaused ? 'Continuar' : 'Pausar juego';
  });

  // Selecciona el botón de parada y lo configura para detener el juego y borrar todas las cartas
  const stopButton = document.querySelector('#stop-btn');
  stopButton.addEventListener('click', () => {
    // Detiene el temporizador, reinicia el índice y borra el número anunciado
    clearInterval(timer);
    currentNumberIndex = 0;
    announcer.innerHTML = '';

    // Selecciona el contenedor de las cartas y borra todas las cartas generadas
    const cardsElement = document.querySelector('.cards');
    while (cardsElement.firstChild) {
    cardsElement.removeChild(cardsElement.firstChild);
    }
  });
});

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

function generateCard() {
    // Crea una matriz vacía para almacenar los números de la carta.
    const cardNumbers = [];
  
    // Agrega números aleatorios a la matriz hasta que tenga 24 números.
    while (cardNumbers.length < 25) {
      const randomNumber = Math.floor(Math.random() * 75) + 1;
      if (!cardNumbers.includes(randomNumber)) {
        cardNumbers.push(randomNumber);
      }
    }
  
    // Crea la estructura HTML para la carta de bingo.
    const card = document.createElement('table');
    card.classList.add('bingo-card');
  
    for (let i = 0; i < 5; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 5; j++) {
        const cell = document.createElement('td');
        const number = document.createTextNode(cardNumbers[j + i * 5]);
        cell.appendChild(number);
        row.appendChild(cell);
      }
      card.appendChild(row);
    }
  
    // Devuelve la carta de bingo.
    return card;
}

function generateNumbers() {
  // Crear un array vacío donde se guardarán los números del 1 al 75
  const numbers = [];

  // Agregar los números del 1 al 75 al array
  for (let i = 1; i <= 75; i++) {
    numbers.push(i);
  }

  // Mezclar los números en el array usando el algoritmo
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  // Retornar el array con los números mezclados
  return numbers;
}

function crossOutNumber(number) {
	// Obtener todas las celdas de las cartas
	const cells = document.querySelectorAll('.bingo-card td');

	// Añadir la clase announced a las celdas que contengan el número anunciado
	cells.forEach((cell) => {
	  if (cell.textContent == number) {
		cell.classList.add('announced');
	  }
	});
  }