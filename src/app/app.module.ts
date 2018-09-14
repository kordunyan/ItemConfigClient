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
import {HeaderComponent} from './shared/components/header/header.component';
import {ItemFieldConfigModule} from './components/item-field-config/item-field-config.module';
import {FieldConfigsModule} from './components/field-configs/field-configs.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
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
    FieldConfigsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
