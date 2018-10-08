import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ItemListComponent } from './item-list/item-list.component';
import { NewItemComponent } from './new-item/new-item.component';
import { ItemNumberDetailComponent } from './item-number-detail/item-number-detail.component';
import { RboParamGuard } from '../../shared/guard/rbo-param.guard';


const itemRoutes: Routes = [
  {
    path: 'items',
    component: ItemComponent,
    canActivateChild: [RboParamGuard],
    children: [
      {
        path: '',
        component: ItemListComponent,
      },
      {
        path: 'new',
        component: NewItemComponent,
      },
      {
        path: ':itemNumber',
        component: ItemNumberDetailComponent,
      }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(itemRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ItemRoutingModule { }
