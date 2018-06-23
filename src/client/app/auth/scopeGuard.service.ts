import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class ScopeGuardService implements CanActivate {

    constructor(public auth: AuthService, public router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {

        const scopes = route.data.scopes;

        if (!this.auth.isAuthenticated() || !this.auth.hasReguiredScopes(scopes)) {
            this.router.navigate(['/home']);
            return false;
        }
        return true;
    }
}