var load_manager = require("./load_manager")
var log4js = require('log4js')
var log = log4js.getLogger("start_up")
var fs = require('fs');

var load_apis = function(resolve,reject){
	var module_list = config.get('modules')
	for(var i=0;i<module_list.length;i++){
		var ml_folder = process.env.NODE_SRC_DIR+"/"+module_list[i]+"/ml/"
		if (fs.existsSync(ml_folder)) {
            fs.readdirSync(ml_folder).forEach(file => {		
				require(ml_folder+file.split(".js")[0])
			 })
        }
		var api_folder = process.env.NODE_SRC_DIR+"/"+module_list[i]+"/api/"		
		fs.readdirSync(api_folder).forEach(file => {
			log.debug(api_folder+file.split(".js")[0])
			require(api_folder+file.split(".js")[0])
		})
	}
	resolve()
}


var load_services = function(resolve,reject){
	var services_folder = process.env.NODE_SRC_DIR+"/services/"
	log.debug(services_folder)	
	fs.readdirSync(services_folder).forEach(file => {
		require(services_folder+file.split(".js")[0])
	})
	resolve()
}	

var start_server = function(resolve,reject){
	var server = app.listen(process.env.PORT)
    log.info('Listening on port ', server.address().port, " with pid ", process.pid )
	resolve()
}

load_manager.registerToStage(load_manager.getLoadServicesStage(),load_services)
load_manager.registerToStage(load_manager.getLoadApiStage(),load_apis)
load_manager.registerToStage(load_manager.getServerStartStage(),start_server)

load_manager.startUp()
