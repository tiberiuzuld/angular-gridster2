import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
import {
  MdIconModule,
  MdButtonModule,
  MdSelectModule,
  MdInputModule,
  MdTooltipModule,
  MdCheckboxModule, MdSidenavModule
} from '@angular/material';

import {AppComponent} from './app.component';
import {GridsterModule} from '../lib/gridster.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MdIconModule, MdButtonModule, MdSelectModule, MdInputModule, MdTooltipModule, MdCheckboxModule, MdSidenavModule,
    GridsterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
