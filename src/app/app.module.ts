import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
import {
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule, MatSidenavModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {GridsterModule} from '../lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule, MatButtonModule, MatSelectModule, MatInputModule, MatTooltipModule, MatCheckboxModule, MatSidenavModule,
    GridsterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
