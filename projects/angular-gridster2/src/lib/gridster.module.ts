import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridsterItem.component';
import { GridsterPreviewComponent } from './gridsterPreview.component';

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
    GridsterPreviewComponent
  ],
  imports: [CommonModule],
  exports: [GridsterComponent, GridsterItemComponent]
})
export class GridsterModule {}
