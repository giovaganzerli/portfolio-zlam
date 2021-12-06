import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// SERVICES
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string) {
        if (this.authService.isLoggedIn) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
