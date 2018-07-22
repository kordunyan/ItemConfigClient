import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemFieldConfigRoutingModule } from './item-field-config-routing.module';
import { MainComponentsModule } from '../../shared/components/main-components.module';
import { MaterialModulesModule } from '../../shared/modules/material-modules/material-modules.module';
import { ItemFieldConfigComponent } from './item-field-config/item-field-config.component';
import { FieldConfigListComponent } from './field-config-list/field-config-list.component';
import { FieldConfigRowComponent } from './field-config-row/field-config-row.component';
import { FieldConfigListControlComponent } from './field-config-list-control/field-config-list-control.component';

@NgModule({
  imports: [
    CommonModule,
    ItemFieldConfigRoutingModule,
    MainComponentsModule,
    MaterialModulesModule
  ],
  declarations: [
    ItemFieldConfigComponent,
    FieldConfigListComponent,
    FieldConfigRowComponent,
    FieldConfigListControlComponent
  ],
  exports: [
    ItemFieldConfigRoutingModule
  ]
})
export class ItemFieldConfigModule { }
