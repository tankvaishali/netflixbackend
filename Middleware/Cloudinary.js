import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dybe35ddl',
  api_key: '677834169371452',
  api_secret: 't5PJZGC5Q0yXkAbqIgB-DHpkr_I',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'netflix_series',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'm4v'],
      public_id: Date.now().toString(),
    };
  },
});

export { cloudinary, storage };
