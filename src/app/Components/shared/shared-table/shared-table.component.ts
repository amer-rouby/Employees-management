import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent<T> {
  @Input() dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  @Input() displayedColumns: string[] = [];
  @Input() columnDefinitions: any[] = [];
  @Input() showViowAction: any;
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<string>(); // افتراض أن المعرف هو من النوع string
  @Output() onView = new EventEmitter<T>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  heCanTakeAction: any;
  
  constructor(private authService: AuthService) {}

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit() {
    this.heCanTakeAction = this.authService.canRegisterUser();
  }
  
  openDialog(element?: T): void {
    this.onEdit.emit(element);
  }

  deleteItem(id: string): void {
    this.onDelete.emit(id);
  }

  viewItemDetails(item: T): void {
    this.onView.emit(item);
  }
}
