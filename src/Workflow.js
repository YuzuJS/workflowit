import Q from "q";
import { makeEmitter } from "pubit-as-promised";

class Step {
    constructor(name, fn) {
        this.name = name;
        this.fn = fn.bind(this);
        this._publish = makeEmitter(this, ["exec"]);
    }
    exec(wf) {
        return Q(this.fn()).then(() => this._publish("exec", wf));
    }
}
export default class Workflow {
    constructor(name) {
        this._name = name;
        this._steps = [];
        this._publish = makeEmitter(this, ["step", "run"]);
    }
    get name() {
        return this._name;
    }
    addStep(step) {
        this._steps.push(step);
        return this;
    }
    run() {
        var chainSteps = (prev, nextStep) => prev.then(() => this._onStep(prev, nextStep));

        return this._steps.reduce(chainSteps, Q.resolve()).then(
            () => this._publish.when("run")
        );
    }

    _onStep(prev, step) {
        var progress = this._progressOf(step);
        return prev.then(() => step.exec(this))
                   .then(() => this._publish.when("step", step, progress));
    }

    _progressOf(step) {
        return (this._steps.indexOf(step) + 1) / this._steps.length;
    }

    static get Step() { return Step; }
}
