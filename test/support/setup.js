"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var sinonChai = require("sinon-chai");

global.sinon = require("sinon");
global.expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();
