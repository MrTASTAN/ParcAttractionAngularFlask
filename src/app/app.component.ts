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
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from './Service/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule, // ✅ Ajouté pour éviter l'erreur mat-toolbar
    RouterModule, // ✅ Ajouté pour éviter l'erreur router-outlet
    TranslateModule, // ✅ Ajouté pour éviter l'erreur translate pipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public visibleAttractions$: Observable<AttractionInterface[]> = of([]);
  public reviews$: Observable<ReviewInterface[]> = of([]);
  public selectedAttractionId?: number;

  // Gestion des erreurs
  public errorMessageAttractions?: string;
  public errorMessageReviews?: string;

  // Variables pour le formulaire de critique
  public reviewNote = 0;
  public reviewComment = '';
  public reviewNom?: string;
  public reviewPrenom?: string;

  constructor(
    public attractionService: AttractionService,
    private translateService: TranslateService,
    public authService: AuthService
  ) {
    this.loadVisibleAttractions();
    this.setDefaultLanguage();
  }

  /**
   * ✅ Définit la langue par défaut et charge la langue enregistrée
   */
  private setDefaultLanguage(): void {
    this.translateService.setDefaultLang('fr');

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.translateService.use(savedLang);
    }
  }

  /**
   * ✅ Change la langue et sauvegarde la préférence utilisateur
   */
  public switchLang(lang: string): void {
    this.translateService.use(lang);
    localStorage.setItem('lang', lang);
  }

  /**
   * ✅ Charge les attractions visibles avec gestion des erreurs.
   */
  private loadVisibleAttractions(): void {
    this.errorMessageAttractions = undefined;
    this.visibleAttractions$ = this.attractionService.getVisibleAttractions().pipe(
      catchError(error => {
        console.error('❌ Erreur lors de la récupération des attractions :', error);
        this.errorMessageAttractions = 'Erreur lors du chargement des attractions. Veuillez réessayer.';
        return of([]);
      })
    );
  }

  /**
   * ✅ Affiche les critiques d'une attraction avec gestion des erreurs.
   */
  public showReviews(attractionId: number | null): void {
    if (attractionId !== null) {
      this.selectedAttractionId = attractionId;
      this.errorMessageReviews = undefined;

      this.reviews$ = this.attractionService.getReviews(attractionId).pipe(
        catchError(error => {
          console.error(`❌ Erreur lors de la récupération des critiques pour l'attraction ${attractionId} :`, error);
          this.errorMessageReviews = 'Impossible de récupérer les critiques.';
          return of([]);
        })
      );
    }
  }

  /**
   * ✅ Envoie une critique avec gestion des erreurs.
   */
  public submitReview(attractionId: number): void {
    if (!attractionId) {
      console.error('❌ Erreur : attractionId est null.');
      return;
    }

    const newReview: ReviewInterface = {
      id: undefined,
      attraction_id: attractionId,
      note: this.reviewNote,
      commentaire: this.reviewComment,
      nom: this.reviewNom,
      prenom: this.reviewPrenom,
    };

    this.attractionService.postReview(newReview).subscribe(
      () => {
        console.log('✅ Critique envoyée avec succès :', newReview);
        this.showReviews(attractionId);
        this.resetReviewForm();
      },
      error => {
        console.error('❌ Erreur lors de l\'envoi de la critique :', error);
        alert('Erreur lors de l\'envoi de la critique. Veuillez réessayer.');
      }
    );
  }

  /**
   * ✅ Réinitialise le formulaire après soumission.
   */
  private resetReviewForm(): void {
    this.reviewNote = 0;
    this.reviewComment = '';
    this.reviewNom = undefined;
    this.reviewPrenom = undefined;
  }

  /**
   * ✅ Gestion du changement de langue
   */
  public changeLanguage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const lang = target.value;
      this.translateService.use(lang);
      localStorage.setItem('lang', lang);
    }
  }

  /**
   * ✅ Déconnexion utilisateur
   */
  public logout(): void {
    this.authService.logout();
  }

  /**
   * ✅ Optimisation du *ngFor pour éviter les re-rendu inutiles
   */
  trackByAttractionId(index: number, attraction: AttractionInterface): number {
    return attraction.attraction_id ?? index;
  }

  trackByReviewId(index: number, review: ReviewInterface): number {
    return review.id ?? index;
  }
}
