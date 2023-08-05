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
  isBotTyping: boolean = false;

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
    if (!message.trim()) {
      return;
    }
    this.messages.push({ text: message, sender: 'user' });
    const chatMessagesElement = document.querySelector('.chat-messages');
    const isUserAtBottom = chatMessagesElement.scrollHeight - chatMessagesElement.clientHeight <= chatMessagesElement.scrollTop + 1;
    this.isLoading = true;
  
    const formData = new FormData();
    formData.append('question', message);
  
    this.http.post('http://3.212.224.14:8000/chat/', formData)
      .subscribe((response: any) => {
          console.log("Answer", response);
          const answer = response.answer;
  
          if (!isUserAtBottom) {
            chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
          }
  
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
    const typingInterval = 50;
    const typingChars = ['.', '..', '...'];

    this.isBotTyping = true;
    this.isLoading = false;

    this.messages.push({ text: '', sender: 'bot' });

    const showNextChar = (index: number, typingMessage: string) => {
      if (index < answer.length) {
        typingMessage += answer.charAt(index);
        this.messages[this.messages.length - 1].text = typingMessage;
        setTimeout(() => showNextChar(index + 1, typingMessage), typingInterval);
      } else {
        this.messages.pop(); 
        this.messages.push({ text: answer, sender: 'bot' });
        this.isBotTyping = false; 
      }
    };

    showNextChar(0, '');
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
