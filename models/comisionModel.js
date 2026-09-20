const pool = require('../config/db')

const ComisionModel = {
  obtenerTiposComision: async () => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_commission_types()')
      return result.rows
    } catch (error) {
      console.error('Error en modelo obtenerTiposComision:', error)
      throw error
    }
  }
};

module.exports = ComisionModel