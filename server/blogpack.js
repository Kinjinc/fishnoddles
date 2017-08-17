module.exports = class blogpack {
    constructor(options) {
        this.config = options.config || {}
        this.plugins = options.plugins || []
        this.models = options.models
        this.redis = options.redis
    }
    /*
    * app挂载第三方中间件
    *
    *
    * */
    async beforeUseRoutes(...args) {
        for (const plugin of this.plugins) {
            plugin.beforeUseRoutes && await plugin.beforeUseRoutes(...args)
        }
    }
    /*
    * 返回routes对象
    *
    * */
    async getMiddlewareRoutes(){
        const plugins = this.plugins.filter(plugin=>plugin['mountingRoute'])
        const result = []
        for(const plugin of plugins){
            const routeObj =await plugin.mountingRoute()
            result.push(Object.assign({},routeObj,{
                needBeforeRoutes:routeObj.needBeforeRoutes || false,
                needAfterRoutes:routeObj.needAfterRoutes || false
            }))
        }
        return result
    }
    /*
    * 获取各种中间件方法函数
    *
    *
    * */
    getBeforeRestfulRoutes(){
        return this.plugins
            .filter(plugin=>plugin['beforeRestful'])
            .map(plugin=>plugin['beforeRestful'])
    }
    getAfterRestfulRoutes() {
        return this.plugins
            .filter(plugin => plugin['afterRestful'])
            .map(plugin => plugin['afterRestful'])
    }
    getBeforeServerStartFuncs() {
        return this.plugins
            .filter(plugin => plugin['beforeServerStart'])
            .map(plugin => plugin['beforeServerStart'])
    }

}



























