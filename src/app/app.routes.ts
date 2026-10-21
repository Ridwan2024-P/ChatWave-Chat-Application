import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { PhoneVerification } from './phone-verification/phone-verification';

export const routes: Routes = [

    {
    path: '',
    component:Welcome,
    pathMatch: 'full',
  },
   { path: 'verify-phone',component:PhoneVerification,
    pathMatch: 'full' 
    },
];
