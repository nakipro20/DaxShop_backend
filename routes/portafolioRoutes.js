const express = require('express');
const router = express.Router();
const PortafolioController = require('../controllers/portafolioController');
const CmsPortafolioController = require('../controllers/cmsPortafolioController');
const verificarToken = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

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
router.put('/admin/actualizar/:id', verificarToken, CmsPortafolioController.actualizar); // NUEVO
router.get('/admin/:id/detalle', verificarToken, CmsPortafolioController.detalle); // NUEVO
router.get('/admin/:id/galeria', verificarToken, CmsPortafolioController.galeria); // NUEVO
router.delete('/admin/eliminar/:id', verificarToken, CmsPortafolioController.eliminar);
router.post('/admin/:id/imagen', verificarToken, upload.single('imagen'), CmsPortafolioController.subirImagenObra);

module.exports = router;