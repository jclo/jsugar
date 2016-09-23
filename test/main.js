/* global describe, it */
/* eslint camelcase: 0, no-unused-expressions: 0 */

// -- Node modules
var expect = require('chai').expect
  ;

// -- Local modules
var sugar = require('../index.js')
  ;

// -- Local constants
var domain = 'http://ec2-54-74-149-4.eu-west-1.compute.amazonaws.com/sugarCE' // 'http://sas.opacus.co.uk'
  , user = 'demo' // 'Demo'
  , password = 'demo' // 'opacus'
  ;

// -- Local variables
var id = ''
  ;

// -- Main

describe('Test of jsugar library:', function() {
  // Test access to the server:
  describe('The function getServerInfo():', function() {
    var data;

    it('Expects the method to return an object.', function(done) {
      sugar.getServerInfo(domain, function(error, res) {
        data = res.data;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects the object to have a property "falvor".', function() {
      expect(data).to.have.property('flavor');
    });

    it('Expects the object to have a property "version".', function() {
      expect(data).to.have.property('version');
    });

    it('Expects the object to have a property "gmt_time".', function() {
      expect(data).to.have.property('gmt_time');
    });
  });

  // Test login:
  describe('The function login():', function() {
    var data;

    it('Expects the method to return an object.', function(done) {
      sugar.login(domain, user, password, function(error, res) {
        data = res.data;
        id = res.data.id;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects the object to have a property "id".', function() {
      expect(data).to.have.property('id');
    });

    it('Expects the property "id" to be a string.', function() {
      expect(data.id).to.be.a('string');
    });

    // Test error:
    it('Expects the method throws an error if missing arguments.', function() {
      var error = false;
      try {
        sugar.login(domain, user, function() {
          //
        });
      } catch (e) {
        error = true;
      }
      expect(error).to.be.true;
    });
  });

  // Test User ID:
  describe('The function getUserID():', function() {
    var data;

    it('Expects the method to return a string.', function(done) {
      sugar.getUserID(domain, id, function(error, res) {
        data = res.data;
        expect(data).to.be.a('string');
        done();
      });
    });
  });

  // Test a call:
  describe('The function call():', function() {
    var data;

    it('Expects the method to return an object.', function(done) {
      var params = {
        session: id,
        module_name: 'Accounts',
        query: '',
        deleted: false
      };
      sugar.call(domain, 'get_entries_count', params, function(error, res) {
        data = res.data;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects the object to have a property "result_count".', function() {
      expect(data).to.have.property('result_count');
    });

    it('Expects the property "result_count" to be a string.', function() {
      expect(data.result_count).to.be.a('string');
    });

    // Test error:
    it('Expects the method throws an error if missing arguments.', function() {
      var error = false;
      try {
        sugar.call(domain, 'get_entries_count', function() {
          //
        });
      } catch (e) {
        error = true;
      }
      expect(error).to.be.true;
    });
  });

  // Test logout:
  describe('The function logout():', function() {
    it('Expects the method to return null.', function(done) {
      sugar.logout(domain, id, function(error, res) {
        expect(res.data).to.be.null;
        done();
      });
    });
    it('Expects the method accepts no callback.', function() {
      sugar.logout(domain, id);
      expect(true).to.be.true;
    });
  });
});
