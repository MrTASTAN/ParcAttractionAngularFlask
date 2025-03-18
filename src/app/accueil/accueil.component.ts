import { Component } from '@angular/core';
import { AttractionService } from '../Service/attraction.service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReviewInterface } from '../Interface/review.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule, MatInputModule, MatFormFieldModule, TranslateModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss',
})
export class AccueilComponent {
  public visibleAttractions$: Observable<AttractionInterface[]>;  // ✅ Observable pour les attractions visibles
  public reviews$: Observable<ReviewInterface[]> = of([]); // ✅ Observable pour les critiques
  public selectedAttractionId: number | null = null;

  // Variables pour le formulaire de critique
  public reviewNote: number = 0;
  public reviewComment: string = '';
  public reviewNom?: string;
  public reviewPrenom?: string;

  constructor(public attractionService: AttractionService) {
    this.visibleAttractions$ = this.attractionService.getVisibleAttractions(); // ✅ Récupération en Observable
  }

  /**
   * Affiche les critiques d'une attraction donnée.
   */
  public showReviews(attractionId: number | null): void {
    if (attractionId !== null) {
      this.selectedAttractionId = attractionId;
      this.reviews$ = this.attractionService.getReviews(attractionId); // ✅ Observable
    }
  }

  /**
   * Envoie une critique pour une attraction.
   */
  public submitReview(attractionId: number | null): void {
    if (attractionId === null || this.reviewNote <= 0 || this.reviewComment.trim() === '') {
      console.error("❌ Erreur : Tous les champs sont obligatoires.");
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
    /**
   * Optimisation du *ngFor pour éviter les re-rendu inutiles
   */
  trackByAttractionId(index: number, attraction: AttractionInterface): number {
    return attraction.attraction_id ?? index; // ✅ Utilise l'index si `attraction_id` est null
  }

  trackByReviewId(index: number, review: ReviewInterface): number {
    return review.id ?? index; // ✅ Utilise l'index si `id` est null
  }
}
