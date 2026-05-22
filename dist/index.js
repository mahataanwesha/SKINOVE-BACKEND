"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv/config"); // Must be the very first import
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const socketHandler_1 = require("./sockets/socketHandler");
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Setup Socket.io
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
(0, socketHandler_1.socketHandler)(exports.io);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// Route imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const testimonialRoutes_1 = __importDefault(require("./routes/testimonialRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
// Mount routers
app.use('/api/auth', authRoutes_1.default);
app.use('/api/leads', leadRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/testimonials', testimonialRoutes_1.default);
// Error handler middleware
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
