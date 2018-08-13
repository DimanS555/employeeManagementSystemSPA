import {
    HttpClientTestingModule,
    HttpTestingController,
    TestRequest
} from '@angular/common/http/testing';

import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { TestBed } from '@angular/core/testing';

import { Employee, Department, PaginatedResult } from '../../models/interfaces';
import { DataService } from './data.service';
import { AUTH_CONFIG } from '../../auth/auth0Variables';
import { MOCK_EMPLOYEE, MOCK_DEPARTMENT } from '../../testing/mockData';
import { Observable } from 'rxjs/Observable';

describe('DataService', () => {
    let service: DataService;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataService]
        });

        // inject the service
        service = TestBed.get(DataService);
        httpClient = TestBed.get(HttpClient);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('returns a single employee by id', () => {
        let testEmployee = (employee: Employee) => {
            expect(employee).toBeDefined;
            expect(employee.firstName).toEqual('Den');
            expect(employee.lastName).toEqual('Brown');
            expect(employee.isActive).toBeFalsy;
            expect(employee.emp_depID).toEqual(3);
        };
        service.getEmployee(3).subscribe(testEmployee);

        const call: TestRequest =
            httpMock.expectOne(`${service.baseUrl}/employees/3`);

        expect(call.request.method).toEqual('GET');

        call.flush(MOCK_EMPLOYEE[2]);
        httpMock.verify();
    });

    it('returns a list of departments', () => {
        service.getDepartmentsData().subscribe((result: Department[]) => {
            expect(result).toBeDefined;
            expect(result.length).toEqual(3);
            expect(result[0].id).toEqual(1);
            expect(result[0].depName).toEqual('Finance');
        });

        const call: TestRequest =
            httpMock.expectOne(`${service.baseUrl}/departments`);

        expect(call.request.method).toEqual('GET');
        call.flush(MOCK_DEPARTMENT);
        httpMock.verify();
    });

    it('returns a single department by id', () => {
        let testDep = (dep: Department) => {
            expect(dep).toBeDefined;
            expect(dep.depName).toEqual('Tech');
        };
        service.getDepartment(3).subscribe(testDep);

        const call: TestRequest =
            httpMock.expectOne(`${service.baseUrl}/departments/3`);

        expect(call.request.method).toEqual('GET');

        call.flush(MOCK_DEPARTMENT[2]);
        httpMock.verify();
    });

    it('should post the correct data', () => {
        let testNewEmployee = (newEmployee: Employee) => {
            expect(newEmployee).toEqual(jasmine.objectContaining({
                id: 3,
                firstName: 'Den',
                lastName: 'Brown',
                isActive: false,
                emp_depID: 3
            }));
        };
        service.createEmployee(MOCK_EMPLOYEE[2]).subscribe(testNewEmployee);

        const call: TestRequest =
            httpMock.expectOne(`${service.baseUrl}/employees`);

        expect(call.request.method).toEqual('POST');
        expect(call.request.body).toEqual(MOCK_EMPLOYEE[2]);
        call.flush(MOCK_EMPLOYEE[2], { status: 200, statusText: 'OK' });
        httpMock.verify();
    });

    it('should delete an employee', () => {
        service.deleteEmployee(1).subscribe();

        const call: TestRequest =
            httpMock.expectOne(`${service.baseUrl}/employees/1`);

        expect(call.request.method).toEqual('DELETE');
        call.flush({});
        httpMock.verify();
    });

    it('should update an employee', () => {
        let testUpdatedEmployee = (updatedEmployee: Employee) => {
            expect(updatedEmployee).toEqual(jasmine.objectContaining({
                id: 2,
                firstName: 'Peter',
                lastName: 'Sermon',
                isActive: false,
                emp_depID: 2
            }));
        };
        service.updateEmployee(MOCK_EMPLOYEE[1]).subscribe(testUpdatedEmployee);

        const call: TestRequest =
            httpMock.expectOne(`${service.baseUrl}/employees/2`);

        expect(call.request.method).toEqual('PUT');
        expect(call.request.body).toEqual(MOCK_EMPLOYEE[1]);
        call.flush(MOCK_EMPLOYEE[1], { status: 200, statusText: 'OK' });
        httpMock.verify();
    });

    it('should return expected employees', () => {
        let testEmployeesData = ((res: PaginatedResult<Employee[]>) => {
            expect(res.result.length).toEqual(MOCK_EMPLOYEE.length);
            expect(res.pagination.currentPage).toEqual(1);
            expect(res.pagination.itemsPerPage).toEqual(10);
            expect(res.pagination.totalItems).toEqual(MOCK_EMPLOYEE.length);
            expect(res.pagination.totalPages).toEqual(1);
        });

        let obj = {
            itemsPerPage: 10,
            currentPage: 1
        }

        service.getData(obj).subscribe(testEmployeesData);

        const call: TestRequest[] =
            httpMock.match((request) => {
                return request.url == `${service.baseUrl}/employees` &&
                    request.urlWithParams == `${service.baseUrl}/employees?limit=10&pageNo=1` &&
                    request.method === 'GET' &&
                    request.params.get('limit') == '10' &&
                    request.params.get('pageNo') == '1';
            });
        expect(call.length).toEqual(1);
        call[0].flush({
            result: MOCK_EMPLOYEE,
            pagingData: {
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: MOCK_EMPLOYEE.length,
                totalPages: 1
            }
        });
        httpMock.verify();
    });
});