const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');
const CmsProductoController = require('../controllers/cmsProductoController'); // NUEVO
const verificarToken = require('../middlewares/authMiddleware'); // NUEVO EL GUARDIA
const { upload } = require('../config/cloudinary');

// ==============================
// RUTAS PÚBLICAS (Sin guardia)
// ==============================
router.get('/', ProductoController.listarCatalogo);
router.get('/:id', ProductoController.verProducto);

// ==============================
// RUTAS PRIVADAS / CMS (Con guardia)
// ==============================
// Nota como pasamos 'verificarToken' antes de ir al controlador
router.post('/admin/crear', verificarToken, CmsProductoController.crear)
router.post('/admin/:id/imagen', verificarToken, upload.single('imagen'), CmsProductoController.subirImagenProducto);;
router.delete('/admin/eliminar/:id', verificarToken, CmsProductoController.eliminar);

module.exports = router;