import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { FooterComponent } from './Components/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { EmployeeManagementComponent } from './Components/employee-management/employee-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeDialogComponent } from './Components/employee-management/employee-add-dialog/employee-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmDeleteDialogComponent } from './Dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { SharedTableComponent } from './Components/shared/shared-table/shared-table.component';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './Services/auth.service';
import { AuthGuard } from './Guards/auth.guard';
import { RedirectIfLoggedInGuard } from './Guards/redirect-if-logged-in.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { EmployeeDetailsDialogComponent } from './Dialogs/employee-details-dialog/employee-details-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LeaveManagementComponent } from './Components/leave-management/leave-management.component';
import { LeaveDialogComponent } from './Components/leave-management/leave-add-dialog/leave-dialog.component';
import { TranslateTextPipe } from './pipes/Transform.pipe';
import { CountDirective } from './Directives/count.directive';
import { NationalitiesComponent } from './Admin/nationalities/nationalities.component';
import { JobTitlesComponent } from './Admin/job-titles/job-titles.component';
import { ValidateLanguageDirective } from './Directives/validate-language.directive';
import { SharedFormComponent } from './Components/shared/shared-form/shared-form.component';
import { BreadcrumbsComponent } from './Components/shared/breadcrumbs/breadcrumbs.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    EmployeeManagementComponent,
    EmployeeDialogComponent,
    ConfirmDeleteDialogComponent,
    SharedTableComponent,
    RegisterComponent,
    LoginComponent,
    EmployeeDetailsDialogComponent,
    LeaveManagementComponent,
    LeaveDialogComponent,
    TranslateTextPipe,
    CountDirective,
    NationalitiesComponent,
    JobTitlesComponent,
    ValidateLanguageDirective,
    SharedFormComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatMenuModule,
    AppRoutingModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule, 
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    provideAnimationsAsync(),
   AuthService, AuthGuard, RedirectIfLoggedInGuard, TranslateTextPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
