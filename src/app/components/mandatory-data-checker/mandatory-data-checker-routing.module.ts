import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MandatoryDataCheckerComponent} from './mandatory-data-checker/mandatory-data-checker.component';
import {RboParamGuard} from '../../shared/guard/rbo-param.guard';
import {ItemFieldConfigListComponent} from './item-field-config-list/item-field-config-list.component';

const routes: Routes = [
  {
    path: 'mandatory-data-checker',
    canActivateChild: [
      RboParamGuard
    ],
    component: MandatoryDataCheckerComponent,
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
export class MandatoryDataCheckerRoutingModule { }
