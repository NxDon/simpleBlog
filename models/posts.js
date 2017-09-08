var Post = require('../lib/mongo').Post;
var marked = require('marked');//markdown 支持

Post.plugin('contentToHtml', {
    afterFind: function (posts) {
        return posts.map(function (post) {
            post.content = marked(post.content);
            return post;
        })
    },

    afterFindOne: function (post) {
        post.content = marked(post.content);
        return post;
    }
});

module.exports = {
    // 创建一篇文章
    create: function create(post) {
        return Post.create(post).exec();
    },

    // 通过文章 id 获取一篇文章
    getPostById: function getPostById(postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawPostById: function (postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },
    // 通过用户 id 和文章 id 更新一篇文章
    updatePostById: function (postId, authorId, data) {
        return Post.update({author: authorId, _id: postId}, {$set: data}).exec();
    },
// 通过用户 id 和文章 id 删除一篇文章
    delPostById: function (postId, authorId) {
        return Post.remove({author: authorId, _id: postId}).exec();
    },
    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(postId) {
        return Post
            .update({_id: postId}, {$inc: {pv: 1}})
            .exec();
    }
};