const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  // 1. Obtener el header de autorización
  const authHeader = req.header('Authorization');

  // Si no hay header, bloqueamos el paso
  if (!authHeader) {
    return res.status(401).json({ exito: false, mensaje: 'Acceso denegado. Se requiere un token.' });
  }

  // El header usualmente viene en formato: "Bearer eyJhbGciOi..."
  // Por lo que separamos la palabra Bearer del token real.
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ exito: false, mensaje: 'Formato de token inválido.' });
  }

  try {
    // 2. Verificar si el token es real y no ha expirado
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Guardar los datos del usuario (id, email) en la request para usarlos luego si es necesario
    req.admin = verificado; 
    
    // 4. NEXT() es la clave: le dice a Node "Todo está bien, déjalo pasar a la ruta"
    next(); 
  } catch (error) {
    res.status(400).json({ exito: false, mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = verificarToken;