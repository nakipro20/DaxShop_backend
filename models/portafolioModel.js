const pool = require('../config/db')

const PortafolioModel = {
    obtenerObras: async (categoriaId = null) => {
        try {
            const result = await pool.query('select * from sp_get_portfolio_items($1)', [categoriaId])
            return result.rows  
        } catch (error) {
            console.error('Error al intentar obtener las obras', error)
            throw error 
        }
    },

    obtenerDetalleObras:async (id) =>{
        try {
            const result = await pool.query('select * from sp_get_portfolio_item_details($1)', [id])
            result.rows[0]
        } catch (error) {
            console.error('Error al obtener el detalle de las obras',error)
            throw error
        }
    },

    obtenerCategorias:async () => {
        try {
            const result = await pool.query('select * from sp_get_portfolio_categories()')
            return result.rows  
        } catch (error) {
            console.error('Error al obtener las categorias', error)
            throw error
        }
    }
}

module.exports = PortafolioModel