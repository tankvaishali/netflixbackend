import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: "uploads/", 
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const multerupload = multer({ storage });

export default multerupload;
  