import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';

@Injectable({ providedIn: 'root' })
export class ExportImageService {
  async exportElAsPng(el: HTMLElement, fileName: string) {
    const dataUrl = await htmlToImage.toPng(el, { cacheBust: true, pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  }
}
