const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));

const users = new Map();
io.on('connection', socket => {
  // 每个客户端都有一个连接对象，其中id属性为唯一标识
  let userId = socket.id;
  // 监听登陆事件，用户登陆之后将用户信息存储于map对象中
  socket.on('login', name => {
    let haedline = '';
    if(!isLogin(userId)){
      users.set(userId, {name, haedline});
      socket.emit('message', {type: 'system', username: name});
      // socket.emit('membersChange', userArr());
    }
  });
  socket.on('message', msg => {
    io.emit('message', {
      type: 'user',
      user: msg.name,
      content: msg.data,
      createAt: new Date().toLocaleString()
    });
  });
});

// 判断用户是否已登陆
function isLogin (id) {
  if (users.has(id)) {
    return true;
  }
  return false;
}
function userArr() {
  let values = users.values();
  return [...values]
}

server.listen(3000, () => {
  console.log('server listening on port 3000')
});