import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
import {MaterialModule} from '@angular/material';

import {AppComponent} from './app.component';
import {GridsterModule} from '../gridster/gridster.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    GridsterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
