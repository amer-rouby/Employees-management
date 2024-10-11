import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeaveService } from '../../../Services/leave.service';
import { Leave } from '../../../Models/leave.model';
import { DatePipe } from '@angular/common';
import { leaveStatus } from '../../../constants/data.constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-leave-dialog',
  templateUrl: './leave-dialog.component.html',
  styleUrls: ['./leave-dialog.component.scss'],
  providers: [DatePipe]
})
export class LeaveDialogComponent implements OnInit {
  leaveStatus: any[] = [];
  selectedStatus: any;
  leave: Leave = {
    type: '',
    startDate: '',
    endDate: '',
    status: '',
    id: ''
  };

  constructor(
    private leaveService: LeaveService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadStatus();

    if (this.data.action === 'edit' && this.data.leave) {
      this.leave = { ...this.data.leave };
      this.selectedStatus = this.leaveStatus.find(status => status.name === this.leave.status)?.name || '';
    }
  }

  onSubmit(): void {
    this.leave.startDate = this.datePipe.transform(this.leave.startDate, 'yyyy-MM-dd') || '';
    this.leave.endDate = this.datePipe.transform(this.leave.endDate, 'yyyy-MM-dd') || '';
    this.leave.status = this.selectedStatus;

    console.log('Submitting leave request:', this.leave);

    if (this.data.action === 'add') {
      this.leaveService.addLeaveRequest(this.leave).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else if (this.data.action === 'edit') {
      if (this.leave.id) {
        this.leaveService.updateLeaveRequest(this.leave.id, this.leave).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        console.error('Leave ID is not defined');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private loadStatus() {
    const currentLang = this.translate.currentLang || 'en';
    this.leaveStatus = leaveStatus.map(item => ({
      id: item.id,
      name: currentLang === 'ar' ? item.arabic : item.english
    }));
  }
}
