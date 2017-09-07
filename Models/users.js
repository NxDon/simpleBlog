var User = require('../lib/mongo').User;

module.exports = {
    //注册用户
    create:function (user) {
        return User.create(user).exec();
    }
}