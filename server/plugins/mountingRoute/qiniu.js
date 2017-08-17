const qiniu =require('qiniu')
const fops = "imageMogr2/format/webp"




const policy = (name,fileName,{
    qiniuPipeline,
    qiniuBucketName
})=>{
    let urlEncode = qiniu.util.urlsafeBase64Encode(`${qiniuBucketName}:webp/${fileName}`);
    const persist = {}
    if(qiniuPipeline !== ''){
        persist.persistentOps=`${fops}|saveas/${urlEncode}`
        persist.persistentPipeline = qiniuPipeline
    }
    return Object.assign({},persist,{
        scope:name,
        deadline:new Date().getTime()+600
    })
}

















const getQiniuTokenFromFilename = (fileName,{
    qiniuBucketName,
    qiniuPipeline,
    qiniuBucketHost})=>{
    const key = `${qiniuBucketName}:${fileName}`
    const putPolicy = new qiniu.rs.putPolicy(policy(key,fileName,{
        qiniuPipeline,
        qiniuBucketName
    }))
    const upToken = putPolicy.uploadToken()
    return {
        upToken,
        key,
        bucketHost: qiniuBucketHost,
        supportWebp: qiniuPipeline !== ''
    }

}






module.exports = class{
    constructor(options){
        this.options = options
    }
    async mountingRoute(){
        return {
            method:"post",
            path:'/admin/qiniu',
            needBeforeRoutes:true,
            needAfterRoutes:false,
            middleware:[(ctx,next)=>{
                return ctx.response.body = getQiniuTokenFromFilename(
                    ctx.request.body.key,
                    this.options
                )
            }]
        }
    }
}