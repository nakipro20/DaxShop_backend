const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./config/db')

const app = express()
const PORT = process.env.PORT || 3000
const pool = require('./config/db')

// importar rutas
const productoRoutes = require('./routes/productoRoutes')
const portafolioRoutes = require('./routes/portafolioRoutes')
const comisionRoutes = require('./routes/comisionRoutes')
const authRoutes = require('./routes/authRoutes')

// middleware
app.use(cors())
app.use(express.json())

// Consumir rutas
app.use('/productos', productoRoutes)
app.use('/portafolio', portafolioRoutes)
app.use('/comisiones', comisionRoutes)
app.use('/auth', authRoutes)

// ruta inicial de prueba
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'La API de DAXSHOP esta en linea y funcionando!'
    })
})

app.get('/categorias', async (req, res) => {
    try {
        const result = await pool.query('select * from sp_get_product_categories()')
        res.json(result.rows)
    } catch(error) {
        console.error(error)
        res.status(500).json({
            error: 'Error al obtener las categorias'
        })
    }
})

app.listen(PORT, () => {
    console.log('Servidor backend corriendo en http://localhost:'+PORT)
})
