import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import { createServer } from 'http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(server, {
    path: '/api/socket/io',
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    const { roomId, userId } = socket.handshake.query;
    console.log(`User ${userId} connected to room ${roomId}`);

    socket.join(roomId);

    socket.on('message',  async (text) => {
      console.log(`Message from ${userId} in room ${roomId}: ${text}`);
      io.to(roomId).emit('message', { userId, text });

      await connectDB();
      await Message.create(msg); // save to DB
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
    });
  });

  const PORT = 8000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
