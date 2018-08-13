import { ComponentFixture, TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injectable, Component } from '@angular/core';

import { Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule, } from '@angular/router/testing';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/services/data.service';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../shared/utils/notification.service';

import { Employee, Pagination, Department, PaginatedResult } from '../models/interfaces';
import { EmployeesListComponent } from './employeesList.component';
import { MOCK_EMPLOYEE, MOCK_DEPARTMENT } from '../testing/mockData';

import { EmployeesModule } from './employees.module.js';

describe('Employees List Component Tests', overrideSetup);

function overrideSetup() {
    let comp: EmployeesListComponent;
    let fixture: ComponentFixture<EmployeesListComponent>;
    let location: SpyLocation;
    let route: any;
    let serviceSpy: any;
    let notifyService: NotificationService;
    let routerSpy: any;
    let routerMock: any;
    let service: AuthService;
    let scopes: any[];
    let tableDe: DebugElement;
    let tableHe: HTMLTableSectionElement;
    let el: HTMLElement;
    let links: DebugElement[];

    class DataServiceSpy {
        testEmployees: Employee[] = MOCK_EMPLOYEE;
        testDepartments: Department[] = MOCK_DEPARTMENT;

        getData = jasmine.createSpy('getData').and.callFake((obj) => {

            let paginatedResult: PaginatedResult<Employee[]> = new PaginatedResult<Employee[]>();
            let pageIndex = (obj.currentPage - 1) * obj.itemsPerPage;
            paginatedResult.result = this.testEmployees.slice(pageIndex, pageIndex + obj.itemsPerPage);

            let pagination: Pagination = {
                currentPage: obj.currentPage,
                itemsPerPage: obj.itemsPerPage,
                totalItems: this.testEmployees.length,
                totalPages: Math.ceil(this.testEmployees.length / obj.itemsPerPage)
            } as Pagination;
            paginatedResult.pagination = pagination;

            return new Observable<PaginatedResult<Employee[]>>((obs) => {
                setTimeout(obs.next(paginatedResult), 1000);
            });
        });

        getDepartmentsData = jasmine.createSpy('getDepartmentsData').and.callFake(() => {
            return new Observable<Department[]>((obs) => {
                setTimeout(obs.next(this.testDepartments), 1000);
            });
        });

        deleteEmployee = jasmine.createSpy('deleteEmployee').and.callFake((id: number) => {
            let index = this.testEmployees.findIndex(element => element.id == id);
            let empl = this.testEmployees[index];
            if (index > -1) {
                this.testEmployees.splice(index, 1);
                return new Observable<Employee>((obs) => {
                    setTimeout(obs.next(empl), 1000);
                });
            }
        });
    }

    beforeEach(async(() => {
        route = { snapshot: { data: { scopes: [''] } } };
        routerMock = {
            navigate: jasmine.createSpy('navigate')
        }

        TestBed.configureTestingModule({
            imports: [EmployeesModule, RouterTestingModule],
            providers: [
                AuthService,
                NotificationService,
                { provide: ActivatedRoute, useValue: route },
                { provide: Router, useValue: routerMock },
            ]
        }).overrideComponent(EmployeesListComponent, {
            set: {
                providers: [
                    { provide: DataService, useClass: DataServiceSpy }
                ]
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(EmployeesListComponent);
            comp = fixture.componentInstance;
            const injector = fixture.debugElement.injector;
            serviceSpy = injector.get(DataService);
            routerSpy = injector.get(Router);
            service = injector.get(AuthService);
            notifyService = injector.get(NotificationService);
        });
    }));

    it('should fetch employees list on init', fakeAsync(() => {
        let hasScopes;
        let tdEls;
        spyOn(service, 'hasReguiredScopes').and.returnValue(true);
        advance();
        expect(service.hasReguiredScopes).toHaveBeenCalled();
        expect(comp.hasScopes).toBeTruthy();
        expect(serviceSpy.getDepartmentsData).toHaveBeenCalled();
        expect(serviceSpy.getData).toHaveBeenCalledWith(jasmine.any(Object));

        tableDe = fixture.debugElement.query(By.css('table tbody'));
        tableHe = tableDe.nativeElement;

        expect(comp.employees.length).toEqual(5);
        expect(comp.totalItems).toEqual(5);
        expect(tableHe.getElementsByTagName('tr').length).toEqual(5);

        tdEls = tableHe.getElementsByTagName('tr')[0].getElementsByTagName('td');

        expect(tdEls.length).toBe(7);
        expect(tdEls[1].textContent.trim()).toEqual('Dima');
        expect(tdEls[2].textContent.trim()).toEqual('Savenkov');
        expect(comp.departments.length).toEqual(3);

        serviceSpy.testEmployees.push({
            id: 6,
            firstName: "John",
            lastName: "Pappa",
            isActive: true,
            emp_depID: 2
        });

        comp.ngOnInit();
        tick();
        fixture.detectChanges();
        expect(comp.employees.length).toEqual(6);
        expect(tableHe.getElementsByTagName('tr').length).toEqual(6);
    }));

    it('should hide buttons when hasReguiredScopes returns false value', fakeAsync(() => {
        let hasScopes;
        let tdEls;
        spyOn(service, 'hasReguiredScopes').and.returnValue(false);
        advance();
        expect(service.hasReguiredScopes).toHaveBeenCalled();
        expect(comp.hasScopes).toBeFalsy();
        tableDe = fixture.debugElement.query(By.css('table tbody'));
        tableHe = tableDe.nativeElement;
        tdEls = tableHe.getElementsByTagName('tr')[0].getElementsByTagName('td');
        expect(tdEls.length).toBe(5);
    }));

    it('should fetch deps name by id', fakeAsync(() => {
        spyOn(service, 'hasReguiredScopes').and.returnValue(true);
        fixture.detectChanges();
        tick();
        expect(comp.getDepName(1)).toEqual('Finance');
        expect(comp.getDepName(2)).toEqual('HR');
        expect(comp.getDepName(3)).toEqual('Tech');
    }));

    it('should navigate to the edit page', fakeAsync(() => {
        spyOn(service, 'hasReguiredScopes').and.returnValue(true);
        spyOn(comp, 'editEmployeePage').and.callThrough();
        advance();
        let buttons = fixture.debugElement.queryAll(By.css('button'));
        expect(buttons[1].nativeElement.textContent.trim()).toEqual('Edit');
        buttons[1].nativeElement.click();
        expect(comp.editEmployeePage).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/form', 'edit', 1]);
    }));

    it('should navigate to the create page', fakeAsync(() => {
        spyOn(service, 'hasReguiredScopes').and.returnValue(true);
        spyOn(comp, 'createEmployeePage').and.callThrough();
        advance();
        let createButton = fixture.debugElement.query(By.css('#createButton'));
        expect(createButton.nativeElement.textContent.trim()).toEqual('Create New Employee');
        createButton.nativeElement.click();
        expect(comp.createEmployeePage).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/form/create']);
    }));
    
    it('should remove employees selected to be deleted', fakeAsync(() => {
        spyOn(notifyService, 'openConfirmationDialog').and.callFake(()=>{
            serviceSpy.deleteEmployee(MOCK_EMPLOYEE[0].id);
        });
        comp.removeEmployee(MOCK_EMPLOYEE[0]);
        expect(notifyService.openConfirmationDialog).toHaveBeenCalled();
        expect(serviceSpy.deleteEmployee).toHaveBeenCalledTimes(1);
    }));

    function advance() {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
    }
};

