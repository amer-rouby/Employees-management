import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Leave } from '../Models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private basePath = 'leave-management'; // المسار الأساسي في Firebase Realtime Database

  constructor(private db: AngularFireDatabase) { }

  getAllLeaveRequests(): Observable<Leave[]> {
    return this.db.list<Leave>(this.basePath).snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const data = c.payload.val() as Leave;
        const id = c.payload.key as string;
        return { ...data, id }; // إضافة الـ id لكل كائن
      })),
      catchError(error => {
        console.error('Error fetching leave requests', error);
        return of([]); // إرجاع قائمة فارغة عند حدوث خطأ
      })
    );
  }

  // إضافة طلب إجازة
  addLeaveRequest(data: Leave): Observable<Leave> {
    return from(this.db.list<Leave>(this.basePath).push(data).then(docRef => {
      return { ...data, id: docRef.key ?? 'default-id' }; // إضافة الـ id للكائن
    })).pipe(
      catchError(error => {
        console.error('Error adding leave request', error);
        return of({ ...data, id: 'default-id' }); // إرجاع كائن افتراضي عند حدوث خطأ
      })
    );
  }

  // تحديث طلب إجازة
  updateLeaveRequest(id: string, data: Leave): Observable<void> {
    return from(this.db.object<Leave>(`${this.basePath}/${id}`).update(data)).pipe(
      catchError(error => {
        console.error('Error updating leave request', error);
        return of(); // إرجاع Observable فارغ عند حدوث خطأ
      })
    );
  }

  // حذف طلب إجازة
  deleteLeaveRequest(id: string): Observable<void> {
    return from(this.db.object(`${this.basePath}/${id}`).remove()).pipe(
      catchError(error => {
        console.error('Error deleting leave request', error);
        return of(); // إرجاع Observable فارغ عند حدوث خطأ
      })
    );
  }
}
