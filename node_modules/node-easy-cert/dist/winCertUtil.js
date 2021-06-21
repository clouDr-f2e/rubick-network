'use strict';

/**
*
*/
var Shell = require('node-powershell');

var anyProxyCertReg = /CN=AnyProxy,\sOU=AnyProxy\sSSL\sProxy/;

/**
 * detect whether root CA is trusted
 */
function ifWinRootCATrusted() {
  var ps = new Shell({
    executionPolicy: 'Bypass',
    debugMsg: false,
    noProfile: true
  });

  return new Promise(function (resolve, reject) {
    ps.addCommand('Get-ChildItem', [{
      name: 'path',
      value: 'cert:\\CurrentUser\\Root'
    }]);
    ps.invoke().then(function (output) {
      var isCATrusted = anyProxyCertReg.test(output);
      ps.dispose();
      resolve(isCATrusted);
    }).catch(function (err) {
      console.log(err);
      ps.dispose();
      resolve(false);
    });
  });
}

module.exports.ifWinRootCATrusted = ifWinRootCATrusted;