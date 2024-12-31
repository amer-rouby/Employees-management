import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: any[];
  pattern?: string;
}

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit {
  @Input() fields: Field[] = [];
  @Input() formData: any = {};
  @Output() formSubmit = new EventEmitter<any>();

  genericForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.genericForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.fields.forEach(field => {
      this.genericForm.addControl(
        field.name,
        this.fb.control(this.formData[field.name] || '', this.getValidators(field))
      );
    });
  }

  getValidators(field: Field): any[] {
    const validators = [];
    if (field.required) {
      validators.push(Validators.required);
    }
    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }
    return validators;
  }

  onSubmit(): void {
    if (this.genericForm.valid) {
      this.formSubmit.emit(this.genericForm.value);
    }
  }
}
