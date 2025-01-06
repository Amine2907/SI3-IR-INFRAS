import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-prospect", upload.single("file"), prospectStorageCntrl.uploadFileController);
