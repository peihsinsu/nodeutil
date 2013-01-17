NodeUtil
====================

This is just a tool collect for easy use of some tool library. I will pack some operation for more easy to use.

## Install

<pre>
npm install nodeutil
</pre>

## Usage

<pre>
var nu = require('nodeutil');
</pre>

## Using logger

<pre>
var log = nu.logger.getInstance();
log.info('Test logger...');
</pre>

## Using dateutil

<pre>
var dateutil = no.dateutil;
var pattern = 'yyyymmdd hh24:mi:ss';
dateutil.getNowString(pattern);
dateutil.getDateString(new Date(), pattern)
</pre>

## Using step

<pre>
var Step = nu.step;
Step(
  function step1(){
    //do something...
    return something1;
  },
  function step2(step1_returned){
    //do something
    return something2;
  },
  ...
)
</pre>

## Using cfgutil

<pre>
var cfgutil = nu.cfgutil;
//read from json file
var cfg = cfgutil.readJsonCfg('path to json config file');
</pre>

## Using mailutil

```javascript
var nu = require('nodeutil');
var mailer = nu.mailutil;

mailer.init(
  {"smtpOptions":{"service":"Gmail", "auth": {"user": "your-account","pass": "your-password"}}, "sender": "NO-REPLY <no-reply@micloud.tw>"}
);

mailer.sendNodeMailAsync('receiver@gmail.com',
  'test mail send...',
  'send mail OK!',
  true,
  function(){
    console.log('Send mail done...');
  }
);
```
