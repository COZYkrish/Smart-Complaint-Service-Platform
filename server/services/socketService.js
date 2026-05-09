let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log(`👑 Admin joined room: ${socket.id}`);
    });

    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

const emitComplaintCreated = (complaint) => {
  if (!io) return;
  io.to('admin_room').emit('complaint_created', complaint);
};

const emitComplaintUpdated = (complaint) => {
  if (!io) return;
  io.to('admin_room').emit('complaint_updated', complaint);
  io.to(`user_${complaint.userId}`).emit('complaint_status_changed', complaint);
};

module.exports = { initSocket, getIO, emitComplaintCreated, emitComplaintUpdated };
