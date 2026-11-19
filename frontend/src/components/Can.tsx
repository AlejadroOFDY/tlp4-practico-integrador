import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface CanProps {
  permission: string;
  children: ReactNode;
}

export function Can({ permission, children }: CanProps) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? <>{children}</> : null;
}
