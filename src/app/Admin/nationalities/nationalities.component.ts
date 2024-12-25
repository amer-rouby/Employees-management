import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Nationalities } from '../../Models/nationalities.model';
import { NationalitiesService } from '../../Services/nationalities.service';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nationalities',
  templateUrl: './nationalities.component.html',
  styleUrls: ['./nationalities.component.scss']
})
export class NationalitiesComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION'},
    { label: 'MANAGEMENT_NATIONALITIES' }
  ];
  nationalities: MatTableDataSource<Nationalities> = new MatTableDataSource<Nationalities>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: Nationalities) => `${element.arabic}` },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: Nationalities) => `${element.english}` },
    { key: 'actions', header: 'ACTIONS' }
  ];
  
  nationalityFields = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true },
  ];
  
  nationalityForm: FormGroup;
  isEditing: boolean = false;
  selectedId: string | null = null;
  
  constructor(
    private nationalitiesService: NationalitiesService, 
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.nationalityForm = this.fb.group({
      arabic: ['', Validators.required],
      english: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchNationalities();
  }

  fetchNationalities(): void {
    this.nationalitiesService.getAllNationalitiesRequests().subscribe(data => {
      this.nationalities.data = data;
    });
  }

  addNationality(): void {
    if (this.nationalityForm.invalid) return;

    const newNationality: Nationalities = this.nationalityForm.value;
    this.nationalitiesService.addnatioNalitiesRequest(newNationality).subscribe(() => {
      this.fetchNationalities();
      this.resetForm();
    });
  }

  editNationality(nationality: Nationalities): void {
    this.nationalityForm.patchValue(nationality);
    this.isEditing = true;
    this.selectedId = nationality.id;
  }

  updateNationality(): void {
    if (this.nationalityForm.invalid || !this.selectedId) return;

    this.nationalitiesService.updateNationalitiesRequest(this.selectedId, this.nationalityForm.value).subscribe(() => {
      this.fetchNationalities();
      this.resetForm();
    });
  }

  deleteNationality(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe((result) => {
      if (result) {
        this.nationalitiesService.deleteNationalitiesRequest(id).subscribe(() => {
          this.fetchNationalities();
          this.resetForm();
        });
      }
    });
  }

  resetForm(): void {
    this.nationalityForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

}
