import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from '../../Services/leave.service';
import { Leave } from '../../Models/leave.model';
import { LeaveDialogComponent } from './leave-add-dialog/leave-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { leaveStatus, leaveTypes } from './../../constants/data.constants';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss'],
})
export class LeaveManagementComponent {
  dataSource = new MatTableDataSource<Leave>([]);
  leaveRequests: Leave[] = [];
  displayedColumns: string[] = ['employee', 'types', 'startDate', 'endDate', 'status', 'actions'];
  isLoading = true;

  leaveStatus = leaveStatus;
  leaveTypes = leaveTypes;

  columnDefinitions: any[] = [];
  showViowAction = false;

  constructor(
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.setupColumnDefinitions();
    this.loadLeaveRequests();
  }

  private setupColumnDefinitions(): void {
    this.translate.get(['TYPE', 'EMPLOYEE', 'START_DATE', 'END_DATE', 'STATUS', 'ACTIONS']).subscribe(translations => {
      this.columnDefinitions = [
        { key: 'types', header: translations['TYPE'], cell: (leave: Leave) => this.getTranslationForKey('leaveTypes', leave.types) },
        { key: 'employee', header: translations['EMPLOYEE'], cell: (leave: Leave) => leave.employee },
        { key: 'startDate', header: translations['START_DATE'], cell: (leave: Leave) => leave.startDate },
        { key: 'endDate', header: translations['END_DATE'], cell: (leave: Leave) => leave.endDate },
        { key: 'status', header: translations['STATUS'], cell: (leave: Leave) => this.getTranslationForKey('leaveStatus', leave.status) },
        { key: 'actions', header: translations['ACTIONS'], cell: () => '' }
      ];
    });
  }

  private getTranslationForKey(key: 'leaveStatus' | 'leaveTypes', id: any): string {
    const data = this[key] as { id: any, arabic: string, english: string }[];
    const item = data.find(i => i.id === id);
    return item ? (this.translate.currentLang === 'ar' ? item.arabic : item.english) : 'Pending';
  }

  loadLeaveRequests(): void {
    this.isLoading = true;

    this.leaveService.getAllLeaveRequests().subscribe((data) => {
      this.leaveRequests = data;
      this.dataSource.data = data;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  openAddLeaveDialog(): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '600px',
      data: { action: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaveRequests();
      }
    });
  }

  openEditLeaveDialog(leave: Leave): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '600px',
      data: { action: 'edit', leave }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaveRequests();
      }
    });
  }

  deleteLeaveRequest(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leaveService.deleteLeaveRequest(id).subscribe(() => {
          this.loadLeaveRequests();
        });
      }
    });
  }
}
