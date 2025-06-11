import multer from "multer";

// Use memory storage instead of disk storage to avoid file system issues
// This keeps files in memory and avoids ENOENT errors in production
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log(
      "Processing file:",
      file.originalname,
      "MIME type:",
      file.mimetype
    );
    // Accept images only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});
