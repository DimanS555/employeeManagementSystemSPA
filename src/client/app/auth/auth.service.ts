import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { AUTH_CONFIG } from './auth0Variables';
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {

    requestedScopes: string = 'openid profile email app_metadata read:employees';

    auth0 = new auth0.WebAuth({
        clientID: AUTH_CONFIG.clientID,
        domain: AUTH_CONFIG.domain,
        responseType: 'token id_token',
        audience: AUTH_CONFIG.apiUrl,
        redirectUri: AUTH_CONFIG.callbackURL,
        scope: this.requestedScopes
    });

    userProfile: any;

    constructor(private router: Router) { }

    login(): void {
        this.auth0.authorize();
    }

    authentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);
                this.router.navigate(['/home']);
            } else if (err) {
                this.router.navigate(['/home']);
            }
        });
    }

    private setSession(authResult): void {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        const scopes = authResult.scope || this.requestedScopes || '';
        // Store the authResult in local storage
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('scopes', JSON.stringify(scopes));
    }

    logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('scopes');
        // Go back to the home route
        this.router.navigate(['/home']);
    }

    isAuthenticated(): boolean {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
        return new Date().getTime() < expiresAt;
    }

    getUserProfile(callback): void {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access Token must exist to fetch profile');
        }
        const self = this;
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                self.userProfile = profile;
            }
            callback(err, profile);
        });
    }

    hasReguiredScopes(scopes: Array<string>): boolean {
        const requiredScopes = decodeURIComponent(JSON.parse(localStorage.getItem('scopes')).split(' '));
        return scopes.every(data => requiredScopes.includes(data));
    }
}

