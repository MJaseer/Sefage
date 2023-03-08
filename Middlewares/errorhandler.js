
const errorhandler = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    console.log("this is error.msg", err.message, "this is error.msg")
    res.render('user/500');
}

module.exports = {
    errorhandler
}
