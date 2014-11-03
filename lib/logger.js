/**
 * Usage: 
 * var logger = require('nodeutil').logger.getInstance();
 * or
 * var logger = require('nodeutil').logger.getInstance("log_name");
 * logger.debug('TEST...123');
 */
var fs = require('fs')
	, defaultPath = fs.existsSync('/tmp') ? '/tmp/node.log' : (__dirname + '/../../../node.log')
  , logFile = process.env.LOGPATH ? process.env.LOGPATH : defaultPath
  , logCategory = process.env.LOGCATG ? process.env.LOGCATG : 'default'
  , logLevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'DEBUG'
  , logMaxSize = process.env.LOG_MAX_SIZE ? process.env.LOG_MAX_SIZE : 20480000
  , logBackup = process.env.LOG_BACKUP ? process.env.LOG_BACKUP : 7;

var log4js = require('log4js')
var appenderNames = [logCategory];
var appenders = [
		{ type: 'console' },
		{
			"type": "file",
			"filename": logFile,
			"maxLogSize": logMaxSize,
			"backups": logBackup,
			"category": logCategory 
		}
	];

//Default appender
log4js.configure( { "appenders": appenders } );

//Append other appender
exports.getInstance = function(catg, opts) {
	if (appenderNames.indexOf(catg) >= 0) {
		return log4js.getLogger(catg);
	} else {
	  appenderNames.push(catg);
	}

	if (!opts) opts = {}

	opts.path = opts['path'] || logFile;
	opts.catg = catg || logCategory;
	opts.level = opts.level || logLevel;
	opts.logMaxSize = opts.logMaxSize || logMaxSize;
	opts.logBackup = opts.logBackup || logBackup;
	log4js.addAppender(log4js.appenders.file(opts.path, null, opts.logMaxSize, opts.logBackup), opts.catg); 
  var logger = log4js.getLogger(opts.catg);
	logger.setLevel(opts.level);
	
	if(catg === 'app') logger.warn('Warn: category name=app will conflict with express4 debug module');
  
	logger.trace('Initial log4js %s log for [%s] in path:%s', opts.level, catg, opts.path);

  return logger;
}
