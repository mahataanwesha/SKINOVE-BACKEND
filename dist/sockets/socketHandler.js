"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Room for admins
        socket.on('join_admin', () => {
            socket.join('admin_room');
            console.log(`Socket ${socket.id} joined admin_room`);
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.socketHandler = socketHandler;
