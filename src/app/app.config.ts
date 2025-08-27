import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideIcons } from '@ng-icons/core';
import {
  lucideSave,
  lucidePlus,
  lucidePencil,
  lucideTrash2,
  lucideDownload,
  lucideMove,
  lucideCalendar,
  lucideClock,
  lucideX,
  lucideInfo,
  lucideUser,
  lucideChevronDown,
  lucideCircleCheck,
  lucideTriangleAlert,
  lucideCircleX,
  lucideSun,
  lucideMoon,
  lucideEraser,
  lucideSunset,
  lucideGithub,
  lucideArrowUpToLine,
  lucideChevronUp,
} from '@ng-icons/lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideIcons({
      lucideEraser,
      lucideSave,
      lucidePlus,
      lucidePencil,
      lucideTrash2,
      lucideDownload,
      lucideMove,
      lucideCalendar,
      lucideClock,
      lucideX,
      lucideInfo,
      lucideUser,
      lucideChevronDown,
      lucideCircleX,
      lucideTriangleAlert,
      lucideCircleCheck,
      lucideSun,
      lucideMoon,
      lucideSunset,
      lucideGithub,
      lucideArrowUpToLine,
      lucideChevronUp,
    }),
  ],
};
