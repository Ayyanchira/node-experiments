// var mysql = require('mysql');
//
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'password',
//   database : 'BeaconMessages'
// });
//
// connection.connect(function(err){
// if(!err) {
//     console.log("Database is connected ... nn");
// } else {
//     console.log("Error connecting database ... nn");
// }});
//
// exports.addProduct = function(req,res){
//   var product={
//     "name":req.body.name,
//     "region":req.body.region,
//     "photo":req.body.photo,
//     "price":req.body.price,
//     "discount":req.body.discount
//   }
//   connection.query('INSERT INTO Products SET ?',product, function (error, results, fields) {
//   if (error) {
//     console.log("error ocurred",error);
//     res.send({
//       "code":400,
//       "failed":"error ocurred"
//     })
//   }else{
//     res.send({
//       "code":200,
//       "success":"product added successfully"
//         });
//   }
//   });
// };
//
// /*All Products*/
// exports.allProducts = function(req,res){
//   connection.query('Select * from Products', function (error, results, fields) {
//   if (error) {
//     console.log("error ocurred",error);
//     res.send({
//       "code":400,
//       "failed":"error ocurred"
//     });
//   }else if (results.length>0) {
//     var productArr=[];
//     res.send({
//       "result":results
//     });
//   }else{
//     res.send({
//       "code":200,
//       "success":"no products in the store"
//         });
//   }
//   });
// };
//
// /*Products By Region*/
// exports.productsByRegion = function(req,res){
//   var region = req.params.region;
//   connection.query('Select * from Products where region=?',[region], function (error, results, fields) {
//   if (error) {
//     console.log("error ocurred",error);
//     res.send({
//       "code":400,
//       "failed":"error ocurred"
//     });
//   }else if (results.length>0) {
//     var productArr=[];
//     res.send({
//       "result":results
//     });
//   }else{
//     res.send({
//       "code":200,
//       "success":"no products in the store"
//         });
//   }
//   });
// };
