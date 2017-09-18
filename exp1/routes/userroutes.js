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
      console.log("Database is connected..");
    } else {
      console.log("Error connecting database..");
    }
});

//signup
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

//login
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

//compose message
exports.composeMessage = function(req, res){
  console.log("composeMessage API----\n");
  var message={
    "recipient":req.body.to,
    "sender":req.body.from,
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
    var username = req.body.username;
    console.log("getting messages for "+username);
    connection.query('Select * from Messages where recipient = ?',[username], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    }else if (results.length>0) {
      var productArr=results;
      for(var i=0;i<productArr.length;i++){
        if (productArr[i].islock == 1){
          productArr[i].message = "Message locked. Go near "+productArr[i].region+" region to unlock the message";
          console.log('message altered');
        }
      }
      res.send({
        "code":200,
        "result":productArr
      });
    }else{
      res.send({
        "code":201,
        "success":"No messages found..."
          });
    }
    });
  }

//deleteMessage
exports.deleteMessage = function(req, res){
    var messageId = req.body.messageId;
    console.log("deleting message...");
    connection.query('delete from Messages where messageId = ?',[messageId], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    }else if (results.affectedRows == 0) {
      res.send({
        "code":202,
        "success":"Message already deleted from server."
      });
    }else{
      res.send({
        "code":200,
        "success":"Message deleted."
          });
    }
    });
  }

//read message
exports.readMessage = function(req, res){
    var messageId = req.body.messageId;
    connection.query('select * from Messages where messageId = ?',[messageId], function (error, results, fields) {
    if (error) {
      console.log("error ocurred",error);
      res.send({
        "code":400,
        "failed":"error ocurred"
      });
    }
    else{
      if (results[0].islock == 0) {
        connection.query('update Messages set isread = 1 where messageid =?',[messageId], function (error, results, fields) {
          if (error) {
            console.log("error ocurred",error);
            res.send({
              "code":400,
              "failed":"error ocurred"
            });
          }
          else{
            res.send({
              "code":200,
              "success":"message successfully marked as read."
                });
          }
        });
      }
      else {
        res.send({
          "code":405,
          "message":"message is locked. Cannot be marked as read."
        });
      }
    }
  });
}

//unlockMessage
exports.unlockMessage = function(req, res){
    var messageId = req.body.messageId;
    console.log("unlocking message with messageid "+messageId);
    connection.query('update Messages set islock = 0 where messageid =?',[messageId], function (error, results, fields) {
      if (error) {
        console.log("error ocurred",error);
        res.send({
          "code":400,
          "failed":"error ocurred"
        });
      }
      else{
        res.send({
          "code":200,
          "success":results
            });
      }
    });
}
