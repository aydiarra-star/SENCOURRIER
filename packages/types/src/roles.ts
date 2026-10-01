/**
 * Canonical RBAC roles for the SENCOURRIER editorial platform.
 * Ordered from most to least privileged — `ROLE_RANK` relies on this order.
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PUBLISHER = 'PUBLISHER',
  EDITOR_IN_CHIEF = 'EDITOR_IN_CHIEF',
  JOURNALIST = 'JOURNALIST',
  CORRESPONDENT = 'CORRESPONDENT',
  COMMUNITY_MANAGER = 'COMMUNITY_MANAGER',
  PREMIUM_SUBSCRIBER = 'PREMIUM_SUBSCRIBER',
  READER = 'READER',
}

export const ROLE_RANK: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 100,
  [Role.PUBLISHER]: 90,
  [Role.EDITOR_IN_CHIEF]: 80,
  [Role.JOURNALIST]: 60,
  [Role.CORRESPONDENT]: 50,
  [Role.COMMUNITY_MANAGER]: 40,
  [Role.PREMIUM_SUBSCRIBER]: 20,
  [Role.READER]: 10,
};

/** Roles allowed to reach the editorial back-office. */
export const STAFF_ROLES: readonly Role[] = [
  Role.SUPER_ADMIN,
  Role.PUBLISHER,
  Role.EDITOR_IN_CHIEF,
  Role.JOURNALIST,
  Role.CORRESPONDENT,
  Role.COMMUNITY_MANAGER,
];

/** Roles allowed to move an article from DRAFT to PUBLISHED. */
export const PUBLISHING_ROLES: readonly Role[] = [
  Role.SUPER_ADMIN,
  Role.PUBLISHER,
  Role.EDITOR_IN_CHIEF,
];

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Administrateur',
  [Role.PUBLISHER]: 'Directeur de publication',
  [Role.EDITOR_IN_CHIEF]: 'Rédacteur en chef',
  [Role.JOURNALIST]: 'Journaliste',
  [Role.CORRESPONDENT]: 'Correspondant',
  [Role.COMMUNITY_MANAGER]: 'Community Manager',
  [Role.PREMIUM_SUBSCRIBER]: 'Abonné Premium',
  [Role.READER]: 'Lecteur',
};

export function hasRoleRank(role: Role, minimum: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}
