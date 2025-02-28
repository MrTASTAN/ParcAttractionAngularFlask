import { Component } from '@angular/core';
import { AttractionService } from './Service/attraction.service';
import { CommonModule } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import { AttractionInterface } from './Interface/attraction.interface';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReviewInterface } from './Interface/review.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule, MatInputModule, MatFormFieldModule, TranslateModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  public visibleAttractions: Observable<AttractionInterface[]> | null = null;
  public reviews: Observable<ReviewInterface[]> | null = null;
  public selectedAttractionId: number | null = null;

  // Gestion des erreurs
  public errorMessageAttractions: string | null = null;
  public errorMessageReviews: string | null = null;

  // Variables pour le formulaire de critique
  public reviewNote: number = 0;
  public reviewComment: string = '';
  public reviewNom?: string;
  public reviewPrenom?: string;

  constructor(public attractionService: AttractionService) {
    this.loadVisibleAttractions();
  }

  /**
   * Charge les attractions visibles avec gestion des erreurs.
   */
  private loadVisibleAttractions(): void {
    this.errorMessageAttractions = null;
    this.visibleAttractions = this.attractionService.getVisibleAttractions().pipe(
      catchError(error => {
        console.error("❌ Erreur lors de la récupération des attractions :", error);
        this.errorMessageAttractions = "Erreur lors du chargement des attractions. Veuillez réessayer.";
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }

  /**
   * Affiche les critiques d'une attraction donnée avec gestion des erreurs.
   */
  public showReviews(attractionId: number | null): void {
    if (attractionId !== null) {
      this.selectedAttractionId = attractionId;
      this.errorMessageReviews = null;
      
      this.reviews = this.attractionService.getReviews(attractionId).pipe(
        catchError(error => {
          console.error(`❌ Erreur lors de la récupération des critiques pour l'attraction ${attractionId} :`, error);
          this.errorMessageReviews = "Impossible de récupérer les critiques.";
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      );
    }
  }

  /**
   * Envoie une critique pour une attraction avec gestion des erreurs.
   */
  public submitReview(attractionId: number | null): void {
    if (attractionId === null) {
      console.error("❌ Erreur : attractionId est null.");
      return;
    }

    const newReview: ReviewInterface = {
      id: undefined, // ID généré par le backend
      attraction_id: attractionId,
      note: this.reviewNote,
      commentaire: this.reviewComment,
      nom: this.reviewNom,
      prenom: this.reviewPrenom,
    };

    this.attractionService.postReview(newReview).subscribe(
      () => {
        console.log("✅ Critique envoyée avec succès :", newReview);
        this.showReviews(attractionId);
        this.resetReviewForm();
      },
      error => {
        console.error("❌ Erreur lors de l'envoi de la critique :", error);
        alert("Erreur lors de l'envoi de la critique. Veuillez réessayer.");
      }
    );
  }

  /**
   * Réinitialise le formulaire de critique après soumission.
   */
  private resetReviewForm(): void {
    this.reviewNote = 0;
    this.reviewComment = '';
    this.reviewNom = undefined;
    this.reviewPrenom = undefined;
  }
}
