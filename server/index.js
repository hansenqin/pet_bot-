var Gpio = require('onoff').Gpio;
var Piservo = require('pi-servo');

var rightservo = new Piservo(17);
var leftservo = new Piservo(27);
var camservo = new Piservo(22);

const express = require('express');
const raspividStream = require('raspivid-stream');

const app = express();
const wss = require('express-ws')(app);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.post('/login', urlencodedParser, function (req, res) {
	console.log(req.body.fname);
	if (req.body.fname == "hansen302"){
		res.sendFile('/home/pi/pet_bot-/server/temp/next.html');
	}
});

app.ws('/servos',(ws,req) =>{
   console.log('connected to servo');  
   ws.onmessage = function(e){
      console.log('recieved data');
      console.log(e.data);      
   }
});


app.ws('/video-stream', (ws, req) => {
    console.log('Client connected');

    ws.send(JSON.stringify({
      action: 'init',
      width: '960',
      height: '540'
    }));

    var videoStream = raspividStream({ rotation: 180 });

    videoStream.on('data', (data) => {
        ws.send(data, { binary: true }, (error) => {if (error) console.error(error); });
    });

    ws.on('close', () => {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    }); 
});




app.listen(4000, () => console.log('Server started on 4000'));
