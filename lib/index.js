var exports = module.exports;

exports.dateutil = require('./dateutil');
exports.mailutil = require('./mailutil');
exports.httputil = require('./http/httputil');
exports.step = require('./git/step');
exports.logger = require('./logger');

String.prototype.endsWith = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
}

String.prototype.startsWith = function (str) {
  return this.indexOf(str) == 0;
};

String.prototype.includeOf = function(str) {
  return this.indexOf(str) >=0;
}
