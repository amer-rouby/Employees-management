import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from '../../Services/leave.service';
import { Leave } from '../../Models/leave.model';
import { LeaveDialogComponent } from './leave-add-dialog/leave-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { leaveStatus, leaveTypes } from './../../constants/data.constants';
import { Employee } from '../../Models/employee.model';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss'],
})
export class LeaveManagementComponent {
  dataSource = new MatTableDataSource<Leave>([]);
  displayedColumns: string[] = ['name', 'types', 'startDate', 'endDate', 'status', 'actions'];
  leaveRequests: Leave[] = [];
  isLoading = false;

  leaveStatus = leaveStatus;
  leaveTypes = leaveTypes;

  columnDefinitions: any[] = [];
  showViewAction = false;

  constructor(
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.setupColumnDefinitions();
    this.loadLeaveRequests();
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

  openAddLeaveDialog(): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '600px',
      data: { action: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showSuccess('leaveUpdated');
        this.loadLeaveRequests();
      }
    });
  }

  openDialog(leave: Leave): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '600px',
      data: { action: 'edit', leave },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showSuccess('leaveUpdated');
        this.loadLeaveRequests();
      }
    });
  }

  confirmDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
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
      .get([
        'TYPE',
        'EMPLOYEES_ARABIC_NAME',
        'EMPLOYEES_ENGLISH_NAME',
        'START_DATE',
        'END_DATE',
        'STATUS',
        'ACTIONS',
      ])
      .subscribe((translations) => {
        this.columnDefinitions = [
          {
            key: 'types',
            header: 'TYPE',
            cell: (leave: Leave) => this.getTranslationForKey('leaveTypes', leave.types),
          },
          {
            key: 'name',
            header: 'NAME',
            cell: (employee: Employee) => this.translate.currentLang === 'ar' ? employee.name : employee.englishName,
          },
          {
            key: 'startDate', 
            header: 'START_DATE',
            cell: (leave: Leave) => leave.startDate },
          { key: 'endDate', 
            header: 'END_DATE', 
            cell: (leave: Leave) => leave.endDate },
          { 
            key: 'status', 
            header: 'STATUS', 
            cell: (leave: Leave) => this.getTranslationForKey('leaveStatus', leave.status) },
          { 
            key: 'actions', 
            header: 'ACTIONS', cell: () => '' },
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
