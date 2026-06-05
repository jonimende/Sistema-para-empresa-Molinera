import { Router } from 'express';
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/UserController';

const router = Router();

router.get('/', getUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
