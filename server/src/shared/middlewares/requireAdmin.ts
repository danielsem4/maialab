import { authenticate } from './authenticate';
import { authorize } from './authorize';

export const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const;

/** Route guard for any content-editing endpoint. */
export const requireAdmin = [authenticate, authorize(...ADMIN_ROLES)];

/** Route guard for account management. */
export const requireSuperAdmin = [authenticate, authorize('SUPER_ADMIN')];
