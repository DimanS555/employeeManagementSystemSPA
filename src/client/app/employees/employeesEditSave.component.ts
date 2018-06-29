import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable'
import { ActivatedRoute, Router } from '@angular/router';

import { Employee, Department } from '../models/interfaces';
import { DataService } from '../shared/services/data.service';
import { NotificationService } from '../shared/utils/notification.service';

@Component({
    selector: 'app-form',
    moduleId: module.id,
    templateUrl: 'employeesEditSave.component.html',
    styleUrls: ['employeesEditSave.component.css']
})
export class EmployeeEditSaveComponent {
    employee: Employee = {} as Employee;
    departments$: Observable<Department[]>
    editing: boolean = false;

    constructor(
        private dataService: DataService,
        private notificationService: NotificationService,
        private activeRoute: ActivatedRoute,
        private router: Router
    ) {
        this.departments$ = this.dataService.getDepartmentsData();
        this.editing = activeRoute.snapshot.params['mode'] === 'edit';
        let id: number = + activeRoute.snapshot.params['id'];
        if (id) {
            this.dataService.getEmployee(id).subscribe(e => {
                Object.assign(this.employee, e || {} as Employee);
            },
                error => {
                    this.notificationService.printErrorMessage(
                        'Failed to load employees: ' + error
                    );
                });
        }
    }

    submitForm(form: NgForm) {
        if (form.valid) {
            this.saveEmployee(this.employee);
            this.router.navigateByUrl('/employees');
        }
    }

    resetForm() {
        this.employee = {} as Employee;
    }

    private saveEmployee(employee) {
        if (employee.id === 0 || employee.id === undefined) {
            this.dataService.createEmployee(employee).subscribe(employeeCreated => {
                this.notificationService.printSuccessMessage(employeeCreated.firstName + " " + employeeCreated.lastName + " has created");
            },
                error => this.notificationService.printErrorMessage("Failed to create employee: " + error));
        } else {
            this.dataService.updateEmployee(employee).subscribe(() => {
                this.notificationService.printSuccessMessage(employee.firstName + " " + employee.lastName + " has updated");
            },
                error => this.notificationService.printErrorMessage("Failed to update employee: " + error));
        }
    }
} 