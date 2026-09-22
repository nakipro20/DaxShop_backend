const pool = require('../config/db');

// NOTA: sp_get_commission_types() ya existe en tu base de datos.
// sp_insert_commission_type y sp_delete_commission_type NO existen todavía —
// están propuestas en comisiones_sp_pendientes.sql. Revisa esos nombres de
// columna contra tu tabla real de comisiones antes de correr ese script;
// una vez creadas las funciones, este modelo funciona tal cual.

const CmsComisionesModel = {
  // Listado de tipos de comisión (ya funcional hoy)
  obtenerTiposComision: async () => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_commission_types()');
      return result.rows;
    } catch (error) {
      console.error('Error en modelo obtenerTiposComision:', error);
      throw error;
    }
  },

  // Crear un nuevo tipo de comisión
  // Requiere sp_insert_commission_type (ver comisiones_sp_pendientes.sql)
  crearTipoComision: async (datos) => {
    const { type_name, price_quetzales, price_usd, description } = datos;
    try {
      const result = await pool.query(
        'SELECT sp_insert_commission_type($1, $2, $3, $4) AS nuevo_id',
        [type_name, price_quetzales, price_usd, description]
      );
      return result.rows[0].nuevo_id;
    } catch (error) {
      console.error('Error en modelo crearTipoComision:', error);
      throw error;
    }
  },

  // Eliminar (o desactivar) un tipo de comisión
  // Requiere sp_delete_commission_type (ver comisiones_sp_pendientes.sql)
  eliminarTipoComision: async (id) => {
    try {
      await pool.query('SELECT sp_delete_commission_type($1)', [id]);
      return true;
    } catch (error) {
      console.error('Error en modelo eliminarTipoComision:', error);
      throw error;
    }
  }
};

module.exports = CmsComisionesModel;