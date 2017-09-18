var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'BeaconMessages'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}});


exports.signup = function(req,res){
  console.log("signup function called");
  //validation
  if (req.body.email == ""){
    res.send({
      "code":404,
      "success":"email is empty"
        });
        return;
  }
  if (req.body.password != req.body.passwordConfirmation){
    res.send({
      "code":405,
      "success":"Password mismatch"
        });
        return;
  }

  //object creation
  var user={
    "username":req.body.username,
    "fullname":req.body.fullname,
    "email":req.body.email,
    "password":req.body.password
  }
  connection.query('INSERT INTO Users SET ?',user, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    if(error.errno == 1062){
      res.send({
        "code":401,
        "failed":"Username already exists. Please try a different username"
      })
    }
      res.send({
        "code":400,
        "failed":"error ocurred"
      })


  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
      }
  });
};

exports.login = function(req,res){
  console.log("Login API----\n");
  var username = req.body.username;
  var password = req.body.password;
  connection.query('SELECT * FROM Users WHERE username = ?',[username], function (error, results, fields) {
  if (error) {
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    if(results.length >0){
      if(results[0].password == password){
        var user = {
          "username":results[0].username,
          "password":results[0].password,
          "fullname":results[0].fullname,
          "email":results[0].email
        };
        //var token = jwt.sign(user, 'signingkey');
        res.send({
          "code":200,
          "success":"login sucessfull",
          //"token":token,
          "username":user.username
            });
      }
      else{
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Username does not exits."
          });
    }
  }
  });

}

exports.composeMessage = function(req, res){
  console.log("composeMessage API----\n");
  var message={
    "to":req.body.to,
    "from":req.body.from,
    "message":req.body.message,
    "region":req.body.region
  }
  connection.query('INSERT INTO Messages SET ?',message, function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"Message sent!"
        });
      }
  });
}

//getAllContacts
  exports.getAllContacts = function(req, res){
    console.log("getting all contacts");
    var username = req.body.username; //replace it by jwt implementation
    connection.query('Select username from Users where username != ?',[username], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    }else if (results.length>0) {
      var productArr=[];
      res.send({
        "result":results
      });
    }else{
      res.send({
        "code":200,
        "success":"no products in the store"
          });
    }
    });
  }

  //get Messages
  exports.getMessages = function(req, res){
    console.log("getting all contacts");

    username = req.body.username;
    connection.query('Select * from Messages where to=? ',username, function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    }else if (results.length>0) {
      var productArr=[];
      res.send({
        "code":200,
        "result":results
      });
    }else{
      res.send({
        "code":201,
        "success":"No messages found..."
          });
    }
    });
  }
