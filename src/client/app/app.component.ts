import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app',
    moduleId: module.id,
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(public auth: AuthService) { }
}
