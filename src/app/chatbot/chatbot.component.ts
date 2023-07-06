import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: { text: string, sender: string }[] = [];
  userMessage: string = '';

  isChatMessagesScrollable(): boolean {
    const chatMessagesElement = document.querySelector('.chat-messages');
    return chatMessagesElement.scrollHeight > chatMessagesElement.clientHeight;
  }

  sendMessage(message: string) {
    this.messages.push({ text: message, sender: 'user' });

    let response: string;

    if (message.toLowerCase().includes('hello')) {
      response = 'Hello there!';
    } else if (message.toLowerCase().includes('how are you')) {
      response = 'I am doing well, thank you!';
    } else if (message.toLowerCase().includes('goodbye')) {
      response = 'Goodbye! Take care.';
    } else {
      response = "I'm sorry, I didn't understand that.";
    }

    this.messages.push({ text: response, sender: 'bot' });
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
