/**
 * @module proxy
 * @license MIT
 * @version 2017/11/09
 */

'use strict';

// Import lib
const spawn = require('./spawn');
const fs = require('fs');
const path = require('path');

const scriptPath = `${process.cwd()}\\script.js`;
let filePath = path.join(__dirname,'..','node_modules\\node-adodb\\lib\\adodb.js' ); // electron
if (!fs.existsSync(filePath)) { 
  filePath = require.resolve('./adodb')
}


/**
 * @class Proxy
 */
class Proxy {
  /**
   * @constructor
   * @param {string} engine
   */
  constructor(engine) {
    this.engine = engine;

    fs.readFile(filePath, function(err, data) {
      fs.writeFile(scriptPath, data, function (err) {
        if (err) throw err;
      });
    });

  }

  /**
   * @method exec
   * @param {string} command
   * @param {Object} params
   * @returns {Promise}
   */
  exec(command, params) {
    const engine = this.engine;

    // Params to string
    params = JSON.stringify(params);

    // Spawn args
    const args = [Proxy.adodb, '//E:JScript', '//Nologo', '//U', '//B', command];

    // Spawn
    return spawn(engine, args, params, { encoding: 'utf16le' })
      .then(data => JSON.parse(data))
      .catch(error => {
        if (error.process) {
          error.process = JSON.parse(error.process);
        }

        throw error;
      });
  }
}

// ADODB actuator
Proxy.adodb = Proxy.adodb = scriptPath; // require.resolve('./adodb');

// Exports
module.exports = Proxy;
