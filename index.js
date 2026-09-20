const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000


// middleware
app.use(cors())
app.use(express.json())

// ruta inicial de prueba
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'La API de DAXSHOP esta en linea y funcionando!'
    })
})

app.listen(PORT, () => {
    console.log('Servidor backend corriendo en http://localhost:'+PORT)
})
