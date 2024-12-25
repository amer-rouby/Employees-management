import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shared-form',
  templateUrl: './shared-form.component.html',
  styleUrls: ['./shared-form.component.scss'],
})
export class SharedFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields!: { label: string; controlName: string; type: string; required: boolean, languageType: 'arabic' | 'english'}[];
  @Input() isEditing = false;

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancelForm = new EventEmitter<void>();

  onSubmit() {
    this.submitForm.emit();
  }

  onCancel() {
    this.cancelForm.emit();
  }
}
