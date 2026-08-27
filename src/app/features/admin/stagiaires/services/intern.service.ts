import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Intern } from '../interfaces/intern.model';

@Injectable({ providedIn: 'root' })
export class InternService {
  readonly backendAvailable = false;
  readonly unavailableMessage = 'Le module stagiaires n’est pas encore exposé par Back.';
  listLocalState(): Observable<Intern[]> { return of([]); }
}
