// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // ✅ Use absolute path
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../uploads'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const multerupload = multer({ storage });

// export default multerupload;



import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Use absolute path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Use timestamp + original file name to avoid overwrites and make it more readable
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, uniqueName);
    },
});

const multerupload = multer({ storage });

export default multerupload;





// import multer from 'multer';
// import { storage } from './Cloudinary.js';

// const multerupload = multer({
//   storage,
//   limits: {
//     fileSize: 1024 * 1024 * 1024 * 10, // 10GB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === 'video') {
//       return file.mimetype.startsWith('video/')
//         ? cb(null, true)
//         : cb(new Error('Only video files allowed for "video" field.'));
//     }
//     if (file.fieldname === 'thumbnail') {
//       return file.mimetype.startsWith('image/')
//         ? cb(null, true)
//         : cb(new Error('Only image files allowed for "thumbnail" field.'));
//     }
//     cb(null, true);
//   }
// });

// export default multerupload;
