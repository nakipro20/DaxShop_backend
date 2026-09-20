const express = require('express')
const router = express.Router()
const ComisionController = require('../controllers/comisionController')

router.get('/', ComisionController.listarComisiones)

module.exports = router