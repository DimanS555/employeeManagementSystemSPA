import { Injectable } from '@angular/core';

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ScopeGuardService } from './scopeGuard.service';

describe('Scope Guard Service', () => {
    let activatedRouteSnapshotMock: any;
    let routerMock: any;
    let service: AuthService;
    let routerSpy: Router;
    let activatedRouteSnapshotSpy: ActivatedRouteSnapshot;
    let scopeService: ScopeGuardService;

    beforeEach(() => {
        activatedRouteSnapshotMock = {
            data: {
                scopes: [
                ]
            }
        }
        routerMock = {
            navigate: jasmine.createSpy('navigate')
        }
        TestBed.configureTestingModule({
            imports:[RouterTestingModule],
            providers: [
                AuthService,
                ScopeGuardService,
                { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotMock },
                { provide: Router, useValue: routerMock }
            ]
        });
        service = TestBed.get(AuthService);
        scopeService = TestBed.get(ScopeGuardService);
        routerSpy = TestBed.get(Router);
        activatedRouteSnapshotSpy = TestBed.get(ActivatedRouteSnapshot);
    });

    it('should block a route when a user does not have permissions', () => {
        spyOn(service, 'isAuthenticated').and.returnValue(false);
        spyOn(service, 'hasReguiredScopes').and.returnValue(false);

        expect(scopeService.canActivate(activatedRouteSnapshotSpy)).toBeFalsy();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);

    });

    it('should block a route when a user does not have permissions', () => {
        spyOn(service, 'isAuthenticated').and.returnValue(true);
        spyOn(service, 'hasReguiredScopes').and.returnValue(true);

        expect(scopeService.canActivate(activatedRouteSnapshotSpy)).toBeTruthy();
        expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/home']);

    });
});