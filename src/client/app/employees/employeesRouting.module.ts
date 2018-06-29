import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../auth/authGuard.service';
import { ScopeGuardService as ScopeGuard } from '../auth/scopeGuard.service';

import { EmployeesListComponent } from './employeesList.component';
import { EmployeeEditSaveComponent } from './employeesEditSave.component';

const appRoutes: Routes = [
    {
        path: 'employees',
        component: EmployeesListComponent,
        canActivate: [AuthGuard],
        data: {
            scopes: [
                'create:employees',
                'delete:employees',
                'edit:employees'
            ]
        }
    },
    {
        path: 'form/:mode/:id',
        component: EmployeeEditSaveComponent,
        canActivate: [ScopeGuard],
        data: {
            scopes: [
                'create:employees',
                'delete:employees',
                'edit:employees'
            ]
        }
    },
    {
        path: "form/:mode",
        component: EmployeeEditSaveComponent,
        canActivate: [ScopeGuard],
        data: {
            scopes: [
                'create:employees',
                'delete:employees',
                'edit:employees'
            ]
        }
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