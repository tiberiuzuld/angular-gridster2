import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      MarkdownModule.forRoot({
        loader: HttpClient,
        markedOptions: {
          provide: MARKED_OPTIONS,
          useValue: { smartypants: true, breaks: true }
        }
      })
    )
  ]
};
