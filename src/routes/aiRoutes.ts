import express from 'express';
import multer from 'multer';
import { analyzeImage, chatWithAi } from '../controllers/aiController';

const router = express.Router();

// Set up memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/analyze', upload.single('image'), analyzeImage);
router.post('/chat', chatWithAi);

export default router;
