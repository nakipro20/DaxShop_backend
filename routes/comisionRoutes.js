const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // Tu middleware de Cloudinary
const ComisionController = require('../controllers/comisionController');
const CmsComisionesController = require('../controllers/cmsComisionesController');
const verificarToken = require('../middlewares/authMiddleware');

// ==============================
// RUTAS PÚBLICAS (Lectura)
// ==============================
router.get('/', ComisionController.listarComisiones);

// ==============================
// RUTAS PRIVADAS / CMS (Escritura)
// ==============================
router.post('/admin/crear', verificarToken, CmsComisionesController.crear);
router.post('/admin/:id/imagen', verificarToken, upload.single('imagen'), CmsComisionesController.subirImagen);
router.delete('/admin/eliminar/:id', verificarToken, CmsComisionesController.eliminar);

module.exports = router;