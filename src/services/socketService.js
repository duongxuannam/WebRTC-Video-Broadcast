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
    const rooms = {};

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

      /// Group chat

      socket.on('joinRoom', (roomId, nameRoom, name) => {
        socket.join(roomId);
        const room = rooms[roomId];
        const id = socket.id;
        const user = {
          socketId: id,
          name,
        };
        if (!room) {
          const newRoom = {
            roomId,
            nameRoom,
            users: {
              [id]: user,
            },
          };
          rooms[roomId] = newRoom;
        }
        if (room) {
          rooms[roomId].users[id] = user;
        }
        socket.to(roomId).emit('joinRoom', id);
      });

      socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        const id = socket.id;
        const room = rooms[roomId];
        if (!room) {
          return;
        }
        if (room) {
          const users = Object.getOwnPropertyNames(rooms[roomId].users);
          if (users.length < 2) {
            delete rooms[roomId];
            socket.to(roomId).emit('leaveRoom', id);
            return;
          }
          rooms[roomId].users[id] && delete rooms[roomId].users[id];
        }
        socket.to(roomId).emit('leaveRoom', id);
      });

      socket.on('getRooms', (roomId) => {
        this.io.to(socket.id).emit('getRooms', rooms[roomId]);
      });

      socket.on('candidateRoomVideo', (roomId, candidate, id) => {
        socket.to(id).emit('candidateRoomVideo', socket.id, candidate);
      });

      socket.on('offerRoomVideo', (roomId, description, id) => {
        socket.to(id).emit('offerRoomVideo', socket.id, description);
      });

      socket.on('answerRoomVideo', (roomId, description, id) => {
        socket.to(id).emit('answerRoomVideo', socket.id, description);
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
