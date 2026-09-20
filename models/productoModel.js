const pool = require('../config/db')

const ProductoModel = {
    obtenerProductosPublicos: async (categoriaId = null) => {
        try{
            const result = await pool.query('select * from sp_get_public_products($1)', [categoriaId])
            return result.rows
        }catch(error){
            console.error('No se lograron obtener los productos publicos: ', error)
            throw error
        }
    },

    obtenerDetallesProductos: async (Id) => {
        try{ 
            const result = await pool.query('select * from sp_get_product_details($1)', [Id])
            return result.rows[0]
        }catch(error){
            console.error('No se pudo obtener los detalles de los productos')
            throw error
        }
    }
}

module.exports = ProductoModel