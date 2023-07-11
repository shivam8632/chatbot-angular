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

  sendMessage(message: string) {
    this.messages.push({ text: message, sender: 'user' });
    this.isLoading = true;
    const formData = new FormData();
    formData.append('question', message);

    this.http.post('http://3.212.224.14:8000/chat/', formData )
      .subscribe((response: any) => {
          console.log("Answer", response);
          const answer = response.answer;
          this.messages.push({ text: answer, sender: 'bot' });
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      );

    this.userMessage = '';
  }

  getMessageClass(message: any): string {
    if (message.sender === 'user') {
      return 'user-message';
    } else {
      return 'bot-message';
    }
  }
}
