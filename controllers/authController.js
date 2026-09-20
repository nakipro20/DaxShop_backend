const AuthModel = require('../models/authModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ exito: false, mensaje: 'Email y contraseña son obligatorios' });
      }

      const admin = await AuthModel.obtenerAdminPorEmail(email);

      // Si no existe el usuario
      if (!admin) {
        return res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas' });
      }

      // IMPORTANTE: Como estamos en desarrollo y quizá metiste la contraseña manual en la BD sin encriptar, 
      // dejamos este "atajo" temporal para que puedas hacer login si el hash no empieza con "$2a" o "$2b".
      // En producción, TODAS las contraseñas DEBEN ser comparadas con bcrypt.
      let passwordValida = false;
      if (admin.password_hash.startsWith('$2')) {
          passwordValida = await bcrypt.compare(password, admin.password_hash);
      } else {
          // Comparación plana SOLO SI no es un hash (para tu primera prueba)
          passwordValida = (password === admin.password_hash);
      }

      if (!passwordValida) {
        return res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas' });
      }

      // Generar el Token JWT
      const token = jwt.sign(
        { id: admin.id, email: admin.email, rol: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // El token expira en 24 horas
      );

      res.status(200).json({
        exito: true,
        mensaje: 'Login exitoso',
        token: token,
        usuario: { id: admin.id, username: admin.username, email: admin.email }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ exito: false, mensaje: 'Error interno del servidor', detalle: error.message });
    }
  }
};

module.exports = AuthController;