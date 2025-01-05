import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaritalStatus } from '../../Models/maritalStatus.model';
import { MaritalStatusService } from '../../Services/maritalStatus.service';
import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-titles',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.scss']
})
export class MaritalStatusComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'MANAGEMENT_DEPARTMENTS' }
  ];

  maritalStatus: MatTableDataSource<MaritalStatus> = new MatTableDataSource<MaritalStatus>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: MaritalStatus) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: MaritalStatus) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];

  maritalStatusFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];

  maritalStatusForm: FormGroup;
  isEditing = false;
  selectedId: string | null = null;
  isLoading = false;

  constructor(
    private maritalStatusService: MaritalStatusService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.maritalStatusForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchMaritalStatus();
  }

  private fetchMaritalStatus(): void {
    this.toggleLoading(true);
    this.maritalStatusService.getAllMaritalStatus().subscribe(
      data => {
        this.maritalStatus.data = data;
        this.toggleLoading(false);
      },
      error => this.handleError('FAILED_TO_LOAD_DEPARTMENTS', error)
    );
  }

  addMaritalStatus(): void {
    if (this.maritalStatusForm.invalid) return;

    this.toggleLoading(true);
    const newMaritalStatus: MaritalStatus = this.maritalStatusForm.value;
    this.maritalStatusService.addMaritalStatus(newMaritalStatus).subscribe(
      () => this.handleSuccess('DEPARTMENT_ADDED_SUCCESS'),
      error => this.handleError('FAILED_TO_ADD_DEPARTMENT', error)
    );
  }

  editMaritalStatus(department: MaritalStatus): void {
    this.maritalStatusForm.patchValue(department);
    this.isEditing = true;
    this.selectedId = department.id;
  }

  updateMaritalStatus(): void {
    if (this.maritalStatusForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.maritalStatusService.updateMaritalStatus(this.selectedId, this.maritalStatusForm.value).subscribe(
      () => this.handleSuccess('DEPARTMENT_UPDATED_SUCCESS'),
      error => this.handleError('FAILED_TO_UPDATE_DEPARTMENT', error)
    );
  }

  deleteMaritalStatus(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.maritalStatusService.deleteMaritalStatus(id).subscribe(
          () => this.handleSuccess('DEPARTMENT_DELETED_SUCCESS'),
          error => this.handleError('FAILED_TO_DELETE_DEPARTMENT', error)
        );
      }
    });
  }

  resetForm(): void {
    this.maritalStatusForm.reset();
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
    this.fetchMaritalStatus();
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
