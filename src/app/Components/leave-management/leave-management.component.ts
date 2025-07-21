import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from '../../Services/leave.service';
import { Leave } from '../../Models/leave.model';
import { LeaveDialogComponent } from './leave-add-dialog/leave-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../Models/employee.model';
import { DialogService } from '../../Services/dialog.service';
import { TypesOfVacationsService } from '../../Services/Types-of-vacations.service';
import { leavelStatusService } from '../../Services/leave-status.service';
import { DropdownItem } from '../../Models/dropdown.model';
import { DataService } from '../../Services/Data.service';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss'],
})
export class LeaveManagementComponent {
  breadcrumbs = [
    { label: 'HOME', link: '/' },
    { label: 'MANAGEMENT' },
    { label: 'LEAVE_MANAGEMENT' }
  ];
  dataSource = new MatTableDataSource<Leave>([]);
  displayedColumns: string[] = ['name', 'types', 'startDate', 'endDate', 'status', 'actions'];
  leaveRequests: Leave[] = [];
  isLoading = false;
  leaveStatus: DropdownItem[] = [];
  leaveTypes: DropdownItem[] = [];
  columnDefinitions: any[] = [];
  showViewAction = false;

  constructor(
    private leaveService: LeaveService,
    private typesOfVacationsService: TypesOfVacationsService,
    private leavelStatusService: leavelStatusService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private dataService: DataService,
    private toastr: ToastrService
  ) {
    this.setupColumnDefinitions();
    this.loadLeaveRequests();
    this.fetchData();
  }

  loadLeaveRequests(): void {
    this.toggleLoading(true);
    this.leaveService.getAllLeaveRequests().subscribe({
      next: (data) => {
        this.leaveRequests = data;
        this.dataSource.data = data;
        this.toggleLoading(false);
      },
      error: () => {
        this.toggleLoading(false);
      },
    });
  }

  private fetchData(): void {
    this.dataService.getLeavelStatus().subscribe(data => this.leaveStatus = data);
    this.dataService.getTypesOfVacations().subscribe(data => this.leaveTypes = data);
  }
  
  openAddLeaveDialog(): void {
    this.dialogService.openDialog(LeaveDialogComponent, { action: 'add' }).subscribe((result) => {
      if (result) {
        this.showSuccess('leaveUpdated');
        this.loadLeaveRequests();
      }
    });
  }

  openEditDialog(leave: Leave): void {
    this.dialogService.openDialog(LeaveDialogComponent, { action: 'edit', leave }).subscribe((result) => {
      if (result) {
        this.showSuccess('leaveUpdated');
        this.loadLeaveRequests();
      }
    });
  }

  confirmDelete(id: string): void {
    this.dialogService.openDialog(ConfirmDeleteDialogComponent, {}, '400px').subscribe((result) => {
      if (result) {
        this.leaveService.deleteLeaveRequest(id).subscribe({
          next: () => {
            this.showSuccess('leaveDeleted');
            this.loadLeaveRequests();
          },
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  private showSuccess(key: string): void {
    this.translate.get(key).subscribe((message) => {
      this.toastr.success(message, 'Success');
    });
  }

  private setupColumnDefinitions(): void {
    this.translate
      .get(['TYPE', 'EMPLOYEES_ARABIC_NAME', 'EMPLOYEES_ENGLISH_NAME', 'START_DATE', 'END_DATE', 'STATUS', 'ACTIONS'])
      .subscribe(() => {
        this.columnDefinitions = [
          { key: 'types', header: 'TYPE', cell: (leave: Leave) => this.getTranslationForKey('leaveTypes', leave.types), },
          { key: 'name', header: 'NAME', cell: (employee: Employee) => this.translate.currentLang === 'ar' ? employee.name : employee.englishName, },
          { key: 'startDate', header: 'START_DATE', cell: (leave: Leave) => leave.startDate },
          { key: 'endDate', header: 'END_DATE', cell: (leave: Leave) => leave.endDate },
          { key: 'status', header: 'STATUS', cell: (leave: Leave) => this.getTranslationForKey('leaveStatus', leave.status), },
          { key: 'actions', header: 'ACTIONS', cell: () => '' },
        ];
      });
  }

  private getTranslationForKey(key: 'leaveStatus' | 'leaveTypes', id: any): string {
    const data = this[key] as { id: any; arabic: string; english: string }[];
    const item = data.find((i) => i.id === id);
    return item
      ? this.translate.currentLang === 'ar'
        ? item.arabic
        : item.english
      : '';
  }
  private toggleLoading(state: boolean): void {
    this.isLoading = state;
  }
}
