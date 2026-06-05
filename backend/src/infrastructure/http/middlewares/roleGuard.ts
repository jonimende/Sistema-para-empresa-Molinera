import { Response, NextFunction } from 'express';
import { AuthRequest } from './authGuard';

export const roleGuard = (requiredPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.role === 'Admin') {
      return next();
    }

    const hasPermission = requiredPermissions.some(p => user.permissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
