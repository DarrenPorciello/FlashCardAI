class Flashcard {
    constructor(id, question, answer, dateAdded) {
      this.id = id;
      this.question = question;
      this.answer = answer;
      this.dateAdded = dateAdded;
    }
  
    // Getter methods to retrieve flashcard properties
    getId() {
      return this.id;
    }
  
    getQuestion() {
      return this.question;
    }
  
    getAnswer() {
      return this.answer;
    }
  
    getDateAdded() {
      return this.dateAdded;
    }
  
    // Setter methods to update flashcard properties
    setQuestion(newQuestion) {
      this.question = newQuestion;
    }
  
    setAnswer(newAnswer) {
      this.answer = newAnswer;
    }
  
    setDateAdded(newDateAdded) {
      this.dateAdded = newDateAdded;
    }
  
    // Method to format the flashcard as a string
    toString() {
      return `Flashcard #${this.id}:\nQuestion: ${this.question}\nAnswer: ${this.answer}\nDate Added: ${this.dateAdded}`;
    }
  }
  
  // Example usage:
  const myFlashcard = new Flashcard(1, "What is the capital of France?", "Paris", "2023-09-08");
  console.log(myFlashcard.toString());
  
  // Updating the flashcard properties
  myFlashcard.setQuestion("What is the capital of Spain?");
  myFlashcard.setAnswer("Madrid");
  console.log(myFlashcard.toString());
  