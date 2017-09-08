var User = require('../lib/mongo').User;

module.exports = {
    //注册用户
    create:function (user) {
        return User.create(user).exec();
    },

    getUserByName:function (name) {
        return User
            .findOne({ name: name })
            .addCreatedAt()//自定义插件，根据_id生成时间戳
            .exec();
    }
}