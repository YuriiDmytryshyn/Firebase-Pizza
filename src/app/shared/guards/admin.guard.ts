import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private db: AngularFirestore,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.cheackLogin();
  }
  private cheackLogin(): boolean {
    if (localStorage.getItem('user')) {
      const CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      if (CURRENT_USER.role === 'admin' && CURRENT_USER != null) {
        return true;
      }
    }
    this.router.navigateByUrl('home');
  }

}
