const redis  = require('../../mongo/redis')
const tokenService = require('../../service/token')

module.exports = class{
    async beforeRestful(ctx,next){
        const isGettingUser = ctx.url.startsWith('/api/user')
        const isGettingAdmin = ctx.url.startsWith('/admin/')
        const isGet = ctx.url.startsWith('/api/') &&ctx.method ==='GET'
            // 非User表的get请求无需验证
            // user表以及非get请求,都要通过验证
        if(!isGettingAdmin && !isGettingUser && isGet){
            return next()
        }
        const headers =ctx.request.headers
        let token
        try{
            token = headers['authorization']
        }catch(err){
            return ctx.body={
                status:'fail',
                description:err
            }
          if(!token){
                return ctx.body={
                    status:'fail',
                    description:'Token not found'
                }
          }
          const result = tokenService.verifyToken(token)
            if(!result){
              return ctx.body ={
                  status:'fail',
                  description:'Token verity Failed'
              }
            }
            let reply = await redis.getAsync('token')
            if(reply === token){
                return next()
            }else{
                return ctx.body = {
                    status:'fail',
                    description:'Token invalid'
                }
            }
        }
    }
}