import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { GridsterItem, GridsterItemComponentInterface, GridsterComponentInterface } from 'lib';

@Injectable()
export class GridsterSelectable {

    constructor(private gridsterItem: GridsterItemComponentInterface, private gridster: GridsterComponentInterface, private zone: NgZone) {

    }

    onMouseDown(): any {
        this.gridster.selectedComponent = this.gridsterItem;
    }
}

