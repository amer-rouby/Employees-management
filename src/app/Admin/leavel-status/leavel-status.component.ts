import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { leavelStatus } from '../../Models/leavelStatus.model';
import { leavelStatusService } from '../../Services/leave-status.service';

@Component({
  selector: 'app-job-titles',
  templateUrl: './leavel-status.component.html',
  styleUrls: ['./leavel-status.component.scss']
})
export class LeavelStatusComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'MANAGEMENT_LEAVEL_STATUSE' }
  ];

  leavelStatus: MatTableDataSource<leavelStatus> = new MatTableDataSource<leavelStatus>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: leavelStatus) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: leavelStatus) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];

  leavelStatusFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];

  leavelStatusForm: FormGroup;
  isEditing = false;
  selectedId: string | null = null;
  isLoading = false;

  constructor(
    private leavelStatusService: leavelStatusService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.leavelStatusForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchLeavelStatus();
  }

  private fetchLeavelStatus(): void {
    this.toggleLoading(true);
    this.leavelStatusService.getAllleavelStatusRequests().subscribe(
      data => {
        this.leavelStatus.data = data;
        this.toggleLoading(false);
      },
      error => this.handleError('FAILED_TO_LOAD_DEPARTMENTS', error)
    );
  }

  addDepartment(): void {
    if (this.leavelStatusForm.invalid) return;

    this.toggleLoading(true);
    const newDepartment: leavelStatus = this.leavelStatusForm.value;
    this.leavelStatusService.addleavelStatusRequest(newDepartment).subscribe(
      () => this.handleSuccess('DEPARTMENT_ADDED_SUCCESS'),
      error => this.handleError('FAILED_TO_ADD_DEPARTMENT', error)
    );
  }

  editDepartment(department: leavelStatus): void {
    this.leavelStatusForm.patchValue(department);
    this.isEditing = true;
    this.selectedId = department.id;
  }

  updateDepartment(): void {
    if (this.leavelStatusForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.leavelStatusService.updateleavelStatusRequest(this.selectedId, this.leavelStatusForm.value).subscribe(
      () => this.handleSuccess('DEPARTMENT_UPDATED_SUCCESS'),
      error => this.handleError('FAILED_TO_UPDATE_DEPARTMENT', error)
    );
  }

  deleteDepartment(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.leavelStatusService.deleteleavelStatusRequest(id).subscribe(
          () => this.handleSuccess('DEPARTMENT_DELETED_SUCCESS'),
          error => this.handleError('FAILED_TO_DELETE_DEPARTMENT', error)
        );
      }
    });
  }

  resetForm(): void {
    this.leavelStatusForm.reset();
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
    this.fetchLeavelStatus();
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
