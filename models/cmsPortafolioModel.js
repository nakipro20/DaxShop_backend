const pool = require('../config/db');

// Normaliza completion_date y project_type antes de enviarlos al SP,
// ya que el formulario del CMS puede mandarlos como "" o como número (1/2/3).
function normalizarDatosObra(datos) {
  const { title, category_id, description, technique, completion_date, project_type } = datos;

  const fechaValidada = completion_date && completion_date.trim() !== '' ? completion_date : null;

  let tipoValidado = project_type;
  if (tipoValidado === '1' || tipoValidado === 1) tipoValidado = 'Personal';
  if (tipoValidado === '2' || tipoValidado === 2) tipoValidado = 'Comision';
  if (tipoValidado === '3' || tipoValidado === 3) tipoValidado = 'Comercial';

  return { title, category_id, description, technique, fechaValidada, tipoValidado };
}

const CmsPortafolioModel = {
  crearObra: async (datos) => {
    const { title, category_id, description, technique, fechaValidada, tipoValidado } = normalizarDatosObra(datos);

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

  // Actualizar una obra existente
  actualizarObra: async (id, datos) => {
    const { title, category_id, description, technique, fechaValidada, tipoValidado } = normalizarDatosObra(datos);

    try {
      await pool.query(
        'SELECT sp_update_portfolio_item($1, $2, $3, $4, $5, $6, $7)',
        [id, title, category_id, description, technique, fechaValidada, tipoValidado]
      );
      return true;
    } catch (error) {
      console.error('Error en modelo actualizarObra:', error);
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

  // Detalle completo de una obra (para precargar el formulario de edición)
  obtenerDetalleObra: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_portfolio_item_details($1)', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error en modelo obtenerDetalleObra:', error);
      throw error;
    }
  },

  // Galería de imágenes de una obra
  obtenerGaleriaObra: async (id) => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_portfolio_item_gallery($1)', [id]);
      return result.rows;
    } catch (error) {
      console.error('Error en modelo obtenerGaleriaObra:', error);
      throw error;
    }
  },

  // Listado de obras, opcionalmente filtrado por categoría (pásale null para traer todas)
  obtenerObras: async (categoria_id = null) => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_portfolio_items($1)', [categoria_id]);
      return result.rows;
    } catch (error) {
      console.error('Error en modelo obtenerObras:', error);
      throw error;
    }
  },

  // Categorías disponibles (para poblar el <select> del formulario)
  obtenerCategorias: async () => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_portfolio_categories()');
      return result.rows;
    } catch (error) {
      console.error('Error en modelo obtenerCategorias (portafolio):', error);
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