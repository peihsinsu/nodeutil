var exports = module.exports

exports.dateutil = require('./dateutil');
exports.mailutil = require('./mailutil');
exports.httputil = require('./http/httputil');
exports.step = require('./git/step');
exports.logger = require('./logger');
exports.simplelog = require('./simplelog');
exports.cfgutil = require('./cfgutil');
exports.sqlutil = require('./sqlutil');
//From: https://github.com/buglabs/node-xml2json
//Modify the trim function for break line parse
//exports.xml2json = require('./git/xml2json');
exports.xml2json = require('./xml2json');
exports.guid = require('./guid');
exports.hasher = require('./hasher');
exports.validator = require('./validator');
  
exports.json2table = require('./git/json-to-table');

String.prototype.endsWith = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
}

String.prototype.startsWith = function (str) {
  return this.indexOf(str) == 0;
};

String.prototype.includeOf = function(str) {
  return this.indexOf(str) >=0;
}

/*
JSON.prototype.isJSON = function(value){
  try {
    if(typeof(value) == 'string')
      JSON.parse(value);
    else
      JSON.stringify(value)
    return true;
  } catch (ex) {
    return false;
  }
}
*/
