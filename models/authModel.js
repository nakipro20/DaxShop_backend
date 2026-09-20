const pool = require('../config/db');

const AuthModel = {
  obtenerAdminPorEmail: async (email) => {
    try {
      const result = await pool.query('SELECT * FROM sp_get_admin_user_by_email($1)', [email]);
      return result.rows[0]; // Retorna el usuario o undefined si no existe
    } catch (error) {
      console.error('Error en modelo obtenerAdminPorEmail:', error);
      throw error;
    }
  }
};

module.exports = AuthModel;