import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { homeUrlFor } from '../../../../core/auth/auth-navigation';
import { AuthStateService } from '../../../../core/services/auth-state.service';

@Component({
  selector: 'app-access-denied',
  imports: [RouterLink],
  template: `
    <main class="access-denied">
      <p class="code">403</p>
      <h1>Accès refusé</h1>
      <p>Votre compte ne possède pas la permission nécessaire.</p>
      <a [routerLink]="homeUrl()">Retour à mon espace</a>
    </main>
  `,
  styles: `
    .access-denied { min-height: 100vh; display: grid; place-content: center; text-align: center; padding: 2rem; }
    .code { margin: 0; color: #f16e00; font-size: 4rem; font-weight: 800; }
    a { color: #b34f00; font-weight: 700; }
  `,
})
export class AccessDenied {
  private readonly state = inject(AuthStateService);
  readonly homeUrl = computed(() => homeUrlFor(this.state.user()));
}
