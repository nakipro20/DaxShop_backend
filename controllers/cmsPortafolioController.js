const CmsPortafolioModel = require('../models/cmsPortafolioModel');

const CmsPortafolioController = {
  crear: async (req, res) => {
    try {
      const nuevoId = await CmsPortafolioModel.crearObra(req.body);
      res.status(201).json({ exito: true, mensaje: 'Obra creada exitosamente', obra_id: nuevoId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al crear la obra', detalle: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      await CmsPortafolioModel.eliminarObra(id);
      res.status(200).json({ exito: true, mensaje: 'Obra eliminada correctamente (borrado lógico)' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al eliminar la obra' });
    }
  },

  subirImagenObra: async (req, res) => {
    try {
      const obra_id = parseInt(req.params.id, 10);
      
      if (!req.file) {
        return res.status(400).json({ exito: false, mensaje: 'No se envió ninguna imagen' });
      }

      const imageUrl = req.file.path;
      const is_primary = req.body.is_primary === 'true' ? true : false;
      const display_order = req.body.display_order ? parseInt(req.body.display_order) : 1;

      await CmsPortafolioModel.agregarImagen(obra_id, imageUrl, is_primary, display_order);

      res.status(200).json({ exito: true, mensaje: 'Imagen vinculada a la obra', url: imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al subir la imagen de la obra' });
    }
  }
};

module.exports = CmsPortafolioController;