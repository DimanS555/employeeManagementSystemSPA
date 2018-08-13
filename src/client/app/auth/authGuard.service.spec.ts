import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuardService } from './authGuard.service.js';
import { AuthService } from './auth.service.js';

describe('AuthGuardService', () => {
    let serviceGuard: AuthGuardService;
    let serviceAuth: AuthService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
         imports:[RouterTestingModule],
            providers: [
                AuthGuardService,
                AuthService
            ]
        });
        serviceGuard = TestBed.get(AuthGuardService);
        serviceAuth = TestBed.get(AuthService);
        router = TestBed.get(Router);
    });
    it('checks if a user is valid', () => {
        let spyNavigation = spyOn(router, 'navigate');
        spyOn(serviceAuth, 'isAuthenticated').and.returnValue(false);
        expect(serviceGuard.canActivate()).toBeFalsy;
        expect(spyNavigation).toHaveBeenCalled();
        expect(spyNavigation).toHaveBeenCalledWith(['']);
    });
});