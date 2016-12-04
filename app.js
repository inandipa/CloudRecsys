var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var Rec = {};
var Books = {};

fs.readFile('OutputFiles/recomendations', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
    var lines = data.split('\n');
    for(var line = 0; line < lines.length; line++){
        var user = lines[line].match("u\'(.*?)\'");
        var list = lines[line].match("\\[(.*?)\\]");
        List = [];
        if(user != null && list[1] != ""){
            //console.log(user[1]+"and"+list[1]);
            var reg = /(\(.*?\))/g,found,rating,book;
            found = list[1].match(reg);
            for (var i =0 ; i<found.length;i++){
            //console.log(found[i]);
            rating = found[i].match("\\((.*?)\,")
            //console.log(rating[1]);
            book = found[i].match("u\'(.*?)\'")
            //console.log(book[1]);
            List.push({book : book[1] , rating : rating[1]})
        
            }
             Rec[user[1]] = List;
        }
   }
     console.log(Rec);
});


fs.readFile('OutputFiles/BX-Books.csv', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
    var lines = data.split('\n');
    for(var line = 0; line < lines.length; line++){
        var image = lines[line].match("http(.*?)MZZZZZZZ");
        var book = lines[line].match("^\"(.*?)\"\;");
        if(image != null && book!=null)
        Books[book[1]] = "http"+image[1]+"MZZZZZZZ.jpg";
    }
    console.log(Books);
});

var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req,res){
    res.jsonp({data : {Recomendations : Rec , Books : Books}});
});
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
