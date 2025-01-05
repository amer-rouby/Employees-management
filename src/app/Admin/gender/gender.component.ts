import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gender } from '../../Models/gender.model';
import { GenderService } from '../../Services/gender.service';
import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-titles',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'MANAGEMENT_DEPARTMENTS' }
  ];

  gender: MatTableDataSource<Gender> = new MatTableDataSource<Gender>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: Gender) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: Gender) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];

  genderFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];

  genderForm: FormGroup;
  isEditing = false;
  selectedId: string | null = null;
  isLoading = false;

  constructor(
    private genderService: GenderService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.genderForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchGender();
  }

  private fetchGender(): void {
    this.toggleLoading(true);
    this.genderService.getAllGenderRecords().subscribe(
      data => {
        this.gender.data = data;
        this.toggleLoading(false);
      },
      error => this.handleError('FAILED_TO_LOAD_DEPARTMENTS', error)
    );
  }

  addGender(): void {
    if (this.genderForm.invalid) return;

    this.toggleLoading(true);
    const newGender: Gender = this.genderForm.value;
    this.genderService.addGenderRecord(newGender).subscribe(
      () => this.handleSuccess('DEPARTMENT_ADDED_SUCCESS'),
      error => this.handleError('FAILED_TO_ADD_DEPARTMENT', error)
    );
  }

  editGender(department: Gender): void {
    this.genderForm.patchValue(department);
    this.isEditing = true;
    this.selectedId = department.id;
  }

  updateGender(): void {
    if (this.genderForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.genderService.updateGenderRecord(this.selectedId, this.genderForm.value).subscribe(
      () => this.handleSuccess('DEPARTMENT_UPDATED_SUCCESS'),
      error => this.handleError('FAILED_TO_UPDATE_DEPARTMENT', error)
    );
  }

  deleteGender(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.genderService.deleteGenderRecord(id).subscribe(
          () => this.handleSuccess('DEPARTMENT_DELETED_SUCCESS'),
          error => this.handleError('FAILED_TO_DELETE_DEPARTMENT', error)
        );
      }
    });
  }

  resetForm(): void {
    this.genderForm.reset();
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
    this.fetchGender();
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
