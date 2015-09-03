import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";

global.sinon = require("sinon");
global.expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();
