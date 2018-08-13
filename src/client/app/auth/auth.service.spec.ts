import { Injectable } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AUTH_CONFIG } from './auth0Variables';
import { AuthService } from './auth.service';

describe('Auth Service', () => {
    let service: AuthService;
    let routerSpy: Router;
    let routerMock: any;

    beforeEach(() => {
        routerMock = {
            navigate: jasmine.createSpy('navigate')
        };

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: routerMock }
            ]
        });
        service = TestBed.get(AuthService);

    });
    it('hasReguiredScopes returns true when user has permissions', () => {
        localStorage.setItem('scopes', JSON.stringify("create:employees edit:employees delete:employees"));
        expect(service.hasReguiredScopes(['create:employees', 'edit:employees', 'delete:employees'])).toBeTruthy();
    });

    it('hasReguiredScopes returns false when user does not have permissions', () => {
        localStorage.setItem('scopes', JSON.stringify("read:employees"));
        expect(service.hasReguiredScopes(['create:employees', 'edit:employees', 'delete:employees'])).toBeFalsy();
    });
});