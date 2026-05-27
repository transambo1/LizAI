import { AbstractControl, ValidationErrors } from '@angular/forms';

export class customValidator {
  static passwordRange(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (value.length < 6) {
      return { weakPassword: 'Value must be at least 6 characters long.' };
    }
    if (value.length > 15) {
      return { longPassword: 'Value must be no more than 8 characters long.' };
    }
    return null;
  }
}
