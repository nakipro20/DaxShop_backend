const express = require('express');
const router = express.Router();
const PortafolioController = require('../controllers/portafolioController');
const CmsPortafolioController = require('../controllers/cmsPortafolioController'); // NUEVO
const verificarToken = require('../middlewares/authMiddleware'); // NUEVO
const { upload } = require('../config/cloudinary'); // NUEVO

// ==============================
// RUTAS PÚBLICAS (Lectura)
// ==============================
router.get('/', PortafolioController.listarObras);
router.get('/categorias', PortafolioController.listarCategorias);
router.get('/:id', PortafolioController.verObra);

// ==============================
// RUTAS PRIVADAS / CMS (Escritura)
// ==============================
router.post('/admin/crear', verificarToken, CmsPortafolioController.crear);
router.delete('/admin/eliminar/:id', verificarToken, CmsPortafolioController.eliminar);
router.post('/admin/:id/imagen', verificarToken, upload.single('imagen'), CmsPortafolioController.subirImagenObra);

module.exports = router;