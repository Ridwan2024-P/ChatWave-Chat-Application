import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhoneOtpVerification } from './phone-otp-verification';

describe('PhoneOtpVerification', () => {
  let component: PhoneOtpVerification;
  let fixture: ComponentFixture<PhoneOtpVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneOtpVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneOtpVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
