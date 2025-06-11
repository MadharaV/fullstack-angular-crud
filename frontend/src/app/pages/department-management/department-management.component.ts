import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
})
export class DepartmentManagementComponent implements OnInit {
  departments: any[] = [];
  departmentObject: any = {
    //deptId: '',
    deptName: '',
  };

  isListView = true;
  constructor(private http: HttpClient) {}

  isEditMode(): boolean {
    return !!this.departmentObject.deptId;
    //(d) => d.deptId === this.departmentObject.deptId
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.http.get('http://localhost:3000/api/departments').subscribe(
      (res: any) => {
        this.departments = res.data;
      },
      (error) => {
        alert('Failed to load departments');
        console.error(error);
      }
    );
  }

  onSaveDept(): void {
    if (this.isEditMode()) {
      // Update
      this.http
        .put(
          `http://localhost:3000/api/departments/${this.departmentObject.deptId}`,
          this.departmentObject
        )
        .subscribe(
          (res: any) => {
            alert(res.message);
            this.resetForm();
          },
          (error) => {
            alert(error?.error?.message || 'Failed to update department.');
            console.error(error);
          }
        );
    } else {
      // Remove deptId before sending
      const { deptName } = this.departmentObject;
      const newDept = { deptName };

      this.http
        .post('http://localhost:3000/api/departments', newDept)
        .subscribe(
          (res: any) => {
            alert(res.message);
            this.resetForm();
          },
          (error) => {
            alert(error?.error?.message || 'Failed to create department.');
            console.error(error);
          }
        );
    }
  }

  onEditDept(dept: any): void {
    this.departmentObject = {
      deptId: dept.deptId,
      deptName: dept.deptName,
    };
    this.isListView = false;
  }

  onDeleteDept(dept: any): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${dept.deptName}?`
    );
    if (confirmed) {
      this.http
        .delete(`http://localhost:3000/api/departments/${dept.deptId}`)
        .subscribe(
          (res: any) => {
            alert(res.message);
            this.loadDepartments();
          },
          (error) => {
            alert('Failed to delete department.');
            console.error(error);
          }
        );
    }
  }

  resetForm(): void {
    this.loadDepartments();
    this.departmentObject = {
      deptName: '',
    };
    this.isListView = true;
  }
}
