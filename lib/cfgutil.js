var fs = require('fs');
var util = require('util');

function readJsonCfg(cfg_path) {
  try {
    var cfgstr = fs.readFileSync(cfg_path, 'utf8');
    util.log(cfgstr);
    return JSON.parse(cfgstr);
  } catch (e) {
    util.error('Read configure file error from cfg_path:' + cfg_path);
    util.error('Please put the .nmail file into your HOME directory, and has the following config:');
    util.error('{ smtpOption:{service:"...", auth: {user: "...",pass: "..."}}}');
    util.error('Error msg:'+ JSON.stringify(e));
  }
}

exports.readJsonCfg = readJsonCfg;
