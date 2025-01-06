import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { TypesOfVacations } from '../../Models/TypesOfVacations.model';
import { TypesOfVacationsService } from '../../Services/Types-of-vacations.service';

@Component({
  selector: 'app-job-titles',
  templateUrl: './types-of-vacations.component.html',
  styleUrls: ['./types-of-vacations.component.scss']
})
export class TypesOfVacationsComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'MANAGEMENT_TYPE_OF_VACATIONS' }
  ];

  TypesOfVacations: MatTableDataSource<TypesOfVacations> = new MatTableDataSource<TypesOfVacations>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: TypesOfVacations) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: TypesOfVacations) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];

  TypesOfVacationsFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];

  TypesOfVacationsForm: FormGroup;
  isEditing = false;
  selectedId: string | null = null;
  isLoading = false;

  constructor(
    private typesOfVacationsService: TypesOfVacationsService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.TypesOfVacationsForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchTypesOfVacations();
  }

  private fetchTypesOfVacations(): void {
    this.toggleLoading(true);
    this.typesOfVacationsService.getAllTypesOfVacationsRequests().subscribe(
      data => {
        this.TypesOfVacations.data = data;
        this.toggleLoading(false);
      },
      error => this.handleError('FAILED_TO_LOAD_DEPARTMENTS', error)
    );
  }

  addDepartment(): void {
    if (this.TypesOfVacationsForm.invalid) return;

    this.toggleLoading(true);
    const newDepartment: TypesOfVacations = this.TypesOfVacationsForm.value;
    this.typesOfVacationsService.addTypesOfVacationsRequest(newDepartment).subscribe(
      () => this.handleSuccess('DEPARTMENT_ADDED_SUCCESS'),
      error => this.handleError('FAILED_TO_ADD_DEPARTMENT', error)
    );
  }

  editDepartment(department: TypesOfVacations): void {
    this.TypesOfVacationsForm.patchValue(department);
    this.isEditing = true;
    this.selectedId = department.id;
  }

  updateDepartment(): void {
    if (this.TypesOfVacationsForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.typesOfVacationsService.updateTypesOfVacationsRequest(this.selectedId, this.TypesOfVacationsForm.value).subscribe(
      () => this.handleSuccess('DEPARTMENT_UPDATED_SUCCESS'),
      error => this.handleError('FAILED_TO_UPDATE_DEPARTMENT', error)
    );
  }

  deleteDepartment(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.typesOfVacationsService.deleteTypesOfVacationsRequest(id).subscribe(
          () => this.handleSuccess('DEPARTMENT_DELETED_SUCCESS'),
          error => this.handleError('FAILED_TO_DELETE_DEPARTMENT', error)
        );
      }
    });
  }

  resetForm(): void {
    this.TypesOfVacationsForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }

  private handleError(messageKey: string, error: any): void {
    console.error(error);
    this.toastr.error(messageKey, 'Error');
    this.toggleLoading(false);
  }

  private handleSuccess(messageKey: string): void {
    this.fetchTypesOfVacations();
    this.resetForm();
    this.showToast(messageKey);
  }

  private showToast(key: string): void {
    this.translate.get(key).subscribe(message => {
      this.toastr.success(message);
    });
    this.toggleLoading(false);
  }
}
