var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.listen(3000, (req,res) => console.log("Server Listening"));





//PAGE ROUTES
app.get('/', (req, res) => {
  res.render('landingPage');
});

app.get('/login', (req, res) => {
  res.render('login');
});



//ADMIN ROUTES
app.get('/admin', (req, res) => {
  res.render('adminLogin');
});

app.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard');
});


//API ROUTES
app.post('/api/login', (request, response) => {
  console.log(request.body);
});
