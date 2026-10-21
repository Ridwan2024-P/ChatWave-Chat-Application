import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneVerification } from './phone-verification';

describe('PhoneVerification', () => {
  let component: PhoneVerification;
  let fixture: ComponentFixture<PhoneVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
