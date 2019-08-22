import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MandatoryDataCheckerRoutingModule} from './mandatory-data-checker-routing.module';
import {MandatoryDataCheckerComponent} from './mandatory-data-checker/mandatory-data-checker.component';
import {MainComponentsModule} from '../../shared/components/main-components.module';
import {ItemFieldConfigListComponent} from './item-field-config-list/item-field-config-list.component';
import {DataCheckerPanelComponent} from './data-checker-panel/data-checker-panel.component';
import {MandatoryTranslationsComponent} from './data-check-panels/mandatory-translations/mandatory-translations.component';
import {TranslationComponent} from './data-check-panels/translation/translation.component';
import {AddMandatoryTranslationComponent} from './data-check-panels/add-mandatory-translation/add-mandatory-translation.component';
import { MenuPanelComponent } from './menu-panel/menu-panel.component';
import { MandatoryFieldsComponent } from './data-check-panels/mandatory-fields/mandatory-fields.component';
import { FieldConfigComponent } from './data-check-panels/field-config/field-config.component';
import { AddMandatoryFieldComponent } from './data-check-panels/add-mandatory-field/add-mandatory-field.component';

@NgModule({
  declarations: [
    MandatoryDataCheckerComponent,
    ItemFieldConfigListComponent,
    DataCheckerPanelComponent,
    MandatoryTranslationsComponent,
    TranslationComponent,
    AddMandatoryTranslationComponent,
    MenuPanelComponent,
    MandatoryFieldsComponent,
    FieldConfigComponent,
    AddMandatoryFieldComponent
  ],
  imports: [
    CommonModule,
    MainComponentsModule,
    MandatoryDataCheckerRoutingModule
  ]
})
export class MandatoryDataCheckerModule {
}
