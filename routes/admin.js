const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const upload = require('../Middlewares/multer');
const { veryfyLoginAdmin } = require('../Middlewares/session')


router.get('/', adminController.getlogin);

router.post('/login', adminController.postlogin);

router.get('/home', veryfyLoginAdmin, adminController.gethome);

router.post('/categorySales',adminController.categorySales);

router.post('/monthlySales',adminController.monthlySales)

router.get('/block', veryfyLoginAdmin, adminController.block);

router.get('/unBlock', veryfyLoginAdmin, adminController.unBlock);

router.get('/car', veryfyLoginAdmin, adminController.getcar);

router.get('/addCar', veryfyLoginAdmin, adminController.getaddcar);

router.post('/addCar', veryfyLoginAdmin, upload.array('image', 3), adminController.postaddcar);

router.get('/editCar', veryfyLoginAdmin, adminController.geteditcar);

router.put('/editCar/:id', upload.array('image', 3), adminController.posteditcar);

router.delete('/deleteCar/:id', veryfyLoginAdmin, adminController.deletecar);

router.get('/category', veryfyLoginAdmin, adminController.getCategory);

router.post('/categoryPost', adminController.postCategory);

router.get('/delete', veryfyLoginAdmin, adminController.deleteUser);

router.get('/tables', veryfyLoginAdmin, adminController.getTable);

router.get('/coupon', veryfyLoginAdmin, adminController.coupon);

router.post('/postCoupon', veryfyLoginAdmin, adminController.couponPost);

router.get('/banner', veryfyLoginAdmin,adminController.banner)

router.get('/addBanner', veryfyLoginAdmin, adminController.addBanner)

router.get('/editBanner', veryfyLoginAdmin, adminController.editBanner);

router.put('/postEditBanner', veryfyLoginAdmin, upload.array('image', 1), adminController.postBanner);

router.post('/addBanner', veryfyLoginAdmin, upload.array('image', 1), adminController.postAddBanner)

router.get('/deleteBanner',adminController.deleteBanner);

router.get('/signOut', adminController.signout);

router.get('/404', adminController.not)

module.exports = router;
