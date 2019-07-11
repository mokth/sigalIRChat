import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(private auth:AuthService,
               private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   // console.log(this.auth.isAuthenticated());
   if (this.auth.isAuthenticated())
   {
       return true;
   }else
   {
    this.router.navigate(['/login']);
   }
    return false;
  }
}
