const redis = require('redis')
const tokenService = require('../../service/token')
module.exports = class{
    async mountingRoute(){
        return {
            method:'post',
            path:'/admin/logout',
            middleware:[middleware]
        }
    }
}
async function middleware(ctx ,next){
    const header = ctx.request.headers
    let token
    try{
        token = header['authorization']
    }catch(err){
        return ctx.body = {
            status: 'fail',
            description:err
        }
    }
    if(!token){
        return ctx.body ={
             status:'fail',
            description:'token not found'
        }
    }
    const result = tokenService.verifyToken(token)
    if(!result){
        return ctx.body ={
            status:'fail',
            description:'token verify failed'
        }
    }else{
        await redis.del('token')
        return ctx.body = {
            status:'success',
            description:'token deleted'
        }
    }
}