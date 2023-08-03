import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: { text: string, sender: string }[] = [];
  userMessage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient) { }
  isChatMessagesScrollable(): boolean {
    const chatMessagesElement = document.querySelector('.chat-messages');
    return chatMessagesElement.scrollHeight > chatMessagesElement.clientHeight;
  }

  startNewChat() {
    this.messages = [];
    this.userMessage = '';
  }

  updateInputValue(buttonText: string) {
    this.userMessage = buttonText;
  }

  sendMessage(message: string) {
    this.messages.push({ text: message, sender: 'user' });
    this.isLoading = true;
    const formData = new FormData();
    formData.append('question', message);
  
    this.http.post('http://3.212.224.14:8000/chat/', formData)
      .subscribe((response: any) => {
        console.log("Answer", response);
        const answer = response.answer;
        this.showTypingEffect(answer);
      },
      (error: any) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  
    this.userMessage = '';
  }
  
  showTypingEffect(answer: string) {
    const typingInterval = 80;
    const typingChars = ['.', '..', '...'];
  
    this.isLoading = false;
  
    const showNextChar = (index: number, typingMessage: string) => {
      if (index < answer.length) {
        typingMessage += answer.charAt(index);
        this.messages[this.messages.length - 1].text = typingMessage;
        setTimeout(() => showNextChar(index + 1, typingMessage), typingInterval);
      } else {
        this.messages.pop();
        this.messages.push({ text: answer, sender: 'bot' });
      }
    };
  
    let typingMessage = typingChars[0];
    this.messages.push({ text: typingMessage, sender: 'bot' });
    showNextChar(0, typingMessage);
  }
  

  getMessageClass(message: any): string {
    if (message.sender === 'user') {
      return 'user-message';
    } else {
      return 'bot-message';
    }
  }

  getInputPlaceholder(): string {
    return this.messages.length === 0 ? 'Hello! How can I help you?' : 'Type a Message';
  }
}
