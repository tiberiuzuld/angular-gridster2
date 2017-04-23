import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {GridsterComponent} from './gridster.component';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterPreviewComponent} from './gridsterPreview.component';
import {GridsterGridComponent} from './gridsterGrid.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterGridComponent,
    GridsterPreviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [GridsterComponent, GridsterItemComponent],
  providers: [],
  bootstrap: []
})
export class GridsterModule {
}
