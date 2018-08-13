import { ComponentFixture, inject, async, TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service.js';
import { CallbackComponent } from './callback.component.js';

describe('Callback Component Tests', () => {
    let comp: CallbackComponent;
    let fixture: ComponentFixture<CallbackComponent>;
    let authServiceSpy: AuthService;
    let authServiceMock: any;

    beforeEach(async(() => {
        authServiceMock = {
            authentication: jasmine.createSpy('authentication')
        };
        TestBed.configureTestingModule({
            declarations: [CallbackComponent],
            providers: [
                { provide: AuthService, useValue: authServiceMock }
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CallbackComponent);
            comp = fixture.componentInstance;
            const injector = fixture.debugElement.injector;
            authServiceSpy = injector.get(AuthService);
        });
    }));

    it('should create a component', () => {
        expect(comp).toBeDefined;
    });

    it('should call authentication method', () => {
        fixture.detectChanges();
        expect(authServiceSpy.authentication).toHaveBeenCalled();
    });
});