import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Chatbot Flotante -->
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <!-- Ventana Chat -->
      <div *ngIf="isChatOpen" class="w-80 h-96 flex flex-col bg-white rounded-xl shadow-2xl border border-slate-200 mb-4 overflow-hidden fade-in">
        <div class="bg-indigo-600 text-white p-4 flex justify-between items-center font-bold">
          <span>Asistente IA</span>
          <button (click)="cerrarChat()" class="text-white hover:text-indigo-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
          <div *ngFor="let msg of chatMessages" [ngClass]="msg.role === 'user' ? 'self-end bg-indigo-600 text-white' : 'self-start bg-white border border-slate-200 text-slate-700'" class="px-4 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm whitespace-pre-wrap">
            {{ msg.text }}
          </div>
          <div *ngIf="isChatLoading" class="self-start bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-2xl text-sm italic shadow-sm">
            Escribiendo...
          </div>
        </div>
        <div class="p-3 bg-white border-t border-slate-200 flex">
          <input type="text" #chatInput (keyup.enter)="sendChatMessage(chatInput.value); chatInput.value=''" placeholder="Escribe un mensaje..." class="flex-1 border-slate-200 rounded-l-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none">
          <button (click)="sendChatMessage(chatInput.value); chatInput.value=''" class="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition flex items-center justify-center">
            <svg class="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </div>
      
      <!-- Botón Flotante -->
      <button *ngIf="!isChatOpen" (click)="isChatOpen = true" class="w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-indigo-700 transition hover:scale-110 border-4 border-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      </button>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ChatbotComponent implements OnInit {
  isChatOpen = false;
  chatMessages: {role: 'user'|'bot', text: string}[] = [{role: 'bot', text: '¡Hola! Soy tu asistente. ¿En qué te puedo ayudar?'}];
  isChatLoading = false;
  
  private http = inject(HttpClient);

  ngOnInit() {}

  cerrarChat() {
    this.isChatOpen = false;
    this.chatMessages = [{role: 'bot', text: '¡Hola! Soy tu asistente. ¿En qué te puedo ayudar?'}];
  }

  sendChatMessage(userText: string) {
    if (!userText.trim()) return;
    this.chatMessages.push({ role: 'user', text: userText.trim() });
    this.isChatLoading = true;
    
    const historialMapeado = this.chatMessages
      .filter(m => m.text !== 'Escribiendo...')
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }));

    this.http.post(`${environment.apiUrl}/ai/chat`, { 
      history: historialMapeado, 
      contextModule: 'dashboard' 
    }).subscribe({
      next: (res: any) => {
        this.chatMessages.push({ role: 'bot', text: res.response || res.message || 'Sin respuesta.' });
        this.isChatLoading = false;
      },
      error: () => {
        this.chatMessages.push({ role: 'bot', text: 'Error de conexión con la IA.' });
        this.isChatLoading = false;
      }
    });
  }
}
