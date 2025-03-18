import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MessageInterface } from '../Interface/message.interface';
import { ReviewInterface } from '../Interface/review.interface';

@Injectable({
  providedIn: 'root',
})
export class AttractionService {
  private apiUrl = "http://127.0.0.1:5001"; // ✅ Stocke l’URL pour éviter la répétition

  constructor(private dataService: DataService) {}

  /**
   * ✅ Récupère toutes les attractions
   */
  public getAllAttractions(): Observable<AttractionInterface[]> {
    return this.dataService.getData<AttractionInterface[]>(`${this.apiUrl}/attraction`);
  }

  /**
   * ✅ Récupère uniquement les attractions visibles
   */
  public getVisibleAttractions(): Observable<AttractionInterface[]> {
    return this.dataService.getData<AttractionInterface[]>(`${this.apiUrl}/attraction/visible`);
  }

  /**
   * ✅ Ajoute une nouvelle attraction
   */
  public postAttraction(attraction: AttractionInterface): Observable<any> { 
    return this.dataService.postData(`${this.apiUrl}/attraction`, attraction);
  }

  /**
 * Met à jour la visibilité d'une attraction
 */
public updateAttractionVisibility(attractionId: number, visible: boolean): Observable<MessageInterface> {
  const url = `http://127.0.0.1:5001/attraction/${attractionId}/visibility`;
  return this.dataService.patchData(url, { visible }) as Observable<MessageInterface>;
}


  /**
   * ✅ Récupère les critiques d'une attraction
   */
  public getReviews(attractionId: number): Observable<ReviewInterface[]> {
    return this.dataService.getData<ReviewInterface[]>(`${this.apiUrl}/attraction/${attractionId}/reviews`);
  }

  /**
   * ✅ Ajoute une critique à une attraction
   */
  public postReview(review: ReviewInterface): Observable<any> {
    return this.dataService.postData(`${this.apiUrl}/reviews`, review);
  }  

  /**
   * ✅ Met à jour une attraction existante
   */
  public updateAttraction(attraction: AttractionInterface): Observable<any> {
    return this.dataService.putData(`${this.apiUrl}/attraction/${attraction.attraction_id}`, attraction);
  }
}
