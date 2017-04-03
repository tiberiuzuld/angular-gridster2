import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
import {MaterialModule} from '@angular/material';

import {AppComponent} from './app.component';
import {GridsterModule} from '../../lib/gridster.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    GridsterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

}
