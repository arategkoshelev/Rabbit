

messages__form.onsubmit = function(){
  const xhr = new XMLHttpRequest();
 
  xhr.open('POST', '/publish', true);
  const messageInput = this.elements.message;

  xhr.send(JSON.stringify({message: messageInput.value}));

  // const li = document.createElement('li');
  // li.style.paddingLeft="30px";
  // li.textContent = messageInput.value;
  // messages__list.appendChild(li);

  messageInput.value = '';

  return false;
}

subscribe();

function subscribe(){
  const xhr = new XMLHttpRequest();

  xhr.open('GET', '/subscribe', true);

  xhr.onload = function(){
    const li = document.createElement('li');
    li.textContent = this.responseText;
    messages__list.appendChild(li);
    console.log('i subs')
    subscribe();
  };

  xhr.onerror = xhr.onabort = function(){
    setTimeout(subscribe, 0)
  };

  xhr.send();
}
