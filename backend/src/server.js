import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import messageRoute from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();
const app = express();
const httpServer = createServer(app);
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

// Store online users: userId -> socketId
const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Get userId from auth cookie
  const cookieHeader = socket.handshake.headers.cookie;
  if (cookieHeader) {
    const jwtCookie = cookieHeader.split(';').find(c => c.trim().startsWith('jwt='));
    if (jwtCookie) {
      const token = jwtCookie.split('=')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded?.userId) {
          userSocketMap.set(decoded.userId.toString(), socket.id);
          socket.userId = decoded.userId.toString();
          console.log('User authenticated:', socket.userId);
        }
      } catch (e) {
        console.log('Invalid token in socket connection');
      }
    }
  }

  // Emit online users to all connected clients
  io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
      io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
    }
  });
});

// Make io and getReceiverSocketId available globally
global.io = io;
global.getReceiverSocketId = (receiverId) => userSocketMap.get(receiverId);

app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);

httpServer.listen(PORT, () => {
    console.log('Server is running on port:' +PORT);
    connectDB();  
});
