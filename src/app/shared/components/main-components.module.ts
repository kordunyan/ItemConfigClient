import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NotFoundComponent} from './not-found/not-found.component';
import {ProgressComponent} from './progress/progress.component';
import {MaterialModulesModule} from '../modules/material-modules/material-modules.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RequiredFieldDirective} from '../directives/required-field.directive';
import {ChipsComponent} from './chips/chips.component';
import {DeleteComponent} from './delete/delete.component';
import {DeleteDialog} from './delete-dialog/delete-dialog.component';
import {ChooseFieldDialog} from './choose-field/choose-field.component';
import {ExcludedFieldsComponent} from './excluded-fields/excluded-fields.component';
import {ExportComponent} from './export/export.component';
import {ScrollTopComponent} from './scroll-top/scroll-top.component';
import {SelectValuesDialogComponent} from './select-values-dialog/select-values-dialog.component';
import {RboSelectComponent} from './rbo-select/rbo-select.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {ExportItemNumberComponent} from './export-item-number/export-item-number.component';
import { MultipleFieldsComponent } from './multiple-fields/multiple-fields.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ControllComponent } from './controll/controll.component';
import { OptionsSelectDialog } from './options-select-dialog/options-select-dialog';
import { InsertOptionDialog } from './insert-options-dialog/insert-option-dialog';
import { InputFieldDialog } from './input-field-dialog/input-field-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModulesModule
  ],
  declarations: [
    HeaderComponent,
    NotFoundComponent,
    ProgressComponent,
    RequiredFieldDirective,
    ChipsComponent,
    DeleteComponent,
    DeleteDialog,
    ChooseFieldDialog,
    ExcludedFieldsComponent,
    ExportComponent,
    InsertOptionDialog,
    ScrollTopComponent,
    SelectValuesDialogComponent,
    RboSelectComponent,
    ExportItemNumberComponent,
    MultipleFieldsComponent,
    ProgressBarComponent,
    ControllComponent,
    OptionsSelectDialog,
    InputFieldDialog
  ],
  entryComponents: [
    DeleteDialog,
    ChooseFieldDialog,
    InsertOptionDialog,
    SelectValuesDialogComponent,
    OptionsSelectDialog,
    InputFieldDialog
  ],
  exports: [
    HeaderComponent,
    NotFoundComponent,
    ProgressComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModulesModule,
    RequiredFieldDirective,
    ChipsComponent,
    DeleteComponent,
    DeleteDialog,
    ChooseFieldDialog,
    ExcludedFieldsComponent,
    ExportComponent,
    ScrollTopComponent,
    SelectValuesDialogComponent,
    RboSelectComponent,
    ExportItemNumberComponent,
    MultipleFieldsComponent,
    ProgressBarComponent,
    ControllComponent,
    OptionsSelectDialog,
    InsertOptionDialog,
    InputFieldDialog
  ]
})
export class MainComponentsModule {
}
