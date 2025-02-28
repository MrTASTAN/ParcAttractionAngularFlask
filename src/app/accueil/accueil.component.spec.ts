import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilComponent } from './accueil.component';
import { AttractionService } from '../Service/attraction.service';
import { Observable, of } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { ReviewInterface } from '../Interface/review.interface';
import { By } from '@angular/platform-browser';

describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;
  let mockAttractionService: jasmine.SpyObj<AttractionService>;

  beforeEach(async () => {
    // Mock des données des attractions
    const mockAttractions: AttractionInterface[] = [
      { attraction_id: 1, nom: 'Roller Coaster', description: 'Sensations fortes', difficulte: 5, visible: true },
      { attraction_id: 2, nom: 'Grande Roue', description: 'Vue panoramique', difficulte: 2, visible: true }
    ];

    // Mock des données des critiques
    const mockReviews: ReviewInterface[] = [
      { id: 1, attraction_id: 1, note: 5, commentaire: 'Incroyable!', nom: 'Jean', prenom: 'Dupont' },
      { id: 2, attraction_id: 1, note: 4, commentaire: 'Très sympa.', nom: 'Sophie', prenom: 'Martin' }
    ];

    // Création d'un mock du service AttractionService
    mockAttractionService = jasmine.createSpyObj('AttractionService', ['getVisibleAttractions', 'getReviews']);
    mockAttractionService.getVisibleAttractions.and.returnValue(of(mockAttractions));
    mockAttractionService.getReviews.and.returnValue(of(mockReviews));

    await TestBed.configureTestingModule({
      imports: [AccueilComponent],
      providers: [{ provide: AttractionService, useValue: mockAttractionService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de la création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de l'affichage des attractions visibles
  it('should display visible attractions', () => {
    const compiled = fixture.nativeElement;
    const attractions = compiled.querySelectorAll('.attraction');

    expect(attractions.length).toBe(2);
    expect(attractions[0].textContent).toContain('Roller Coaster');
    expect(attractions[1].textContent).toContain('Grande Roue');
  });

  // Test de l'affichage des critiques après un clic
  it('should show reviews when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selectedAttractionId).toBe(1);
    expect(mockAttractionService.getReviews).toHaveBeenCalledWith(1);

    const reviews = fixture.nativeElement.querySelectorAll('p');
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0].textContent).toContain('Incroyable!');
  });
});
