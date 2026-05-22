"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(appointmentController_1.createAppointment)
    .get(authMiddleware_1.protect, authMiddleware_1.admin, appointmentController_1.getAppointments);
router.route('/:id/status')
    .put(authMiddleware_1.protect, authMiddleware_1.admin, appointmentController_1.updateAppointmentStatus);
router.route('/:id')
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, appointmentController_1.deleteAppointment);
exports.default = router;
