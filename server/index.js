const Gpio= require('pigpio').Gpio; 
const motorRight = new Gpio(27, {mode: Gpio.OUTPUT});
const motorLeft = new Gpio(22, {mode: Gpio.OUTPUT});
const camServo = new Gpio(17, {mode: Gpio.OUTPUT});


let pos = 1000;
let increment = 20;

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
      if(e.data == "nothing"){
         console.log(e.data);
         motorRight.servoWrite(1500);
	 motorLeft.servoWrite(1550);
      }else if(e.data == "reverse"){
         console.log(e.data);
         motorRight.servoWrite(1000);
         motorLeft.servoWrite(2000);
      }else if(e.data == "right"){
         console.log(e.data);
         motorRight.servoWrite(1700);
         motorLeft.servoWrite(1700);
      }else if(e.data == "left"){
         console.log(e.data);
         motorRight.servoWrite(1300);
         motorLeft.servoWrite(1300);
      }else if(e.data == "forward"){
	 console.log(e.data);
	 motorRight.servoWrite(2000);
         motorLeft.servoWrite(1000);
      }
   }
});

app.ws('/cam',(ws,req) =>{
    console.log('connected to camera servo');
    ws.onmessage = function(e){
      if(e.data == "nothing"){
         console.log(e.data);
         camServo.servoWrite(pos);
      }else if(e.data == "Up"){
         console.log(e.data);
	 pos = pos + increment;
         camServo.servoWrite(pos);
      }else if(e.data == "Down"){
         console.log(e.data);
	 pos = pos - increment;
         camServo.servoWrite(pos);
      }
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


console.log("hello");



app.listen(4000, () => console.log('Server started on 4000'));
