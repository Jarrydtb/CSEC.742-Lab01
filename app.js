//NPM File imports
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var vhost = require('vhost');
var session = require('express-session');
var cookieParser = require('cookie-parser');

//Custom File imports

//Inpute Validation
var validationModule = require('./security/inputValidation.js')
const Validation = new validationModule();


//SQL Files
var db = require('./db/initdb.js')//TODO CLose connection per request.
var userDB = require('./db/users.js')
var accountsDB = require('./db/accounts.js')
var statementsDB = require('./db/statements.js')



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
  // Logout Route
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

app.get('/transferfunds', ensureAuthenticated,(req, res) => {                    // Transfer funds Page
    Accounts.getBalance(req.user.email)
    .then(data=>{
      res.render('transferFunds',{data:data.data});
    })
    .catch(err=>{
      res.render('transferFunds',{data: []});
    })

});

app.get('/statementspage', ensureAuthenticated, (req,res) => {
  res.render('statements',{name:req.user.name});
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
        return res.redirect('/login');
      }
      req.logIn(user, (logInErr) => {
        if (logInErr) {
          console.log(logInErr)
        }
        req.session.save(() => {
          if(req.user.account_type=="admin"){
            res.redirect('/admin/dashboard')
          }else{
            res.redirect('/dashboard')
          }
        });
      });
    })(req, res, next);
  });

//Login API - Admin user
app.post('/api/admin/login', (req, res, next) => {
  passport.authenticate('local',(err,user) =>{
    if (err) {
        console.log(err);
      }
      console.log('user', user);
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (logInErr) => {
        if (logInErr) {
          console.log(logInErr)
        }
        req.session.save(() => {
          if(req.user.account_type=="admin"){
            res.redirect('/admin/dashboard')
          }else{
            res.redirect('/dashboard')
          }
        });
      });
    })(req, res, next);
});

//Transfer funds API
app.post('/api/transferfunds',ensureAuthenticated,(req,res)=>{
  //TODO amount validation and email validation (exists)
  Validation.validateTransferAmount(req.user.email,req.body.amount)
  .then(result=>{

    Accounts.balanceUpdate(req.body.recipient,req.user.email,req.body.amount)
    .then(result=>{
      res.redirect(301,'/transferFunds')
    })
    .catch(err=>{
      console.log(err)
      res.redirect(301,'/transferFunds')
    })

  })
  .catch(err=>{
    console.log(err)
    res.redirect(301,'/transferFunds')
  })



  // END
  // connection.query("UPDATE accounts SET balance = balance +" + req.body.amount + " WHERE email = '" + req.body.recipient + "';" +
  // "UPDATE accounts SET balance = balance - " + req.body.amount + " WHERE email='" + sessions.email + "'",(err,result,fields)=>{
  //   console.log(result)
  //   res.redirect(301,'/transferFunds')
  // });


});

//Fetch Statements API
app.get('/api/fetch/statement_list',ensureAuthenticated,(req,res)=>{
  Statements.fetchStatements(req.user.email)
  .then(results=>{
    console.log(results)
    res.json({status:200,data:results});
  })
  .catch(error=>{
    res.json({status:202,data:[]});
  })
});

//Download Statement API
app.get('/api/documents/download', ensureAuthenticated, (req, res) => {
  //TODO Path validation
  try {
    var root = path.join(__dirname,"/user_data")
    if(Validation.validatePath(req.user.id,req.query.file)){res.json({status:403, msg: "Access Denied "})}
    var filename = path.join(root,req.query.file);
    if(filename.indexOf(__dirname)!==0){
      //trying to escape root directory
      res.json({status:403, msg: "Access Denied "})
    }else{
      res.download(filename, function(err){
        res.json({status:403, msg: "Access Denied "})
      });
    }
  } catch (e) {
    res.json({status:403, msg: "Access Denied "})
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
  Validation.validatePassword(req.body.password)
  .then(hashedPassword=>{
    if(!Validation.validateEmail(req.body.email)||!Validation.validateString(req.body.name)){tres.json({status:403, msg: "Access Denied "})}

    User.addNew(req.body.name, req.body.email, hashedPassword)
    .then(results=>{
      console.log(results.status)
      //res.json({status:200,msg:"user created successfully"})
      res.redirect(301,'/admin/dashboard')
    })
    .catch(error=>{
      console.log(error)
      // res.json({status:512,msg:"user creation failed"})
      res.redirect(301,'/admin/dashboard')
    })
  })
  .catch(error=>{
    console.log(error)
    // res.json({status:512,msg:"user creation failed"})
    res.redirect(301,'/admin/dashboard')
  });

})
