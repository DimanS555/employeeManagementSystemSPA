import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../auth/authGuard.service';

import { EmployeesListComponent } from './employeesList.component';
import { EmployeeEditSaveComponent } from './employeesEditSave.component';

const appRoutes: Routes = [
    {
        path: 'employees',
        component: EmployeesListComponent,
        canActivate:[AuthGuard]
    },
    {
        path: '"form/:mode/:id"',
        component: EmployeeEditSaveComponent,
        canActivate:[AuthGuard]
    },
    {
        path: "form/:mode",
        component: EmployeeEditSaveComponent,
        canActivate:[AuthGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class EmployeesRoutingModule { }