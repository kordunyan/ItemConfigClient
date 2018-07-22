import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  exports: [
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  declarations: []
})
export class MaterialModulesModule { }
