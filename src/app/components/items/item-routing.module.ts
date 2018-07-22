import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ItemListComponent } from './item-list/item-list.component';
import { NewItemComponent } from './new-item/new-item.component';
import { ItemNumberDetailComponent } from './item-number-detail/item-number-detail.component';


const itemRoutes: Routes = [
  {
    path: 'items',
    component: ItemComponent,
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
