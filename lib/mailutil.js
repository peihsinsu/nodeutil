var nodemailer = require("nodemailer")
  , log = require('./logger').getInstance()
  , os = require('os')
  , fs = require('fs')
  , cfg = null
  , smtpOption = {}
  , smtpTransport = null
  , cfg_path = process.env.HOME + '/.nmail';

var mailutil = exports;

exports.init = function(json){
  if(json) {
    log.debug('Setting the cfg using json...' );
    log.debug(json);
    cfg = json;
    log.debug('Confirm cfg:');
    log.debug(cfg);

    smtpOption = json.smtpOptions;
  }
  initial();
}

/* node.js v0.6.x still no fs.existsSync() */
function isCfgExists() {
  try {
    fs.statSync(cfg_path);
    return true;
  } catch(e) {
    return false;
  }
}

function initial(){
  if(!cfg || cfg == null)
    if(isCfgExists()) {
      cfg =  require('../lib/cfgutil').readJsonCfg(cfg_path);
    } else {
      cfg = {smtpOptions:{host : "localhost"}};
    }
  smtpOption = cfg.smtpOptions;
  smtpTransport = nodemailer.createTransport("SMTP", smtpOption);
  mailutil.smtpOption = smtpOption;

  /**
   * SMTP transport object
   */
  smtpTransport = nodemailer.createTransport("SMTP", smtpOption);

  /**
   * To set the SMTP transport using option
   */
  mailutil.setSmtpTransUsingOption = function(opt){
    smtpTransport = nodemailer.createTransport("SMTP", opt);
  };

  /**
   * To reset the SMTP transport using the last smtpOption 
   */
  mailutil.resetSmtpTrans = function() {
    smtpTransport = nodemailer.createTransport("SMTP", this.smtpOption);
  };
}

/**
 * Mail options default object
 */
var mailOptions = {
    from: os.hostname()  , // sender address
    to: "receiver@mycompany.com", // list of receivers
    subject: "Hello Send From NMAIL", // Subject line
    text: "Dear:\n\n Hello, this is a sample mail. \n That you are success send this mail!\n]n Thanks.", // plaintext body
    html: "Dear:<br/><br/>Hello, this is a sample mail from <font color=red>nmail<font>. <br/>That you are success send this mail!  <br/><br/>Thanks." // html body
}

/**
 * Mail options for setting from, to, subject, content(text or html)
 */
mailutil.mailOptions = mailOptions;

/**
 * Main function for send mail
 */
function sendMail(sender, receivers, subject, msg, isClose, callback) {
    if(sender) mailOptions.from = sender;
    mailOptions.to = receivers;
    mailOptions.subject = subject;
    mailOptions.html = msg;
    log.debug('[INFO]Using smtpOption:%s', JSON.stringify(smtpOption));
    log.debug('[INFO]Using mailOptions:%s', JSON.stringify(mailOptions));
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
         log.error('[ERROR]%s',JSON.stringify(error));
      } else {
         log.debug("Message sent: " + response.message);
      }
      if(isClose)
        smtpTransport.close(); // shut down the connection pool, no more messages
      if(callback) {
        callback(response);
      }
    });
}

/**
 * Send mail without waiting the response
 */
mailutil.sendNodeMailAsync = function(receivers, subject, msg, isClose) {
  sendMail(cfg.sender, receivers, subject, msg, isClose);
}

/**
 * Send mail and have a callback with response after mail sent
 */
mailutil.sendNodeMailSync = function(receivers, subject, msg, isClose, callback) {
  sendMail(cfg.sender, receivers, subject, msg, isClose, callback);
}

/**
 * Sample of mail object
 */
var mo = {
  sender:"",
  receivers:[],
  subject:"Test mail",
  contentTemplate:"~/tmpl/sample.tpl",
  contentValues:{key:"value"}
}

/**
 * Send mail using template
 */
exports.sendTemplateMail = sendTemplateMail;
function sendTemplateMail(mo, callback){
  var sender = mo.sender ? mo.sender : cfg.sender;
  var isClose = mo.isClose ? mo.isClose : true;
  sendMail(sender, mo.receivers, 
    mo.subject, convertTemplateMail(mo.contentTemplate, mo.contentValues),
    isClose, callback);
} 

function convertTemplateMail(tpl_path, opt){
  var template = fs.readFileSync(tpl_path,'UTF-8');
  if(opt){
    var keys = Object.keys(opt);
    keys.forEach(function(v,i){
      var value = opt[v];
      template = template.replace(new RegExp('\\\$' + v, 'g'),value);
    });
  }
  return template;
}





