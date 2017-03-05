import {Component, OnInit, ElementRef} from '@angular/core';

@Component({
  selector: 'tz-gridster-item',
  templateUrl: './gridsterItem.html',
  styleUrls: ['./gridsterItem.css']
})
export class GridsterItemComponent implements OnInit {

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'red';
  }

  ngOnInit() {
    console.log('init item');
  }
}
