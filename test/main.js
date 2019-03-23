/* global describe, it */
/* eslint one-var: 0, import/no-extraneous-dependencies: 0, semi-style: 0,
  prefer-destructuring: 0 */

// -- Node modules
const { expect } = require('chai')
    ;


// -- Local modules
const sugar = require('../index.js')
    ;


// -- Local constants
const domain = 'http://ec2-54-74-149-4.eu-west-1.compute.amazonaws.com/sugarCE' // 'http://sas.opacus.co.uk'
    , user = 'demo' // 'Demo'
    , password = 'demo' // 'opacus'
    ;


// -- Local variables
let id = ''
  ;

// -- Main

describe('Test of jsugar library:', () => {
  // Test access to the server:
  describe('The function getServerInfo():', () => {
    let data;

    it('Expects the method to return an object.', (done) => {
      sugar.getServerInfo(domain, (error, res) => {
        data = res.data;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects the object to have a property "falvor".', () => {
      expect(data).to.have.property('flavor');
    });

    it('Expects the object to have a property "version".', () => {
      expect(data).to.have.property('version');
    });

    it('Expects the object to have a property "gmt_time".', () => {
      expect(data).to.have.property('gmt_time');
    });
  });

  // Test login:
  describe('The function login():', () => {
    let data;

    it('Expects the method to return an object.', (done) => {
      sugar.login(domain, user, password, (error, res) => {
        data = res.data;
        id = res.data.id;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects the object to have a property "id".', () => {
      expect(data).to.have.property('id');
    });

    it('Expects the property "id" to be a string.', () => {
      expect(data.id).to.be.a('string');
    });

    // Test error:
    it('Expects the method throws an error if missing arguments.', () => {
      let error = false;
      try {
        sugar.login(domain, user, () => {
          //
        });
      } catch (e) {
        error = true;
      }
      expect(error).to.be.equal(true);
    });
  });

  // Test User ID:
  describe('The function getUserID():', () => {
    let data;

    it('Expects the method to return a string.', (done) => {
      sugar.getUserID(domain, id, (error, res) => {
        data = res.data;
        expect(data).to.be.a('string');
        done();
      });
    });
  });

  // Test a call:
  describe('The function call():', () => {
    let data;

    it('Expects the method "get_entries_count" to return an object.', (done) => {
      const params = {
        session: id,
        module_name: 'Accounts',
        query: '',
        deleted: false,
      };
      sugar.call(domain, 'get_entries_count', params, (error, res) => {
        data = res.data;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects the object to have a property "result_count".', () => {
      expect(data).to.have.property('result_count');
    });

    it('Expects the property "result_count" to be a string.', () => {
      expect(data.result_count).to.be.a('string');
    });

    // Test error:
    it('Expects the method to throw an error if the argument "params" is missing.', () => {
      let error = false;
      try {
        sugar.call(domain, 'get_entries_count', () => {
          //
        });
      } catch (e) {
        error = true;
      }
      expect(error).to.be.equal(true);
    });

    it('Expects the method "get_entry_list" to return an object.', (done) => {
      const params = {
        session: id,
        module_name: 'Accounts',
        query: '',
        order_by: '',
        offset: 0,
        select_fields: ['name'],
        link_name_to_fields_array: '',
        max_results: 1,
        deleted: false,
      };
      sugar.call(domain, 'get_entry_list', params, (error, res) => {
        data = res.data;
        expect(data).to.be.an('object');
        done();
      });
    });

    it('Expects this object to contains three results.', (done) => {
      const params = {
        session: id,
        module_name: 'Accounts',
        query: '',
        order_by: '',
        offset: 0,
        select_fields: ['name'],
        link_name_to_fields_array: '',
        max_results: 3,
        deleted: false,
      };
      sugar.call(domain, 'get_entry_list', params, (error, res) => {
        data = res.data.result_count;
        expect(data).to.be.equal(3);
        done();
      });
    });

    it('Expects the method "get_entry_list" to return an empty string if a param is missing.', (done) => {
      const params = {
        session: id,
        module_name: 'Accounts',
        // query: '',
        order_by: '',
        offset: 0,
        select_fields: ['name'],
        link_name_to_fields_array: '',
        max_results: 3,
        deleted: false,
      };
      sugar.call(domain, 'get_entry_list', params, (error, res) => {
        data = res.data;
        expect(data).to.be.a('string').that.has.a.lengthOf(0);
        done();
      });
    });

    it('Expects the method "get_entry_list" to return an error if the params "query, order_by and offset" are missing.', (done) => {
      const params = {
        session: id,
        module_name: 'Accounts',
        // query: '',
        // order_by: '',
        // offset: 0,
        select_fields: ['name'],
        link_name_to_fields_array: '',
        max_results: 3,
        deleted: false,
      };
      sugar.call(domain, 'get_entry_list', params, (error) => {
        expect(error).to.be.a('string');
        done();
      });
    });
  });

  // Test logout:
  describe('The function logout():', () => {
    it('Expects the method to return null.', (done) => {
      sugar.logout(domain, id, (error, res) => {
        expect(res.data).to.be.equal(null);
        done();
      });
    });
    it('Expects the method accepts no callback.', () => {
      sugar.logout(domain, id);
      expect(true).to.be.equal(true);
    });
  });
});
