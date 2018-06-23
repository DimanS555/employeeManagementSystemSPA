import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { Employee, Pagination, PaginatedResult } from '../../app/models/interfaces';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/services/data.service';
import { NotificationService } from '../shared/utils/notification.service';

@Component({
    selector: 'app-list',
    moduleId: module.id,
    templateUrl: 'employeesList.component.html',
    styleUrls: ['employeesList.component.css']
})
export class EmployeesListComponent implements OnInit {
    employees: Employee[];
    scopes: any;
    hasScopes: boolean;
    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.dataService.getData().subscribe(data => {
            this.employees = data;
        });
        this.scopes = this.route.snapshot.data.scopes;
        this.hasScopes = this.auth.hasReguiredScopes(this.scopes);
    }

    removeEmployee(employee: Employee) {
        this.notificationService.openConfirmationDialog(
            'Are you sure, you want to delete this Employee?', () => {
                this.dataService.deleteEmployee(employee.id).subscribe(() => {
                    let index = this.employees.findIndex(element => element.id === employee.id);
                    if (index > -1) {
                        this.employees.splice(index, 1);
                    }
                    this.notificationService.printSuccessMessage(employee.firstName + " " + employee.lastName + " has deleted");
                },
                    error => {
                        this.notificationService.printErrorMessage('Failed to delete employee ' + employee.firstName + " " + employee.lastName + ":" + error);
                    }
                );
            }
        );
    }
}