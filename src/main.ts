import { HttpClient, HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      MarkdownModule.forRoot({
        loader: HttpClient,
        markedOptions: {
          provide: MarkedOptions,
          useValue: { smartypants: true, breaks: true }
        }
      })
    )
  ]
}).catch(err => console.log(err));
