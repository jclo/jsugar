# jSugar

[![NPM version][npm-image]][npm-url]
[![Travis CI][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependencies status][dependencies-image]][dependencies-url]
[![Dev Dependencies status][devdependencies-image]][devdependencies-url]
[![License][license-image]](LICENSE.md)
<!--- [![node version][node-image]][node-url] -->

[![NPM install][npm-install-image]][npm-install-url]

`jsugar` Node.js library is a REST API Client that addresses a server running SugarCRM.

SugarCRM's REST API is available on a SugarCRM server at the path `http://<domain name>/service/v4_1/rest.php`.

`jsugar` relies on [Mocha](https://mochajs.org) and [Chai](http://chaijs.com) for unitary testing. It relies on [Istanbul](https://gotwarlost.github.io/istanbul/) for code coverage. And, it uses [Travis CI](https://travis-ci.org) for continuous integration and [Coveralls.io](https://coveralls.io) to display test coverage.


## Quick Startup

### Test if the server is responding
```
var jsugar = require('jsugar');

var domain = 'http://www.xxxxx'   // the domain name of the server,
var username = 'xxxxx';           // the account username,
var password = 'xxxxx';           // the account password,

jsugar.getServerInfo(domain, username, password, function(error, res) {
  // the server returns:
  // res = { data: { flavor: 'CE', version: '6.5.x', gmt_time: '201x-xx-xx h:mn:s' } }
});
```

### Retrieve the number of records in a given module

```
// Get a session ID:
jsugar.login(domain, user, password, function(error, res) {
  var id = res.data.id;

  // Retrieve the number of Accounts
  var params = {
    session: id,
    module_name: 'Accounts',
    query: '',
    deleted: false
  };
  jsugar.call(domain, 'get_entries_count', params, function(error, res) {
    // the server returns:
    // res = { data: { result_count: '561' } }
  });

  // Close the session:
  jsugar.logout(domain, id);
});
```

## API

`jsugar` provides five functions:

  * `getServerInfo()`   tests if the server is responding,
  * `login()`           returns the session ID,
  * `getUserID`         returns the User ID,
  *  `call()`           processes a SugarCRM's method,
  * `logout()`          closes the session.


### getServerInfo(domain, callback)

`getServerInfo` requires two arguments:
  * the domain name of the server,
  * a callback function.

The callback gets two arguments: `error` and the server `response`.

`error` is null or contains the error message.

The `response` object contains:
```
{ data: { flavor: 'CE', version: '6.5.x', gmt_time: '201x-xx-xx h:mn:s' } }
```

### login(domain, username, password, callback)

`login` requires four arguments:
  * the domain name of the server,
  * the account username,
  * the account password,
  * a callback function.

The callback gets two arguments: `error` and the server `response`.

`error` is null or contains the error message.

The `response` object contains:
```
{ data: { id: 'dfa56ebd6b383d746794530ade564c7c', ... }}
```

`id` is the session ID.

### getUserID(domain, id, callback)

`getUserID` requires three arguments:
* the domain name of the server,
* the session id,
* a callback function.

The callback gets two arguments: `error` and the server `response`.

`error` is null or contains the error message.

The `response` object contains:
```
{ { data: '684f6427-2168-a221-a418-4d4ffa3fc397' }}
```

`data`is the User ID.

### call(domain, method, params, callback)

`call` gets four arguments:
* the domain name of the server,
* the SugarCRM's method to execute,
* the parameters associated to this method,
* a callback function.

The method argument is a string that matches the SugarCRM method to process. For instance `method="get_entries_count"`. The parameters argument is an object. Its content depends on the method. The first key/value pair is the session ID (§ quick startup).

The callback gets two arguments: `error` and the server `response`.

`error` is null or contains the error message.

The `response` object depends on the selected method. For instance `get_entries_count` returns:
```
{ data: { result_count: '561' } }
```

Enjoy!

## License

[MIT](LICENSE.md).

<!--- URls -->

[npm-image]: https://img.shields.io/npm/v/jsugar.svg?style=flat-square
[npm-install-image]: https://nodei.co/npm/jsugar.png?compact=true
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[download-image]: https://img.shields.io/npm/dm/jsugar.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/jclo/jsugar.svg?style=flat-square
[coveralls-image]: https://img.shields.io/coveralls/jclo/jsugar/master.svg?style=flat-square
[dependencies-image]: https://david-dm.org/jclo/jsugar/status.svg?theme=shields.io
[devdependencies-image]: https://david-dm.org/jclo/jsugar/dev-status.svg?theme=shields.io
[license-image]: https://img.shields.io/npm/l/jsugar.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/jsugar
[npm-install-url]: https://nodei.co/npm/jsugar
[node-url]: http://nodejs.org/download
[download-url]: https://www.npmjs.com/package/jsugar
[travis-url]: https://travis-ci.org/jclo/jsugar
[coveralls-url]: https://coveralls.io/github/jclo/jsugar?branch=master
[dependencies-url]: https://david-dm.org/jclo/jsugar#info=dependencies
[devdependencies-url]: https://david-dm.org/jclo/jsugar#info=devDependencies
[license-url]: http://opensource.org/licenses/MIT
