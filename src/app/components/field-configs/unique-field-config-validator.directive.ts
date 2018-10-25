import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { FieldConfigHttpService } from 'src/app/shared/service/http/field-config-http.service';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appUniqueFieldConfigValidator]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: UniqueFieldConfigValidatorDirective, multi: true }]
})
export class UniqueFieldConfigValidatorDirective implements AsyncValidator {

  constructor(
    private fieldConfigHttpService: FieldConfigHttpService
  ) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.fieldConfigHttpService.getByName(control.value)
      .pipe(
        map(result => result ? { uniqueFieldConfigName: true} : null)
      )
  }

}
