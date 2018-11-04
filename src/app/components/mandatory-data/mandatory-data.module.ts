import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MandatoryDataRoutingModule} from './mandatory-data-routing.module';
import {MandatoryDataComponent} from './mandatory-data/mandatory-data.component';
import {MainComponentsModule} from 'src/app/shared/components/main-components.module';
import {MaterialModulesModule} from 'src/app/shared/modules/material-modules/material-modules.module';
import {ItemFieldConfigListComponent} from './item-field-config-list/item-field-config-list.component';
import {ControllComponent} from './controll/controll.component';
import {MandatoryTranslationsComponent} from './mandatory-translations/mandatory-translations.component';
import {MandatoryFieldsComponent} from './mandatory-fields/mandatory-fields.component';
import {TranslationComponent} from './translation/translation.component';
import {FieldConfigComponent} from './field-config/field-config.component';
import {MenuPanelComponent} from './menu-panel/menu-panel.component';
import { AddMandatoryFieldComponent } from './add-mandatory-field/add-mandatory-field.component';
import { AddMandatoryTranslationComponent } from './add-mandatory-translation/add-mandatory-translation.component';

@NgModule({
  imports: [
    CommonModule,
    MandatoryDataRoutingModule,
    MainComponentsModule,
    MaterialModulesModule
  ],
  declarations: [
    MandatoryDataComponent,
    ItemFieldConfigListComponent,
    ControllComponent,
    MandatoryTranslationsComponent,
    MandatoryFieldsComponent,
    TranslationComponent,
    FieldConfigComponent,
    MenuPanelComponent,
    AddMandatoryFieldComponent,
    AddMandatoryTranslationComponent
  ],
  exports: [
    MandatoryDataRoutingModule
  ]
})
export class MandatoryDataModule {
}
