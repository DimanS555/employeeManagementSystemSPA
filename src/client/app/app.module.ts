import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './appRouting.module';

import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import {HomeComponent} from './home/home.component';


@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }