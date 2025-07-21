import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { DialogService } from '../../Services/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nationalities } from '../../Models/nationalities.model';
import { NationalitiesService } from '../../Services/nationalities.service';
import { FieldsAdminModel } from '../../Models/FieldsAdmin.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nationalities',
  templateUrl: './nationalities.component.html',
  styleUrls: ['./nationalities.component.scss']
})
export class NationalitiesComponent implements OnInit {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'SYSTEM_ADMINISTRATION' },
    { label: 'MANAGEMENT_NATIONALITIES' }
  ];

  nationalities: MatTableDataSource<Nationalities> = new MatTableDataSource<Nationalities>();
  displayedColumns: string[] = ['arabic', 'english', 'actions'];
  columnDefinitions = [
    { key: 'arabic', header: 'ARABIC_NAME', cell: (element: Nationalities) => element.arabic },
    { key: 'english', header: 'ENGLISH_NAME', cell: (element: Nationalities) => element.english },
    { key: 'actions', header: 'ACTIONS' }
  ];

  nationalityFields: FieldsAdminModel[] = [
    { label: 'ARABIC_NAME', controlName: 'arabic', type: 'text', required: true, languageType: 'arabic' },
    { label: 'ENGLISH_NAME', controlName: 'english', type: 'text', required: true, languageType: 'english' },
  ];

  nationalityForm: FormGroup;
  isEditing: boolean = false;
  selectedId: string | null = null;
  isLoading: boolean = false;

  constructor(
    private nationalitiesService: NationalitiesService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
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
    this.toggleLoading(true);
    this.nationalitiesService.getAllNationalitiesRequests().subscribe(
      data => {
        this.nationalities.data = data;
        this.toggleLoading(false);
      },
      error => this.handleError('FAILED_TO_LOAD_NATIONALITIES', error)
    );
  }

  addNationality(): void {
    if (this.nationalityForm.invalid) return;

    this.toggleLoading(true);
    const newNationality: Nationalities = this.nationalityForm.value;
    this.nationalitiesService.addnatioNalitiesRequest(newNationality).subscribe(
      () => {
        this.fetchNationalities();
        this.resetForm();
        this.showToast('NATIONALITY_ADDED_SUCCESS');
      },
      error => this.handleError('FAILED_TO_ADD_NATIONALITY', error)
    );
  }

  editNationality(nationality: Nationalities): void {
    this.nationalityForm.patchValue(nationality);
    this.isEditing = true;
    this.selectedId = nationality.id;
  }

  updateNationality(): void {
    if (this.nationalityForm.invalid || !this.selectedId) return;

    this.toggleLoading(true);
    this.nationalitiesService.updateNationalitiesRequest(this.selectedId, this.nationalityForm.value).subscribe(
      () => {
        this.fetchNationalities();
        this.resetForm();
        this.showToast('NATIONALITY_UPDATED_SUCCESS');
      },
      error => this.handleError('FAILED_TO_UPDATE_NATIONALITY', error)
    );
  }

  deleteNationality(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe(result => {
      if (result) {
        this.toggleLoading(true);
        this.nationalitiesService.deleteNationalitiesRequest(id).subscribe(
          () => {
            this.fetchNationalities();
            this.resetForm();
            this.showToast('NATIONALITY_DELETED_SUCCESS');
          },
          error => this.handleError('FAILED_TO_DELETE_NATIONALITY', error)
        );
      }
    });
  }

  resetForm(): void {
    this.nationalityForm.reset();
    this.isEditing = false;
    this.selectedId = null;
  }

  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }

  private handleError(message: string, error: any): void {
    console.error(error);
    this.toastr.error(message, 'Error');
    this.toggleLoading(false);
  }

  private showToast(key: string): void {
    this.translate.get(key).subscribe(message => {
      this.toastr.success(message);
    });
    this.toggleLoading(false);
  }
}
