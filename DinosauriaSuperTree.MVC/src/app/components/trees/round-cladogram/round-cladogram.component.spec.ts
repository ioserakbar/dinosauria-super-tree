import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCladogramComponent } from './round-cladogram.component';

describe('RoundCladogram', () => {
    let component: RoundCladogramComponent;
    let fixture: ComponentFixture<RoundCladogramComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RoundCladogramComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RoundCladogramComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
