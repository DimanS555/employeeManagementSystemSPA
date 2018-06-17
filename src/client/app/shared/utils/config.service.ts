import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

    apiHost: string;

    constructor() {
        this.apiHost = 'http://localhost:3500/';
    }

    getApiHost() {
        return this.apiHost;
    }
}