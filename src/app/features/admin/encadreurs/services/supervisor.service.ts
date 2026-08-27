import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supervisor } from '../interfaces/supervisor.model';

@Injectable({ providedIn: 'root' })
export class SupervisorService {
  readonly backendAvailable = false;
  readonly unavailableMessage = 'Le module encadreurs n’est pas encore exposé par Back.';
  listLocalState(): Observable<Supervisor[]> { return of([]); }
}
