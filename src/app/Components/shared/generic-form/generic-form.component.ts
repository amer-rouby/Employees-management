import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date';
  required?: boolean;
  options?: { id: any; name: string }[];
  pattern?: string;
}

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
})
export class GenericFormComponent implements OnInit {
  @Input() fields: Field[] = [];
  @Input() formData: any = {};
  @Output() formSubmit = new EventEmitter<any>();

  genericForm: FormGroup;

  constructor(private fb: FormBuilder 
    ,private dialogRef: MatDialogRef<any>,
  ) {
    this.genericForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.createFormControls();
  }

  // Create form controls dynamically based on input fields
  private createFormControls(): void {
    this.fields.forEach((field) => {
      const control = this.fb.control(this.formData[field.name] || '', this.getValidators(field));
      this.genericForm.addControl(field.name, control);
    });
  }

  // Get validators based on the field definition
  private getValidators(field: Field): any[] {
    const validators = [];
    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }
    return validators;
  }

  // Handle form submission
  onSubmit(): void {
    if (this.genericForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const formData = this.prepareFormDataForSubmission();
    this.formSubmit.emit(formData);
  }

  // Prepare form data by converting date fields to ISO format
  private prepareFormDataForSubmission(): any {
    const formData = { ...this.genericForm.value };

    this.fields.forEach((field) => {
      if (field.type === 'date' && formData[field.name]) {
        formData[field.name] = this.convertToDateISOString(formData[field.name], field.name);
      }
    });

    return formData;
  }

  // Convert date to ISO string and handle invalid date
  private convertToDateISOString(dateValue: any, fieldName: string): string | undefined {
    const date = new Date(dateValue);
    if (dateValue && !isNaN(date.getTime())) {
      return date.toISOString();
    } else {
      console.warn(`Invalid date for field: ${fieldName}`);
      return undefined;
    }
  }

  // Handle cancel action
  cancel(): void {
    this.dialogRef.close();
  }

  // Helper method to get form control by name
  getControl(name: string): AbstractControl | null {
    return this.genericForm.get(name);
  }
}
