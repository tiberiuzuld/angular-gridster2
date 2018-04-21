import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {GridsterComponent} from './gridster.component';
import {GridsterItemComponent} from './gridsterItem.component';
import {GridsterPreviewComponent} from './gridsterPreview.component';

import {polyfill} from 'mobile-drag-drop';
// optional import of scroll behaviour
import {scrollBehaviourDragImageTranslateOverride} from 'mobile-drag-drop/scroll-behaviour';

// options are optional ;)
polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
});

@NgModule({
  declarations: [
    GridsterComponent,
    GridsterItemComponent,
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
