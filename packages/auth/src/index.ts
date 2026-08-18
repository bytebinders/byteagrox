import { UserRole } from '@byteagrox/types';

export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
}

export function isAuthorizedRole(session: AuthSession, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(session.role);
}
