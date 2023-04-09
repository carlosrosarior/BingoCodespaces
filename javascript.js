//Selecciona el formulario
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  //Toma la variable numero de cartas y la parsea a Int
  const numberOfCards = parseInt(document.querySelector('#numberOfCards').value, 10);
  const cards = generateCards(numberOfCards);

  const cardsElement = document.querySelector('.cards');

  cards.forEach((card) => {
    cardsElement.appendChild(card);
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