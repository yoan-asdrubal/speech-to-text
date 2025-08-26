import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechConfigService {
  
  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
}