import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import "rxjs/add/observable/throw";

import { Employee, Pagination, PaginatedResult } from '../../models/interfaces';
import { ConfigService } from '../utils/config.service';

@Injectable()
export class DataService {
    baseUrl: string = '';
    queryUrl: string = 'search?name=';

    constructor(
        private httpClient: HttpClient,
        private configService: ConfigService,
    ) {
        this.baseUrl = configService.apiHost;
    }

    getData():Observable<Employee[]>{
        return this.httpClient.get(this.baseUrl + 'employees').catch(this.handleError);
    }

    createEmployee(employee: Employee): Observable<Employee> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.httpClient.post(
            this.baseUrl + 'employees', employee, { headers: headers }
        )
            .catch(this.handleError);
    }

    updateEmployee(employee: Employee): Observable<Employee> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.httpClient.put(
            this.baseUrl + 'employees/' + employee.id, employee, { headers: headers }
        )
            .catch(this.handleError);
    }

    deleteEmployee(id: number): Observable<void> {
        return this.httpClient.delete(this.baseUrl + 'employees/' + id)
            .catch(this.handleError);
    }

    getEmployee(id: number): Observable<Employee> {
        return this.httpClient.get(this.baseUrl + 'employees/' + id)
            .catch(this.handleError);
    }

    private handleError(error: any) {
        let applicationError = error.headers.get('Application-Error');
        let serverError = error.json();
        let modelStateErrors: string = '';

        if (!serverError.type) {
            console.log(serverError);
            for (let key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}