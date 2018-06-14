import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-callback',
    moduleId: module.id,
    templateUrl: 'callback.component.html',
    styleUrls: ['callback.component.css']
})
export class CallbackComponent {
    constructor(private auth: AuthService) { }
    ngOnInit() {
        this.auth.authentication();
    }
}