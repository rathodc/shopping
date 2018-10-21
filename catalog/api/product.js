/******************Start Up****************************** */
var log = require('log4js').getLogger("product")
var load_manager = require(process.env.NODE_SRC_DIR+"/load_manager")
var Validator = require('jsonschema').Validator;
var validator_obj = new Validator();
var add_product_schema = {    
    "type": "object",
    "properties": {
      "title": {"type": "string","minLength" : 3,"maxLength" : 50},
	  "parent": {"type": "string","minLength" : 8,"maxLength" : 10},
	  "price":{"type": "string","minLength" : 6,"maxLength" : 10},
	  "description":{"type": "string","maxLength" : 100},
	  "_id":{"type": "string","minLength" : 8,"maxLength" : 10}
	},
	"required": ["title","parent","price"]
};  

var define_middleware = function(resolve,reject){	
	router.use('/catalog/product',jsonParser,product_ml)
	resolve()
}

var define_routes = function(resolve,reject){
	router.post('/catalog/product',jsonParser,add_product_handler)	
	router.put('/catalog/product/:id',jsonParser,update_product_handler)	
	resolve()
}

var define_error_handler = function(resolve,reject){
	router.use('/catalog/product',product_eh)
	router.use('/catalog/product/:id',product_eh)
	resolve()
}

var error_obj = {
                    "NOT_FOUND":{"status":404,"message":"Content tree not found"},
					"METHOD_NOT_ALLOWED":{"status":405,"message":"Method not allowed"},
					"PARAM_MISSING":{"status":400,"message":"Required param 'product' missing"},
					"INVALID_REQUEST":{"status":400,"message":"Input body invalid"}
                }

load_manager.registerToStage(load_manager.getMiddlewareStage(),define_middleware)
load_manager.registerToStage(load_manager.getRoutesStage(),define_routes)
load_manager.registerToStage(load_manager.getErrorHandlerStage(),define_error_handler)
/***************************************************************************************/

/************************** Middle Ware**********************************/

var validate_and_go_next = function(schema,req,res,next){
	var result = validator_obj.validate(req.body,schema);
	if(result.errors.length>0){
		console.log("Invalid request")
		next(new Error("INVALID_REQUEST"))
	}else	
		next()
}

var product_ml = function(req,res,next){
	if(req.method=="POST") {
		validate_and_go_next(add_product_schema,req,res,next)
	}
	else if(req.method=="PUT"){
		next()
	}
	else{
		next(new Error("METHOD_NOT_ALLOWED"))
	}	
}

/***************************************************************************************/

/************************** Route Handler**********************************/
var facade_bl = require(process.env.NODE_SRC_DIR+"/catalog/bl/catalog_bl")

var add_product_handler = function(req,res,next){	
	log.debug("add_product_handler")
	var cbk = function(result){
		res.setHeader('Content-Type', 'application/json')
		if(result.error)
			res.status(400).send({"error_title":"Bad Request","error_message":"Cannot add product"})			
		else
			res.status(201).send(result.data)								
	}
	facade_bl.addProduct(req.body,cbk)
}

var update_product_handler = function(req,res,next){	
	var cbk = function(result){
		res.setHeader('Content-Type', 'application/json')
		if(result.error)
			res.status(400).send({"error_title":"Bad Request","error_message":"Could not update product"})			
		else
			res.status(200).send(result.data)								
	}
	facade_bl.updateProduct(req.params.id,req.body,cbk)
}

/***************************************************************************************/

/************************** Error Handler **********************************/
var product_eh = function(err, req, res, next) {
    log.debug("Product Error handler")
    var a = err.message
    res.status(error_obj[a].status || 404).send({"error_title":a,"error_message":error_obj[a].message})
}

/***************************************************************************************/
