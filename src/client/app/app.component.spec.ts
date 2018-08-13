import { Component, DebugElement, Type, Injectable } from '@angular/core';

import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Location, CommonModule } from '@angular/common';

import { RouterTestingModule, } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

import { Router, RouterLinkWithHref } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { AuthGuardService as AuthGuard } from './auth/authGuard.service';
import { AppComponent } from './app.component';
import { Observable } from 'rxjs/Observable';

@Component({ template: '' })
class HomeComponentStub { }

@Component({ template: '' })
class ProfileComponentStub { }

@Component({ template: '' })
class EmployeesListComponentStub { }

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let router: Router;
let location: SpyLocation;
let authServiceMock: any;
let guardServiceMock: any;
let service: AuthService;
let homeLinkDe: DebugElement;
let profLinkDe: DebugElement;
let empLinkDe: DebugElement;
let links: DebugElement[];
let lisDe: DebugElement[];
let loginHe: HTMLLIElement;
let logoutHe: HTMLLIElement;
let guardService: AuthGuard;

describe('component: AppComponent', () => {
    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomeComponentStub },
                    { path: 'profile', component: ProfileComponentStub, canActivate: [AuthGuard] },
                    { path: 'employees', component: EmployeesListComponentStub },
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                ])
            ],
            declarations: [
                AppComponent,
                HomeComponentStub,
                ProfileComponentStub,
                EmployeesListComponentStub
            ],
            providers: [
                AuthGuard,
                AuthService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(AppComponent);
            comp = fixture.componentInstance;
            const injector = fixture.debugElement.injector;
            service = injector.get(AuthService);
            guardService = injector.get(AuthGuard);
            router = injector.get(Router);
            router.initialNavigation();
            location = injector.get(Location) as SpyLocation;
            lisDe = fixture.debugElement.queryAll(By.css('li'));
        });
    }));

    it('can instantiate a component', () => {
        expect(comp).toBeDefined;
    });

    it('fakeAsync works', fakeAsync(() => {
        let done: boolean = false;
        let observable = new Observable((obs) => {
            setTimeout(obs.next(), 10)
        });
        observable.subscribe(() => { done = true });
        tick(50);
        expect(done).toBeTruthy();
    }));

    it('should navigate to "Home" immediately', () => {
        expect(location.path()).toEqual('/home', 'after initialNavigation()');
        expectElementOf(HomeComponentStub);
    });

    it('should navigate to "Profile" on click', fakeAsync(() => {
        spyOn(service, 'isAuthenticated').and.returnValue(true);
        spyOn(guardService, 'canActivate').and.returnValue(true);
        fixture.detectChanges();
        let profEl = getLinks()[2].nativeElement.click();
        tick(50);
        expect(location.path()).toEqual('/profile');
        expectElementOf(ProfileComponentStub);
    }));

    it('should navigate to "Home" on click', fakeAsync(() => {
        let homeEl = getLinks()[0].nativeElement.click();
        tick(50);
        expect(location.path()).toEqual('/home');
        expectElementOf(HomeComponentStub);
    }));

    it('should navigate to "Employees" on click', fakeAsync(() => {
        spyOn(service, 'isAuthenticated').and.returnValue(true);
        fixture.detectChanges();
        let emplEl = getLinks()[3].nativeElement.click();
        tick(50);
        expect(location.path()).toEqual('/employees');
        expectElementOf(EmployeesListComponentStub);
    }));

    it('should navigate to "Profile" browser location URL change', fakeAsync(() => {
        spyOn(guardService, 'canActivate').and.returnValue(true);
        location.simulateHashChange('/profile');
        tick(50);
        expect(location.path()).toEqual('/profile');
        expectElementOf(ProfileComponentStub);
    }));

    it('should navigate to "Employees" browser location URL change', fakeAsync(() => {
        location.simulateHashChange('/employees');
        tick(50);
        expect(location.path()).toEqual('/employees');
        expectElementOf(EmployeesListComponentStub);
    }));

    it('login button should be hidden when the user is authenticated', () => {
        spyOn(service, 'isAuthenticated').and.returnValue(true);
        fixture.detectChanges();
        loginHe = lisDe[5].nativeElement;
        logoutHe = lisDe[6].nativeElement;

        expect(loginHe.textContent.trim() === '').toBeTruthy();
        expect(logoutHe.textContent.trim()).toBe('Log out');
    });

    it('logout button should be hidden when the user is not authenticated', () => {
        spyOn(service, 'isAuthenticated').and.returnValue(false);
        fixture.detectChanges();
        loginHe = lisDe[5].nativeElement;
        logoutHe = lisDe[6].nativeElement;

        expect(loginHe.textContent.trim()).toBe('Log in');
        expect(logoutHe.textContent.trim() === '').toBeTruthy();
    });

    it('auth login() method should be called', fakeAsync(() => {
        spyOn(service, 'isAuthenticated').and.returnValue(false);
        fixture.detectChanges();
        logoutHe = lisDe[5].nativeElement;
        loginHe.click();
        tick();
        expect(service.login).toHaveBeenCalled;
    }));

    it('auth logout() method should be called', fakeAsync(() => {
        spyOn(service, 'isAuthenticated').and.returnValue(true);
        fixture.detectChanges();
        logoutHe = lisDe[6].nativeElement;
        logoutHe.click();
        tick();
        expect(service.logout).toHaveBeenCalled;
    }));
});

function expectElementOf(type: Type<any>) {
    const el = fixture.debugElement.query(By.directive(type));
    expect(el).toBeTruthy('expected an element for' + type.name);
}
const ButtonClickEvents = {
    left: { button: 0 },
    right: { button: 2 }
};

function getLinks(): DebugElement[]{
    links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    return links;
}

