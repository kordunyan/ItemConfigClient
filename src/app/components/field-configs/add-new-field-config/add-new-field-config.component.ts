import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FieldConfig} from '../../../shared/domain/field-config';

@Component({
  selector: 'app-add-new-field-config',
  templateUrl: './add-new-field-config.component.html',
  styleUrls: ['./add-new-field-config.component.css']
})
export class AddNewFieldConfigComponent implements OnInit {

  @Input('fieldConfig') fieldConfig: FieldConfig;

  constructor(public dialogRef: MatDialogRef<AddNewFieldConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    //this.fieldConfig = data.fieldConfig;
  }

  ngOnInit() {
  }

}
