var nodemailer = require("nodemailer");
var os = require('os');
var fs = require('fs');
var util = require('util');
var cfg = null;

var mailutil = exports;

/* node.js v0.6.x still no fs.existsSync() */
function isCfgExists() {
  try {
    fs.statSync(cfg_path);
    return true;
  } catch(e) {
    return false;
  }
  //node 0.8.x
  //return fs.existsSync(cfg_path);
}

var cfg_path = process.env.HOME + '/.nmail';
if(isCfgExists()) {
  cfg =  require('../lib/cfgutil').readJsonCfg(process.env.HOME + '/.nmail');
} else {
  cfg = {smtpOptions:{host : "localhost"}};
}
var smtpOption = cfg.smtpOptions;
mailutil.smtpOption = smtpOption;

/**
 * SMTP transport object
 */
var smtpTransport = nodemailer.createTransport("SMTP", smtpOption);

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

/**
 * Mail options default object
 */
var mailOptions = {
    from: os.hostname() , // sender address
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
function sendMail(receivers, subject, msg, isClose, callback) {
    mailOptions.to = receivers;
    mailOptions.subject = subject;
    mailOptions.html = msg;
    util.log(util.format('[INFO]Using smtpOption:%s', JSON.stringify(smtpOption)));
    util.log(util.format('[INFO]Using mailOptions:%s', JSON.stringify(mailOptions)));
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
         console.log('[ERROR]%s',JSON.stringify(error));
      } else {
         util.log(util.format("Message sent: " + response.message));
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
  sendMail(receivers, subject, msg, isClose);
}

/**
 * Send mail and have a callback with response after mail sent
 */
mailutil.sendNodeMailSync = function(receivers, subject, msg, isClose, callback) {
  sendMail(receivers, subject, msg, isClose, callback);
}
