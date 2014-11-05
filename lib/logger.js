/**
 * Usage: 
 * var logger = require('nodeutil').logger.getInstance();
 * or
 * var logger = require('nodeutil').logger.getInstance("log_name");
 * logger.debug('TEST...123');
 */
var fs = require('fs')
	, _ = require('underscore')
	, defaultPath = fs.existsSync('/tmp') ? '/tmp/node.log' : (__dirname + '/../../../node.log')
  , logFile = process.env.LOGPATH ? process.env.LOGPATH : defaultPath
  , logCategory = process.env.LOGCATG ? process.env.LOGCATG : 'default'
  , logLevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'DEBUG'
  , logMaxSize = process.env.LOG_MAX_SIZE ? process.env.LOG_MAX_SIZE : 204800000
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
			"category": logCategory,
			"pattern": "-yyyy-MM-dd",
	    "alwaysIncludePattern": true
		}
	];

//Default appender
log4js.configure( { "appenders": appenders } );

exports.addAppender = function(catg, opts) {
  var categories = _.map(appenders, function(v) {
		if(v[catg]) {
			return v[catg];
		}
	});

	if(categories.indexOf(catg) < 0) {
		opts.category = catg;
		appenders.push(opts);
		log4js.configure( { "appenders": appenders } );
	}
  var logger = log4js.getLogger(catg);	
	logger.setLevel(opts.level || process.env.LOGLEVEL);
	logger.trace('Initial log4js %s log for [%s] in path:%s', opts.level, catg, opts.filename);
	return logger;
}

exports.currentAppenders = function() {
	return appenders;
}

//Append other appender
exports.getInstance = getInstance;
function getInstance(catg, opts) {
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
