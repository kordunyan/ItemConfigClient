import {NgModule} from '@angular/core';
import {FieldConfigsRoutingModule} from './field-configs-routing.module';
import {FieldConfigComponent} from './field-config/field-config.component';
import {FieldConfigsListComponent} from './field-configs-list/field-configs-list.component';
import {CommonModule} from '@angular/common';
import {MaterialModulesModule} from '../../shared/modules/material-modules/material-modules.module';
import {MainComponentsModule} from '../../shared/components/main-components.module';
import {AddNewFieldConfigComponent} from './add-new-field-config/add-new-field-config.component';
import {SaveForAllDialogComponent} from '../item-field-config/save-for-all-dialog/save-for-all-dialog.component';
import {MultipleEditDialogComponent} from '../item-field-config/multiple-edit-dialog/multiple-edit-dialog.component';
import { UniqueFieldConfigValidatorDirective } from './unique-field-config-validator.directive';


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
      AddNewFieldConfigComponent,
      UniqueFieldConfigValidatorDirective
    ],
    entryComponents: [
      AddNewFieldConfigComponent
    ],
    exports: [FieldConfigsRoutingModule]
  }
)
export class FieldConfigsModule {
}
