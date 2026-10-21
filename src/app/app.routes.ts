import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { PhoneVerification } from './phone-verification/phone-verification';
import { PhoneOtpVerification } from './phone-otp-verification/phone-otp-verification';

export const routes: Routes = [

    {
    path: '',
    component:Welcome,
    pathMatch: 'full',
  },
   { path: 'verify-phone',component:PhoneVerification,
    pathMatch: 'full' 
    },
    { path: 'verify-otp',component:PhoneOtpVerification,
    pathMatch: 'full' 
    },
];
