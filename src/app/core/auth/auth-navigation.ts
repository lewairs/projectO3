import { AuthenticatedUser } from '../../interfaces/user';

const MANAGEMENT_LANDING_ROUTES: ReadonlyArray<[string, string]> = [
  ['dashboard.read', '/dashboard'],
  ['interns.read', '/dashboard/stagiaires'],
  ['internships.read', '/dashboard/stages'],
  ['projects.read', '/dashboard/projets'],
  ['project-assignments.read', '/dashboard/affectations'],
  ['departments.read', '/dashboard/departements'],
  ['supervisors.read', '/dashboard/encadreurs'],
  ['authorities.read', '/dashboard/autorites'],
  ['positions.read', '/dashboard/postes'],
  ['employees.read', '/dashboard/employes'],
  ['users.read', '/dashboard/utilisateurs'],
  ['roles.read', '/dashboard/roles'],
  ['audit-logs.read', '/dashboard/journal-audit'],
];

export function homeUrlFor(user: AuthenticatedUser | null): string {
  if (!user) return '/login';
  if (user.mustChangePassword) return '/changer-mot-de-passe';
  if (user.role === 'UTILISATEUR') return '/espace-utilisateur';
  const permissions = new Set(user.permissions);
  return MANAGEMENT_LANDING_ROUTES.find(([permission]) => permissions.has(permission))?.[1]
    ?? '/acces-refuse';
}
