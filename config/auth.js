


module.exports = {
  verifyPermission: (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error_msg", " Please Login Admin Prevelages Required To View Resource");
        res.redirect("/admin/login");
    }
},
}