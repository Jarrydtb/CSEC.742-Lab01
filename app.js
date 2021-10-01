var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require("path");

// var root_directory = '/var/www'
// var rootdir = ""

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.listen(3000, (req,res) => console.log("Server Listening"));


//MYSQL CONFIGURATION

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'lab01'
});


//PAGE ROUTES
app.get('/', (req, res) => {
  res.render('landingPage');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/documents/download', (req, res) => {
  console.log(req.query)
});


//ADMIN ROUTES
app.get('/admin', (req, res) => {
  res.render('adminLogin');
});


app.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard');
});

//API ROUTES
app.post('/api/auth', (request, response) => {
  console.log(typeof(request.body.password));
  var filename = path.join(__dirname, request.body.password);
  response.download(filename)
});

app.post('/api/admin/login', (request, response) => {
  const tmpUser = "adminguest";
  const tmpPass = "guestpassadmin";
  if(request.body.email === tmpUser && request.body.password === tmpPass){
    // response.json({status:200})
    response.redirect("/admin/dashboard")
  }
});
