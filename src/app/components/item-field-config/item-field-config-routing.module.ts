import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemFieldConfigComponent } from './item-field-config/item-field-config.component';
import { FieldConfigListComponent } from './field-config-list/field-config-list.component';
import { RboParamGuard } from '../../shared/guard/rbo-param.guard';

const itemRoutes: Routes = [
  {
    path: 'item-field-config',
    component: ItemFieldConfigComponent,
    canActivateChild: [ 
      RboParamGuard 
    ],
    children: [
      {
        path: ':itemId',
        component: FieldConfigListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(itemRoutes)  
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class ItemFieldConfigRoutingModule { }
