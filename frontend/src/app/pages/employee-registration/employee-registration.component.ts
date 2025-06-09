import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments() {
    this.http
      .get('http://localhost:3000/api/departments')
      .subscribe((res: any) => {
        console.log('Departments:', res);
        this.departments = res.data;
      });
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
        alert(res.message);

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

  onDelete(item: any) {
    const confirmed = confirm(
      `Are you sure you want to delete ${item.firstName} ${item.lastName}?`
    );
    if (confirmed) {
      this.http
        .delete(`http://localhost:3000/api/employees/${item.email}`)
        .subscribe({
          next: (res: any) => {
            alert(res.message);
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
