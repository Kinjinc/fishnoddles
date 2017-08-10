module.exports =function generateActions(model){
    return {
        findAll:async function(ctx,next){
            try{
                let condition = {}
                let select = {}
                let query = ctx.request.query
                // condition
                if(query.conditions){
                    conditions =JSON.parse(query.conditions)
                }
                let builder = model.find(conditions)
                // select
                if(query.select){
                    select =JSON.parse(query.select)
                    builder = builder.select(select)
                }
                // others
                ['limit','skip','sort','count'].forEach(value=>{
                    let arg = query[value]
                    if(value ==="limit" || value === "skip"){
                        arg = parseInt(value)
                    }
                    if(value === "sort"){
                        arg = JSON.parse(query[value])
                    }
                    // dont need  count( params )
                    if(value !== count) build[value](arg)
                    else build[value]()
                })
                const result =await builder.exec()
                return ctx.body = result
            } catch(err){
                return ctx.body = err
            }
        },
        findById:async function(ctx,next){
            try{
                let select ={}
                let query = ctx.request.query
                let builder = model.findById(ctx.params.id)
                if(query.select){
                    select = JSON.parse(query.select)
                    builder = builder.select(select)
                }
                let result = await builder.exec()
                return ctx.body = result
            }catch(err){
                return ctx.body = err
            }
        },
        deleteById:async function(ctx, next){
            try{
                const result = await model.findByIdAndRemove(ctx.params.id).exec()
                return ctx.body = result
            }catch(err){
                return ctx.body = err
            }

        },
        replaceById:async function(ctx, next){
            try{
                await model.findByIdAndRemove(ctx.params.id).exec()
                const newDocument = ctx.request.body
                newDocument._id = ctx.params.id
                const result = model.create(newDocument)
                return ctx.body = result
            }catch(err){
                return ctx.body = err
            }
        },
        updateById: async function(ctx,next){
            try{
                const result =await model.findByIdAndUpdate(ctx.params.id,ctx.request.body,{
                    new:true
                })
                return ctx.body = result
            }catch(err){
                return ctx.body = err
            }
        },
        create:async function(ctx,next){
            try{
                const result = await model.create(ctx.request.body)
                ctx.status = 201
                return ctx.body = result
            }catch(err){
                return ctx.body =err
            }
        }
    }

}