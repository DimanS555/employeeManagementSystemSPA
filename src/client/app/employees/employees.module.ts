import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { EmployeesRoutingModule } from './employeesRouting.module';

import { EmployeesListComponent } from './employeesList.component';
import { EmployeeEditSaveComponent } from './employeesEditSave.component';

import { DataService } from '../shared/services/data.service';
import { ConfigService } from '../shared/utils/config.service';

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
    providers: [DataService, ConfigService]
})
export class EmployeesModule { }