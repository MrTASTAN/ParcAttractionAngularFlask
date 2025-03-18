import { Injectable, inject } from '@angular/core';
import { UserInterface } from '../Interface/user.interface';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  http = inject(HttpClient);
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.getInitialAuthState());
  public loggedIn$ = this.loggedInSubject.asObservable(); // ✅ Observable pour écouter l'état de connexion
  private user: UserInterface | null = null;

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
   * Connexion de l'utilisateur
   */
  login(form: object): Observable<boolean> {
    return this.http.post<UserInterface>(
      'http://127.0.0.1:5000/login',
      { ...form }
    ).pipe(map(user => {
      const isLoggedIn = !!user.token;
      this.user = isLoggedIn ? user : null;

      // ✅ Mise à jour du BehaviorSubject
      this.loggedInSubject.next(isLoggedIn);

      // ✅ Stocker l'état de connexion dans `localStorage`
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loggedIn", JSON.stringify(isLoggedIn));

      return isLoggedIn;
    }));
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    this.user = null;
    
    // ✅ Mise à jour du BehaviorSubject
    this.loggedInSubject.next(false);

    // ✅ Supprimer toutes les infos d'authentification
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
  }

  /**
   * Vérifie et met à jour l'état utilisateur depuis localStorage
   */
  private setUser() {
    const userData = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    this.user = userData ? JSON.parse(userData) as UserInterface : null;
    this.loggedInSubject.next(isLoggedIn);
  }

  /**
   * Récupère l'état initial d'authentification
   */
  private getInitialAuthState(): boolean {
    return localStorage.getItem("loggedIn") === "true";
  }
}
