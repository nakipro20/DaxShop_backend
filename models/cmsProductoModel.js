const pool = require('../config/db');

const CmsProductoModel = {
  // Crear nuevo producto
  crearProducto: async (datos) => {
    const { sku, titulo, categoria_id, descripcion, precio_quetzales, precio_usd, stock_status, visibility } = datos;
    try {
      const result = await pool.query(
        'SELECT sp_insert_product($1, $2, $3, $4, $5, $6, $7, $8) AS nuevo_id',
        [sku, titulo, categoria_id, descripcion, precio_quetzales, precio_usd, stock_status, visibility]
      );
      return result.rows[0].nuevo_id;
    } catch (error) {
      console.error('Error en modelo crearProducto:', error);
      throw error;
    }
  },

  // Eliminar producto (Borrado Lógico)
  eliminarProducto: async (id) => {
    try {
      await pool.query('SELECT sp_delete_product($1)', [id]);
      return true;
    } catch (error) {
      console.error('Error en modelo eliminarProducto:', error);
      throw error;
    }
  }, 

  // Agregar imagen a un producto existente
  agregarImagen: async (producto_id, image_url, is_primary, display_order) => {
    try {
      await pool.query(
        'SELECT sp_insert_product_image($1, $2, $3, $4)',
        [producto_id, image_url, is_primary, display_order]
      );
      return true;
    } catch (error) {
      console.error('Error en modelo agregarImagen:', error);
      throw error;
    }
  }
};

module.exports = CmsProductoModel;