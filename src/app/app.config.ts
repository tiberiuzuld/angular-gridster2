import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(
      MarkdownModule.forRoot({
        loader: HttpClient,
        markedOptions: {
          provide: MARKED_OPTIONS,
          useValue: { breaks: true }
        }
      })
    ),
    provideAnimationsAsync()
  ]
};
