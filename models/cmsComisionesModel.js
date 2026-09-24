const pool = require('../config/db');
const CmsComisionesModel = {
  // Listado de tipos de comisión (ya funcional hoy, pero revisa que devuelva
  // TODAS las columnas — ver nota arriba)
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
    const { type_name, price_quetzales, price_usd, description, estimated_time, cover_image_url } = datos;
    try {
      const result = await pool.query(
        'SELECT sp_insert_commission_type($1, $2, $3, $4, $5, $6) AS nuevo_id',
        [type_name, price_quetzales, price_usd, description, estimated_time, cover_image_url]
      );
      return result.rows[0].nuevo_id;
    } catch (error) {
      console.error('Error en modelo crearTipoComision:', error);
      throw error;
    }
  },

  // NUEVO — Guardar/reemplazar la imagen de portada de un tipo de comisión ya
  // creado. Es el equivalente a CmsProductoModel.agregarImagen, pero como
  // cover_image_url es una sola columna (no una galería), aquí hacemos un
  // UPDATE directo en vez de insertar una fila en una tabla de imágenes.
  // Requiere sp_update_commission_image (ver comisiones_sp_pendientes.sql).
  actualizarImagenComision: async (id, image_url) => {
    try {
      await pool.query('SELECT sp_update_commission_image($1, $2)', [id, image_url]);
      return true;
    } catch (error) {
      console.error('Error en modelo actualizarImagenComision:', error);
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
  },
};

module.exports = CmsComisionesModel;