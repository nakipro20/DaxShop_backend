const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');
const CmsProductoController = require('../controllers/cmsProductoController');
const verificarToken = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

// ==============================
// RUTAS PÚBLICAS (Sin guardia)
// ==============================
router.get('/', ProductoController.listarCatalogo);
router.get('/categorias', CmsProductoController.categorias); // NUEVO — referencia útil también para filtros públicos
router.get('/:id', ProductoController.verProducto);

// ==============================
// RUTAS PRIVADAS / CMS (Con guardia)
// ==============================
router.get('/admin/listado', verificarToken, CmsProductoController.listarAdmin); // NUEVO
router.post('/admin/crear', verificarToken, CmsProductoController.crear);
router.put('/admin/actualizar/:id', verificarToken, CmsProductoController.actualizar); // NUEVO
router.patch('/admin/:id/estado', verificarToken, CmsProductoController.actualizarEstado); // NUEVO
router.get('/admin/:id/detalle', verificarToken, CmsProductoController.detalle); // NUEVO
router.get('/admin/:id/galeria', verificarToken, CmsProductoController.galeria); // NUEVO
router.post('/admin/:id/imagen', verificarToken, upload.single('imagen'), CmsProductoController.subirImagenProducto);
router.delete('/admin/eliminar/:id', verificarToken, CmsProductoController.eliminar);

module.exports = router;