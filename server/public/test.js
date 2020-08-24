var socket = io.connect('http://192.168.1.99:4000');

socket.on('image', function(data){
		document.getElementById("h1").style.color = "red";
		document.getElementById("im").src = 'data:image/jpg,' + data.buffer;
	console.log(data.buffer);
	

})// Make connection


