import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Internship } from '../interfaces/internship.model';

@Injectable({ providedIn: 'root' })
export class InternshipService {
  readonly backendAvailable = false;
  readonly unavailableMessage = 'Le module stages n’est pas encore exposé par Back.';
  listLocalState(): Observable<Internship[]> { return of([]); }
}
