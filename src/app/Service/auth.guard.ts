import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * ✅ Vérifie si l'utilisateur est authentifié avant d'accéder à la route admin
   */
  canActivate(): Observable<boolean> | boolean {
    const isLoggedIn = this.authService.isAuthenticated();

    if (isLoggedIn) {
      console.log("✅ Accès autorisé à l'admin.");
      return true;
    } else {
      console.warn("❌ Accès refusé - Redirection vers la page de connexion.");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
