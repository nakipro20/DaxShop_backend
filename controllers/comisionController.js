const ComisionModel = require('../models/comisionModel')

const ComisionController = {
  listarComisiones: async (req, res) => {
    try {
      const comisiones = await ComisionModel.obtenerTiposComision()
      res.status(200).json({ exito: true, cantidad: comisiones.length, datos: comisiones })
    } catch (error) {
      console.error(error)
      res.status(500).json({ exito: false, mensaje: 'Error al obtener las comisiones', detalle: error.message })
    }
  }
};

module.exports = ComisionController