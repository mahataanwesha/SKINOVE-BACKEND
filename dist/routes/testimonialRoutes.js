"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testimonialController_1 = require("../controllers/testimonialController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(testimonialController_1.getTestimonials)
    .post(authMiddleware_1.protect, authMiddleware_1.admin, testimonialController_1.createTestimonial);
router.route('/:id')
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, testimonialController_1.deleteTestimonial);
exports.default = router;
