/******************Start Up****************************** */
var log = require('log4js').getLogger("category")
var load_manager = require(process.env.NODE_SRC_DIR+"/load_manager")
var Validator = require('jsonschema').Validator;
var validator_obj = new Validator();
var category_schema = {    
    "type": "object",
    "properties": {
      "title": {"type": "string","minLenth" : 3,"maxLength" : 20},
      "parent": {"type": "string","minLenth" : 8,"maxLength" : 10}
	},
	"required": ["title","parent"]
  };

var define_middleware = function(resolve,reject){
	router.use('/catalog/category',jsonParser,category_ml)
	resolve()
}

var define_routes = function(resolve,reject){
	router.post('/catalog/category',jsonParser,category_route_handler)
	resolve()
}

var define_error_handler = function(resolve,reject){
	router.use('/catalog/category',category_eh)
	resolve()
}

var error_obj = {
                    "NOT_FOUND":{"status":404,"message":"Content tree not found"},
					"METHOD_NOT_ALLOWED":{"status":405,"message":"Method not allowed"},
					"INVALID_REQUEST":{"status":400,"message":"Input body invalid"}
                }

load_manager.registerToStage(load_manager.getMiddlewareStage(),define_middleware)
load_manager.registerToStage(load_manager.getRoutesStage(),define_routes)
load_manager.registerToStage(load_manager.getErrorHandlerStage(),define_error_handler)
/***************************************************************************************/

/************************** Middle Ware**********************************/
var category_ml = function(req,res,next){
	if(req.method != 'POST'){
	    next(new Error("METHOD_NOT_ALLOWED"))
	}else{
		var result = validator_obj.validate(req.body,category_schema)
		if(result.errors.length>0)
			next(new Error("INVALID_REQUEST"))
		else
			next()			
	}
}

/***************************************************************************************/

/************************** Route Handler**********************************/
var facade_bl = require(process.env.NODE_SRC_DIR+"/catalog/bl/catalog_bl")

var category_route_handler = function(req,res,next){
	var cbk = function(result){
		res.setHeader('Content-Type', 'application/json')
		if(result.error)
			res.status(400).send({"error_title":"Bad Request","error_message":"Cannot add category"})			
		else
			res.status(201).send(result.data)								
	}
	facade_bl.addCategory(req.body,cbk)
}

/***************************************************************************************/

/************************** Error Handler **********************************/
var category_eh = function(err, req, res, next) {
    var a = err.message
    res.status(error_obj[a].status || 404).send({"error_title":a,"error_message":error_obj[a].message})
}

/***************************************************************************************/
