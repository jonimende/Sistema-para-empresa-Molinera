import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que la ruta exista a nivel código también es buena práctica
const uploadDir = path.join(__dirname, '../../../../uploads/no-conformidades');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Middleware configurado con límite de 10MB y filtrado solo de imágenes
export const uploadMiddleware = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado, solo se permiten imágenes.'));
    }
  }
});
