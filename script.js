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
            console.log(selectedFlashcards[0].textContent.trim())
            console.log(selectedFlashcards[1].textContent.trim)
            console.log(selectedFlashcards[2].textContent.trim())
            console.log(selectedFlashcards[0])
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