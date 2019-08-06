

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
