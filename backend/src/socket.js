import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  // Inicialização do Socket.IO com a configuração de CORS independente
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        'https://clean-line.vercel.app',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ].filter(Boolean),
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado no Socket:', socket.id);

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io não foi inicializado!');
  }
  return io;
};