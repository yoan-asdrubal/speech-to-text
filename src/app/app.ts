import { Component } from '@angular/core';
import { SpeechHistoryComponent } from './speech-history.component';

@Component({
  selector: 'app-root',
  imports: [SpeechHistoryComponent],
  template: '<app-speech-history />',
  styleUrl: './app.css'
})
export class App {}
