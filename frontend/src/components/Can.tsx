import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Can: React.FC<{ permission: string; children: React.ReactNode }> = ({
  permission,
  children,
}) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? <>{children}</> : null;
};