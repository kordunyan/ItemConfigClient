import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { ItemRoutingModule } from './item-routing.module';
import { ItemListComponent } from './item-list/item-list.component';
import { NewItemComponent} from './new-item/new-item.component';
import { MaterialModulesModule } from '../../shared/modules/material-modules/material-modules.module';
import { MainComponentsModule } from '../../shared/components/main-components.module';
import { ItemNumberDetailComponent } from './item-number-detail/item-number-detail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemFieldComponent } from './item-field/item-field.component';
import { ItemLocationEnablementComponent } from './item-location-enablement/item-location-enablement.component';
import { NewItemFieldsComponent } from './new-item-fields/new-item-fields.component';

@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    MainComponentsModule,
    MaterialModulesModule
  ],
  declarations: [
    ItemComponent,
    ItemListComponent,
    NewItemComponent,
    ItemNumberDetailComponent,
    ItemDetailComponent,
    ItemFieldComponent,
    ItemLocationEnablementComponent,
    NewItemFieldsComponent
  ],
  exports: [ItemRoutingModule]
})
export class ItemModule { }
