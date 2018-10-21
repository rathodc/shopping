var MongoClient = require('mongodb').MongoClient;
var config = require('config')
var load_manager = require(process.env.NODE_SRC_DIR+"/load_manager")
var db;
var client_ref;

var __initialize = function(resolve,reject){    
    MongoClient.connect(config.get('db.host'), (err, client) => {
        if(err) {
            reject("Error connecting database");
            return;
        }
        db = client.db(config.get('db.db_name'));
        client_ref = client;
        resolve();
    });
}

var services = {}

services.closeConnection = function(){
    client_ref.close()
}

services.getClientRef=function(){
    return client_ref
}

services.getDBRef=function(){
    return db
}


load_manager.registerToStage(load_manager.getServerStartStage(), __initialize)
module.exports = services