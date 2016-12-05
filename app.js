var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var Rec = {};
var Books = {};
var Ratings = {};
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('OutputFiles/recomendations');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

rl.on('line', function(line) {
        var user = line.match("u\'(.*?)\'");
        var list = line.match("\\[(.*?)\\]");
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
});

rl.on('close', function() {
  // do something on finish here
    console.log(Rec);
    
    var instream = fs.createReadStream('OutputFiles/BX-Books.csv');
var outstream = new stream;
var rla = readline.createInterface(instream, outstream);

rla.on('line', function(line) {
        var image = line.match("http(.*?)THUMBZZZ");
        var book = line.match("^\"(.*?)\"\;");
        if(image != null && book!=null)
        Books[book[1]] = "http"+image[1]+"MZZZZZZZ.jpg";
});

rla.on('close', function() {
  console.log(Books);
    
    
      var instream = fs.createReadStream('OutputFiles/BX-Book-Ratings.csv');
var outstream = new stream;
var rlb = readline.createInterface(instream, outstream);

rlb.on('line', function(line) {
         var book,user,rating
        
        var ratings = line.match(/\"(.*?)\"/g);
        if(ratings != null){
            user = ratings[0].slice(1, -1);
            book = ratings[1].slice(1, -1);
            rating = ratings[2].slice(1, -1);
        if( Ratings[user] != null){
            var data = Ratings[user];
            data.push({bookid : book , rating : rating})
        }else{
            Ratings[user] = [{bookid : book , rating : rating}]
        }
        }
});

rlb.on('close', function() {
  console.log(Ratings);
});


});

    
    
    
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

app.get('/', function(req,res){
    RecList = [];
    BoughtList = [];
    user = req.query.username;
    if(Rec[user] != null){
        var rec = Rec[user]
        console.log(rec);
        for (var i = 0 ; i<rec.length ; i++){
        console.log(rec[i].book);
        var bookid = rec[i].book
        console.log(Books[bookid]);
        console.log(rec[i].rating);
        RecList.push({book:bookid, image: Books[bookid],rating :rec[i].rating })
       }
    }
    if(Ratings[user] != null){
        var rec = Ratings[user]
        console.log(rec);
        for (var i = 0 ; i<rec.length ; i++){
        var bookid = rec[i].bookid
        console.log(Books[bookid]);
        console.log(rec[i].rating);
        BoughtList.push({book:bookid, image: Books[bookid],rating :rec[i].rating })
       }
    }
     res.jsonp( {Rec: RecList , Bought :BoughtList })
   
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
