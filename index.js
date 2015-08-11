var http = require('http'),
	express = require('express'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash');

// grab global so we can the io connection to everywhere
var global = require('./global.js');

var app = express();


var handlebars = require('express3-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		static: function(name) {
			return require('./lib/static.js').map(name);
		},
		json: function(context) {
			return JSON.stringify(context);
		},
		section: function(name, options) {
			if(!this_sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}, 
		each_upto: function(ary, max, options) {
			if(!ary || ary.length == 0)
				return options.inverse(this);

			var result = [ ];
			for(var i=0; i < max && i < ary.length; ++i)
				result.push(options.fn(ary[i]));
			return result.join('');
		}
	}
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));


// set up logging
switch(app.get('env')){
	case 'development':
		app.use(require('morgan')('dev'));
		break;
	case 'production':
		app.use(require('express-logger')({
			path: __dirname + '/log/requests.log'
		}));
		break;
}

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') != 'production' && res.req.query.test === '1';
	next();
});


// if mongo is required for saving game states, put it here:

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'war' }));

app.use(flash());

// set up global socket
var io = require('socket.io')(http);
global.io = io;

// register routes
require('./routes.js')(app);

//custom 404 page
app.use(function(req, res){
	console.log('Error: 404 logged');
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express started in ' + app.get('env') + ' on http://localhost:' + 
		app.get('port') + '; press Ctrl-C to terminate.');
});



