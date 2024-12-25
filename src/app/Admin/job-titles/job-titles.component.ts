import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobTitles } from '../../Models/JobTitles.model';
import { JobTitlesService } from '../../Services/JobTitles.service';

@Component({
  selector: 'app-job-titles',
  templateUrl: './job-titles.component.html',
  styleUrls: ['./job-titles.component.scss']
})
export class JobTitlesComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION'},
    { label: 'ADD_JOB_TITLES' }
  ];
  jobTitles: MatTableDataSource<JobTitles> = new MatTableDataSource<JobTitles>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: JobTitles) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: JobTitles) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];
  
  jobTitlesFields = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true },
  ];
  
  jobTitlesForm: FormGroup;
  isEditing: boolean = false;
  selectedId: string | null = null;
  
  constructor(
    private jobTitlesService: JobTitlesService, 
    private dialogService: DialogService,
    private fb: FormBuilder
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
    this.jobTitlesService.getAllJobTitlesRequests().subscribe(data => {
      this.jobTitles.data = data;
    });
  }

  addJobTitles(): void {
    if (this.jobTitlesForm.invalid) return;

    const newJobTitles: JobTitles = this.jobTitlesForm.value;
    this.jobTitlesService.addJobTitlesRequest(newJobTitles).subscribe(() => {
      this.fetchJobTitles();
      this.resetForm();
    });
  }

  editJobTitles(JobTitles: JobTitles): void {
    this.jobTitlesForm.patchValue(JobTitles);
    this.isEditing = true;
    this.selectedId = JobTitles.id;
  }

  updateJobTitles(): void {
    if (this.jobTitlesForm.invalid || !this.selectedId) return;

    this.jobTitlesService.updateJobTitlesRequest(this.selectedId, this.jobTitlesForm.value).subscribe(() => {
      this.fetchJobTitles();
      this.resetForm();
    });
  }

  deleteJobTitles(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe((result) => {
      if (result) {
        this.jobTitlesService.deleteJobTitlesRequest(id).subscribe(() => {
          this.fetchJobTitles();
          this.resetForm();
        });
      }
    });
  }

  resetForm(): void {
    this.jobTitlesForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

}
