const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configuramos las credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Le decimos a multer que envíe los archivos a una carpeta llamada 'daxshop' en tu Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'daxshop_productos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] // Solo permitimos imágenes
  }
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };