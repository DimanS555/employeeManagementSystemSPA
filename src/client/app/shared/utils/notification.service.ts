import { Injectable } from '@angular/core';

declare var alertify: any;

@Injectable()
export class NotificationService {
    private notifier: any = alertify;

    constructor() { }

    /*
    Opens a confirmation dialog using the alertify.js lib
    */
    openConfirmationDialog(message: string, okCallback: () => any) {
        this.notifier.confirm(message, function () {
            okCallback();
        });
    }

    /*
    Prints a success message using the alertify.js lib
    */
    printSuccessMessage(message: string) {

        this.notifier.success(message);
    }

    /*
    Prints an error message using the alertify.js lib
    */
    printErrorMessage(message: string) {
        this.notifier.error(message);
    }
}