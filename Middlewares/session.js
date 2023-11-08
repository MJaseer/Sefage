let msg = "";
module.exports = {
    veryfyLoginAdmin: (req,res,next) => {
        if(req.session.email){
            next();
        }else{
            msg = "Please Login"
            res.redirect('/admin')
        }
    },
    verifyLoginUser: (req,res,next)=>{
        if(req.session.username){
            next();
        }else{
            msg = "Please Login"
            res.redirect('/')
        }
    },
    Nosession: (req,res,next)=>{
        if(req.session.username){
            res.redirect('/')
        }else{
            next();
        }
    }
}