global.Promise = require("bluebird")
const log = require('./utils/log')
const Koa = require('koa')
const koaRouter = require('koa-router')

const mongoRest = require('./mongoRest')
const models = require('./mongo/mongo')
const redis = require('./mongo/redis')
const config = require('./conf/config')

const configName = process.env.NODE_ENV ==="development"?"dev":"prod"
const blogpackConfig =require(`./build/blogpack.${configName}.config`)
blogpackConfig.models = models
blogpackConfig.redis = redis
const blogpack = require('./blogpack')
 const lifecycle = global.lifecycle = new blogpack(blogpackConfig)

const app = new Koa()
const router = koaRouter()

;(async ()=>{
    try{
        /*
        * 初始化路由状态,链接数据库
        *
        *
        * */
        await lifecycle.beforeUseRoutes({
            config:lifecycle.config,
            app,
            router,
            models,
            redis
        })

        /*
        * 登入登出验证等常规接口
        *
        *
        * */
        const beforeRestfulRoutes = lifecycle.getBeforeRestfulRoutes()
        const afterRestfulRoutes = lifecycle.getAfterRestfulRoutes()

        const middlewareRoutes = await lifecycle.getMiddlewareRoutes()

        console.log(1)
        for( const item of middlewareRoutes){
            const middlewares = [...item.middleware]
            
            item.needBeforeRoutes && middlewares.unshift(...beforeRestfulRoutes)
            item.needAfterRoutes && middlewares.push(...afterRestfulRoutes)
            console.log(middlewares[0])
            router[item.method](item.path,...middlewares)
        }
        
        Object.keys(models).map(name=>models[name]).forEach(model=>{
            mongoRest(router,model,'/api',{
                beforeRestfulRoutes,
                afterRestfulRoutes
            })
        })
       
        app.use(router.routes())
        
        const beforeServerStart = lifecycle.getBeforeServerStartFuncs()
        for (const middleWare of beforeServerStart){
            await middleWare()
        }
        app.listen(config.serverPort,()=>{
            log.info(`Koa2 server is running at ${config.serverPort}`)
        })
    }catch(err){
        log.error(err)
    }
})()