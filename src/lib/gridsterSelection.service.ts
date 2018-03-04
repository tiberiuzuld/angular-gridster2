import { Injectable, EventEmitter } from '@angular/core';
import { GridsterItem, GridsterItemComponentInterface } from 'lib';

@Injectable()
export class GridsterSelectionService {
    public selectItem = new EventEmitter<GridsterItemComponentInterface>();
    public unSelectItem = new EventEmitter<GridsterItemComponentInterface>();
}

