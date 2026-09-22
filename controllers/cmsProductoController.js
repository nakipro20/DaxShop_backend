const CmsProductoModel = require('../models/cmsProductoModel');

const CmsProductoController = {
  crear: async (req, res) => {
    try {
      // Tomamos los datos que vienen en el body de la petición
      const nuevoId = await CmsProductoModel.crearProducto(req.body);

      res.status(201).json({
        exito: true,
        mensaje: 'Producto creado exitosamente',
        producto_id: nuevoId
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al crear el producto', detalle: error.message });
    }
  },

  // Actualizar datos generales (sin tocar stock/visibilidad)
  actualizar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      await CmsProductoModel.actualizarProducto(id, req.body);
      res.status(200).json({ exito: true, mensaje: 'Producto actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al actualizar el producto', detalle: error.message });
    }
  },

  // Actualizar solo estado de stock y visibilidad (ej: pausar/reactivar desde la tabla)
  actualizarEstado: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      const { stock_status, visibility } = req.body;
      await CmsProductoModel.actualizarEstadoProducto(id, stock_status, visibility);
      res.status(200).json({ exito: true, mensaje: 'Estado del producto actualizado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al actualizar el estado del producto', detalle: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      await CmsProductoModel.eliminarProducto(id);

      res.status(200).json({ exito: true, mensaje: 'Producto eliminado correctamente (borrado lógico)' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al eliminar el producto' });
    }
  },

  // Detalle completo para precargar el formulario de edición en el CMS
  detalle: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      const producto = await CmsProductoModel.obtenerDetalleProducto(id);
      if (!producto) {
        return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
      }

      res.status(200).json({ exito: true, datos: producto });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al obtener el detalle del producto' });
    }
  },

  // Galería de imágenes del producto
  galeria: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      const imagenes = await CmsProductoModel.obtenerGaleriaProducto(id);
      res.status(200).json({ exito: true, cantidad: imagenes.length, datos: imagenes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al obtener la galería del producto' });
    }
  },

  // Categorías disponibles (para el <select> del formulario)
  categorias: async (req, res) => {
    try {
      const categorias = await CmsProductoModel.obtenerCategorias();
      res.status(200).json({ exito: true, cantidad: categorias.length, datos: categorias });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al obtener las categorías' });
    }
  },

  subirImagenProducto: async (req, res) => {
    try {
      const producto_id = parseInt(req.params.id, 10);

      // req.file lo genera multer automáticamente cuando subimos un archivo
      if (!req.file) {
        return res.status(400).json({ exito: false, mensaje: 'No se envió ninguna imagen' });
      }

      // Multer-storage-cloudinary nos devuelve la URL pública en req.file.path
      const imageUrl = req.file.path;

      // Asumimos que si es la primera que subes, es la principal (is_primary = true)
      // Esto después lo puedes mandar dinámicamente desde el frontend
      const is_primary = req.body.is_primary === 'true' ? true : false;
      const display_order = req.body.display_order ? parseInt(req.body.display_order) : 1;

      // Guardar en la base de datos (Neon)
      await CmsProductoModel.agregarImagen(producto_id, imageUrl, is_primary, display_order);

      res.status(200).json({
        exito: true,
        mensaje: 'Imagen subida y vinculada correctamente',
        url: imageUrl
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al subir la imagen' });
    }
  }
};

module.exports = CmsProductoController;