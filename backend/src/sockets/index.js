import { Server } from 'socket.io';

let ioInstance = null;

export function initializeSockets(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for specific auction
    socket.on('join:auction', (auctionId) => {
      const room = `auction:${auctionId}`;
      socket.join(room);
      console.log(`[Socket.IO] Client ${socket.id} joined room ${room}`);
    });

    // Leave room
    socket.on('leave:auction', (auctionId) => {
      const room = `auction:${auctionId}`;
      socket.leave(room);
      console.log(`[Socket.IO] Client ${socket.id} left room ${room}`);
    });

    // Join personal user room for direct notifications
    socket.on('join:user', (userId) => {
      const room = `user:${userId}`;
      socket.join(room);
      console.log(`[Socket.IO] User ${userId} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
  return io;
}

export function getIO() {
  return ioInstance;
}

export function broadcastAuctionUpdate(auctionId, data) {
  if (ioInstance) {
    ioInstance.to(`auction:${auctionId}`).emit('auction.updated', data);
    ioInstance.emit('global.auction.updated', data);
  }
}

export function broadcastBidCreated(auctionId, bidData) {
  if (ioInstance) {
    ioInstance.to(`auction:${auctionId}`).emit('bid.created', bidData);
    ioInstance.emit('global.bid.created', bidData);
  }
}

export function broadcastAuctionExtended(auctionId, extensionData) {
  if (ioInstance) {
    ioInstance.to(`auction:${auctionId}`).emit('auction.extended', extensionData);
  }
}

export function broadcastAuctionEnded(auctionId, endData) {
  if (ioInstance) {
    ioInstance.to(`auction:${auctionId}`).emit('auction.ended', endData);
    ioInstance.emit('global.auction.ended', endData);
  }
}

export function sendUserNotification(userId, notification) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit('notification.created', notification);
  }
}
