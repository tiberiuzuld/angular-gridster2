# angular-gridster2

[![npm version](https://badge.fury.io/js/angular-gridster2.svg)](https://badge.fury.io/js/angular-gridster2)
![Node CI](https://github.com/tiberiuzuld/angular-gridster2/actions/workflows/deploy-demo.yml/badge.svg)
[![downloads](https://img.shields.io/npm/dm/angular-gridster2.svg)](https://www.npmjs.com/package/angular-gridster2)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/tiberiuzuld)

### Angular implementation of angular-gridster [Demo](http://tiberiuzuld.github.io/angular-gridster2)

### Requires Angular 18.x

### For other Angular versions check the other branches.

## Browser support

What Angular supports [here](https://github.com/angular/angular)

## Install

`npm install angular-gridster2 --save`

## How to use

```javascript
import {Component} from '@angular/core';
import {GridsterComponent, GridsterItemComponent} from 'angular-gridster2';

@Component({
  standalone: true,
  imports: [GridsterComponent, GridsterItemComponent],
  ...
})
```

```html
<gridster [options]="options">
  @for (item of dashboard; track item) {
  <gridster-item [item]="item">
    <!-- your content here -->
  </gridster-item>
  }
</gridster>
```

Initialize a simple dashboard:

```typescript
   import { GridsterConfig, GridsterItem }  from 'angular-gridster2';
   options: GridsterConfig;
   dashboard: Array<GridsterItem>;

   static itemChange(item, itemComponent) {
     console.info('itemChanged', item, itemComponent);
   }

   static itemResize(item, itemComponent) {
     console.info('itemResized', item, itemComponent);
   }

   ngOnInit() {
     this.options = {
       itemChangeCallback: AppComponent.itemChange,
       itemResizeCallback: AppComponent.itemResize,
     };

     this.dashboard = [
       {cols: 2, rows: 1, y: 0, x: 0},
       {cols: 2, rows: 2, y: 0, x: 2}
     ];
   }

   changedOptions() {
     this.options.api.optionsChanged();
   }

   removeItem(item) {
     this.dashboard.splice(this.dashboard.indexOf(item), 1);
   }

   addItem() {
     this.dashboard.push({});
   }
```

##### Note: The gridster will take all the available space from the parent. It will not size depending on content. The parent of the component needs to have a size.

### Having iFrame in widgets content

iFrames can interfere with drag/resize of widgets. For a workaround please read [this issue #233](https://github.com/tiberiuzuld/angular-gridster2/issues/233)

### Interact with content without dragging

Option 1 (without text selection):

```html
<gridster-item>
  <div (mousedown)="$event.stopPropagation()" (touchstart)="$event.stopPropagation()">Some content to click without dragging the widget</div>
  <div class="item-buttons">
    <button class="drag-handler">
      <md-icon>open_with</md-icon>
    </button>
    <button class="remove-button" (click)="removeItem($event, item)" (touchstart)="removeItem($event, item)">
      <md-icon>clear</md-icon>
    </button>
  </div>
</gridster-item>
```

Option 2 (with text selection):

```html
<gridster-item>
  <div class="gridster-item-content">Some content to select and click without dragging the widget</div>
  <div class="item-buttons">
    <button class="drag-handler">
      <md-icon>open_with</md-icon>
    </button>
    <button class="remove-button" (click)="removeItem($event, item)" (touchstart)="removeItem($event, item)">
      <md-icon>clear</md-icon>
    </button>
  </div>
</gridster-item>
```

### Contributors [here](https://github.com/tiberiuzuld/angular-gridster2/graphs/contributors)

### [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/tiberiuzuld)

### License

The MIT License

Copyright (c) 2024 Tiberiu Zuld
