import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {GridsterComponent} from './gridster.component';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterPreviewComponent} from './gridsterPreview.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent
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
