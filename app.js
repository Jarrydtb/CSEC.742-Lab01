//NPM File imports
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var vhost = require('vhost');
var session = require('express-session');
var cookieParser = require('cookie-parser');

//Custom File imports
//SQL Files
var db = require('./db/initdb.js')//TODO CLose connection per request.
var userDB = require('./db/users.js')
var accountsDB = require('./db/accounts.js')
var statementsDB = require('./db/accounts.js')



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(vhost('theseus.com',app))

/* ------------------------- MYSQL CONFIGURATIONS ------------------------------- */
var mysql      = require('mysql2');                            //MYSQL DB dependency import
var MYSQLStore = require('express-mysql-session')(session)   //MYSQL Sessions dependency import

//Create Instances
const User = new userDB()
const Accounts = new accountsDB()
const Statements = new statementsDB()



//MYSQL Sessions Config
var sessionStore = new MYSQLStore({
  host     : 'localhost',
  user     : 'root',
  password : 'TheseusPassword',
  database : 'theseus',
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}

})

//Express sessions
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    cookie: { secure: false, httpOnly:true, maxAge: 36000 },
    store: sessionStore,
    resave: true,
    saveUninitialized:true,
}));


/* ------------------------- SECURITY CONFIGURATIONS ------------------------------- */

//Passport Configuration
const passport = require('passport');
require('./security/passport.js')(passport);
const ensureAuthenticated = require('./security/auth.js')
const secret = 'keyboard cat'



//Sessions and Cookies Configuration
app.use(cookieParser(secret));
app.use(passport.initialize());
app.use(passport.session());



app.listen(3000, (req,res) => console.log("Server Listening"));


/* ------------------------- PAGE ROUTES ------------------------------- */
app.get('/', (req, res) => {                                    // Landing Page
  res.render('landingPage');
});

app.post('/logout', (req, res) => {
  console.log("logout")                     // Logout Route
  req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect(301,'/login');
    });
});

app.get('/login', (req, res) => {                             // Login Page
  res.render('login');
});

app.get('/dashboard',ensureAuthenticated,(req, res) => {     // Dashboard Page
	res.render('dashboard',{data:req.user});
});

app.get('/transferfunds', (req, res) => {                    // Transfer funds Page
    //TODO: Change to accounts balanceUpdate function
    connection.query("SELECT * FROM accounts WHERE email='"+sessions.email + "'",(err,result, fields)=>{
      var data = {balance:0}
      if(result.length>0){
        data.balance = result[0].balance
      }
      res.render('transferFunds',{data:data});
    });
});

app.get('/statementspage', ensureAuthenticated, (req,res) => {
  res.render('statements',{name:sessions.name});
});

app.get('/settings', ensureAuthenticated, (req,res)=>{
  res.render('settings')
})

/* ------------------------- ADMIN ROUTES ------------------------------- */

app.get('/admin',(req, res) => {
  res.render('adminLogin');
});


app.get('/admin/dashboard', ensureAuthenticated,(req, res) => {
  res.render('adminDashboard');
});

/* ------------------------- API ROUTES ------------------------------- */

//Login API - Regular user
app.post('/api/auth', (req,res,next) => {

  passport.authenticate('local',(err,user) =>{
    if (err) {
        console.log(err);
      }
      console.log('user', user);
      if (!user) {
        return res.redirect('/users/login');
      }
      req.logIn(user, (logInErr) => {
        if (logInErr) {
          console.log(logInErr)
        }
        req.session.save(() => res.redirect('/dashboard'));
      });
    })(req, res, next);
  });

//Login API - Admin user
app.post('/api/admin/login', (request, response) => {
  passport.authenticate('local',{
    successRedirect: '/admin/dashboard',
    failureRedirect: '/login',
  })(req,res,next)
});

//Transfer funds API
app.post('/api/transferfunds',ensureAuthenticated,(req,res)=>{
  //TODO amount validation and email validation (exists)
  connection.query("UPDATE accounts SET balance = balance +" + req.body.amount + " WHERE email = '" + req.body.recipient + "';" +
  "UPDATE accounts SET balance = balance - " + req.body.amount + " WHERE email='" + sessions.email + "'",(err,result,fields)=>{
    console.log(result)
    res.redirect(301,'/transferFunds')
  });
});

//Fetch Statements API
app.get('/api/fetch/statement_list',ensureAuthenticated,(req,res)=>{
  //TODO CHANGE TO STATEMENTS DB FUNCTIONS : fetchStatements()
  connection.query("SELECT * FROM statements WHERE customer_email='" + sessions.email + "'",function(err,result,fields){
    if(err) throw err;
    var data = {statements: result}
		res.json({dtatus:200,data:data});
  });

});

//Download Statement API
app.get('/api/documents/download', ensureAuthenticated, (req, res) => {
  //TODO Path validation
  var root = path.join(__dirname,"/user_data")

  var filename = path.join(root,req.query.file);
  if(filename.indexOf(__dirname)!==0){
    //trying to escape root directory
    res.json({status:403, msg: "Access Denied "})
  }else{
    res.download(filename);
  }
});


//SQL INJECTION
app.post('/api/update/name', ensureAuthenticated, (req,res)=>{
  //TODO: ADD UPDATE NAME SQL FUNCTION FROM users.js updateName
  connection.query("UPDATE users SET name = '" + req.body.name + "' WHERE email='" + sessions.email + "'; SELECT name FROM users WHERE email ='" + sessions.email + "';",function(err,result,fields){
      res.json({result:result[1]})
  });

})

app.post('/api/user/add', ensureAuthenticated, (req,res)=>{
  // TODO: ADD INPUT VALIDATION HERE & Password HASH:
  // Add user to DB
  User.addnew(connection, req.body.name, req.body.email,req.body.password)
  .then(results=>{
    console.log(results.status)
    res.json({status:200,msg:"user created successfully"})
  })
  .catch(error=>{
    console.log(error)
    res.json({status:512,msg:"user creation failed"})
  })

})
