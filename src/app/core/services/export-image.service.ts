import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';

@Injectable({ providedIn: 'root' })
export class ExportImageService {
  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  async exportElAsPng(el: HTMLElement, fileName: string) {
    const ios = this.isIOS();
    let placeholderWin: Window | null = null;
    if (ios) {
      try { placeholderWin = window.open('', '_blank'); } catch {}
    }

    const dataUrl = await htmlToImage.toPng(el, { cacheBust: true, pixelRatio: 2 });

    const navAny = navigator as any;
    if (ios && navAny?.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: 'image/png' });

        if (!navAny.canShare || navAny.canShare({ files: [file] })) {
          await navAny.share({ files: [file], title: fileName, text: 'Horários exportados' });
          placeholderWin?.close();
          return;
        }
      } catch {}
    }

    if (ios) {
      try {
        if (placeholderWin) {
          placeholderWin.location.href = dataUrl;
        } else {
          window.open(dataUrl, '_blank');
        }
      } finally {}
      return;
    }

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
