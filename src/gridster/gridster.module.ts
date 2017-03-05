import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {GridsterComponent} from './gridster.component';
import {GridsterItemComponent} from './gridsterItem.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [GridsterComponent, GridsterItemComponent],
  providers: [],
  bootstrap: []
})
export class GridsterModule {
}
