const express = require('express');
const router = express.Router();
const userContoller = require('../Controllers/userController');
const { verifyLoginUser, Nosession } = require('../Middlewares/session');


router.get('/', userContoller.getHome);

router.get('/login', Nosession, userContoller.getLogin);

router.post('/login', Nosession, userContoller.postLogin);

router.get('/signUp', Nosession, userContoller.getSignUp);

router.post('/signUp', Nosession, userContoller.postSignUp);

router.get('/otp', Nosession, userContoller.getOtp);

router.post('/otp', Nosession, userContoller.postOtp);

router.get('/likes', verifyLoginUser, userContoller.getLikes);

router.get('/addLike', verifyLoginUser, userContoller.addlike)

router.get('/profile', userContoller.getProfile);

router.get('/deleteMe', userContoller.deleteMe);

router.get('/browse', userContoller.getBrowse);

router.post('/productSearch',userContoller.postSearch);

router.get('/about', (req, res) => {
  res.render('user/about')
});

router.get('/carDetails', userContoller.getCarDetail);

router.get('/contact', (req, res) => {
  res.render('user/contact')
});

router.get('/forgotPass',Nosession,(req, res) => {
  res.render('user/email')
});

router.post('/emailPost',Nosession, userContoller.emailPost);

router.get('/onlyOtp',Nosession, userContoller.getOnlyOtp);

router.post('/onlyOtpPost',Nosession, userContoller.onlyOtpPost);

router.get('/setPassword',Nosession, userContoller.getSetPassword);

router.put('/setPassword',Nosession, userContoller.postSetPassword);

router.get('/editMe', verifyLoginUser, userContoller.editMe);

router.put('/editMe', verifyLoginUser, userContoller.postEditMe);

router.get('/removeLike', verifyLoginUser,userContoller.removeLike);

router.post('/applyCoupon',verifyLoginUser ,userContoller.coupon);

router.post('/product/order', verifyLoginUser,userContoller.order);

router.post('/verifyPayment', verifyLoginUser,userContoller.verifyPayment);

router.get('/myOrders',verifyLoginUser,userContoller.myOrder);

router.post('/cancelOrder',verifyLoginUser,userContoller.cancelOrder);

router.post('/payNow',verifyLoginUser,userContoller.payNow);

router.post('/verifyFull',verifyLoginUser,userContoller.verifyFull)

router.get('/signOut', verifyLoginUser,userContoller.signOut);

router.get('/500', userContoller.netErr);

router.get('/404',userContoller.not);


// router.get('/locate',(req,res)=>{
//   res.render('admin/location')
// })



// router.post('/locate',async(req,res)=>{
//   await Location.find()
// })

module.exports = router;