/* eslint one-var: 0, semi-style: 0 */

// -- Node modules
const crypto = require('crypto')
    , http   = require('http')
    ;

// -- Local modules

// -- Local constants
const restapi  = '/service/v4_1/rest.php'
    ;

// -- Local variables

// -- Private functions --------------------------------------------------------
/* eslint-disable no-underscore-dangle */

/**
 * HTTP Post.
 *
 * @function (arg1, arg2, arg3)
 * @private
 * @param {String}      the server domain name,
 * @param {String}      the sugar method to call,
 * @param {Function}    callback to call at completion,
 *                      the callback gets two arguments. The first argument is
 *                      null or an error message. The second argument is an
 *                      object with: { statusCode: '', headers: '', data: payload }
 * @returns {}          -,
 */
const _post = function(domain, api, callback) {
  let payload
    , subpath
    , path
    ;

  // Extract subpath if any:
  if (domain.replace(/http:\/\//, '').match(/\//)) {
    /* istanbul ignore next */
    subpath = domain.replace(/http:\/\//, '').replace(/^(.+?)\//, '').replace(/\/$/, '');
  } else {
    /* istanbul ignore next */
    subpath = '';
  }

  if (subpath !== '') {
    /* istanbul ignore next */
    path = `/${subpath}${restapi}`;
  } else {
    /* istanbul ignore next */
    path = restapi;
  }

  const options = {
    // host: domain.replace(/http\:\/\//, ''),
    host: domain.replace(/http:\/\//, '').replace(/\/.*/, ''),
    port: 80,
    path: `${path}?${api}`,
    method: 'POST',
  };

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    // Collect data chunk by chunk:
    payload = '';
    response.on('data', (data) => {
      payload += data;
    });
    // Send data to caller when all chunk are collected:
    response.on('end', () => {
      let error = null;

      try {
        JSON.parse(payload);
      } catch (e) {
        if (payload.length > 0) {
          error = payload;
          payload = '';
        }
        payload = JSON.stringify(payload);
      }
      if (callback) {
        callback(error, {
          // statusCode: response.statusCode,
          // headers: response.headers,
          data: JSON.parse(payload),
        });
      }
    });
  });

  // On error, return the error message in callback:
  /* istanbul ignore next */
  request.on('error', (e) => {
    if (callback) {
      callback(e.message);
    }
  });

  // http.request process end:
  request.end();
};

/**
 * Creates the url string api.
 *
 * @function (arg1, arg2, arg3, arg4)
 * @public
 * @param {String}    the server domain name,
 * @param {String}    the method to process on the server,
 * @param {Object}    the parameters associated to this method,
 * @param {Function}  callback to call at completion. The callback gets two
 *                    arguments. The first argument is null or an error message.
 *                    The second argument is an object with: { data: payload }.
 *                    The payload is an object with :
 *                      'depends on the called method'
 * @returns {}        -,
 */
const _call = function(domain, method, params, callback) {
  const sugarMethod = `method=${method}&input_type=JSON&response_type=JSON`;
  const api = `${sugarMethod}&rest_data=${encodeURIComponent(JSON.stringify(params))}`;
  _post(domain, api, callback);
};
/* eslint-enable no-underscore-dangle */


// -- Public methods -----------------------------------------------------------

module.exports = {

  /**
   * Logs the user into the application.
   *
   * @function (arg1, arg2, arg3, arg4)
   * @public
   * @param {String}    the server domain name,
   * @param {String}    the username,
   * @param {String}    the paswword,
   * @param {Function}  callback to call at completion,
   *                    the callback gets two arguments. The first argument is
   *                    null or an error message. The second argument is an
   *                    object with: { data: payload }. payload is an object with:
   *                      {String} id : is the session_id of the session that
   *                                    was created,
   * @returns {}        -,
   */
  login(domain, user, password, callback) {
    // Four arguments provided?
    if (arguments.length < 4) {
      throw new Error('You must provide domain, username, password and callback!');
    }

    // Create a md5 hash for the password:
    const md5 = crypto.createHash('md5');
    md5.update(password);

    const params = {
      user_auth: {
        user_name: user,
        password: md5.digest('hex'),
      },
      application: null,
      name_value_list: [{
        name: 'notifyonsave',
        value: true,
      }],
    };

    // request a login to Sugar server:
    _call(domain, 'login', params, callback);
  },

  /**
   * Logs out of the session.
   *
   * @function (arg1, arg2, arg3)
   * @public
   * @param {String}    the server domain name,
   * @param {String}    session ID returned by a previous call to login,
   * @param {Function}  callback to call at completion,
   * @returns {}        -,
   */
  logout(domain, id, callback) {
    _call(domain, 'logout', { session: id }, callback);
  },

  /**
   * Returns the user_id of the user that is logged into the current session.
   *
   * @function (arg1, arg2, arg3)
   * @public
   * @param {String}    the server domain name,
   * @param {String}    session ID returned by a previous call to login,
   * @param {Function}  callback to call at completion. The callback gets two
   *                    arguments. The first argument is null or an error message.
   *                    The second argument is an object with: { data: payload }:
   *                      {String} payload : the User ID of the current session.
   * @returns {}        -,
   */
  getUserID(domain, id, callback) {
    _call(domain, 'get_user_id', { session: id }, callback);
  },

  /**
   * Gets server info.
   *
   * @function (arg1, arg2)
   * @public
   * @param {String}    the server domain name,
   * @param {Function}  callback to call at completion. The callback gets two
   *                    arguments. The first argument is null or an error message.
   *                    The second argument is an object with: { data: payload }.
   *                    The payload is an object with:
   *                      {String} flavor : SugarCRM flavor,
   *                      {String} version : SugarCRM version number,
   *                      {String} gmt_time : the current time on the server,
   * @returns {}        -,
   */
  getServerInfo(domain, callback) {
    _call(domain, 'get_server_info', {}, callback);
  },

  /**
   * Calls the server.
   *
   * @function (arg1, arg2, arg3, arg4)
   * @public
   * @param {String}    the server domain name,
   * @param {String}    the method to process on the server,
   * @param {Object}    the parameters associated to this method,
   * @param {Function}  callback to call at completion. The callback gets two
   *                    arguments. The first argument is null or an error message.
   *                    The second argument is an object with: { data: payload }.
   *                    The payload is an object with :
   *                      'depends on the called method'
   * @returns {}        -,
   */
  call(domain, method, params, callback) {
    if (arguments.length < 4) {
      throw new Error('You must provide four arguments: domain, method, params and a callback!');
    }

    _call(domain, method, params, callback);
  },
};
