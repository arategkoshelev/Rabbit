

if (document.getElementById('login')){
  const form = document.querySelector('.login__form');
  const button = document.querySelector('.login__submit-btn');
  const helper= document.querySelector('.login__submit-helper');
  const inputs = document.getElementsByClassName('login__input');


  form.onsubmit = (e)=>{
    e.preventDefault();

    button.innerHTML = 'loading';

    const xhr = new XMLHttpRequest();

    const data = new FormData();

    Array.prototype.forEach.call(inputs, (input)=>{
      data.append(input.name, input.value)
    })
    
    xhr.open("POST", "./login", true)

    xhr.onreadystatechange = ()=>{
      if (xhr.readyState == 4){
        button.innerHTML = "reset" 
        switch (xhr.status){
          case 200: 
            form.classList.add('login__form_success');
            console.log("success send")
            window.location.href = "./chat";
          break;
          case 403: 
            console.log(xhr.responseText)
            helper.innerHTML = xhr.responseText;
            button.innerHTML = "Send"
          break;
          default: 
            helper.innerHTML = "something went wrong"
          
        }
      }
    }

    xhr.send(data)
  }
}

if (document.getElementById('logout')){
  const logout = document.getElementById('logout');

  logout.onclick=function(){
      const form = document.createElement('form');
      form.method='POST';
      form.action='./logout';
      form.style.display='none';
      document.body.appendChild(form);
      form.submit();
      return false
    }
}

if (document.getElementById('chat')){
  const socket = io('/chat',{
    'reconnection delay': 1,
    'reconnect': false
    // 'max reconnection attempts': 4
  });

  const form = document.getElementById('chat__form');
  const input = document.getElementById('chat__input');
  const messages = document.getElementById('chat__messages');

  socket
  .on('chat message', function(user, msg){
    printStatus(user, msg);
  })
  .on('connect',(user)=>{
    printStatus(user, 'connect'),
    input.removeAttribute('disabled');
    form.addEventListener('submit', sendMessage);
  })
  .on('disconnect',(user)=>{
    printStatus(user, 'disconnect');
    input.setAttribute('disabled', true);
    form.removeEventListener('submit',sendMessage);
    setTimeout(reconnect, 500);
  })
  // .on('reconnect_failed',()=>{
  //   alert('forever disconnect')
  // })

  function sendMessage(e){
    e.preventDefault();
    console.log(input.value)
    socket.emit('chat message', input.value, function(data){
      console.log(data) 
    });

    input.value = '';
  }

  function printStatus(user, status){
    const li = document.createElement('li');
    const div = document.createElement('div');
    li.innerText = user;
    div.innerText = status;
    li.appendChild(div)
    messages.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
  }

  function reconnect(){
    socket.once('error', function(){
      setTimeout(reconnect, 500);
    });
    socket.socket.connect();
  }
}






