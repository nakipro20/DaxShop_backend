const pool = require('../config/db');

const CmsPortafolioModel = {
  crearObra: async (datos) => {
    const { title, category_id, description, technique, completion_date, project_type } = datos;
    try {
      const result = await pool.query(
        'SELECT sp_insert_portfolio_item($1, $2, $3, $4, $5, $6) AS nuevo_id',
        [title, category_id, description, technique, completion_date, project_type]
      );
      return result.rows[0].nuevo_id;
    } catch (error) {
      console.error('Error en modelo crearObra:', error);
      throw error;
    }
  },

  eliminarObra: async (id) => {
    try {
      await pool.query('SELECT sp_delete_portfolio_item($1)', [id]);
      return true;
    } catch (error) {
      console.error('Error en modelo eliminarObra:', error);
      throw error;
    }
  },

  agregarImagen: async (portfolio_item_id, image_url, is_primary, display_order) => {
    try {
      await pool.query(
        'SELECT sp_insert_portfolio_image($1, $2, $3, $4)',
        [portfolio_item_id, image_url, is_primary, display_order]
      );
      return true;
    } catch (error) {
      console.error('Error en modelo agregarImagenPortafolio:', error);
      throw error;
    }
  }
};

module.exports = CmsPortafolioModel;