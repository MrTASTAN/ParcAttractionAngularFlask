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
      catchError(this.handleError<T>('getData', url))
    );
  }

  // ✅ POST : Envoi de données (corrigé)
  public postData<T, R>(url: string, data: T): Observable<R> {
    return this.http.post<R>(url, data, this.httpOptions).pipe(
      catchError(this.handleError<R>('postData', url))
    );
  }

  // ✅ PUT : Mise à jour complète (corrigé)
  public putData<T, R>(url: string, data: T): Observable<R> {
    return this.http.put<R>(url, data, this.httpOptions).pipe(
      catchError(this.handleError<R>('putData', url))
    );
  }

  // ✅ PATCH : Mise à jour partielle (corrigé)
  public patchData<T, R>(url: string, data: Partial<T>): Observable<R> {
    return this.http.patch<R>(url, data, this.httpOptions).pipe(
      catchError(this.handleError<R>('patchData', url))
    );
  }

  // ✅ DELETE : Suppression
  public deleteData<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, this.httpOptions).pipe(
      catchError(this.handleError<T>('deleteData', url))
    );
  }

  // 🚨 Gestion améliorée des erreurs
  private handleError<T>(operation = 'operation', url = '') {
    return (error: any): Observable<T> => {
      console.error(`❌ Erreur dans ${operation} (${url}):`, error.message || error);
      return throwError(() => new Error(`${operation} a échoué: ${error.message || error}`));
    };
  }
}
