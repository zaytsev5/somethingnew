module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
            return next()
    }
    req.flash('error_msg', 'Vui lòng đăng nhập');
    res.redirect('/user/account#dangnhap');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    console.log(req.user)
    res.redirect('/home');      
  }

};
