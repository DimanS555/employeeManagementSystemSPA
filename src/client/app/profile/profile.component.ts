import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-profile',
    moduleId: module.id,
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {
    profile: any;
    constructor(public auth: AuthService) { }
    ngOnInit() {
        if (this.auth.userProfile) {
            this.profile = this.auth.userProfile;
        } else {
            this.auth.getUserProfile((err, profile) => {
                if (err) {
                    throw err;
                } else {
                    this.profile = profile;
                    console.log(this.profile);
                }
            });
        }
    }
}