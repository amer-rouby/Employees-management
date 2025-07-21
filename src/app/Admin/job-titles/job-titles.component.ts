import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobTitles } from '../../Models/JobTitles.model';
import { JobTitlesService } from '../../Services/JobTitles.service';
import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-titles',
  templateUrl: './job-titles.component.html',
  styleUrls: ['./job-titles.component.scss']
})
export class JobTitlesComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'ADD_JOB_TITLES' }
  ];
  
  jobTitles: MatTableDataSource<JobTitles> = new MatTableDataSource<JobTitles>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  
  columnDefinitions = this.createColumnDefinitions();
  jobTitlesFields: FieldsAdminModel[] = this.createJobTitlesFields();
  
  jobTitlesForm: FormGroup;
  isEditing: boolean = false;
  selectedId: string | null = null;
  isLoading: boolean = false;

  constructor(
    private jobTitlesService: JobTitlesService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.jobTitlesForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchJobTitles();
  }

  fetchJobTitles(): void {
    this.toggleLoading(true);
    this.jobTitlesService.getAllJobTitlesRequests().subscribe(
      data => this.handleFetchJobTitlesSuccess(data),
      error => this.handleError('FETCH_JOB_TITLES_ERROR', error)
    );
  }

  addJobTitle(): void {
    if (this.jobTitlesForm.invalid) return;

    this.toggleLoading(true);
    const newJobTitles: JobTitles = this.jobTitlesForm.value;
    this.jobTitlesService.addJobTitlesRequest(newJobTitles).subscribe(
      () => this.handleAddJobTitlesSuccess(),
      error => this.handleError('ADD_JOB_TITLES_ERROR', error)
    );
  }

  editJobTitle(jobTitles: JobTitles): void {
    this.jobTitlesForm.patchValue(jobTitles);
    this.isEditing = true;
    this.selectedId = jobTitles.id;
  }

  updateJobTitle(): void {
    if (this.jobTitlesForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.jobTitlesService.updateJobTitlesRequest(this.selectedId, this.jobTitlesForm.value).subscribe(
      () => this.handleUpdateJobTitlesSuccess(),
      error => this.handleError('UPDATE_JOB_TITLES_ERROR', error)
    );
  }

  deleteJobTitle(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.jobTitlesService.deleteJobTitlesRequest(id).subscribe(
          () => this.handleDeleteJobTitlesSuccess(),
          error => this.handleError('DELETE_JOB_TITLES_ERROR', error)
        );
      }
    });
  }

  resetForm(): void {
    this.jobTitlesForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }

  private handleError(translationKey: string, error: any): void {
    console.error(error);
    this.translate.get(translationKey).subscribe(message => this.toastr.error(message, 'Error'));
    this.toggleLoading(false);
  }

  private showToast(translationKey: string): void {
    this.translate.get(translationKey).subscribe(message => this.toastr.success(message, 'Success'));
  }

  private handleFetchJobTitlesSuccess(data: JobTitles[]): void {
    this.jobTitles.data = data;
    this.toggleLoading(false);
  }

  private handleAddJobTitlesSuccess(): void {
    this.fetchJobTitles();
    this.resetForm();
    this.showToast('ADD_JOB_TITLES_SUCCESS');
  }

  private handleUpdateJobTitlesSuccess(): void {
    this.fetchJobTitles();
    this.resetForm();
    this.showToast('UPDATE_JOB_TITLES_SUCCESS');
  }

  private handleDeleteJobTitlesSuccess(): void {
    this.fetchJobTitles();
    this.resetForm();
    this.showToast('DELETE_JOB_TITLES_SUCCESS');
  }

  private createColumnDefinitions() {
    return [
      { key: 'arabic', header: 'ARABIC_NAME', cell: (element: JobTitles) => `${element.arabic}` },
      { key: 'english', header: 'ENGLISH_NAME', cell: (element: JobTitles) => `${element.english}` },
      { key: 'actions', header: 'ACTIONS' }
    ];
  }

  private createJobTitlesFields() {
    return [
      { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' as 'arabic' },
      { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' as 'english' }
    ];
  }
  
}
