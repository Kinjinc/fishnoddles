const restc = require('restc')
module.exports =class{
    async beforeUseRoutes({app}){
        app.user(restc.koa2())
    }
}