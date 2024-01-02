

/*
const mongoose = require('mongoose');


//Uses the database at the end of /, will create if it doesnt exist
mongoose.connect('mongodb://127.0.0.1:27017/flashcards', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open!")
    })
    .catch(err => {
        console.log("error detected")
        console.log(err)
    })

// Define the Flashcard schema
const flashcardSchema = new mongoose.Schema({
    question: String,
    answer: String,
});
  
// Create a Flashcard model based on the schema
const Flashcard = mongoose.model('Flashcard', flashcardSchema);
  
// Define the FlashcardDeck schema
const flashcardDeckSchema = new mongoose.Schema({
    name: String,
    dateAdded: new Date(),
    flashcards: [flashcardSchema]
});
  
// Create a FlashcardDeck model based on the schema
const FlashcardDeck = mongoose.model('FlashcardDeck', flashcardDeckSchema);
  

// Function to create and save a flashcard deck to MongoDB
async function createFlashcardDeck(deckName, flashcards) {
    try {
      const deck = new FlashcardDeck({
        name: deckName,
        flashcards: flashcards
      });
      await deck.save();
      console.log(`Flashcard deck "${deckName}" added successfully.`);
    } catch (error) {
      console.error('Error creating flashcard deck:', error);
    }
  }
*/
let messages = []

const chatLog = document.getElementById('chat-log');
const message = document.getElementById('message');
const form = document.querySelector('form');

//Loading symbol for fetch request
const textInput = document.querySelector("#inputPart");
const textOutput = document.querySelector("#showOutput");
const btn = document.querySelector("#submitInput");

// selecting loading div
const loader = document.querySelector("#loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 10000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    displayLoading();

    //Handling the number input
    const numericInput = document.getElementById("numericInput");
    const userNumber = parseFloat(numericInput.value);
    console.log(userNumber)


    const messageText = message.value;
    const newMessage = {"role": "user", "content": `${userNumber}, ${messageText}`}
    messages.push(newMessage)
    message.value = '';
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add('message--sent');
    //console.log(messageText);
    //messageElement.innerHTML = `
    //<div class="message__text">${messageText}</div>
    //`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
    fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages
        })
    })
    .then(res => res.json())
    .then(data => {
        let newAssistantMessage = {"role": "assistant", "content": `${data.completion.content}`}
        messages.push(newAssistantMessage)
        console.log(data.completion.content);
        let text = data.completion.content;
        //Seperation into question and answer elements
        const cleanedText = text
            .split('\n')        // Split text into lines
            .filter(line => line.trim() !== '') // Remove empty lines
            .join(' ');         // Join lines back together without extra spaces

        console.log(cleanedText)

        const pairs = cleanedText.split('\n').filter(pair => pair.trim() !== '');

        // Separate questions and answers
        const questions = [];
        const answers = [];

        //Get rid of loading animation
        hideLoading();

        const regex = /\d+\.\s(.*?)\s\[(.*?)\]/g;
        let match;

        while ((match = regex.exec(cleanedText)) !== null) {
            questions.push(match[1]);
            answers.push(match[2]);
        }

        console.log("Questions:", questions);
        console.log("Answers:", answers);

        

        
        //const messageElement = document.createElement('div');
        //messageElement.classList.add('message');
        //messageElement.classList.add('message--sent');
        //messageElement.innerHTML = `
        //<div class="message__text">${data.completion.content}</div>
        //`;
        //chatLog.appendChild(messageElement);
        //chatLog.scrollTop = chatLog.scrollHeight;

        const cardGrid = document.createElement('div');
        cardGrid.classList.add('card-grid');
        cardGrid.innerHTML = createFlashcards();
        chatLog.appendChild(cardGrid)

        //flipping cards function
        const flippableCards = document.querySelectorAll('.flashcard');

        flippableCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });

        const textarea = document.getElementById('message');

        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });




        function createFlashcards() {
            let flashcardHTML = "";
            let counter = 0;
            for (question of questions) {
                flashcardHTML += `
                    <div class="flashcard">
                        <div class="card-content">
                            <div class="card-front">
                                ${question}
                            </div>
                            <div class="card-back">
                                ${answers[counter]}
                            </div>
                        </div>
                    </div>
                `;
                counter += 1;

            }
            return flashcardHTML;
        }

        // JavaScript for flashcard selection
        const flashcards = document.querySelectorAll('.flashcard');
        const selectButton = document.getElementById('selectButton');
        const addToSelectionButton = document.getElementById('addToSelectionButton');
        const clearSelectionButton = document.getElementById('clearSelectionButton');
        const selectedFlashcards = [];

        selectButton.addEventListener('click', () => {
            flashcards.forEach(flashcard => {
                flashcard.classList.add('selectable');
            });

            selectButton.style.display = 'none';
            addToSelectionButton.style.display = 'block';
            clearSelectionButton.style.display = 'block';
        });

        addToSelectionButton.addEventListener('click', () => {
            flashcards.forEach(flashcard => {
                if (flashcard.classList.contains('selected')) {
                    selectedFlashcards.push(flashcard);
                    flashcard.classList.remove('selected');
                }
            });
            addToSelectionButton.style.display = 'none';
            clearSelectionButton.style.display = 'none';
            selectButton.style.display = 'block';
            alert(`Added ${selectedFlashcards.length} flashcards to the selection.`);
            console.log(selectedFlashcards); // You can use the selectedFlashcards array as needed.
            // Create an array to store the question and answer pairs
            var flashcardsData = [];

            // Loop through each flashcard element
            selectedFlashcards.forEach(function (flashcardElement) {
                // Get the card-back element which contains the answer
                var cardBack = flashcardElement.querySelector('.card-back');
            
                // Access the innerText property of the card-back element
                var cardAnswer = cardBack.textContent.trim();
            
                // Get the card-front element which contains the question
                var cardFront = flashcardElement.querySelector('.card-front');
            
                // Access the innerText property of the card-front element
                var cardQuestion = cardFront.textContent.trim();
            
                //Date
                date = new Date();
                // Push the question and answer pair into the flashcardData array
                //flashcardSingle = new Flashcard(cardQuestion, cardAnswer, date)

                flashcardsData.push(flashcardSingle)
            });

            // Log the flashcardData array containing question and answer pairs
            console.log(flashcardsData);
            });

        clearSelectionButton.addEventListener('click', () => {
            flashcards.forEach(flashcard => {
                flashcard.classList.remove('selected');
                flashcard.classList.remove('selectable');
            });
            addToSelectionButton.style.display = 'none';
            clearSelectionButton.style.display = 'none';
            selectButton.style.display = 'block';
        });

        // Click event for selecting/unselecting flashcards
        flashcards.forEach(flashcard => {
            flashcard.addEventListener('click', () => {
                if (flashcard.classList.contains('selectable')) {
                    flashcard.classList.toggle('selected');
                }
            });
        });

    })
})