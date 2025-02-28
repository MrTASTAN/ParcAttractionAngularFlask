import { Injectable, inject } from '@angular/core';
import { UserInterface } from '../Interface/user.interface';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  http = inject(HttpClient);
  
  private loggedIn = false;
  user: UserInterface | null = null;

  constructor() {
    this.setUser(); // Vérifie l'état de connexion dès le démarrage
  }

  get isAuthenticated(): boolean {
    this.setUser(); // ⚡ Assure que l’état est à jour avant de retourner la valeur
    return this.loggedIn;
  }

  login(form: object): Observable<boolean> {
    return this.http.post<UserInterface>(
      'http://127.0.0.1:5000/login',
      { ...form }
    ).pipe(map(user => {
      this.loggedIn = user.token ? true : false;
      this.user = user || null;

      // ✅ Stocker l'état de connexion dans `localStorage`
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loggedIn", JSON.stringify(this.loggedIn));

      return this.loggedIn;
    }));
  }

  logout(): void {
    this.loggedIn = false;
    this.user = null;

    // ✅ Supprimer toutes les infos d'authentification
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
  }

  public setUser() {
    const user = localStorage.getItem("user");
    const loggedIn = localStorage.getItem("loggedIn");

    if (user && loggedIn === "true") {
      this.loggedIn = (JSON.parse(user) as UserInterface).token ? true : false;
      this.user = JSON.parse(user) as UserInterface;
    } else {
      this.loggedIn = false;
      this.user = null;
    }
  }
}
