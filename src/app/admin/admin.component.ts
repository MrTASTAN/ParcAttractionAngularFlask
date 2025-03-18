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
import { MatIconModule } from '@angular/material/icon'; // ✅ Ajout du module pour éviter l'erreur

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatSlideToggleModule, MatButtonModule, MatCardModule, MatSnackBarModule,
    MatIconModule // ✅ Ajout ici
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  
  public formulaireAttractions: FormGroup[] = [];
  public attractions$: Observable<AttractionInterface[]>; // ✅ Correction : ajout du "$"

  constructor(
    public attractionService: AttractionService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    // ✅ Correction de l'appel avec `attractions$`
    this.attractions$ = this.attractionService.getAllAttractions().pipe(
      tap((attractions: AttractionInterface[]) => {
        this.formulaireAttractions = attractions.map(attraction =>
          new FormGroup({
            attraction_id: new FormControl(attraction.attraction_id, { nonNullable: true }),
            nom: new FormControl(attraction.nom, [Validators.required]),
            description: new FormControl(attraction.description, [Validators.required]),
            difficulte: new FormControl(attraction.difficulte, [Validators.min(1), Validators.max(5)]),
            visible: new FormControl(attraction.visible)
          })
        );
      })
    );
  }

  public onSubmit(attractionFormulaire: FormGroup) {
    if (attractionFormulaire.valid) {
      const updatedAttraction = attractionFormulaire.getRawValue();
      this.attractionService.updateAttraction(updatedAttraction).subscribe(result => {
        this._snackBar.open(result.message || 'Attraction mise à jour avec succès', 'Fermer', { duration: 1500 });
      });
    } else {
      this._snackBar.open("Veuillez remplir correctement tous les champs.", "Fermer", { duration: 1500 });
    }
  }

  public toggleVisibility(attractionFormulaire: FormGroup) {
    const attraction = attractionFormulaire.getRawValue();
    if (typeof attraction.attraction_id !== "number") {
      console.error("❌ Erreur: attraction_id invalide.");
      return;
    }
    attraction.visible = !attraction.visible;
    this.attractionService.updateAttractionVisibility(attraction.attraction_id, attraction.visible).subscribe(result => {
      this._snackBar.open(result.message || "Visibilité modifiée", "Fermer", { duration: 1500 });
    });
  }

  public addAttraction() {
    this.formulaireAttractions.push(
      new FormGroup({
        attraction_id: new FormControl(null),
        nom: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
        difficulte: new FormControl(1, [Validators.min(1), Validators.max(5)]),
        visible: new FormControl(true)
      })
    );
  }

  public trackByFn(index: number, item: FormGroup): number {
    return item.get('attraction_id')?.value ?? index;
  }
}
