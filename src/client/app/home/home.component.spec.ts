import { ComponentFixture, inject, async, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
 
describe('Home Component Tests', () => {
        let comp: HomeComponent;
        let fixture: ComponentFixture<HomeComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [HomeComponent],
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(HomeComponent);
                comp = fixture.componentInstance;
            });
        }));

        it('should create a component', () => {
            expect(comp).toBeDefined;
        });
    });