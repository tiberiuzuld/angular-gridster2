import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatSidenavModule
} from '@angular/material';
import {MarkdownModule, MarkedOptions} from 'ngx-markdown';

import {AppComponent} from './app.component';
import {HomeComponent} from './sections/home/home.component';
import {GridTypesComponent} from './sections/gridTypes/gridTypes.component';
import {GridsterModule} from 'angular-gridster2';
import {CompactComponent} from './sections/compact/compact.component';
import {DisplayGridComponent} from './sections/displayGrid/displayGrid.component';
import {SwapComponent} from './sections/swap/swap.component';
import {PushComponent} from './sections/push/push.component';
import {DragComponent} from './sections/drag/drag.component';
import {ResizeComponent} from './sections/resize/resize.component';
import {GridSizesComponent} from './sections/gridSizes/gridSizes.component';
import {GridMarginsComponent} from './sections/gridMargins/gridMargins.component';
import {MiscComponent} from './sections/misc/misc.component';
import {EmptyCellComponent} from './sections/emptyCell/emptyCell.component';
import {GridEventsComponent} from './sections/gridEvents/gridEvents.component';
import {ItemsComponent} from './sections/items/items.component';
import {ApiComponent} from './sections/api/api.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'api', component: ApiComponent},
  {path: 'compact', component: CompactComponent},
  {path: 'displayGrid', component: DisplayGridComponent},
  {path: 'drag', component: DragComponent},
  {path: 'emptyCell', component: EmptyCellComponent},
  {path: 'gridEvents', component: GridEventsComponent},
  {path: 'gridMargins', component: GridMarginsComponent},
  {path: 'gridSizes', component: GridSizesComponent},
  {path: 'gridTypes', component: GridTypesComponent},
  {path: 'items', component: ItemsComponent},
  {path: 'push', component: PushComponent},
  {path: 'resize', component: ResizeComponent},
  {path: 'swap', component: SwapComponent},
  {path: 'misc', component: MiscComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ApiComponent,
    CompactComponent,
    DisplayGridComponent,
    DragComponent,
    EmptyCellComponent,
    GridEventsComponent,
    GridMarginsComponent,
    GridSizesComponent,
    GridTypesComponent,
    ItemsComponent,
    PushComponent,
    ResizeComponent,
    SwapComponent,
    MiscComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
    ),
    MatIconModule, MatButtonModule, MatSelectModule, MatInputModule, MatCheckboxModule, MatSidenavModule, MatListModule,
    GridsterModule,
    MarkdownModule.forRoot({provide: MarkedOptions, useValue: {smartypants: true, breaks: true}}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
