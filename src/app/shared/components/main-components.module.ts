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
    ExcludedFieldsComponent
  ],
  entryComponents: [
    DeleteDialog,
    ChooseFieldDialog
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
    ExcludedFieldsComponent
  ]
})
export class MainComponentsModule { }
