var mysql = require('mysql');

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
  if (req.body.email == ""){
    res.send({
      "code":404,
      "success":"email is empty"
        });
  }
  if (req.body.password != req.body.passwordConfirmation){
    res.send({
      "code":405,
      "success":"Password mismatch"
        });
  }

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
