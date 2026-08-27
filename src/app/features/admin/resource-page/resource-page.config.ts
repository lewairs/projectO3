export type ResourceFieldType =
  | 'text'
  | 'email'
  | 'url'
  | 'date'
  | 'number'
  | 'textarea'
  | 'select';

export interface ResourceRecord {
  id: string;
  [key: string]: unknown;
}

export interface ResourceColumn {
  label: string;
  path?: string;
  value?: (record: ResourceRecord) => string;
}

export interface ResourceField {
  name: string;
  label: string;
  type: ResourceFieldType;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number;
  nullable?: boolean;
  options?: Array<{ value: string; label: string }>;
  optionsEndpoint?: string;
  optionLabel?: (record: ResourceRecord) => string;
  filterPath?: string;
  filterValue?: (record: ResourceRecord) => string;
}

export interface ResourcePageConfig {
  key: string;
  title: string;
  eyebrow: string;
  description: string;
  endpoint: string;
  permissionPrefix: string;
  itemLabel: string;
  columns: ResourceColumn[];
  fields: ResourceField[];
  filters?: ResourceField[];
  searchPaths: string[];
  responseItemsPath?: string;
  readOnly?: boolean;
  createLabel?: string;
}

const statusOptions = [
  { value: 'PLANNED', label: 'Planifié' },
  { value: 'ONGOING', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'CANCELLED', label: 'Annulé' },
];

const projectStatusOptions = [
  ...statusOptions,
  { value: 'ON_HOLD', label: 'En attente' },
];

const assignmentStatusOptions = [
  { value: 'ASSIGNED', label: 'Affecté' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'REMOVED', label: 'Retiré' },
];

const fullName = (record: ResourceRecord): string =>
  `${String(record['firstName'] ?? '')} ${String(record['lastName'] ?? '')}`.trim();

export const RESOURCE_CONFIGS: Record<string, ResourcePageConfig> = {
  departments: {
    key: 'departments',
    title: 'Départements',
    eyebrow: 'Organisation',
    description: 'Référentiel des départements. La création et la modification se font dans une fenêtre modale.',
    endpoint: '/departments',
    permissionPrefix: 'departments',
    itemLabel: 'département',
    searchPaths: ['code', 'name', 'description'],
    columns: [
      { label: 'Code', path: 'code' },
      { label: 'Nom', path: 'name' },
      { label: 'Description', path: 'description' },
    ],
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, maxLength: 20 },
      { name: 'name', label: 'Nom', type: 'text', required: true, maxLength: 150 },
      { name: 'description', label: 'Description', type: 'textarea', nullable: true },
    ],
  },
  employees: {
    key: 'employees',
    title: 'Employés',
    eyebrow: 'Organisation',
    description: 'Annuaire des employés, de leurs postes et départements.',
    endpoint: '/employees',
    permissionPrefix: 'employees',
    itemLabel: 'employé',
    searchPaths: ['employeeNumber', 'firstName', 'lastName', 'email', 'position.name', 'department.name'],
    columns: [
      { label: 'Matricule', path: 'employeeNumber' },
      { label: 'Nom complet', value: fullName },
      { label: 'Email', path: 'email' },
      { label: 'Téléphone', path: 'phone' },
      { label: 'Poste', path: 'position.name' },
      { label: 'Département', path: 'department.name' },
    ],
    fields: [
      { name: 'employeeNumber', label: 'Matricule', type: 'text', required: true, maxLength: 50 },
      { name: 'firstName', label: 'Prénom', type: 'text', required: true, maxLength: 100 },
      { name: 'lastName', label: 'Nom', type: 'text', required: true, maxLength: 100 },
      { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 255 },
      { name: 'phone', label: 'Téléphone', type: 'text', nullable: true, maxLength: 30 },
      { name: 'positionId', label: 'Poste', type: 'select', required: true, optionsEndpoint: '/positions', optionLabel: (item) => `${item['code']} — ${item['name']}` },
      { name: 'departmentId', label: 'Département', type: 'select', required: true, optionsEndpoint: '/departments', optionLabel: (item) => `${item['code']} — ${item['name']}` },
    ],
  },
  positions: {
    key: 'positions',
    title: 'Postes',
    eyebrow: 'Organisation',
    description: 'Catalogue des fonctions professionnelles de l’entreprise.',
    endpoint: '/positions',
    permissionPrefix: 'positions',
    itemLabel: 'poste',
    searchPaths: ['code', 'name', 'description'],
    columns: [
      { label: 'Code', path: 'code' },
      { label: 'Nom', path: 'name' },
      { label: 'Description', path: 'description' },
      { label: 'Employés actifs', path: '_count.employees' },
    ],
    fields: [
      { name: 'code', label: 'Code', type: 'text', required: true, maxLength: 30 },
      { name: 'name', label: 'Nom', type: 'text', required: true, maxLength: 150 },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  interns: {
    key: 'interns',
    title: 'Stagiaires',
    eyebrow: 'Gestion',
    description: 'Identité, coordonnées et parcours scolaire des stagiaires.',
    endpoint: '/interns',
    permissionPrefix: 'interns',
    itemLabel: 'stagiaire',
    searchPaths: ['registrationCode', 'firstName', 'lastName', 'email', 'school'],
    columns: [
      { label: 'Matricule', path: 'registrationCode' },
      { label: 'Nom complet', value: fullName },
      { label: 'Email', path: 'email' },
      { label: 'Téléphone', path: 'phone' },
      { label: 'École', path: 'school' },
      { label: 'Filière', path: 'fieldOfStudy' },
      { label: 'Niveau', path: 'educationLevel' },
    ],
    fields: [
      { name: 'firstName', label: 'Prénom', type: 'text', required: true, maxLength: 100 },
      { name: 'lastName', label: 'Nom', type: 'text', required: true, maxLength: 100 },
      { name: 'dateOfBirth', label: 'Date de naissance', type: 'date', required: true },
      { name: 'gender', label: 'Genre', type: 'select', required: true, options: [{ value: 'MALE', label: 'Homme' }, { value: 'FEMALE', label: 'Femme' }] },
      { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 255 },
      { name: 'phone', label: 'Téléphone', type: 'text', required: true, maxLength: 30 },
      { name: 'address', label: 'Adresse', type: 'textarea' },
      { name: 'school', label: 'École', type: 'text', required: true, maxLength: 200 },
      { name: 'fieldOfStudy', label: 'Filière', type: 'text', required: true, maxLength: 200 },
      { name: 'educationLevel', label: 'Niveau d’études', type: 'select', required: true, options: [{ value: 'LICENCE', label: 'Licence' }, { value: 'MASTER', label: 'Master' }] },
      { name: 'studyYear', label: 'Année d’étude', type: 'number', required: true, min: 1, max: 10 },
      { name: 'emergencyContactName', label: 'Contact d’urgence', type: 'text', maxLength: 200 },
      { name: 'emergencyContactPhone', label: 'Téléphone du contact', type: 'text', maxLength: 30 },
    ],
  },
  supervisors: {
    key: 'supervisors',
    title: 'Encadreurs',
    eyebrow: 'Gestion',
    description: 'Profils d’encadrement portés par des employés actifs.',
    endpoint: '/supervisors',
    permissionPrefix: 'supervisors',
    itemLabel: 'encadreur',
    searchPaths: ['employee.employeeNumber', 'employee.firstName', 'employee.lastName', 'employee.department.name'],
    columns: [
      { label: 'Matricule', path: 'employee.employeeNumber' },
      { label: 'Nom complet', value: (item) => `${String(item['employee'] && (item['employee'] as ResourceRecord)['firstName'] || '')} ${String(item['employee'] && (item['employee'] as ResourceRecord)['lastName'] || '')}` },
      { label: 'Email', path: 'employee.email' },
      { label: 'Poste', path: 'employee.position.name' },
      { label: 'Département', path: 'employee.department.name' },
    ],
    fields: [
      { name: 'employeeId', label: 'Employé', type: 'select', required: true, optionsEndpoint: '/employees', optionLabel: (item) => `${item['employeeNumber']} — ${item['firstName']} ${item['lastName']}` },
    ],
  },
  authorities: {
    key: 'authorities',
    title: 'Autorités de tutelle',
    eyebrow: 'Gestion',
    description: 'Autorités signataires associées aux employés.',
    endpoint: '/authorities',
    permissionPrefix: 'authorities',
    itemLabel: 'autorité',
    searchPaths: ['name', 'email', 'signingTitle', 'department.name'],
    columns: [
      { label: 'Nom', path: 'name' },
      { label: 'Email', path: 'email' },
      { label: 'Titre de signature', path: 'signingTitle' },
      { label: 'Employé', value: (item) => `${String(item['employee'] && (item['employee'] as ResourceRecord)['firstName'] || '')} ${String(item['employee'] && (item['employee'] as ResourceRecord)['lastName'] || '')}` },
      { label: 'Département', path: 'department.name' },
    ],
    fields: [
      { name: 'employeeId', label: 'Employé', type: 'select', required: true, optionsEndpoint: '/employees', optionLabel: (item) => `${item['employeeNumber']} — ${item['firstName']} ${item['lastName']}` },
      { name: 'departmentId', label: 'Département', type: 'select', nullable: true, optionsEndpoint: '/departments', optionLabel: (item) => `${item['code']} — ${item['name']}` },
      { name: 'name', label: 'Nom d’affichage', type: 'text', required: true, maxLength: 200 },
      { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 255 },
      { name: 'signingTitle', label: 'Titre de signature', type: 'text', required: true, maxLength: 150 },
    ],
  },
  internships: {
    key: 'internships',
    title: 'Stages',
    eyebrow: 'Gestion',
    description: 'Périodes de stage, affectations internes et suivi des statuts.',
    endpoint: '/internships',
    permissionPrefix: 'internships',
    itemLabel: 'stage',
    searchPaths: ['referenceCode', 'title', 'intern.firstName', 'intern.lastName', 'department.name'],
    columns: [
      { label: 'Référence', path: 'referenceCode' },
      { label: 'Stagiaire', value: (item) => `${String(item['intern'] && (item['intern'] as ResourceRecord)['firstName'] || '')} ${String(item['intern'] && (item['intern'] as ResourceRecord)['lastName'] || '')}` },
      { label: 'Titre', path: 'title' },
      { label: 'Type', path: 'internshipType' },
      { label: 'Début', path: 'startDate' },
      { label: 'Fin', path: 'endDate' },
      { label: 'Département', path: 'department.name' },
      { label: 'Statut', path: 'status' },
      { label: 'Note', path: 'grade' },
    ],
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true, maxLength: 200 },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'startDate', label: 'Date de début', type: 'date', required: true },
      { name: 'endDate', label: 'Date de fin', type: 'date', required: true },
      { name: 'status', label: 'Statut', type: 'select', defaultValue: 'PLANNED', options: statusOptions },
      { name: 'internshipType', label: 'Type', type: 'select', required: true, options: [{ value: 'ACADEMIC', label: 'Stage académique' }, { value: 'PROFESSIONAL', label: 'Stage professionnel' }] },
      { name: 'monthlyAllowance', label: 'Indemnité mensuelle', type: 'number', min: 0, step: 0.01, nullable: true },
      { name: 'currency', label: 'Devise', type: 'text', defaultValue: 'XOF', maxLength: 3 },
      { name: 'workLocation', label: 'Lieu de travail', type: 'text', required: true, maxLength: 200 },
      { name: 'internId', label: 'Stagiaire', type: 'select', required: true, optionsEndpoint: '/interns', optionLabel: (item) => `${item['registrationCode']} — ${item['firstName']} ${item['lastName']}` },
      { name: 'departmentId', label: 'Département', type: 'select', required: true, optionsEndpoint: '/departments', optionLabel: (item) => `${item['code']} — ${item['name']}` },
      { name: 'supervisorId', label: 'Encadreur', type: 'select', required: true, optionsEndpoint: '/supervisors', optionLabel: (item) => { const employee = item['employee'] as ResourceRecord; return `${employee?.['firstName'] ?? ''} ${employee?.['lastName'] ?? ''}`; } },
      { name: 'authorityId', label: 'Autorité', type: 'select', nullable: true, optionsEndpoint: '/authorities', optionLabel: (item) => String(item['name'] ?? '') },
      { name: 'grade', label: 'Note sur 20', type: 'number', min: 0, max: 20, nullable: true },
    ],
  },
  projects: {
    key: 'projects',
    title: 'Projets',
    eyebrow: 'Gestion',
    description: 'Projets de l’entreprise confiés dans le cadre des stages.',
    endpoint: '/projects',
    permissionPrefix: 'projects',
    itemLabel: 'projet',
    searchPaths: ['projectCode', 'name', 'description', 'department.name'],
    columns: [
      { label: 'Code', path: 'projectCode' },
      { label: 'Nom', path: 'name' },
      { label: 'Département', path: 'department.name' },
      { label: 'Début', path: 'startDate' },
      { label: 'Fin', path: 'endDate' },
      { label: 'Statut', path: 'status' },
      { label: 'Affectations', path: '_count.projectAssignments' },
    ],
    fields: [
      { name: 'name', label: 'Nom', type: 'text', required: true, maxLength: 200 },
      { name: 'description', label: 'Description', type: 'textarea', nullable: true },
      { name: 'gitlabLink', label: 'Lien GitLab', type: 'url', maxLength: 500, nullable: true },
      { name: 'startDate', label: 'Date de début', type: 'date', required: true },
      { name: 'endDate', label: 'Date de fin', type: 'date', required: true },
      { name: 'status', label: 'Statut', type: 'select', defaultValue: 'PLANNED', options: projectStatusOptions },
      { name: 'departmentId', label: 'Département', type: 'select', required: true, optionsEndpoint: '/departments', optionLabel: (item) => `${item['code']} — ${item['name']}` },
    ],
  },
  assignments: {
    key: 'assignments',
    title: 'Affectations',
    eyebrow: 'Gestion',
    description: 'Affectation des stages aux projets et suivi du travail confié.',
    endpoint: '/project-assignments',
    permissionPrefix: 'project-assignments',
    itemLabel: 'affectation',
    searchPaths: ['role', 'internship.referenceCode', 'project.projectCode', 'project.name'],
    columns: [
      { label: 'Stage', path: 'internship.referenceCode' },
      { label: 'Stagiaire', value: (item) => { const internship = item['internship'] as ResourceRecord; const intern = internship?.['intern'] as ResourceRecord; return `${intern?.['firstName'] ?? ''} ${intern?.['lastName'] ?? ''}`; } },
      { label: 'Projet', path: 'project.name' },
      { label: 'Rôle', path: 'role' },
      { label: 'Début', path: 'startDate' },
      { label: 'Fin', path: 'endDate' },
      { label: 'Statut', path: 'status' },
    ],
    fields: [
      { name: 'internshipId', label: 'Stage', type: 'select', required: true, optionsEndpoint: '/internships', optionLabel: (item) => `${item['referenceCode']} — ${item['title']}` },
      { name: 'projectId', label: 'Projet', type: 'select', required: true, optionsEndpoint: '/projects', optionLabel: (item) => `${item['projectCode']} — ${item['name']}` },
      { name: 'role', label: 'Rôle confié', type: 'text', required: true, maxLength: 150 },
      { name: 'startDate', label: 'Date de début', type: 'date', required: true },
      { name: 'endDate', label: 'Date de fin', type: 'date', required: true },
      { name: 'status', label: 'Statut', type: 'select', defaultValue: 'ASSIGNED', options: assignmentStatusOptions },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  tracking: {
    key: 'tracking',
    title: 'Suivi des stages',
    eyebrow: 'Pilotage',
    description: 'Vue consolidée des stages et de leurs projets.',
    endpoint: '/internships/tracking?limit=100',
    permissionPrefix: 'internships',
    itemLabel: 'stage',
    readOnly: true,
    responseItemsPath: 'items',
    searchPaths: ['referenceCode', 'title', 'intern.firstName', 'intern.lastName', 'department.name'],
    columns: [
      { label: 'Référence', path: 'referenceCode' },
      { label: 'Stagiaire', value: (item) => { const intern = item['intern'] as ResourceRecord; return `${intern?.['firstName'] ?? ''} ${intern?.['lastName'] ?? ''}`; } },
      { label: 'Titre', path: 'title' },
      { label: 'Département', path: 'department.name' },
      { label: 'Statut', path: 'status' },
      { label: 'Projet', path: 'projectAssignments.0.project.name' },
    ],
    fields: [],
    filters: [
      { name: 'departmentId', label: 'Département', type: 'select', optionsEndpoint: '/departments', optionLabel: (item) => `${item['code']} — ${item['name']}`, filterPath: 'department.id' },
      { name: 'internshipStatus', label: 'Statut du stage', type: 'select', options: statusOptions, filterPath: 'status' },
      { name: 'projectStatus', label: 'Statut du projet', type: 'select', options: projectStatusOptions, filterPath: 'projectAssignments.0.project.status' },
    ],
  },
  audit: {
    key: 'audit',
    title: 'Journal d’audit',
    eyebrow: 'Sécurité',
    description: 'Traçabilité des opérations effectuées dans l’application.',
    endpoint: '/audit-logs?page=1&limit=100',
    permissionPrefix: 'audit-logs',
    itemLabel: 'événement',
    readOnly: true,
    responseItemsPath: 'items',
    searchPaths: ['action', 'resource', 'entityLabel', 'user.employee.firstName', 'user.employee.lastName'],
    columns: [
      { label: 'Date', path: 'createdAt' },
      { label: 'Utilisateur', value: (item) => { const user = item['user'] as ResourceRecord; const employee = user?.['employee'] as ResourceRecord; return employee ? `${employee['firstName']} ${employee['lastName']}` : 'Non identifié'; } },
      { label: 'Action', path: 'action' },
      { label: 'Ressource', path: 'resource' },
      { label: 'Élément', path: 'entityLabel' },
      { label: 'Résultat', path: 'outcome' },
      { label: 'Adresse IP', path: 'ipAddress' },
    ],
    fields: [],
    filters: [
      { name: 'action', label: 'Action', type: 'select', options: [
        { value: 'CREATE', label: 'Création' }, { value: 'UPDATE', label: 'Modification' },
        { value: 'DELETE', label: 'Suppression' }, { value: 'LOGIN', label: 'Connexion' },
        { value: 'LOGOUT', label: 'Déconnexion' }, { value: 'PASSWORD_CHANGE', label: 'Changement de mot de passe' },
        { value: 'PASSWORD_RESET', label: 'Réinitialisation de mot de passe' },
      ], filterPath: 'action' },
      { name: 'outcome', label: 'Résultat', type: 'select', options: [{ value: 'SUCCESS', label: 'Succès' }, { value: 'FAILURE', label: 'Échec' }], filterPath: 'outcome' },
      { name: 'resource', label: 'Ressource', type: 'select', options: [
        'departments','positions','employees','users','roles','interns','supervisors','authorities','internships','projects','project-assignments'
      ].map((value) => ({ value, label: value })), filterPath: 'resource' },
    ],
  },
};
