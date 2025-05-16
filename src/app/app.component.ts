import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  // آدرس محلی ویدیو که قرار است نمایش داده شود
  videoSrc: string | undefined;

  // متد انتخاب فایل
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // تبدیل فایل به آدرس قابل نمایش در مرورگر
      this.videoSrc = URL.createObjectURL(file);
    }
  }
}
