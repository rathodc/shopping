/******************Start Up****************************** */
var log = require('log4js').getLogger("product_list");
var load_manager = require(process.env.NODE_SRC_DIR+"/load_manager");

var define_middleware = function(resolve,reject){
	router.use('/catalog/product_list',product_list_ml)
	resolve()
}

var define_routes = function(resolve,reject){
	router.get('/catalog/product_list',product_list_handler)
	resolve()
}

var define_error_handler = function(resolve,reject){
	router.use('/catalog/product_list',product_list_eh)
	resolve()
}

var error_obj = {
                    "NOT_FOUND":{"status":404,"message":"Content tree not found"},
					"METHOD_NOT_ALLOWED":{"status":405,"message":"Method not allowed"},
					"PARAM_MISSING":{"status":400,"message":"Required parameter 'category' missing"}
                }

load_manager.registerToStage(load_manager.getMiddlewareStage(),define_middleware)
load_manager.registerToStage(load_manager.getRoutesStage(),define_routes)
load_manager.registerToStage(load_manager.getErrorHandlerStage(),define_error_handler)
/***************************************************************************************/

/************************** Middle Ware**********************************/
var product_list_ml = function(req,res,next){
	if(req.method != 'GET'){
	    next(new Error("METHOD_NOT_ALLOWED"))
	}else{
		console.log("req.query['category'] "+req.query["category"])
		if(!req.query["category"])
			next(new Error("PARAM_MISSING"))			
		else
		    next()
	}
}

/***************************************************************************************/

/************************** Route Handler**********************************/
var facade_bl = require(process.env.NODE_SRC_DIR+"/catalog/bl/catalog_bl")

var product_list_handler = function(req,res,next){
    var cbk = function(result){
		res.setHeader('Content-Type', 'application/json')
		if(result.error)
			res.status(400).send({"error_title":"Bad Request","error_message":"Could not retrieve product list"})			
		else
			res.status(200).send(result.data)								
	}
	facade_bl.getProducts({category:req.query.category},cbk)
}

/***************************************************************************************/

/************************** Error Handler **********************************/
var product_list_eh = function(err, req, res, next) {
    log.debug("Product list Error handler")
    var a = err.message
    res.status(error_obj[a].status || 404).send({"error_title":a,"error_message":error_obj[a].message})
}

/***************************************************************************************/
