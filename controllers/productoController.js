const ProductoModel = require('../models/productoModel')

const ProductoController = {
    listarCatalogo: async (req, res) => {
        try{
            const { categoria } = req.query
            const categoriaId = categoria ? parseInt(categoria, 10) : null 

            const productos = await ProductoModel.obtenerProductosPublicos(categoriaId)

            res.status(200).json({
                exito:true,
                cantidad: productos.length,
                datos: productos
            })
        }catch(error){
            res.status(500).json({
                exito:false,
                mensaje: 'Error al obtener el catalogo', 
                error: error.message    
            })
        }
    },
    verProducto: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ exito: false, mensaje: 'ID de producto inválido' });
      }

      const producto = await ProductoModel.obtenerDetallesProductos(id);

      if (!producto) {
        return res.status(404).json({ exito: false, mensaje: 'Producto no encontrado' });
      }

      res.status(200).json({ exito: true, datos: producto });
    } catch (error) {
      // ESTA ES LA LÍNEA NUEVA: Imprimir el error real en la terminal
      console.error('Error detallado en verProducto:', error); 
      
      res.status(500).json({ 
        exito: false, 
        mensaje: 'Error al obtener el producto',
        detalle: error.message // Mandamos el detalle del error al navegador para verlo
      });
    }
  }
}

module.exports = ProductoController