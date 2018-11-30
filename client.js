/* 
宽放大模式
var module1 = ( function (mod){

　//...

  return mod;

})(window.module1 || {});
*/
$(function(){
  const client = (function(mod){
    mod.chat = {
      login(){
        const self = this;
        $('#confirmBtn').on('click', function(){
          self.loginFun();
        });
        $('#nickname').keydown(function(e){
          if(e.keyCode === 13){
            self.loginFun();
          }
        });
      },
      loginFun(){
        const self = this;
        const username = $('#nickname').val();
        if(!username.trim().length){
          alert('请输入昵称');
          return;
        }
        $('#nickname').val('');
        $('#dialog').hide();
        self.name = username;
        self.init();
      },
      send(){
        const self = this;
        $('#sendBtn').on('click', function(){
          self.sendFun();
        });
        $('#content').keydown(function(e){
          if(e.keyCode === 13){
            self.sendFun();
          }
        });
      },
      sendFun(){
        const socket = io('');
        let value = $('#content').val();
        let username = $('#username').html();
        if(value){
          socket.emit('message', {
            name: username,
            data: value
          });
          $('#content').val('');
        }else{
          alert('输入的内容不能为空！');
        }
      },
      init(){
        const self = this;
        const socket = io('');

        socket.on('connect', () => {
          console.log('连接成功');
          socket.emit('login', self.name);
        });

        socket.on('message', msg => {
          console.log(msg)
          let html = null;
          if(msg.type === 'system'){
            html = `
              <p style="color: red;text-align: center;">系统：欢迎<span id="username">${msg.username}</span>加入群聊</p>
            `;
          }else{
            html =  `
              <p style="color: #ccc;">
                <span class="user">${msg.user} </span>${msg.createAt}
              </p>
              <p class="content">${msg.content}</p>
            `;
          }
          $('#list').append(html).scrollTop($('#list').height());
        });
        
        socket.on('disconnect', () => {
          console.log('断开连接');
        });
        
        this.send();
      }
    };
    return mod;
  })(window.client || {})
  client.chat.login();
});
