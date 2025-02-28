import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AttractionService } from './attraction.service';
import { AttractionInterface } from '../Interface/attraction.interface';
import { ReviewInterface } from '../Interface/review.interface';

describe('AttractionService', () => {
  let service: AttractionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttractionService]
    });

    service = TestBed.inject(AttractionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête n'est en attente après chaque test
  });

  // ✅ Test : Récupérer les attractions visibles
  it('should fetch visible attractions', () => {
    const mockAttractions: AttractionInterface[] = [
      { attraction_id: 1, nom: 'Roller Coaster', description: 'Sensations fortes', difficulte: 5, visible: true },
      { attraction_id: 2, nom: 'Grande Roue', description: 'Vue panoramique', difficulte: 2, visible: true }
    ];

    service.getVisibleAttractions().subscribe((attractions) => {
      expect(attractions.length).toBe(2);
      expect(attractions).toEqual(mockAttractions);
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/attraction/visible');
    expect(req.request.method).toBe('GET');
    req.flush(mockAttractions);
  });

  // ✅ Test : Récupérer les critiques d'une attraction
  it('should fetch reviews for an attraction', () => {
    const attractionId = 1;
    const mockReviews: ReviewInterface[] = [
      { id: 1, attraction_id: 1, note: 5, commentaire: 'Superbe attraction!', nom: 'Alice', prenom: 'Dupont' },
      { id: 2, attraction_id: 1, note: 4, commentaire: 'Très bon moment.', nom: 'Bob', prenom: 'Martin' }
    ];

    service.getReviews(attractionId).subscribe((reviews) => {
      expect(reviews.length).toBe(2);
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`http://127.0.0.1:5000/attraction/${attractionId}/reviews`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
  });

  // ✅ Test : Ajouter une critique
  it('should add a review', () => {
    const newReview: ReviewInterface = {
      id: null,
      attraction_id: 1,
      note: 5,
      commentaire: 'Expérience incroyable!',
      nom: 'Charlie',
      prenom: 'Lemoine'
    };

    service.postReview(newReview).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://127.0.0.1:5000/reviews');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newReview);
    req.flush({ success: true });
  });
});
