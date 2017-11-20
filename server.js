var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var statusRpi= {}
server.listen(process.env.PORT || 8080);

/*app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
*/
app.get('/monit', function (req, res) {
  res.sendFile(__dirname + '/monit.html');
});


io.on('connection', function (client) {
  console.log(client.request._query.name,'connected')
  // peut correspondre à un onInit
  if(client.request._query.name === 'monit'){
    // emmettre a ce client les rpi.
    client.emit('status', statusRpi)
  }else{
    nameRpi = client.request._query.name
    statusRpi[nameRpi] = {
      'status': true,
      'id': client.id
    }
  }
  function sendStatus(){
    console.log(statusRpi)
    client.emit('status', statusRpi)
  }
  setInterval(sendStatus,10000);

  // gestion de la deconnection
  client.on('disconnect', function (here) {
    if(client.request._query.name != 'monit')
      statusRpi[client.request._query.name].status = false
    console.log(client.request._query.name,'disconnected')
  });
});
