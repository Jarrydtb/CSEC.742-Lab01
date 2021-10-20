//NPM File imports
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var vhost = require('vhost');
var sessions = require('express-session');
var cookieParser = require('cookie-parser');

//Custom File imports
//SQL Files
import User from './db/users.js'

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(vhost('theseus.com',app))

// app.use(sessions({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:true,
//     cookie: { maxAge: 36000 },
//     resave: false
// }));
// app.use(cookieParser());


//Passport Configuration
const passport = require('passport');
require('./localStrategy.js')(passport);
require('./jwtStrategy.js');
const {ensureAuthenticated} = require('./auth.js')

const secret = 'keyboard cat'

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser} = require("./authenticate")

//Sessions and Cookies Configuration
app.use(cookieParser(secret));
app.use(passport.initialize());
app.use(flash());



app.listen(3000, (req,res) => console.log("Server Listening"));


//MYSQL CONFIGURATION
var mysql      = require('mysql');                            //MYSQL DB
var MYSQLStore = require('express-mysql-session')(sessions)   //MYSQL Sessions

var connection = mysql.createConnection({                     //MYSQL DB Configuration
  multipleStatements: true,
  host     : 'localhost',
  user     : 'root',
  password : 'TheseusPassword',
  database : 'theseus'
});

connection.connect(err => {                                   //Connect to MYSQL DB
	if(err) throw err;
	console.log("Connected");
})



//For sessions
var sessionStore = new MYSQLStore({
  host     : 'localhost',
  user     : 'root',
  password : 'TheseusPassword',
  database : 'sessions'
})


//PAGE ROUTES
app.get('/', (req, res) => {
  res.render('landingPage');
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect(301,'/login');
    });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/dashboard',ensureAuthenticated,(req, res) => {
  //sessions = req.session
	if(sessions.email){
		res.render('dashboard',{data: {name:sessions.name}});
	}else{
		res.render('login');
	}
});

app.get('/transferfunds', (req, res) => {
  //sessions = req.session
	if(sessions.email){
    //get account details
    connection.query("SELECT * FROM accounts WHERE email='"+sessions.email + "'",(err,result, fields)=>{
      var data = {balance:0}
      if(result.length>0){
        data.balance = result[0].balance
      }
      res.render('transferFunds',{data:data});
    });

	}else{
		res.render('login');
	}
});

app.get('/statementspage', (req, res) => {
  console.log("statements")
  //sessions = req.session
	if(sessions.email){
      res.render('statements',{name:sessions.name});
	}else{
		res.render('login');
	}
});

app.get('/settings',(req,res)=>{
  if (sessions.email) {
    res.render('settings')
  }else{
    res.render('login')
  }
})

//ADMIN ROUTES
app.get('/admin',(req, res) => {
  res.render('adminLogin');
});


app.get('/admin/dashboard', ensureAuthenticated,(req, res) => {
  res.render('adminDashboard');
});

//API ROUTES
app.post('/api/auth',(req, res, next) => {
  passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })(req,res,next)
});

app.post('/api/admin/login', (request, response) => {
  passport.authenticate('local',{
    successRedirect: '/admin/dashboard',
    failureRedirect: '/login',
  })(req,res,next)
});

app.post('/api/transferfunds',ensureAuthenticated,(req,res)=>{
  //TODO amount validation and email validation (exists)
  connection.query("UPDATE accounts SET balance = balance +" + req.body.amount + " WHERE email = '" + req.body.recipient + "';" +
  "UPDATE accounts SET balance = balance - " + req.body.amount + " WHERE email='" + sessions.email + "'",(err,result,fields)=>{
    console.log(result)
    res.redirect(301,'/transferFunds')
  });
});

app.get('/api/fetch/statement_list',(req,res)=>{
  console.log("Here")
  connection.query("SELECT * FROM statements WHERE customer_email='" + sessions.email + "'",function(err,result,fields){
    console.log(result)
    console.log(err)
    if(err) throw err;
    var data = {statements: result}
    console.log(data)
    console.log(result)
		res.json({dtatus:200,data:data});
  });

});

//DIRECTORY TRAVERSAL
app.get('/api/documents/download', (req, res) => {
  console.log(req.query)
  console.log(req)
  res.download(path.join(__dirname,req.query.file));
});


//SQL INJECTION
app.post('/api/update/name',(req,res)=>{
  connection.query("UPDATE users SET name = '" + req.body.name + "' WHERE email='" + sessions.email + "'; SELECT name FROM users WHERE email ='" + sessions.email + "';",function(err,result,fields){
      res.json({result:result[1]})
  });
})

app.post('/api/user/add',(req,res)=>{
  // TODO: ADD INPUT VALIDATION HERE & Password HASH:
  // @NILOUFAR
  // Add user to DB
  User.addnew(req.body.name, req.body.email,req.body.password)
  .then(results=>{
    console.log(results.status)
    res.json({status:200,msg:"user created successfully"})
  })
  .catch(error=>{
    console.log(error)
    res.json({status:512,msg:"user creation failed"})
  })
})
