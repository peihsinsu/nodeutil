var fs = require('fs')
  , log = require('./logger').getInstance();

function readJsonCfg(cfg_path, fn) {
  try {
    var cfgstr = fs.readFileSync(cfg_path, 'utf8');
    if(fn) fn(cfgstr);
    //log.info(cfgstr);
    return JSON.parse(cfgstr);
  } catch (e) {
    log.error('JSON parsing error! Read configure file error from cfg_path:%s', cfg_path);
    //log.error('Please put the .nmail file into your HOME directory, and has the following config:');
    //log.error('{ smtpOption:{service:"...", auth: {user: "...",pass: "..."}}}');
    log.error('Error msg:'+ JSON.stringify(e));
  }
}

exports.readJsonCfg = readJsonCfg;
