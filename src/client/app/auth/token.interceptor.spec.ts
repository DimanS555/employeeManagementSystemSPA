import {
    HttpClientTestingModule,
    HttpTestingController,
    TestRequest
} from '@angular/common/http/testing';

import { HttpClient } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MOCK_DEPARTMENT } from '../testing/mockData';

describe('TokenInterceptor', () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TokenInterceptor,
                    multi: true,
                }
            ]
        });
    });

    it('should add an Authorization header', inject([HttpClient, HttpTestingController],
        (http: HttpClient, httpMock: HttpTestingController) => {
            http.get('/data').subscribe(response => {
                expect(response).toBeTruthy();
            });
            const call: TestRequest =
                httpMock.expectOne(r => r.headers.has('Authorization'));

            call.flush({ hello: 'world' });
        }));
});