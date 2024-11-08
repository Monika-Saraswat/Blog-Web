const exp=require('express');
const { authenticateJWT } = require('../middleware/auth.middleware');
const {register,verifyEmail,login,logout} = require('../controllers/auth');
const authroutes=exp.Router();

authroutes.post('/signin',register)
authroutes.post('/verifyemail',verifyEmail)
authroutes.post('/login',login);


module.exports=authroutes