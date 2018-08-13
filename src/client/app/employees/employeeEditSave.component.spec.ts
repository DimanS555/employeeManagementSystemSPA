import { ComponentFixture, TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Type, Injectable } from '@angular/core';

import { RouterTestingModule, } from '@angular/router/testing';
import { Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/services/data.service';
import { NotificationService } from '../shared/utils/notification.service';

import { Employee, Department } from '../models/interfaces';
import { MOCK_EMPLOYEE, MOCK_DEPARTMENT } from '../testing/mockData';

import { EmployeesModule } from './employees.module';
import { EmployeeEditSaveComponent } from './employeesEditSave.component';
import { NgForm } from '@angular/forms';

describe('Employee Edit Save Component Tests', overrideSetup);

function overrideSetup() {
    let comp: EmployeeEditSaveComponent;
    let fixture: ComponentFixture<EmployeeEditSaveComponent>;
    let location: SpyLocation;
    let serviceSpy: any;
    let notifyService: NotificationService;
    let activatedRouteMock: any;
    let activatedRouteSpy: any;
    let routerSpy: any;
    let routerMock: any;
    let links: DebugElement[];
    let deEl: DebugElement;

    @Component({ template: '' })
    class EmployeesListComponentStub { }

    class DataServiceSpy {
        testEmployees: Employee[] = MOCK_EMPLOYEE;
        testDepartments: Department[] = MOCK_DEPARTMENT;

        getDepartmentsData = jasmine.createSpy('getDepartmentsData').and.callFake(() => {
            return new Observable<Department[]>((obs) => {
                setTimeout(obs.next(this.testDepartments), 1000);
            });
        });

        getEmployee = jasmine.createSpy('getEmployee').and.callFake((id: number) => {
            if (id) {
                let employee = this.testEmployees.find(data => data.id == id);
                return new Observable((obs) => {
                    setTimeout(obs.next(employee), 1000);
                });
            } else {
                return new Observable((obs) => {
                    setTimeout(obs.error('Incorrect id'), 1000);
                });
            }
        });
        createEmployee = jasmine.createSpy('createEmployee').and.callFake((employee) => {
            this.testEmployees.push(employee);
            return new Observable((obs) => {
                setTimeout(obs.next(this.testEmployees), 1000);
            });
        });

        updateEmployee = jasmine.createSpy('updateEmployee').and.callFake((employee) => {
            let index = this.testEmployees.findIndex(elem => elem.id == employee.id);
            this.testEmployees.splice(index, 1, employee);
            return new Observable((obs) => {
                setTimeout(obs.next(this.testEmployees), 1000);
            });
        });
    }
    beforeEach(async(() => {

        activatedRouteMock = { snapshot: { params: { mode: '', id: null } } };

        routerMock = {
            navigateByUrl: jasmine.createSpy('navigateByUrl')
        }

        TestBed.configureTestingModule({
            imports: [
                EmployeesModule,
                RouterTestingModule.withRoutes([
                    { path: 'employees', component: EmployeesListComponentStub }
                ])
            ],
            declarations: [EmployeesListComponentStub],
            providers: [
                NotificationService,
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: DataService, useValue: {} }
            ]
        }).overrideComponent(EmployeeEditSaveComponent, {
            set: {
                providers: [
                    { provide: Router, useValue: routerMock },
                    { provide: DataService, useClass: DataServiceSpy }
                ]
            }
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(EmployeeEditSaveComponent);
            comp = fixture.componentInstance;
            const injector = fixture.debugElement.injector;
            routerSpy = injector.get(Router);
            serviceSpy = injector.get(DataService);
            notifyService = injector.get(NotificationService);
            activatedRouteSpy = injector.get(ActivatedRoute);
            location = injector.get(Location) as SpyLocation;
            deEl = fixture.debugElement;
        });
    }));

    it('form invalid when empty', fakeAsync(() => {
        advance();
        let form: NgForm = getForm();
        expect(form.valid).toBeFalsy();
    }));

    it('should fetch departments on init', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(serviceSpy.getDepartmentsData).toHaveBeenCalled();
        comp.departments$.subscribe(data => {
            expect(data.length).toEqual(3);
        });
    }));

    it('should show a correct operation in the h1 tag and button', fakeAsync(() => {
        advance();
        let h1El = fixture.debugElement.query(By.css('h4'));
        let button = fixture.debugElement.query(By.css('button'));
        expect(h1El.nativeElement.textContent.trim()).toEqual('Create new employee');
        expect(button.nativeElement.textContent.trim()).toEqual('Create');
        comp.editing = true;
        fixture.detectChanges();
        expect(h1El.nativeElement.textContent.trim()).toEqual('Edit some information');
        expect(button.nativeElement.textContent.trim()).toEqual('Save');
    }));

    it('firstName validity', fakeAsync(() => {
        advance();
        let errors = {};
        let form: NgForm = getForm();
        let firstName = form.controls['firstName'];
        expect(firstName.valid).toBeFalsy();
        errors = firstName.errors || {};
        expect(errors['required']).toBeTruthy();

        firstName.setValue('111John');
        errors = firstName.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();

        firstName.setValue('John');
        errors = firstName.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    }));

    it('lastName validity', fakeAsync(() => {
        advance();
        let errors = {};
        let form = getForm();
        let lastName = form.controls['lastName'];
        expect(lastName.valid).toBeFalsy();
        errors = lastName.errors || {};
        expect(errors['required']).toBeTruthy();

        lastName.setValue('   Doe');
        errors = lastName.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();

        lastName.setValue('Doe');
        errors = lastName.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeFalsy();
    }));

    it('button should be disabled when form is invalid', fakeAsync(() => {
        spyOn(comp, 'submitForm');
        advance();

        let form: NgForm = getForm();
        expect(form.valid).toBeFalsy();

        let firstNameInput = form.controls['firstName'];
        firstNameInput.setValue('0000');
        expect(firstNameInput.valid).toBeFalsy();

        let buttons = fixture.debugElement.queryAll(By.css('button'));
        let createButton = buttons[0].nativeElement;

        createButton.click();

        expect(comp.submitForm).not.toHaveBeenCalled();
    }));

    it('submitting a form', fakeAsync(() => {
        spyOn(comp, 'submitForm');

        advance();

        let form: NgForm = getForm();
        expect(form.valid).toBeFalsy();

        let firstNameInput = form.controls['firstName'];
        firstNameInput.setValue('John');
        expect(comp.employee.firstName).toEqual('John');

        let lastNameInput = form.controls['lastName'];
        lastNameInput.setValue('Pappa');
        expect(comp.employee.lastName).toEqual('Pappa');

        let empDepID = form.controls['emp_depID'];
        empDepID.setValue(2);
        expect(comp.employee.emp_depID).toEqual(2);

        expect(form.valid).toBeTruthy();
        expect()
        let myForm = fixture.debugElement.query(By.css('#myForm'));
        myForm.triggerEventHandler('ngSubmit', null);

        expect(comp.submitForm).toHaveBeenCalledWith(form);
    }));

    it('should reset a form', () => {
        comp.employee = MOCK_EMPLOYEE[0];
        comp.resetForm();
        expect(comp.employee).toEqual({} as Employee);
    })

    it('should save changes when editting was set to "true"', fakeAsync(() => {
        spyOn(comp, 'submitForm');
        activatedRouteSpy.snapshot.params.mode = 'edit';
        activatedRouteSpy.snapshot.params.id = 1;
        fixture.detectChanges();
        tick();
        expect(serviceSpy.getDepartmentsData).toHaveBeenCalled();
        expect(comp.editing).toBe(true);
        expect(serviceSpy.getEmployee).toHaveBeenCalled();
        fixture.detectChanges();
        let form = getForm();
        expect(form.valid).toBeTruthy();
        let firstName = form.controls['firstName'];

        expect(firstName.value).toEqual('Dima');

        firstName.setValue('Diman');

        let buttons = deEl.queryAll(By.css('button'));
        let submitButton = buttons[0].nativeElement;
        expect(submitButton.textContent.trim()).toEqual('Save');

        let myForm = fixture.debugElement.query(By.css('#myForm'));
        myForm.triggerEventHandler('ngSubmit', null);

        expect(comp.submitForm).toHaveBeenCalledWith(form);
        tick();
        expect(comp.employee.firstName).toEqual('Diman');
    }));

    it('should navigate back to the employees list', fakeAsync(() => {
        spyOn(comp, 'goToEmployeesList').and.callThrough();
        activatedRouteMock.snapshot.params.mode = 'edit';
        activatedRouteMock.snapshot.params.id = 1;
        advance();
        let buttons = fixture.debugElement.queryAll(By.css('button'));
        expect(buttons[1].nativeElement.textContent.trim()).toEqual('Cancel');
        buttons[1].nativeElement.click();

        expect(comp.goToEmployeesList).toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/employees');
    }));

    function expectElementOf(type: Type<any>) {
        const el = fixture.debugElement.query(By.directive(type));
        expect(el).toBeTruthy('expected an element for' + type.name);
    }

    function getForm(): NgForm {
        let form = deEl.query(By.css('#myForm')).references['form'];
        return form;
    }
    function advance() {
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
    }
}


