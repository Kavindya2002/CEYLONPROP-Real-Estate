const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image'); // Path to save images
    },
    filename: (req, file, cb) => {
        const cid = req.body.cid;
        cb(null, `${cid}${path.extname(file.originalname)}`); // Renaming the file with CID
    }
});

const upload = multer({ storage: storage });

const uploadProfilePicture = (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' });
};

module.exports = {
    upload,
    uploadProfilePicture
};
