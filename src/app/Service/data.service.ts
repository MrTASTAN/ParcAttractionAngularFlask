import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // ✅ GET : Récupération des données
  public getData<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError(this.handleError<T>('getData'))
    );
  }

  // ✅ POST : Envoi de données
  public postData<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data, this.httpOptions).pipe(
      catchError(this.handleError<T>('postData'))
    );
  }

  // ✅ PUT : Mise à jour des données (ajouté pour corriger l'erreur)
  public putData<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data, this.httpOptions).pipe(
      catchError(this.handleError<T>('putData'))
    );
  }

  // ✅ DELETE : Suppression de données
  public deleteData<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, this.httpOptions).pipe(
      catchError(this.handleError<T>('deleteData'))
    );
  }

  // 🚨 Gestion des erreurs
  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`❌ Erreur dans ${operation}:`, error);
      return throwError(() => new Error(`${operation} a échoué`));
    };
  }
}
