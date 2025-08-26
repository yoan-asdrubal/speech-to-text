import { Injectable, signal } from '@angular/core';

interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  confidence: number;
}

@Injectable({ providedIn: 'root' })
export class SpeechHistoryService {
  private recognition: any = null;
  private silenceTimer: any = null;
  private lastSpeechTime = 0;
  
  readonly history = signal<TranscriptEntry[]>([]);
  readonly isListening = signal(false);
  readonly currentText = signal('');
  readonly error = signal('');
  readonly isSupported = signal(this.checkSupport());
  
  private checkSupport(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
  
  start() {
    if (!this.isSupported()) {
      this.error.set('Speech Recognition no soportado en este navegador');
      return;
    }
    
    console.log('Starting native speech recognition');
    
    // Si hay texto actual, moverlo al historial antes de empezar nueva transcripción
    const currentFinalText = this.currentText().split('|')[0] || '';
    if (currentFinalText.trim()) {
      this.addToHistory(currentFinalText.trim(), 1);
    }
    
    this.isListening.set(true);
    this.currentText.set('');
    this.error.set('');
    this.lastSpeechTime = Date.now();
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';
    this.recognition.maxAlternatives = 1;
    
    // Configuraciones adicionales para evitar cortes
    if ('webkitSpeechRecognition' in window) {
      this.recognition.serviceURI = '';
    }
    
    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.error.set('');
    };
    
    this.recognition.onresult = (event: any) => {
      console.log('Speech recognition result:', event);
      this.lastSpeechTime = Date.now();
      this.resetSilenceTimer();
      
      let interimTranscript = '';
      let newFinalTranscript = '';
      
      // Solo procesar resultados nuevos desde resultIndex
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0;
        
        if (result.isFinal) {
          newFinalTranscript += transcript + ' ';
          console.log('New final transcript:', transcript, 'Confidence:', confidence);
          
          // Check for stop word
          if (transcript.toLowerCase().includes('stop')) {
            console.log('Stop word detected:', transcript, '- stopping recognition');
            this.stop();
            return;
          }
        } else {
          interimTranscript += transcript + ' ';
        }
      }
      
      // Acumular solo texto final nuevo
      const currentFinal = this.currentText().split('|')[0] || '';
      this.currentText.set((currentFinal + newFinalTranscript).trim() + '|' + interimTranscript.trim());
    };
    
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      this.error.set(`Error: ${this.getErrorMessage(event.error)}`);
      this.isListening.set(false);
    };
    
    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      if (this.isListening()) {
        // Limpiar la parte interim antes de reiniciar
        const finalText = this.currentText().split('|')[0] || '';
        this.currentText.set(finalText.trim());
        
        // Restart if still supposed to be listening
        setTimeout(() => {
          if (this.isListening()) {
            console.log('Restarting recognition...');
            try {
              this.lastSpeechTime = Date.now();
              this.recognition.start();
            } catch (error) {
              console.error('Error restarting recognition:', error);
              this.isListening.set(false);
              this.clearSilenceTimer();
            }
          }
        }, 500);
      }
    };
    
    this.recognition.start();
  }
  
  stop() {
    console.log('Stopping speech recognition');
    this.isListening.set(false);
    this.clearSilenceTimer();
    
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    
    // Solo copiar al clipboard, NO agregar al historial
    const finalText = this.currentText().split('|')[0] || '';
    if (finalText.trim()) {
      this.copyToClipboard();
    }
    
    // NO limpiar currentText para mantenerlo visible
  }
  
  private resetSilenceTimer() {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(() => {
      if (this.isListening() && Date.now() - this.lastSpeechTime >= 5000) {
        console.log('5 seconds of silence detected, stopping recognition');
        this.stop();
      }
    }, 5000);
  }
  
  private clearSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }
  
  private getErrorMessage(error: string): string {
    switch (error) {
      case 'no-speech':
        return 'No se detectó voz. Intenta hablar más cerca del micrófono.';
      case 'audio-capture':
        return 'No se pudo acceder al micrófono.';
      case 'not-allowed':
        return 'Permisos de micrófono denegados.';
      case 'network':
        return 'Error de red.';
      default:
        return `Error desconocido: ${error}`;
    }
  }
  
  private addToHistory(text: string, confidence: number) {
    if (!text.trim()) return;
    
    console.log('Adding to history:', text);
    const entry: TranscriptEntry = {
      id: crypto.randomUUID(),
      text: text.trim(),
      timestamp: new Date(),
      confidence
    };
    this.history.update(entries => [...entries, entry]);
  }
  
  private async copyToClipboard() {
    const textToCopy = this.currentText().split('|')[0] || this.currentText();
    if (textToCopy.trim()) {
      console.log('Copying to clipboard:', textToCopy);
      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        console.log('Text copied successfully');
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  }
  
  clearHistory() {
    console.log('Clearing history');
    this.history.set([]);
    this.currentText.set('');
    this.error.set('');
    this.clearSilenceTimer();
  }
}