import Q from "q";

class Step {
    constructor(name, fn) {
        this.name = name;
        this.exec = fn.bind(this);
    }
}
export default class Workflow {
    constructor(name) {
        this._name = name;
        this._steps = [];
    }
    get name() {
        return this._name;
    }
    addStep(step) {
        this._steps.push(step);
        return this;
    }
    run() {
        var chainSteps = (prev, nextStep) => prev.then(nextStep.exec.bind(nextStep));
        return this._steps.reduce(chainSteps, Q.resolve());
    }
    static get Step() { return Step; }
}
