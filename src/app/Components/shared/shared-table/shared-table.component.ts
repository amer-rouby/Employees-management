import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent<T> {
  @Input() dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  @Input() displayedColumns: string[] = [];
  @Input() columnDefinitions: any[] = [];
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onView = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor() {}
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  openDialog(element?: T): void {
    this.onEdit.emit(element);
  }

  deleteEmployee(id: number): void {
    this.onDelete.emit(id);
  }

  viewEmployeeDetails(employee: any): void {
    this.onView.emit(employee);  // Correcting the emitted event to onView
  }
}
