import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../interfaces/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  readonly backendAvailable = false;
  readonly unavailableMessage = 'Le module projets n’est pas encore exposé par Back.';
  listLocalState(): Observable<Project[]> { return of([]); }
}
