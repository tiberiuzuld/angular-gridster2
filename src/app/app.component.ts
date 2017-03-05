import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'tz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  options: Object;
  dashboard: Array<Object>;

  ngOnInit() {
    this.options = {
      gridType: 'fit',
      compactUp: true,
      compactLeft: true,
      itemChangeCallback: this.itemChange,
      margin: 10,
      outerMargin: true,
      draggable: {
        enabled: true,
        stop: this.eventStop
      },
      resizable: {
        enabled: true,
        stop: this.eventStop
      },
      swap: true
    };

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2},
      {cols: 1, rows: 1, y: 0, x: 4},
      {cols: 1, rows: 1, y: 0, x: 5},
      {cols: 2, rows: 1, y: 1, x: 0},
      {cols: 1, rows: 1, y: undefined, x: undefined},
      {cols: 1, rows: 2, y: 1, x: 5},
      {cols: 1, rows: 3, y: 2, x: 0},
      {cols: 2, rows: 1, y: 2, x: 1},
      {cols: 1, rows: 1, y: 2, x: 3},
      {cols: 1, rows: 1, y: 3, x: 4, initCallback: this.itemInit}
    ];
  }


  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  };

  addItem() {
    this.dashboard.push({});
  };

  eventStop(item, scope) {
    console.info('eventStop', item, scope);
  }

  itemChange(item, scope) {
    console.info('itemChanged', item, scope);
  }

  itemInit(item) {
    console.info('itemInitialized', item);
  }
}
