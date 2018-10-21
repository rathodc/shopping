/* Load important modules*/
var express = require("express");
var log4js = require('log4js');
var log = log4js.getLogger("main");
var bodyParser = require('body-parser');
/**************************/

/* Express app and Router */
jsonParser = bodyParser.json()
router = express.Router();
app = express();
/**************************/

/* Set paths and node environment variables*/
var src_path = __dirname
process.env.NODE_CONFIG_DIR = src_path+"/config"
process.env.NODE_APP_INSTANCE = 1
config = require('config')
process.env.NODE_ENV = "development"
process.env.NODE_SRC_DIR = src_path
process.env.NODE_LOG_DIR = src_path+"/log"
process.env.PORT = config.get('server.port')
/********************************************/

/* Make a log directory, just in case it isn't there.*/
try {
	require('fs').mkdirSync(process.env.NODE_LOG_DIR)
  } catch (e) {
	if (e.code != 'EEXIST') {
	  log.error("Could not set up log directory, error was: ", e)
	  process.exit(1)
	}
  }
/******************************************************/
  
/* Configure Logger*/
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }))
log4js.configure({
	appenders: {
		console: { type: 'console' },
		access: { type: 'dateFile', filename: process.env.NODE_LOG_DIR+'/access.log', pattern: '-yyyy-MM-dd' },
		app: { type: 'file', filename: process.env.NODE_LOG_DIR+'/app.log', maxLogSize: 10485760, numBackups: 3 },
		errorFile: { type: 'file', filename: process.env.NODE_LOG_DIR+'/errors.log' },
		errors: { type: 'logLevelFilter', level: 'error', appender: 'errorFile' }
	},
		categories: {
		default: { appenders: ['app', 'errors', 'console'], level: 'info' },
		http: { appenders: ['access'], level: 'info' },
		https: { appenders: ['access'], level: 'info' }
	}
})
/****************************************************************/

/* Mount the Router and boot up the application*/
app.use('/api/v1',router)
require("./module_loader")
/********************************************/


/* Global Middleware */
app.use(function(req, res, next) {
	log.debug('Time: ', Date.now())
	next(new Error('err'))
})

app.use(function(err, req, res, next) {
    log.info("In MAIN | error handler "+res.headersSent)
    res.status(err.status || 400)
    res.send({
		"error_title": "Bad Request",
		"error_message": "Request could not be fulfilled"
	})
})
/********************************************/
