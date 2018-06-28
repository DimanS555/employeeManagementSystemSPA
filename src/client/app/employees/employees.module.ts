import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmployeesRoutingModule } from './employeesRouting.module';

import { ActivatedRoute } from '@angular/router';

import { EmployeesListComponent } from './employeesList.component';
import { EmployeeEditSaveComponent } from './employeesEditSave.component';

import { DataService } from '../shared/services/data.service';
import { ConfigService } from '../shared/utils/config.service';

import { TokenInterceptor } from '../auth/token.interceptor';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        EmployeesRoutingModule
    ],
    declarations: [
        EmployeesListComponent,
        EmployeeEditSaveComponent
    ],
    providers: [
        DataService,
        ConfigService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ]
})
export class EmployeesModule { }