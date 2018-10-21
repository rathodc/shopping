var db = require(process.env.NODE_SRC_DIR+"/services/mongo_client");
var load_manager = require(process.env.NODE_SRC_DIR+"/load_manager");
var log = require('log4js').getLogger("catalog_dal")

const uuidv1 = require('uuid/v1');
var services = {};
var __is_parent_available = function(filter,update){
    return new Promise(function (resolve, reject) {
        db.getDBRef().collection('categories').findOneAndUpdate(
            filter,
            { $set: update},
            { returnOriginal : false },
            function(err,results){
                if (err) reject(err,results.value);                
                resolve(results.value);
            })
        })
}

var __initialize_data = function(resolve,reject){
    log.debug("__initialize_data")
    db.getDBRef().collection("categories").find({'parent_id_list':[]}).toArray((err,result)=>{
        if(err){
            reject(err);
            return;
        }        
        if(result.length>0) resolve();
        else{
            db.getDBRef().collection("categories").insertOne(
                {
                    _id:uuidv1().substr(0,8),
                    title:"Home",
                    parent_id_list:[],
                    has_category:false,
                    has_product:false
                },
                (err,result)=>{
                    if(err) reject(err);
                    else resolve();
                }
            )
        }
    })
}

services.addCategory = function(obj,cbk){
    var filter = { "_id" : obj.parent,"has_product":false};
    var update = { "has_category":true};
    __is_parent_available(filter,update).then(
        function(result){
            if(result && result.has_category){
                var uniquie_id = uuidv1().substr(0,8);
                db.getDBRef().collection('categories').insertOne(
                    {
                        _id:uniquie_id,
                        parent_id_list:[obj.parent],
                        has_category:false,
                        has_product:false,
                        title:obj.title
                    },
                    (err,data)=>{   
                        cbk({error:err,data:data.ops[0]})
                    }
                )     
            }
            else cbk({error:true,data:"Cannot add to this parent"})        
        }
    ).catch(function(err,result){
        cbk({error:true,data:"Cannot add to this parent"})
    })
}

services.addProduct = function(obj,cbk){
    var filter = { "_id" : obj.parent,"has_category":false};
    var update = { "has_product":true};
    __is_parent_available(filter,update).then(
        function(result){
            if(result && result.has_product){
                var uniquie_id = uuidv1().substr(0,8);
                db.getDBRef().collection('products').findOneAndUpdate(
                    { "_id" : obj._id?obj._id:uniquie_id},
                    { 
                        $set: {
                            title : obj.title,
                            price : obj.price,
                            description : obj.description
                        },
                        $push: { 
                            parent_id_list: obj.parent
                        }
                    },
                    { upsert:true,returnOriginal : false },
                    (err,data)=>{            
                            cbk({error:err,data:data.value})
                    }
                )
            }
            else cbk({error:true,data:"Cannot add to this parent"})        
        }
    ).catch(function(err,result){
        cbk({error:true,data:"Cannot add to this parent"})
    })
}

services.getAllCategories = function(cbk){
    db.getDBRef().collection('categories').find({}).toArray((err,result)=>{
        cbk({error:err,data:result})
    })
}

services.getProducts = function(obj,cbk){
    db.getDBRef().collection('products').find({ parent_id_list: { $all: [obj.category] } }).toArray((err,result)=>{
        cbk({error:err,data:result})
    })
}

services.updateProduct = function(product,obj,cbk){
    var new_obj={}
    if(obj.title) new_obj.title = obj.title
    if(obj.price) new_obj.price = obj.price
    if(obj.description) new_obj.description = obj.description

    db.getDBRef().collection('products').findOneAndUpdate(
        {_id:product},
        {$set:new_obj},
        {returnOriginal:false},
        (err,result)=>{
            cbk({error:result && result.value?false:true,data:result && result.value?result.value:{}})            
        }
    )
}

module.exports = services

load_manager.registerToStage(load_manager.getInitializeDataStage(),__initialize_data)