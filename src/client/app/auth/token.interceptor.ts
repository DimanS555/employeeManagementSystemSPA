import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            headers: request.headers.set(
                'Authorization', `Bearer ${localStorage.getItem('access_token')}`
            )
        })
        return next.handle(request);
    }
}