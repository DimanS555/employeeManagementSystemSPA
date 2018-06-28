import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './appRouting.module';
import { EmployeesModule } from './employees/employees.module';

import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthService } from './auth/auth.service';
import { AuthGuardService } from '../app/auth/authGuard.service';
import { ScopeGuardService } from '../app/auth/scopeGuard.service';
import { NotificationService } from './shared/utils/notification.service';

@NgModule({
    imports: [
        BrowserModule,
        EmployeesModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        CallbackComponent,
        ProfileComponent
    ],
    providers: [AuthService,
        AuthGuardService,
        ScopeGuardService, 
        NotificationService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }