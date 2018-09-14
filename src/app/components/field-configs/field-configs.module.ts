import {NgModule} from '@angular/core';
import {FieldConfigsRoutingModule} from './field-configs-routing.module';
import {FieldConfigComponent} from './field-config/field-config.component';
import {FieldConfigsListComponent} from './field-configs-list/field-configs-list.component';
import {CommonModule} from '@angular/common';
import {MaterialModulesModule} from '../../shared/modules/material-modules/material-modules.module';
import {MainComponentsModule} from '../../shared/components/main-components.module';
import {FieldConfigRowComponent} from './field-config-row/field-config-row.component';
import {AddNewFieldConfigComponent} from './add-new-field-config/add-new-field-config.component';
import {SaveForAllDialogComponent} from '../item-field-config/save-for-all-dialog/save-for-all-dialog.component';
import {MultipleEditDialogComponent} from '../item-field-config/multiple-edit-dialog/multiple-edit-dialog.component';


@NgModule({
    imports: [
      CommonModule,
      FieldConfigsRoutingModule,
      MaterialModulesModule,
      MainComponentsModule
    ],
    declarations: [
      FieldConfigComponent,
      FieldConfigsListComponent,
      FieldConfigRowComponent,
      AddNewFieldConfigComponent
    ],
    entryComponents: [
      AddNewFieldConfigComponent
    ],
    exports: [FieldConfigsRoutingModule]
  }
)
export class FieldConfigsModule {
}
