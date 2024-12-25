import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departments } from '../../Models/departments.model';
import { DepartmentsService } from '../../Services/departments.service';
import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';


@Component({
  selector: 'app-job-titles',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION'},
    { label: 'MANAGEMENT_DEPARTMENTS' }
  ];
  departments: MatTableDataSource<Departments> = new MatTableDataSource<Departments>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: Departments) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: Departments) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];
  
  DepartmentsFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic'},
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];
  
  DepartmentsForm: FormGroup;
  isEditing: boolean = false;
  selectedId: string | null = null;
  
  constructor(
    private departmentsService: DepartmentsService, 
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.DepartmentsForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments(): void {
    this.departmentsService.getAllDepartmentsRequests().subscribe(data => {
      this.departments.data = data;
    });
  }

  addDepartments(): void {
    if (this.DepartmentsForm.invalid) return;

    const newDepartments: Departments = this.DepartmentsForm.value;
    this.departmentsService.addDepartmentsRequest(newDepartments).subscribe(() => {
      this.fetchDepartments();
      this.resetForm();
    });
  }

  editDepartments(Departments: Departments): void {
    this.DepartmentsForm.patchValue(Departments);
    this.isEditing = true;
    this.selectedId = Departments.id;
  }

  updateDepartments(): void {
    if (this.DepartmentsForm.invalid || !this.selectedId) return;

    this.departmentsService.updateDepartmentsRequest(this.selectedId, this.DepartmentsForm.value).subscribe(() => {
      this.fetchDepartments();
      this.resetForm();
    });
  }

  deleteDepartments(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe((result) => {
      if (result) {
        this.departmentsService.deleteDepartmentsRequest(id).subscribe(() => {
          this.fetchDepartments();
          this.resetForm();
        });
      }
    });
  }

  resetForm(): void {
    this.DepartmentsForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

}

