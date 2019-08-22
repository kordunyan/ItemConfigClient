import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';


import {AppComponent} from './app.component';
import {MaterialModulesModule} from './shared/modules/material-modules/material-modules.module';
import {AppRoutingModule} from './/app-routing.module';
import {ItemModule} from './components/items/item.module';
import {MainComponentsModule} from './shared/components/main-components.module';
import {ItemFieldConfigModule} from './components/item-field-config/item-field-config.module';
import {MandatoryDataModule} from './components/mandatory-data/mandatory-data.module';
import {FieldConfigsModule} from './components/field-configs/field-configs.module';
import { MandatoryDataCheckerModule } from './components/mandatory-data-checker/mandatory-data-checker.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MaterialModulesModule,
    MainComponentsModule,
    BrowserAnimationsModule,
    ItemModule,
    ItemFieldConfigModule,
    MandatoryDataModule,
    FieldConfigsModule,
    MandatoryDataCheckerModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
