import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
})
export class DepartmentManagementComponent implements OnInit {
  departments: any[] = [];
  departmentObject = {
    deptId: '',
    deptName: '',
  };

  isListView = true;
  constructor(private http: HttpClient) {}

  isEditMode(): boolean {
    return this.departments.some(
      (d) => d.deptId === this.departmentObject.deptId
    );
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.http
      .get('http://localhost:3000/api/departments')
      .subscribe((res: any) => {
        this.departments = res.data;
      });
  }

  onSaveDept() {
    if (this.departmentObject.deptId && this.isEditMode()) {
      this.http
        .put(
          `http://localhost:3000/api/departments/${this.departmentObject.deptId}`,
          this.departmentObject
        )
        .subscribe(
          (res: any) => {
            alert(res.message);
            this.loadDepartments();
            this.isListView = true;
            this.departmentObject = { deptId: '', deptName: '' };
          },
          (error) => {
            alert(error?.error?.message || 'Failed to upadate department.');
            console.error(error);
          }
        );
    } else {
      this.http
        .post('http://localhost:3000/api/departments', this.departmentObject)
        .subscribe(
          (res: any) => {
            alert(res.message);
            this.loadDepartments();
            this.isListView = true;
            this.departmentObject = {
              deptId: '',
              deptName: '',
            };
          },
          (error) => {
            alert(error?.error?.message || 'Failed to create department.');
            console.error(error);
          }
        );
    }
  }

  onEditDept(dept: any) {
    this.departmentObject = { ...dept };
    this.isListView = false;
  }

  onDeleteDept(dept: any) {
    const confirmed = confirm(
      `Are you sure you want to delete ${dept.deptName}?`
    );
    if (confirmed) {
      this.http
        .delete(`http://localhost:3000/api/departments/${dept.deptId}`)
        .subscribe((res: any) => {
          alert(res.message);
          this.loadDepartments();
        });
    }
  }
}
