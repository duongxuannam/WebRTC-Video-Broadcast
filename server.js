const express = require('express');
const app = express();

let broadcaster;
const port = process.env.PORT || 1995;

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);
// app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.send('Hello Worldddd!'));

app.get('/hello', (req, res) => res.send('Hello World!'));

io.sockets.on('error', (e) => console.log(e));
io.sockets.on('connection', (socket) => {
  socket.on('broadcaster', () => {
    console.log('broadcaster init ');
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });
  socket.on('watcher', () => {
    socket.to(broadcaster).emit('watcher', socket.id);
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
    socket.to(broadcaster).emit('disconnectPeer', socket.id);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
