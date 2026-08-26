import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthStateService } from '../../../../../core/services/auth-state.service';

@Component({
  selector: 'app-espace-encadrant',
  imports: [],
  templateUrl: './espace-encadrant.html',
  styleUrl: './espace-encadrant.css',
})
export class EspaceEncadrant {
  private readonly routeData = toSignal(inject(ActivatedRoute).data, {
    initialValue: { view: 'overview' },
  });
  private readonly authState = inject(AuthStateService);

  readonly user = this.authState.user;
  readonly view = computed(() => this.routeData()['view'] as string);
  readonly pageTitle = computed(() => ({
    overview: 'Espace encadrant',
    stagiaires: 'Mes stagiaires',
    validations: 'Validations',
    evaluations: 'Évaluations',
  })[this.view()] ?? 'Espace encadrant');
  readonly pageSubtitle = computed(() => ({
    overview: 'Suivez les stages qui vous sont confiés et les actions prioritaires.',
    stagiaires: 'Consultez la progression et les prochaines échéances de vos stagiaires.',
    validations: 'Vérifiez les livrables et apportez votre retour pédagogique.',
    evaluations: 'Préparez et complétez les évaluations de fin de stage.',
  })[this.view()] ?? '');

  readonly interns = [
    { name: 'Moussa Traoré', project: 'Supervision réseau', progress: 72, status: 'En cours', next: 'Rapport — 28 août' },
    { name: 'Aïssata Dembélé', project: 'Portail RH', progress: 48, status: 'En cours', next: 'Point hebdo — 30 août' },
    { name: 'Oumar Konaté', project: 'Audit cybersécurité', progress: 91, status: 'Finalisation', next: 'Soutenance — 05 sept.' },
  ];

  readonly validations = [
    { title: 'Rapport intermédiaire', owner: 'Moussa Traoré', date: 'Déposé aujourd’hui', type: 'PDF' },
    { title: 'Cahier des charges', owner: 'Aïssata Dembélé', date: 'Déposé hier', type: 'DOCX' },
    { title: 'Support de soutenance', owner: 'Oumar Konaté', date: 'Déposé le 24 août', type: 'PPTX' },
  ];
}
