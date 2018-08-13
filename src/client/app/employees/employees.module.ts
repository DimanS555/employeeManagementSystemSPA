import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmployeesRoutingModule } from './employeesRouting.module';
import { PaginationModule } from 'ngx-bootstrap';

import { ActivatedRoute } from '@angular/router';

import { EmployeesListComponent } from './employeesList.component';
import { EmployeeEditSaveComponent } from './employeesEditSave.component';

import { DataService } from '../shared/services/data.service';

import { TokenInterceptor } from '../auth/token.interceptor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        EmployeesRoutingModule,
        PaginationModule.forRoot()
    ],
    declarations: [
        EmployeesListComponent,
        EmployeeEditSaveComponent
    ],
    providers: [
        DataService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ]
})
export class EmployeesModule { }