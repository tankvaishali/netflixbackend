import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: 'dkly9is4l',
  api_key: '628371884329552',
  api_secret: 'B3VvbltUdpaU5oIWsvOZm-6NxXo',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === 'video' ? 'series_videos' : 'series_thumbnails';
    return {
      folder,
      resource_type: file.fieldname === 'video' ? 'video' : 'image',
      public_id: `${Date.now()}-${file.originalname}`,
      use_filename: true,
      unique_filename: false,
      chunk_size: 6000000, // 6MB chunking for large video uploads
    };
  },
});

export { cloudinary, storage };
