let clients = [];

exports.subscribe = (req, res) => {
  console.log('subscribe');
  clients.push(res);
  console.log(clients.length, 'clientslength')
  res.on('close', ()=>{
    clients.splice(clients.indexOf(res),1)
  })
  
}

exports.publish = (message) => {
  console.log("publish '%s'", message);


  clients.forEach((res) => {
    res.end(message);
  })

  clients = [];
}
//console.log(clients, 'clientslength')
// setInterval(()=>console.log(clients, 'clientslength'), 2000)
