const ratelimit = require('koa-retelimit')
module.exports =class{
    constructor(options){
        this.options = options
    }
    async beforeUseRoutes({app,redis}){
        const config =Object.assign({},this.options,{
            db:redis
        })
        app.use(ratelimit(config))
    }
}