/* 

	the main game server class
	- in this instance, game server refers to an instance of the game
	that has its own players, game/server state

	- if there are multiple games, there will be multiple instances
	of the game server

*/
	var UUID = require('node-uuid'),
		global = require('../global');

	// game server constructor
	// var game_server = function() {
		
	// 	this.world = {
	// 		width: 720,
	// 		height: 720,
	// 	};

	// 	this.players = {};

	// 	global.io.on('connection', function(socket){
	// 		socket.userId = UUID();

	// 		socket.emit('onconnected', { id: socket.userId } );
	// 		console.log('Player connected with user id: ' + socket.userId);
	// 	});
	// }

	GameServer.prototype = {
		constructor: GameServer,
		listUsers: function(){
			console.log(this.players);
		}
	}

	function GameServer(){
		this.world = {
			width: 720,
			height: 720,
		};

		this.players = {};
		parentThis = this;
	
		global.io.on('connection', function(socket){
			socket.userId = UUID();

			socket.emit('onconnected', { id: socket.userId } );
			console.log("Player connected with user id: " + socket.userId);
			


			parentThis.players[socket.userId] = "theoretical game object";
		});

		var listPlayerInterval = setInterval(console.log(parentThis), 3000);
	}



	module.exports = GameServer;