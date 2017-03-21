var express = require('express'),
    path = require('path'),
    fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database');
var index = require('./routes/index');
var courses = require('./routes/courses');
var upload = require('./routes/upload');
var students = require('./routes/student');
var users = require('./routes/users');
var app = express();
var staticRoot = __dirname + '/';

app.set('port', (process.env.PORT || 3000));

// cross browser origin requests
app.use(cors());

app.use(express.static(staticRoot));

// view engine
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/', index);
app.use('/api', courses);
app.use('/api', students);
app.use('/api/users', users);
app.use('/api', upload);

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});