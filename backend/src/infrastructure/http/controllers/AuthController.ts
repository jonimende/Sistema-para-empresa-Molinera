import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../database/sequelize/models/User';
import { Role } from '../../database/sequelize/models/Role';
import { Chofer } from '../../database/sequelize/models/Chofer';
import { Permission, RolePermission } from '../../database/sequelize/models/Permission';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('=> Intento de login recibido:', email);

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Obtener permisos del rol
    const rolePermissions = await RolePermission.findAll({
      where: { role_id: user.role_id }
    });
    
    const permissionIds = rolePermissions.map(rp => (rp as any).permission_id);
    const permissionsRecords = await Permission.findAll({ where: { id: permissionIds } });
    const permissions = permissionsRecords.map(p => p.name);

    // Extra data para Row-Level Security
    let chofer_id = null;
    if (user.role.name === 'Chofer') {
      const choferRecord = await Chofer.findOne({ where: { user_id: user.id } });
      chofer_id = choferRecord?.id;
    }

    // Generar Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name,
        permissions,
        chofer_id
      },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
