import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemFieldConfigRoutingModule } from './item-field-config-routing.module';
import { MainComponentsModule } from '../../shared/components/main-components.module';
import { MaterialModulesModule } from '../../shared/modules/material-modules/material-modules.module';
import { ItemFieldConfigComponent } from './item-field-config/item-field-config.component';
import { FieldConfigListComponent } from './field-config-list/field-config-list.component';
import { FieldConfigListControlComponent } from './field-config-list-control/field-config-list-control.component';
import { SaveForAllDialogComponent } from './save-for-all-dialog/save-for-all-dialog.component';
import { MultipleEditDialogComponent } from './multiple-edit-dialog/multiple-edit-dialog.component';
import { FieldConfigTableComponent } from './field-config-table/field-config-table.component';
import { FilterRegexDialogComponent } from './filter-regex-dialog/filter-regex-dialog.component';
import { FilterRegexComponent } from './filter-regex/filter-regex.component';

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
    FieldConfigListControlComponent,
    SaveForAllDialogComponent,
    MultipleEditDialogComponent,
    FieldConfigTableComponent,
    FilterRegexDialogComponent,
    FilterRegexComponent
  ],
  entryComponents: [
    SaveForAllDialogComponent,
    MultipleEditDialogComponent,
    FilterRegexDialogComponent,
    FilterRegexDialogComponent
  ],
  exports: [
    ItemFieldConfigRoutingModule
  ]
})
export class ItemFieldConfigModule { }
