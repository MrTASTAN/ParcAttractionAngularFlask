import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataService } from './data.service';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MessageInterface } from '../Interface/message.interface';
import { ReviewInterface } from '../Interface/review.interface';

@Injectable({
  providedIn: 'root',
})
export class AttractionService {

  constructor(private dataService: DataService) {}

  /**
   * Récupère toutes les attractions
   */
  public getAllAttraction(): Observable<AttractionInterface[]> {
    const url = "http://127.0.0.1:5000/attraction";
    return this.dataService.getData(url) as Observable<AttractionInterface[]>;
  }

  /**
   * Récupère uniquement les attractions visibles
   */
  public getVisibleAttractions(): Observable<AttractionInterface[]> {
    const url = "http://127.0.0.1:5000/attraction/visible";
    return this.dataService.getData(url) as Observable<AttractionInterface[]>;
  }

  /**
   * Ajoute une nouvelle attraction
   */
  public postAttraction(attraction: AttractionInterface): Observable<MessageInterface> {
    const url = "http://127.0.0.1:5000/attraction";
    return this.dataService.postData(url, attraction) as Observable<MessageInterface>;
  }

  /**
   * Met à jour la visibilité d'une attraction
   */
  public updateAttractionVisibility(attractionId: number, visible: boolean): Observable<MessageInterface> {
    const url = `http://127.0.0.1:5000/attraction/${attractionId}/visibility`;
    return this.dataService.putData(url, { visible }) as Observable<MessageInterface>;
  }

  /**
   * Récupère les critiques d'une attraction
   */
  public getReviews(attractionId: number): Observable<ReviewInterface[]> {
    const url = `http://127.0.0.1:5000/attraction/${attractionId}/reviews`;
    return this.dataService.getData(url) as Observable<ReviewInterface[]>;
  }
  
  /**
   * Ajoute une critique à une attraction
   */
  public postReview(review: ReviewInterface): Observable<MessageInterface> {
    const url = "http://127.0.0.1:5000/reviews";
    return this.dataService.postData(url, review) as Observable<MessageInterface>;
  }  
  
  /**
   * Met à jour une attraction existante
   */
  public updateAttraction(attraction: AttractionInterface): Observable<MessageInterface> {
    const url = `http://127.0.0.1:5000/attraction/${attraction.attraction_id}`;
    return this.dataService.putData(url, attraction) as Observable<MessageInterface>;
  }
}
