NodeUtil
====================

<h2>Usage</h2>

<pre>
var nu = require('nodeutil');

//Using logger
var log = nu.logger.getInstance();
log.info('Test logger...');

//Using dateutil
var dateutil = no.dateutil;
var pattern = 'yyyymmdd hh24:mi:ss';
dateutil.getNowString(pattern);
dateutil.getDateString(new Date(), pattern)

//Using step
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

