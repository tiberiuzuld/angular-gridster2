import { NgModule } from '@angular/core';

import { Gridster } from './gridster';
import { GridsterItemComponent } from './gridsterItem.component';

@NgModule({
  imports: [Gridster, GridsterItemComponent],
  exports: [Gridster, GridsterItemComponent]
})
export class GridsterModule {}
