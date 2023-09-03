let messages = []

const chatLog = document.getElementById('chat-log');
const message = document.getElementById('message');
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

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
    })
})