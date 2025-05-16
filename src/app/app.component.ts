import { Component } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

interface SubtitleLine {
  start: number;
  end: number;
  text: string;
}

interface TranslationItem {
  word: string;
  translation: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    standalone: true
})
export class AppComponent {
  videoSrc: string | undefined;
  subtitles: SubtitleLine[] = [];
  currentSubtitleWords: string[] = [];
  savedTranslations: TranslationItem[] = [];

  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.videoSrc = URL.createObjectURL(file);
    }
  }

  onSubtitleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        this.subtitles = this.parseVTT(content);
      };
      reader.readAsText(file);
    }
  }

  parseVTT(content: string): SubtitleLine[] {
    const lines = content.split('\n\n');
    const result: SubtitleLine[] = [];

    for (const line of lines) {
      const parts = line.split('\n');
      if (parts.length >= 2) {
        const [startStr, endStr] = parts[0].split(' --> ');
        const start = this.timeStringToSeconds(startStr.trim());
        const end = this.timeStringToSeconds(endStr.trim());
        const text = parts.slice(1).join(' ');
        result.push({ start, end, text });
      }
    }

    return result;
  }

  timeStringToSeconds(time: string): number {
    const parts = time.split(':');
    const secondsParts = parts[2].split('.');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(secondsParts[0], 10);
    const milliseconds = parseInt(secondsParts[1] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }

  onTimeUpdate(video: HTMLVideoElement) {
    const currentTime = video.currentTime;
    const currentLine = this.subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
    this.currentSubtitleWords = currentLine ? currentLine.text.split(' ') : [];
  }

  async onWordClick(word: string) {
   try {
    const translation = await invoke<string>('translate', { word });
    this.savedTranslations.push({ word, translation });

    await invoke('save_translation', { word, translation });
  } catch (error) {
    console.error('Translation failed:', error);
  }
  }
}
