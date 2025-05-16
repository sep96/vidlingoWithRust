import { Component } from '@angular/core';

interface Subtitle {
  name: string;
  lang: string;
  url: string;
  default: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  videoSrc: string | undefined;
  subtitles: Subtitle[] = [];
  videoElement: HTMLVideoElement | null = null;

  onVideoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.videoSrc = URL.createObjectURL(file);
    }
  }

  onSubtitlesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.subtitles = [];
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.subtitles.push({
          name: file.name,
          lang: 'en',
          url: URL.createObjectURL(file),
          default: i === 0
        });
      }
    }
  }

  onSubtitleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const index = parseInt(select.value, 10);
    this.subtitles.forEach((sub, i) => sub.default = i === index);
  }
}
