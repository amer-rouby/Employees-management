import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  constructor() {}

  openDialog(element?: T): void {
    this.onEdit.emit(element);
  }

  deleteEmployee(id: number): void {
    this.onDelete.emit(id);
  }
}
