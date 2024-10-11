import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from '../../Services/leave.service';
import { Leave } from '../../Models/leave.model';
import { LeaveDialogComponent } from './leave-add-dialog/leave-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.scss'],
})
export class LeaveManagementComponent {
  dataSource = new MatTableDataSource<Leave>([]);
  leaveRequests: Leave[] = [];
  displayedColumns: string[] = ["employee",'types', 'startDate', 'endDate', 'status', 'actions'];

  columnDefinitions = [
    { key: 'types', header: 'TYPE', cell: (element: Leave) => element.types },
    { key: 'employee', header: 'EMPLOYEE', cell: (element: Leave) => element.employee },
    { key: 'startDate', header: 'START_DATE', cell: (element: Leave) => element.startDate },
    { key: 'endDate', header: 'END_DATE', cell: (element: Leave) => element.endDate },
    { key: 'status', header: 'STATUS', cell: (element: Leave) => this.translateStatus(element.status) },
    { key: 'actions', header: 'ACTIONS', cell: () => '' }
  ];
  
  translateStatus(status: string): string {
    let translatedStatus = '';
    switch (status) {
      case 'Approved':
        this.translate.get('APPROVED').subscribe((res: string) => translatedStatus = res);
        break;
      case 'Pending':
        this.translate.get('PENDING').subscribe((res: string) => translatedStatus = res);
        break;
      case 'Rejected':
        this.translate.get('REJECTED').subscribe((res: string) => translatedStatus = res);
        break;
      default:
        translatedStatus = status;
    }
    return translatedStatus;
  }

  constructor(
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.leaveService.getAllLeaveRequests().subscribe((data) => {
      this.leaveRequests = data;
      this.dataSource.data = data;
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
