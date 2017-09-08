var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');


// GET /posts 所有用户或者指定用户的文章页
// eg:GET /posts?author=xxxx
router.get('/', function (req, res, next) {
    var author = req.query.author;
    PostModel.getPosts(author)
        .then(function (post) {
            res.render('posts',{
                posts:post
            })
        }).catch(next)


    console.log('getting posts');



});

//POST /posts 发表文章
router.post('/', checkLogin, function (req, res, next) {
     var author = req.session.user._id;
     var title = req.fields.title;
     var content = req.fields.content;

     //校验
    try{
        if(!title){
            throw new Error('please input title');
        }
        if(!content){
            throw new Error('please input content');
        }
    }catch (error){
        req.flash('error', error);
        res.redirect('back');
    }

    var post = {
        author: author,
        title : title,
        content : content,
        pv : 0
    }

    PostModel.create(post).then(function (result) {
        //  result 是插入 mongodb 后的值，包含 _id
        post = result.ops[0];
        req.flash('success', '发表成功');
        // 发表成功后跳转到该文章页
        res.redirect(`/posts/${post._id}`);
    }).catch(next);

})

//GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    res.render('create');
});

//GET /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    res.send(req.flash());
});

//GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    res.send(req.flash());

});

//POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
    res.send(req.flash());

});

//GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remote', checkLogin, function (req, res, next) {
    res.send(req.flash());
});


module.exports = router;
