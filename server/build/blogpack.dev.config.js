const base =require('./blogpack.base.config')
const beforeRestfulPrefix = '../plugins/beforeRestfulPrefix'
const serverStartPrefix = '../plugins/beforeServerStart'
const useRoutesPrefix = '../plugins/beforeUseRoutes'
const mountingRoutePrefix = '../plugins/mountingRoute'
const env = process.env
const config = Object.assign({},base)

const BodyParserPlugin = require(`${useRoutesPrefix}/bodyParser`)
const LogTimePlugin = require(`${useRoutesPrefix}/logTime`)
const RestcPlugin = require(`${useRoutesPrefix}/restc`)

const InitOptionPlugin = require(`${serverStartPrefix}/initOption`)
const InstallThemePlugin = require(`${serverStartPrefix}/installTheme`)
const InitUserPlugin = require(`${serverStartPrefix}/initUser`)

const CheckAuthPlugin = require('../plugins/beforeRestful/checkAuth')

const QiniuUploadPlugin = require(`${mountingRoutePrefix}/qiniu`)
const LoginPlugin = require(`${mountingRoutePrefix}/login`)
const LogoutPlugin = require(`${mountingRoutePrefix}/logout`)

config.plugins.push(
    // beforeUseRoutes
    new BodyParserPlugin(),
    new LogTimePlugin(),
    new RestcPlugin(),

    // beforeRestful
    new CheckAuthPlugin(),

    // moutingRoute
    new QiniuUploadPlugin({
        qiniuAccessKey: env.qiniuAccessKey || 'HlaSZXu614KihLQeG2T9BzC_n2M5HIcG5TrJUGt1',
        qiniuSecretKey: env.qiniuSecretKey || 'bWR49i94MzbnNVj5eFheHc15i0K76vF41YDUVMDz',
        qiniuBucketHost: env.qiniuBucketHost || 'http://ouidlk7gx.bkt.clouddn.com',
        qiniuBucketName: env.qiniuBucketName || 'static-n',
        qiniuPipeline: env.qiniuPipeline || 'fishaudio'
    }),
    new LoginPlugin(),
    new LogoutPlugin(),

    // beforeServerStart
    new InitUserPlugin(),
    new InstallThemePlugin(),
    new InitOptionPlugin()

)
module.exports= config