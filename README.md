# angular-gridster2

[![npm version](https://badge.fury.io/js/angular-gridster2.svg)](https://badge.fury.io/js/angular-gridster2)
![Node CI](https://github.com/tiberiuzuld/angular-gridster2/workflows/Node%20CI/badge.svg)
[![downloads](https://img.shields.io/npm/dm/angular-gridster2.svg)](https://www.npmjs.com/package/angular-gridster2)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/tiberiuzuld)

### Angular implementation of angular-gridster [Demo](http://tiberiuzuld.github.io/angular-gridster2)

### Requires Angular 14.x

### For other Angular versions check the other branches.

## Install

`npm install angular-gridster2 --save`

Should work out of the box with webpack, respectively angular-cli.

```javascript
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  imports: [ GridsterModule ],
  ...
})
```

## Browser support

What Angular supports [here](https://github.com/angular/angular)

## How to use

```html
<gridster [options]="options">
  <gridster-item [item]="item" *ngFor="let item of dashboard">
    <!-- your content here -->
  </gridster-item>
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
  <div
    (mousedown)="$event.stopPropagation()"
    (touchstart)="$event.stopPropagation()"
  >
    Some content to click without dragging the widget
  </div>
  <div class="item-buttons">
    <button md-icon-button md-raised-button class="drag-handler">
      <md-icon>open_with</md-icon>
    </button>
    <button
      md-icon-button
      md-raised-button
      class="remove-button"
      (click)="removeItem($event, item)"
      (touchstart)="removeItem($event, item)"
      mdTooltip="Remove"
    >
      <md-icon>clear</md-icon>
    </button>
  </div>
</gridster-item>
```

Option 2 (with text selection):

```html
<gridster-item>
  <div class="gridster-item-content">
    Some content to select and click without dragging the widget
  </div>
  <div class="item-buttons">
    <button md-icon-button md-raised-button class="drag-handler">
      <md-icon>open_with</md-icon>
    </button>
    <button
      md-icon-button
      md-raised-button
      class="remove-button"
      (click)="removeItem($event, item)"
      (touchstart)="removeItem($event, item)"
      mdTooltip="Remove"
    >
      <md-icon>clear</md-icon>
    </button>
  </div>
</gridster-item>
```

### Contributors [here](https://github.com/tiberiuzuld/angular-gridster2/graphs/contributors)

### [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/tiberiuzuld)

### License

The MIT License

Copyright (c) 2022 Tiberiu Zuld
