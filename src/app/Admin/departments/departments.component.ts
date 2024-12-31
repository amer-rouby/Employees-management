import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departments } from '../../Models/departments.model';
import { DepartmentsService } from '../../Services/departments.service';
import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-titles',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'MANAGEMENT_DEPARTMENTS' }
  ];

  departments: MatTableDataSource<Departments> = new MatTableDataSource<Departments>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: Departments) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: Departments) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];

  departmentsFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];

  departmentsForm: FormGroup;
  isEditing = false;
  selectedId: string | null = null;
  isLoading = false;

  constructor(
    private departmentsService: DepartmentsService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.departmentsForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchDepartments();
  }

  private fetchDepartments(): void {
    this.toggleLoading(true);
    this.departmentsService.getAllDepartmentsRequests().subscribe(
      data => {
        this.departments.data = data;
        this.toggleLoading(false);
      },
      error => this.handleError('FAILED_TO_LOAD_DEPARTMENTS', error)
    );
  }

  addDepartment(): void {
    if (this.departmentsForm.invalid) return;

    this.toggleLoading(true);
    const newDepartment: Departments = this.departmentsForm.value;
    this.departmentsService.addDepartmentsRequest(newDepartment).subscribe(
      () => this.handleSuccess('DEPARTMENT_ADDED_SUCCESS'),
      error => this.handleError('FAILED_TO_ADD_DEPARTMENT', error)
    );
  }

  editDepartment(department: Departments): void {
    this.departmentsForm.patchValue(department);
    this.isEditing = true;
    this.selectedId = department.id;
  }

  updateDepartment(): void {
    if (this.departmentsForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.departmentsService.updateDepartmentsRequest(this.selectedId, this.departmentsForm.value).subscribe(
      () => this.handleSuccess('DEPARTMENT_UPDATED_SUCCESS'),
      error => this.handleError('FAILED_TO_UPDATE_DEPARTMENT', error)
    );
  }

  deleteDepartment(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.departmentsService.deleteDepartmentsRequest(id).subscribe(
          () => this.handleSuccess('DEPARTMENT_DELETED_SUCCESS'),
          error => this.handleError('FAILED_TO_DELETE_DEPARTMENT', error)
        );
      }
    });
  }

  resetForm(): void {
    this.departmentsForm.reset();
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
    this.fetchDepartments();
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
