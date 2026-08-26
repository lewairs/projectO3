import { Injectable, computed, signal } from '@angular/core';

import { AuthenticatedUser } from '../../interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly userSignal = signal<AuthenticatedUser | null>(null);
  private readonly initializedSignal = signal(false);

  readonly accessToken = this.accessTokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly initialized = this.initializedSignal.asReadonly();
  readonly isAuthenticated = computed(
    () => this.accessTokenSignal() !== null && this.userSignal() !== null,
  );

  setSession(accessToken: string, user: AuthenticatedUser): void {
    this.accessTokenSignal.set(accessToken);
    this.userSignal.set(user);
  }

  setAccessToken(accessToken: string): void {
    this.accessTokenSignal.set(accessToken);
  }

  setUser(user: AuthenticatedUser): void {
    this.userSignal.set(user);
  }

  markInitialized(): void {
    this.initializedSignal.set(true);
  }

  hasPermission(permission: string): boolean {
    return this.userSignal()?.permissions.includes(permission) ?? false;
  }

  hasRole(roles: readonly string[]): boolean {
    const role = this.userSignal()?.role;
    return role ? roles.includes(role) : false;
  }

  clear(): void {
    this.accessTokenSignal.set(null);
    this.userSignal.set(null);
  }
}
