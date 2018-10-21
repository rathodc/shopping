var facade_dal = require(process.env.NODE_SRC_DIR+"/catalog/dal/catalog_dal");
var exports = {}
var menu = {}
var tempobj = {}
var __add_child_item = function(child_obj,parent_obj){
    delete child_obj.parent_id_list
    parent_obj["child_items"].push(child_obj)   
    tempobj[child_obj._id] = parent_obj["child_items"][parent_obj["child_items"].length-1]
    tempobj[child_obj._id]["child_items"] = []
}



exports.addCategory = function(obj,cbk){
    obj.has_category=false;
    obj.has_product=false;
    facade_dal.addCategory(obj,cbk)
}

exports.addProduct = function(obj,cbk){
    if(!obj["description"]) obj["description"] = ""
    facade_dal.addProduct(obj,cbk)
}

exports.getAllCategories = function(cbk){
    var bl_cbk = function(result){
        if(result.error)
            cbk({error:true,data:{}})
        else{
            for(i in  result.data){
                obj = result.data[i]
                if(obj.parent_id_list.length==0){
                    // menu[obj._id] = obj
                    menu = obj
                    // delete menu[obj._id].parent_id_list
                    delete menu.parent_id_list
                    // menu[obj._id]["child_items"] = []
                    menu["child_items"] = []
                    // tempobj[obj._id] = menu[obj._id]
                    tempobj[obj._id] = menu
                }
                else{
                    __add_child_item(obj,tempobj[obj.parent_id_list[0]])
                }
            }    
            cbk({error:false,data:menu})                    
        }
    }
    facade_dal.getAllCategories(bl_cbk)
}

exports.getProducts = function(obj,cbk){
    facade_dal.getProducts(obj,cbk)
}

exports.updateProduct = function(product,obj,cbk){
    facade_dal.updateProduct(product,obj,cbk)
}

module.exports = exports