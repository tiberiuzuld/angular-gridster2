import { NgModule } from '@angular/core';

import { GridsterComponent } from './gridster.component';
import { GridsterItemComponent } from './gridsterItem.component';

@NgModule({
  imports: [GridsterComponent, GridsterItemComponent],
  exports: [GridsterComponent, GridsterItemComponent]
})
export class GridsterModule {}
