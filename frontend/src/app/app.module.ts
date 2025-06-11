import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { DepartmentsComponent } from './pages/departments/departments.component';
import { EmployeeRegistrationComponent } from './pages/employee-registration/employee-registration.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DepartmentManagementComponent } from './pages/department-management/department-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//import { DepartmentManagementComponent } from './department-management/department-management.component';

@NgModule({
  declarations: [
    AppComponent,
    //DepartmentsComponent,
    EmployeeRegistrationComponent,
    DepartmentManagementComponent,
    //DepartmentManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
