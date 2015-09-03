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

    describe("when adding steps", () => {
        beforeEach(() => {
            this.order = [];
            this.step1 = new Workflow.Step(
                "eula",
                () => Q.delay(300).then(() => this.order.push("eula"))
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

            return this.workflow.run();
        });

        it("should have called the steps in the right order", () => {
            this.order.should.eql(["eula", "releaseNotes", "welcome"]);
        });
    });
});
