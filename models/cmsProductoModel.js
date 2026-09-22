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

  // Actualizar datos generales de un producto (sin tocar stock/visibilidad)
  actualizarProducto: async (id, datos) => {
    const { sku, titulo, categoria_id, descripcion, precio_quetzales, precio_usd } = datos;
    try {
      await pool.query(
        'SELECT sp_update_product($1, $2, $3, $4, $5, $6, $7)',
        [id, sku, titulo, categoria_id, descripcion, precio_quetzales, precio_usd]
      );
      return true;
    } catch (error) {
      console.error('Error en modelo actualizarProducto:', error);
      throw error;
    }
  },

  // Actualizar solo estado de stock y visibilidad (ej: pausar publicación desde la tabla)
  actualizarEstadoProducto: async (id, stock_status, visibility) => {
    try {
      await pool.query(
        'SELECT sp_update_product_status($1, $2, $3)',
        [id, stock_status, visibility]
      );
      return true;
    } catch (error) {
      console.error('Error en modelo actualizarEstadoProducto:', error);
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

  // Detalle completo de un producto (para precargar el formulario de edición)
  obtenerDetalleProducto: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_product_details($1)', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error en modelo obtenerDetalleProducto:', error);
      throw error;
    }
  },

  // Galería de imágenes de un producto
  obtenerGaleriaProducto: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_product_gallery($1)', [id]);
      return result.rows;
    } catch (error) {
      console.error('Error en modelo obtenerGaleriaProducto:', error);
      throw error;
    }
  },

  // Categorías disponibles (para poblar el <select> del formulario)
  obtenerCategorias: async () => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_product_categories()');
      return result.rows;
    } catch (error) {
      console.error('Error en modelo obtenerCategorias (producto):', error);
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