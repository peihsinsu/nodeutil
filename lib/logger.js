/**
 * Usage: 
 * var logger = require('nodeutil').logger.getInstance();
 * or
 * var logger = require('nodeutil').logger.getInstance("log_name");
 * logger.debug('TEST...123');
 */
var fs = require('fs')
	, defaultPath = fs.existsSync('/tmp') ? '/tmp/node.log' : (__dirname + '/../../node.log')
  , logFile = process.env.LOGPATH ? process.env.LOGPATH : defaultPath
  , logCategory = process.env.LOGCATG ? process.env.LOGCATG : 'normal'
  , logLevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'DEBUG'
  , logMaxSize = process.env.LOG_MAX_SIZE ? process.env.LOG_MAX_SIZE : 204800
  , logBackup = process.env.LOG_BACKUP ? process.env.LOG_BACKUP : 7;

exports.getInstance = function(catg, opts) {
	var log4js = require('log4js')
	if (!opts) opts = {}
	log4js.configure(
		{
			"appenders": [
				{ type: 'console' },
				{
					"type": "file",
					"filename": (opts.path ? opts.path + '/node.log': logFile),
					"maxLogSize": logMaxSize,
					"backups": logBackup,
					"category": catg 
				}
			]
		}
	);
  
  var logger;
  if(catg) {
    logger = log4js.getLogger(catg);
  } else {
    logger = log4js.getLogger(logCategory);
  }
  logger.setLevel(logLevel);
	
	if(catg === 'app') console.log('Warn: category name=app will conflict with express4 debug module');
	//logger.debug('[%s] %s:', logLevel, catg, (opts.path ? opts.path + '/node.log': logFile));

  return logger;
}
