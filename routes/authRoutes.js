const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Ruta POST para el login (ej: /api/auth/login)
router.post('/login', AuthController.login);

module.exports = router;