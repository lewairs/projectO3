import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthStateService } from '../../../../../core/services/auth-state.service';

@Component({
  selector: 'app-espace-stagiaire',
  imports: [],
  templateUrl: './espace-stagiaire.html',
  styleUrl: './espace-stagiaire.css',
})
export class EspaceStagiaire {
  private readonly routeData = toSignal(inject(ActivatedRoute).data, {
    initialValue: { view: 'overview' },
  });
  private readonly authState = inject(AuthStateService);

  readonly user = this.authState.user;
  readonly view = computed(() => this.routeData()['view'] as string);
  readonly pageTitle = computed(() => ({
    overview: 'Mon espace de stage',
    stage: 'Mon stage',
    livrables: 'Mes livrables',
    documents: 'Mes documents',
  })[this.view()] ?? 'Mon espace de stage');
  readonly pageSubtitle = computed(() => ({
    overview: 'Retrouvez votre progression, vos échéances et les informations utiles.',
    stage: 'Consultez les informations et les étapes clés de votre parcours.',
    livrables: 'Déposez vos travaux et suivez leur état de validation.',
    documents: 'Accédez aux documents administratifs liés à votre stage.',
  })[this.view()] ?? '');

  readonly deliverables = [
    { name: 'Cahier des charges', date: '12 août 2026', status: 'Validé', type: 'DOCX' },
    { name: 'Rapport intermédiaire', date: '25 août 2026', status: 'En attente', type: 'PDF' },
    { name: 'Support de soutenance', date: '05 septembre 2026', status: 'À déposer', type: 'PPTX' },
  ];

  readonly documents = [
    { name: 'Convention de stage', description: 'Convention signée par les parties', type: 'PDF' },
    { name: 'Charte informatique', description: 'Règles d’utilisation des ressources', type: 'PDF' },
    { name: 'Attestation de présence', description: 'Document mensuel — août 2026', type: 'PDF' },
  ];
}
