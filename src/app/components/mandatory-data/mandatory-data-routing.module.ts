import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MandatoryDataComponent } from './mandatory-data/mandatory-data.component';
import { RboParamGuard } from 'src/app/shared/guard/rbo-param.guard';
import { ItemFieldConfigListComponent } from './item-field-config-list/item-field-config-list.component';

const routes: Routes = [
  {
    path: 'mandatory-data',
    component: MandatoryDataComponent,
    canActivateChild: [ 
      RboParamGuard 
    ],
    children: [
      {
        path: ':itemId',
        component: ItemFieldConfigListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandatoryDataRoutingModule { }
