const pool = require('../config/db');

const CmsPortafolioModel = {
  crearObra: async (datos) => {
    const { title, category_id, description, technique, completion_date, project_type } = datos;
    
    // 1. BLINDAJE DE FECHA: Si viene vacía (""), la volvemos null para que PostgreSQL no se queje
    const fechaValidada = completion_date && completion_date.trim() !== '' ? completion_date : null;

    // 2. BLINDAJE DE ENUM: Si por error de capa llega un "1", lo forzamos a texto
    let tipoValidado = project_type;
    if (tipoValidado === "1" || tipoValidado === 1) tipoValidado = "Personal";
    if (tipoValidado === "2" || tipoValidado === 2) tipoValidado = "Comision";
    if (tipoValidado === "3" || tipoValidado === 3) tipoValidado = "Comercial";

    try {
      const result = await pool.query(
        'SELECT sp_insert_portfolio_item($1, $2, $3, $4, $5, $6) AS nuevo_id',
        [title, category_id, description, technique, fechaValidada, tipoValidado]
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