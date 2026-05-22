"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(leadController_1.createLead)
    .get(authMiddleware_1.protect, authMiddleware_1.admin, leadController_1.getLeads);
router.route('/:id/status')
    .put(authMiddleware_1.protect, authMiddleware_1.admin, leadController_1.updateLeadStatus);
router.route('/:id')
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, leadController_1.deleteLead);
exports.default = router;
