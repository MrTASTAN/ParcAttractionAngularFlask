import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { AttractionService } from '../Service/attraction.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatButtonModule, MatCardModule, MatSnackBarModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  
  public formulaireAttractions: FormGroup[] = [];
  public attractions: Observable<AttractionInterface[]>;

  constructor(
    public attractionService: AttractionService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    // ✅ Correction de l'appel à `getAllAttractions()`
    this.attractions = this.attractionService.getAllAttractions().pipe(
      tap((attractions: AttractionInterface[]) => {
        attractions.forEach(attraction => {
          this.formulaireAttractions.push(
            new FormGroup({
              attraction_id: new FormControl(attraction.attraction_id, { nonNullable: true }),
              nom: new FormControl(attraction.nom, [Validators.required]),
              description: new FormControl(attraction.description, [Validators.required]),
              difficulte: new FormControl(attraction.difficulte),
              visible: new FormControl(attraction.visible)
            })
          );
        });
      })
    );
  }

  /**
   * ✅ Met à jour une attraction
   */
  public onSubmit(attractionFormulaire: FormGroup) {
    if (attractionFormulaire.valid) {
      this.attractionService.updateAttraction(attractionFormulaire.getRawValue()).subscribe(result => {
        this._snackBar.open(result.message, undefined, {
          duration: 1000
        });
      });
    }
  }

  /**
   * ✅ Modifie la visibilité d'une attraction
   */
  public toggleVisibility(attractionFormulaire: FormGroup) {
    const attraction = attractionFormulaire.getRawValue();
    
    if (typeof attraction.attraction_id !== "number") {
      console.error("❌ Erreur: attraction_id est invalide.");
      return;
    }

    attraction.visible = !attraction.visible;
    this.attractionService.updateAttractionVisibility(attraction.attraction_id, attraction.visible).subscribe(result => {
      this._snackBar.open(result.message, undefined, {
        duration: 1000
      });
    });
  }

  /**
   * ✅ Ajoute une nouvelle attraction au formulaire
   */
  public addAttraction() {
    this.formulaireAttractions.push(
      new FormGroup({
        attraction_id: new FormControl(null),
        nom: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        difficulte: new FormControl(),
        visible: new FormControl(true)
      })
    );
  }
}
