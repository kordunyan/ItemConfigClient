import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundComponent } from './not-found/not-found.component';
import { ProgressComponent } from './progress/progress.component';
import { MaterialModulesModule } from '../modules/material-modules/material-modules.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredFieldDirective } from '../directives/required-field.directive';
import { ChipsComponent } from './chips/chips.component';
import { DeleteComponent } from './delete/delete.component';
import { DeleteDialog } from './delete-dialog/delete-dialog.component';
import { ChooseFieldDialog } from './choose-field/choose-field.component';
import { ExcludedFieldsComponent } from './excluded-fields/excluded-fields.component';
import { ExportComponent } from './export/export.component';
import { ItemNumbersSelectDialog } from './item-numbers-select-dialog/item-numbers-select-dialog';
import { InsertItemNumberDialog } from './insert-item-number-dialog/insert-item-number-dialog';
import {ScrollTopComponent} from './scroll-top/scroll-top.component';
import { SelectValuesDialogComponent } from './select-values-dialog/select-values-dialog.component';
import { SelectValuesButtonComponent } from './select-values-button/select-values-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MaterialModulesModule
  ],
  declarations: [
    NotFoundComponent,
    ProgressComponent,
    RequiredFieldDirective,
    ChipsComponent,
    DeleteComponent,
    DeleteDialog,
    ChooseFieldDialog,
    ExcludedFieldsComponent,
    ExportComponent,
    ItemNumbersSelectDialog,
    InsertItemNumberDialog,
    ScrollTopComponent,
    SelectValuesDialogComponent,
    SelectValuesButtonComponent
  ],
  entryComponents: [
    DeleteDialog,
    ChooseFieldDialog,
    ItemNumbersSelectDialog,
    InsertItemNumberDialog,
    SelectValuesDialogComponent
  ],
  exports: [
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
    ItemNumbersSelectDialog,
    ScrollTopComponent,
    SelectValuesDialogComponent,
    SelectValuesButtonComponent
  ]
})
export class MainComponentsModule { }
