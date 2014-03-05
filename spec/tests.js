/*jshint expr:true */
/*global afterEach,beforeEach */
var chai = require("chai");
//var sinon = require("sinon");
//var sinonChai = require("sinon-chai");
chai.should();
var expect = chai.expect;
//chai.use(sinonChai);

var todo = require('../src/scripts/app')

describe('Todo App', function() {
  it('requires Vue & jQuery', function() {
    expect(todo).to.be.defined
    expect(window.$).to.be.defined
    expect(window.Vue).to.be.defined
    expect(window.angular).to.be.undefined
  })
})
