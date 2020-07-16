import SocketIO from 'socket.io';

class _SocketService {
  constructor() {
    this.io = null;
    this.connections = {};
    this.broadcaster;
  }

  start(server) {
    if (!this.io) {
      this.io = SocketIO(server);
    }

    this.io.sockets.on('error', (e) => console.log(e));
    this.io.sockets.on('connection', (socket) => {
      socket.on('broadcaster', () => {
        this.broadcaster = socket.id;
        socket.broadcast.emit('broadcaster');
      });
      socket.on('watcher', () => {
        socket.to(this.broadcaster).emit('watcher', socket.id);
      });
      socket.on('offer', (id, message) => {
        socket.to(id).emit('offer', socket.id, message);
      });
      socket.on('answer', (id, message) => {
        socket.to(id).emit('answer', socket.id, message);
      });
      socket.on('candidate', (id, message) => {
        socket.to(id).emit('candidate', socket.id, message);
      });
      socket.on('disconnect', () => {
        socket.to(this.broadcaster).emit('disconnectPeer', socket.id);
      });
    });
  }

  close() {
    this.io && this.io.close();
  }

  getIO() {
    return this.io;
  }

  getConnections() {
    return this.connections;
  }
}

const SocketService = new _SocketService();

export default SocketService;
