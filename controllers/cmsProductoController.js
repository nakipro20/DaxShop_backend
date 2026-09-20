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