var express    = require("express");
var product = require('./routes/productroutes');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();

//route to handle product operation
// router.post('/addProduct',product.addProduct);
// router.get('/allProducts',product.allProducts);
// router.get('/allProducts/:region',product.productsByRegion);

router.post('/signup',product.signup);
// router.post('/login',product.login);
// router.post('/getMessages',product.getMessages);
// router.post('/composeMessage',product.composeMessage);
// router.post('/deleteMessage',product.deleteMessage);
// router.post('/getAllContacts',product.getAllContacts);

app.use('/api', router);
//app.listen(3000);
app.listen(3000, ()=>{
  console.log('Server started on 3000 port...');
});
