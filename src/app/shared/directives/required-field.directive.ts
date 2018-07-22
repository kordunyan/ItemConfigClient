import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { AppProperties } from '../domain/app-properties';

@Directive({
  selector: '[appRequiredField]',
  providers: [{provide: NG_VALIDATORS, useExisting: RequiredFieldDirective, multi: true}]
})
export class RequiredFieldDirective implements Validator{

  @Input('appRequiredField') controlName: string;
  isRequired: boolean = null;

  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} {
    if (this.isRequired === null) {
      this.isRequired = AppProperties.REQUIRED_FIELDS.indexOf(this.controlName) > -1;
    }
    if (this.isRequired && control.value !== null) { 
      return control.value.length <= 0 ? {'requiredField': {valid: false}} : null;
    }
    return null;
  }

}
