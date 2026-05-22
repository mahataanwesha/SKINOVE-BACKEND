"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const aiController_1 = require("../controllers/aiController");
const router = express_1.default.Router();
// Set up memory storage for multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post('/analyze', upload.single('image'), aiController_1.analyzeImage);
router.post('/chat', aiController_1.chatWithAi);
exports.default = router;
