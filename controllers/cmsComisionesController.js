const CmsComisionesModel = require('../models/cmsComisionesModel');

const CmsComisionesController = {
  crear: async (req, res) => {
    try {
      const nuevoId = await CmsComisionesModel.crearTipoComision(req.body);
      res.status(201).json({ exito: true, mensaje: 'Tipo de comisión creado exitosamente', tipo_id: nuevoId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al crear el tipo de comisión', detalle: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ exito: false, mensaje: 'ID inválido' });

      await CmsComisionesModel.eliminarTipoComision(id);
      res.status(200).json({ exito: true, mensaje: 'Tipo de comisión eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ exito: false, mensaje: 'Error al eliminar el tipo de comisión', detalle: error.message });
    }
  }
};

module.exports = CmsComisionesController;