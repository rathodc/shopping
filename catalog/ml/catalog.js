var load_manager = require(process.env.NODE_SRC_DIR+"/load_manager");
var log = require('log4js').getLogger("catalog");
var allowed_tokens = ["e4b76ae67e4b", "604605a6bfe0", "22437a5dc2f5"]

var define_middleware = function(resolve,reject){
	router.use('/catalog',function(req,res,next){
		log.debug("In ml | Catalog Middleware ")
		log.debug("req.headers.Auth-Token "+req.headers["Auth-Token"])
		log.debug(req.headers["auth-token"])
		if(!req.headers["auth-token"] || allowed_tokens.indexOf(req.headers["auth-token"])==-1){
			res.setHeader('Content-Type', 'application/json')
			res.status(401)
			res.send({
				"error_title": "Bad Request",
				"error_message": "Not Authenticated"
			})
		}
		else{
			next()				
		}
	})
	resolve()
}

load_manager.registerToStage(load_manager.getMiddlewareStage(),define_middleware)
