var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var checkNotLogin = require('../middlewares/check').checkNotLogin;
var UserModel = require('../models/users');


//GET /signin 登录页面
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')

});

//POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;

    UserModel.getUserByName(name)
        .then(function (user) {
            if (!user) {
                req.flash('error', 'no such user');
                return res.redirect('back');
            }
            if (sha1(password) !== user.password) {
                req.flash('error', 'wrong password');
                return res.redirect('back');
            }

            //success
            req.flash('success', 'login success');
            delete user.password;
            
            console.log(user);
            req.session.user = user;

            res.redirect('/posts');


        }).catch(next)

});

module.exports = router;