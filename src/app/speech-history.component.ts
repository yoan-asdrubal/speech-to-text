import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SpeechHistoryService } from './speech-history.service';

@Component({
  selector: 'app-speech-history',
  imports: [DatePipe, DecimalPipe],
  template: `
    <div class="speech-container">
      @if (!isSupported()) {
        <div class="error-message">
          <p>Speech Recognition no es compatible con este navegador.</p>
          <small>Usa Chrome, Edge o Safari para acceder a esta funcionalidad.</small>
        </div>
      } @else {
        <div class="controls">
          <button 
            (click)="toggle()"
            [class.listening]="isListening()">
            {{ isListening() ? 'Detener' : 'Iniciar' }}
          </button>
          <button (click)="clear()">Limpiar</button>
        </div>
        
        @if (getFinalText() || getInterimText()) {
          <div class="current-text">
            <h3>Transcripción Actual:</h3>
            <div class="current-content">
              @if (getFinalText()) {
                <p class="final-text">{{ getFinalText() }}</p>
              }
              @if (getInterimText()) {
                <p class="interim-text"><em>{{ getInterimText() }}</em></p>
              }
            </div>
          </div>
        }
        
        @if (error()) {
          <div class="error-message">
            <p>{{ error() }}</p>
            <small>Asegúrate de que el micrófono esté habilitado y habla claramente.</small>
          </div>
        }
        
        @if (history().length > 0) {
          <div class="transcript-history">
            <h3>Historial de Transcripciones:</h3>
            <div class="history-list">
              @for (entry of getReversedHistory(); track entry.id) {
                <div class="transcript-entry">
                  <span class="timestamp">
                    {{ entry.timestamp | date:'HH:mm:ss' }}
                  </span>
                  <p class="text">{{ entry.text }}</p>
                  <div class="entry-actions">
                    <span class="confidence">
                      {{ (entry.confidence * 100) | number:'1.0-0' }}%
                    </span>
                    <button 
                      class="copy-btn" 
                      (click)="copyToClipboard(entry.text)"
                      title="Copiar texto">
                      📋
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
        
        <div class="instructions">
          <p><strong>Instrucciones:</strong></p>
          <ul>
            <li>Permite el acceso al micrófono cuando se solicite</li>
            <li>Haz clic en "Iniciar" y comienza a hablar</li>
            <li>La transcripción se detiene automáticamente tras 5 segundos de silencio</li>
            <li>Di "stop" o usa el botón "Detener" para finalizar manualmente</li>
            <li>El texto se copia automáticamente al clipboard al detener</li>
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .speech-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .controls button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background: #007bff;
      color: white;
    }
    
    .controls button:hover:not(:disabled) {
      background: #0056b3;
    }
    
    .controls button:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .listening {
      background: #dc3545 !important;
    }
    
    .listening:hover {
      background: #c82333 !important;
    }
    
    .transcript-history {
      margin-top: 30px;
    }
    
    .transcript-history h3 {
      margin: 0 0 15px 0;
      color: #495057;
      font-size: 18px;
    }
    
    .history-list {
      border: 1px solid #ddd;
      border-radius: 5px;
      max-height: 300px;
      overflow-y: auto;
      padding: 10px;
      background: white;
    }
    
    .transcript-entry {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-bottom: 1px solid #eee;
      transition: background-color 0.2s;
    }
    
    .transcript-entry:hover {
      background-color: #f8f9fa;
    }
    
    .transcript-entry:last-child {
      border-bottom: none;
    }
    
    .timestamp {
      font-size: 12px;
      color: #666;
      min-width: 60px;
      font-family: monospace;
    }
    
    .text {
      flex: 1;
      margin: 0;
      line-height: 1.4;
    }
    
    .entry-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .confidence {
      font-size: 12px;
      color: #888;
      min-width: 40px;
      text-align: right;
    }
    
    .copy-btn {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      border-radius: 3px;
      transition: background-color 0.2s;
    }
    
    .copy-btn:hover {
      background-color: #e9ecef;
    }
    
    .copy-btn:active {
      transform: scale(0.95);
    }
    

    
    .current-text {
      margin-top: 20px;
      padding: 20px;
      background: #e8f5e8;
      border-radius: 8px;
      border: 2px solid #28a745;
    }
    
    .current-text h3 {
      margin: 0 0 15px 0;
      color: #155724;
      font-size: 20px;
    }
    
    .current-content {
      min-height: 60px;
    }
    
    .current-content .final-text {
      margin: 0 0 10px 0;
      font-weight: 600;
      font-size: 16px;
      color: #155724;
      line-height: 1.5;
    }
    
    .current-content .interim-text {
      margin: 0;
      color: #6c757d;
      font-size: 14px;
    }
    
    .instructions {
      margin-top: 20px;
      padding: 15px;
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 5px;
      font-size: 14px;
    }
    
    .instructions ul {
      margin: 10px 0 0 0;
      padding-left: 20px;
    }
    
    .instructions li {
      margin-bottom: 5px;
    }
    
    .error-message {
      margin-top: 20px;
      padding: 15px;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 5px;
      color: #721c24;
    }
    
    .error-message small {
      display: block;
      margin-top: 5px;
      font-style: italic;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeechHistoryComponent {
  private speechService = inject(SpeechHistoryService);
  
  readonly history = this.speechService.history;
  readonly isListening = this.speechService.isListening;
  readonly currentText = this.speechService.currentText;
  readonly error = this.speechService.error;
  readonly isSupported = this.speechService.isSupported;
  
  toggle() {
    console.log('Toggle button clicked, current state:', this.isListening());
    if (this.isListening()) {
      console.log('Calling stop()');
      this.speechService.stop();
    } else {
      console.log('Calling start()');
      this.speechService.start();
    }
  }
  
  clear() {
    console.log('Clear button clicked');
    this.speechService.clearHistory();
  }
  
  getFinalText(): string {
    const text = this.currentText();
    const finalText = text.split('|')[0] || '';
    return finalText.trim();
  }
  
  getInterimText(): string {
    const text = this.currentText();
    const parts = text.split('|');
    const interimText = parts.length > 1 ? parts[1] : '';
    return interimText.trim();
  }
  
  getReversedHistory() {
    return [...this.history()].reverse();
  }
  
  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard:', text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }
}