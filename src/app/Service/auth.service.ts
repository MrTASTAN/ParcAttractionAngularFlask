import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, map, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface AuthResponse {
  message: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  http = inject(HttpClient);
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.getInitialAuthState());
  public loggedIn$ = this.loggedInSubject.asObservable(); // ✅ Observable pour écouter l'état de connexion
  private token: string | null = null;

  constructor() {
    this.setUser(); // Vérifie l'état de connexion dès le démarrage
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * ✅ Correction : utilisation de `loggedInSubject`
   */
  public isAuthenticated(): boolean {
    return this.loggedInSubject.value;
  }

  /**
   * Connexion de l'utilisateur (Admin)
   */
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(
      'http://127.0.0.1:5001/login', // ✅ Correction de l'URL du serveur Flask
      { email, password }
    ).pipe(
      map(response => {
        if (response.token) {
          this.token = response.token;
          this.loggedInSubject.next(true);

          // ✅ Stocker l'état de connexion dans `localStorage`
          localStorage.setItem("token", response.token);
          localStorage.setItem("loggedIn", "true");

          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error("❌ Erreur de connexion :", error);
        return throwError(() => new Error("Échec de la connexion. Vérifiez vos identifiants."));
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    this.token = null;

    // ✅ Mise à jour du BehaviorSubject
    this.loggedInSubject.next(false);

    // ✅ Supprimer toutes les infos d'authentification
    localStorage.removeItem("token");
    localStorage.removeItem("loggedIn");
  }

  /**
   * Vérifie et met à jour l'état utilisateur depuis localStorage
   */
  private setUser() {
    const storedToken = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    this.token = storedToken;
    this.loggedInSubject.next(isLoggedIn);
  }

  /**
   * Récupère l'état initial d'authentification
   */
  private getInitialAuthState(): boolean {
    return localStorage.getItem("loggedIn") === "true";
  }

  /**
   * Getter pour récupérer le token
   */
  public getToken(): string | null {
    return this.token;
  }
}
