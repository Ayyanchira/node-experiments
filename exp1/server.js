var express    = require("express");
var user = require('./routes/userroutes');
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

router.post('/signup',user.signup);
router.post('/login',user.login);
router.post('/getMessages',user.getMessages);
router.post('/composeMessage',user.composeMessage);
router.post('/deleteMessage',user.deleteMessage);
router.post('/getAllContacts',user.getAllContacts);
router.post('/readMessage',user.readMessage);
//router.post('/unlockMessage',user.unlockMessage);
app.use('/api', router);
app.listen(3000);
// app.listen(3000, ()=>{
//   console.log('Server started on 3000 port...');
// });
