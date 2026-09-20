const PortafolioModel = require('../models/portafolioModel')

const PortafolioController = {
    listarObras: async (req,res) => {
        try {
            const {categoria} = req.query
            const categoriaId = categoria ? parseInt(categoria, 10) : null
            const obras = await PortafolioModel.obtenerObras(categoriaId)

            res.status(200).json({
                exito:true, 
                cantidad: obras.length, 
                datos: obras
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                exito:false, 
                mensaaje: 'Error al obtener el portafolio',
                detalle: error.message
            })
        }
    },
    verObra:async(req,res) => {
        try {
            const id = parseInt(req.params.id, 10)
            if(isNaN(id)) return res.status(400).json({
                exito:false, 
                mensaje: 'id Invalido'
            })

            const obra = await PortafolioModel.obtenerDetalleObras(id)
            if(!obra) return res.status(404).json({
                exito: false,
                mensaje:'Obra no encontrada'
            })

            res.status(200).json({
                exito:true,
                datos: obra
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                exito:false, 
                mensaaje: 'Error al obtener la obra',
                detalle: error.message
            })
        }
    },

    listarCategorias: async(req, res) => {
        try {
            const categorias = await PortafolioModel.obtenerCategorias()
            res.status(200).json({
                exito : true,
                datos: categorias
            })
        } catch (error) {
            console.error(error)            
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener las categorias',
                detalle: error.message
            })
        }
    }
}

module.exports = PortafolioController