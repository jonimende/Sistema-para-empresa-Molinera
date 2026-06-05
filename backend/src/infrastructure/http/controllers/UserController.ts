import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../database/sequelize/models/User';
import { Role } from '../../database/sequelize/models/Role';

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await User.findAll({
      attributes: { exclude: ['password'] }, // No enviar la contraseña al frontend
      order: [['id', 'DESC']]
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password, role, ...otrosDatos } = req.body;
    
    // Validar si ya existe
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Buscar o crear el rol dinámicamente
    const [rolEncontrado] = await Role.findOrCreate({ 
      where: { name: role },
      defaults: { name: role }
    });

    // Hash de la contraseña obligatoria
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario mapeando al esquema real de la DB
    const nuevoUsuario = await User.create({
      ...otrosDatos,
      email: email,
      username: email, // Usamos el email como username
      passwordHash: hashedPassword,
      role_id: rolEncontrado.id
    });

    // Remover passwordHash de la respuesta (opcional, dependiendo de cómo responda tu sistema, pero es buena práctica)
    const usuarioResponse: any = nuevoUsuario.toJSON();
    delete usuarioResponse.passwordHash;

    res.status(201).json(usuarioResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, role, email, ...otrosDatos } = req.body;
    
    const usuario = await User.findByPk((Number(id)));
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const datosAActualizar: any = { ...otrosDatos };

    if (email) {
      datosAActualizar.email = email;
      datosAActualizar.username = email;
    }

    if (role) {
      const [rolEncontrado] = await Role.findOrCreate({ 
        where: { name: role },
        defaults: { name: role }
      });
      datosAActualizar.role_id = rolEncontrado.id;
    }

    // Si viene un password nuevo en el body, lo hasheamos
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      datosAActualizar.passwordHash = await bcrypt.hash(password, salt);
    }

    await usuario.update(datosAActualizar);

    const usuarioResponse: any = usuario.toJSON();
    delete usuarioResponse.passwordHash;

    res.json(usuarioResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByPk((Number(id)));
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};
