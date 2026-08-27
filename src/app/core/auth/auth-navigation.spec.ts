import { describe, expect, it } from 'vitest';

import { AuthenticatedUser } from '../../interfaces/user';
import { homeUrlFor } from './auth-navigation';

const user = (
  role: string,
  permissions: string[] = [],
  mustChangePassword = false,
): AuthenticatedUser => ({
  id: 'user-id',
  employeeId: 'employee-id',
  employeeNumber: 'EMP-001',
  firstName: 'Utilisateur',
  lastName: 'Test',
  email: 'test@example.com',
  position: null,
  department: null,
  role,
  permissions,
  mustChangePassword,
});

describe('homeUrlFor', () => {
  it('sends unauthenticated visitors to login', () => {
    expect(homeUrlFor(null)).toBe('/login');
  });

  it('keeps simple users in their dashboard without sidebar', () => {
    expect(homeUrlFor(user('UTILISATEUR', ['dashboard.read']))).toBe('/espace-utilisateur');
  });

  it('uses the first permitted management page for a custom role', () => {
    expect(homeUrlFor(user('CHEF_PROJET', ['projects.read']))).toBe('/dashboard/projets');
  });

  it('forces password renewal before any workspace', () => {
    expect(homeUrlFor(user('ADMINISTRATEUR', ['dashboard.read'], true))).toBe('/changer-mot-de-passe');
  });
});
