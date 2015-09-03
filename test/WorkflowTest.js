import Workflow from "../src/Workflow";
import Q from "q";

describe("Workflow", function () {
    beforeEach(() => {
        this.workflow = new Workflow("load");
    });

    it("should implement Workflow", () => {
        this.workflow.should.have.property("name");
        this.workflow.should.respondTo("addStep");
        this.workflow.should.respondTo("run");
    });

    it("should implement Emitter", () => {
        this.workflow.should.respondTo("on");
        this.workflow.should.respondTo("off");
        this.workflow.should.respondTo("once");
    });

    describe("when adding steps", () => {
        beforeEach(() => {
            this.order = [];
            this.step1 = new Workflow.Step(
                "eula",
                () => Q.delay(10).then(() => this.order.push("eula"))
            );
            this.step2 = new Workflow.Step(
                "releaseNotes",
                () => Q.resolve().then(() => this.order.push("releaseNotes"))
            );
            this.step3 = new Workflow.Step(
                "welcome",
                () => this.order.push("welcome")
            );

            this.workflow
                .addStep(this.step1)
                .addStep(this.step2)
                .addStep(this.step3);

            this.runListener = sinon.stub();
            this.stepListener = sinon.stub();
            this.workflow.on("run", this.runListener);
            this.workflow.on("step", this.stepListener);

            this.execListener1 = sinon.stub();
            this.execListener2 = sinon.stub();
            this.execListener3 = sinon.stub();
            this.step1.on("exec", this.execListener1);
            this.step2.on("exec", this.execListener2);
            this.step3.on("exec", this.execListener3);

            return this.workflow.run();
        });

        it("should have called the steps in the right order", () => {
            this.order.should.eql(["eula", "releaseNotes", "welcome"]);
        });

        it("should have called the `runListener`", () => {
            this.runListener.should.have.been.called;
        });

        it("should have called the `stepListener` 3 times", () => {
            this.stepListener.should.have.been.calledThrice;
        });

        it("should have called the `stepListener` the first time with step 1", () => {
            this.stepListener.getCall(0).should.have.been.calledWith(this.step1, 1/3);
        });

        it("should have called the `stepListener` the second time with step 2", () => {
            this.stepListener.getCall(1).should.have.been.calledWith(this.step2, 2/3);
        });

        it("should have called the `stepListener` the third time with step 3", () => {
            this.stepListener.getCall(2).should.have.been.calledWith(this.step3, 1);
        });

        it("should have called the `exec` listener for step 1", () => {
            this.execListener1.should.have.been.calledWith(this.workflow);
        });

        it("should have called the `exec` listener for step 2", () => {
            this.execListener2.should.have.been.calledWith(this.workflow);
        });

        it("should have called the `exec` listener for step 3", () => {
            this.execListener3.should.have.been.calledWith(this.workflow);
        });
    });
});
