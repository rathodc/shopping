var log = require('log4js').getLogger("load_manager")
var export_obj = {}
const cStageLoadServices = "loadServices"
const cStageLoadApi = "loadAPI"
const cStageDefineMiddleWare = "defineML"
const cStageDefineRoutes = "defineRoutes"
const cStageDefineErrorHandler = "defineErrorHandler"
const cStageStartServer = "startServer"
const cStageInitializeData = "InitializeData"


var LoadingArr ={
					"loadServices":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.loadServices.funcList")}},
					"loadAPI":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.loadAPI.funcList")}},
					"defineML":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.defineML.funcList")}},
					"defineRoutes":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.defineRoutes.funcList")}},
					"defineErrorHandler":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.defineErrorHandler.funcList")}},
					"startServer":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.startServer.funcList")}},
					"InitializeData":{"funcList":[],"exe":function(){return stageFunc("LoadingArr.InitializeData.funcList")}}
				}

var stageFunc = function(obj){
		var funcList = getStageFuncList(obj)
		var pr = Promise.all(eval("["+funcList+"]"))
		return pr
}

var getStageFuncList=function(obj){
		var str=[]
		var funcs = eval(obj)
		for(var i=0;i<funcs.length;i++){
			str.push(obj+"["+i+"]()")
		}
		return str.join(",")
}

export_obj.getLoadServicesStage = function(){return cStageLoadServices}
export_obj.getLoadApiStage = function(){return cStageLoadApi}
export_obj.getMiddlewareStage = function(){return cStageDefineMiddleWare}
export_obj.getRoutesStage = function(){return cStageDefineRoutes}
export_obj.getErrorHandlerStage = function(){return cStageDefineErrorHandler}
export_obj.getServerStartStage = function(){return cStageStartServer}
export_obj.getInitializeDataStage = function(){return cStageInitializeData}

export_obj.registerToStage =  function (stage_id,func){
			var new_func = function(){
								return new Promise(function (resolve, reject) {
									func(resolve, reject)
								})
			}
			LoadingArr[stage_id].funcList.push(new_func)
}

export_obj.startUp = function(){
		LoadingArr.loadServices.exe()
		.then(LoadingArr.loadAPI.exe)
		.then(LoadingArr.defineML.exe)
		.then(LoadingArr.defineRoutes.exe)
		.then(LoadingArr.defineErrorHandler.exe)
		.then(LoadingArr.startServer.exe)
		.then(LoadingArr.InitializeData.exe)
		.then(function(){log.info("Server started successfully")})
		.catch(function(e){log.error("Error while loading : "+e)})
}

module.exports = export_obj
