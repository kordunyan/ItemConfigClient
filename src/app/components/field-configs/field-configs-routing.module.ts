import {NgModule, Component} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FieldConfigComponent} from './field-config/field-config.component';
import {FieldConfigsListComponent} from './field-configs-list/field-configs-list.component';
import {RboParamGuard} from '../../shared/guard/rbo-param.guard';

const fieldConfigsRoutes: Routes = [
  {
    path: 'field-configs',
    component: FieldConfigComponent,
    canActivateChild: [RboParamGuard],
    children: [
      {
        path: '',
        component: FieldConfigsListComponent
      }
    ]
  }
];

@NgModule ({
  imports: [
    RouterModule.forChild(fieldConfigsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FieldConfigsRoutingModule { }
