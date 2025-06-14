import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.css'],
})
export class EmployeeRegistrationComponent implements OnInit {
  departments: any[] = [];
  employeeList: any[] = [];
  isListView: boolean = true;
  isEditing: boolean = false;
  employeeObject: any = {
    firstName: '',
    lastName: '',
    departmentId: '',
    gender: '',
    email: '',
    phoneNo: '',
  };
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments() {
    this.http.get('http://localhost:3000/api/departments').subscribe(
      (res: any) => {
        //console.log('Departments:', res);
        this.departments = res.data;
      },
      (error) => {
        console.error('Failed to load departments:', error);
      }
    );
  }

  loadEmployees() {
    this.http
      .get('http://localhost:3000/api/employees')
      .subscribe((res: any) => {
        this.employeeList = res.data.map((emp: any) => {
          const dept = this.departments.find(
            (d) => d.deptId === emp.departmentId
          );
          return {
            ...emp,
            departmentName: dept ? dept.deptName : 'Unknown',
          };
        });
      });
  }

  getDepartmentName(deptId: any): string {
    const dept = this.departments.find((d) => d.deptId === deptId);
    return dept ? dept.deptName : 'Unknown';
  }

  onCreateEmp() {
    debugger;
    this.http
      .post('http://localhost:3000/api/employees', this.employeeObject)
      .subscribe((res: any) => {
        this.toastr.success(res.message);

        this.loadEmployees();

        this.isListView = true;
        this.isEditing = false;

        this.employeeObject = {
          firstName: '',
          lastName: '',
          departmentId: '',
          gender: '',
          email: '',
          phoneNo: '',
        };
      });
  }

  onEdit(item: any) {
    debugger;
    this.employeeObject = { ...item };
    this.isListView = false;
    this.isEditing = true;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.onCreateEmp();
  }

  hasError(control: NgModel, errorName: string): boolean {
    return control.invalid && control.errors?.[errorName];
  }

  onDelete(item: any) {
    const confirmed = confirm(
      `Are you sure you want to delete ${item.firstName} ${item.lastName}?`
    );
    if (confirmed) {
      this.http
        .delete(`http://localhost:3000/api/employees/${item.empId}`)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.message);
            this.loadEmployees(); // Refresh list after deletion
          },
          error: (err) => {
            alert('Failed to delete employee.');
            console.error(err);
          },
        });
    }
  }
}
