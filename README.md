# workflow-it
Run async tasks in a series of steps.

Unlike [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), which runs all tasks in parallel, `workflowit` will run each task in sequence they were added to the workflow object.

This is useful for when you are tying to put a bunch of tasks back to back without each one stepping over each other.

### Okay, tell me more.

With `workflowit`, you create a `Workflow` object, and add `Step`s which represent your task.
The function you pass into your step can optionally return a promise.

```javascript
function showTermsOfService() {
    tosWgt.show();
}
function showReleaseNotes() {
    return service.fetchReleaseNotes().then(function (notes) {
        rnWgt.show(notes);
    });
}
// The task function is passed the step and workflow object.
function showWelcome(step, workflow) {
    welcomeWgt.show(workflow.name, step.name);
}

// Setup the workflow.
var Workflow = require("workflowit");

// Create workflow and add steps.
var wf = new Workflow("startup")
    .addStep(new Workflow.Step("tos", showTermsOfService))
    .addStep(new Workflow.Step("rn", showReleaseNotes))
    .addStep(new Workflow.Step("welcome", showWelcome));

// You can also provide steps directly in the constructor
var wf = new Workflow(
    "startup",
    new Workflow.Step("tos", showTermsOfService),
    new Workflow.Step("rn", showReleaseNotes),
    new Workflow.Step("welcome", showWelcome)
);

// Later....
wf.run().done();
```

In the above example, `rn` won't run until `tos` promise has resolved, similarly, `welcome` won't run until `rn` has completed.

You can listen for events.

```javascript
wf.on("step", function (step, progress) {
    console.log("We are at step " + step.name + " with progress " + progress);
}

// The step event handler would get 3 times from the above setup.
// The step being the `Workflow.Step` object, and the progress being
// `1/3` for the first, `2/3` for the second, and `1` for the last event.

wf.on("exec", function () {
    console.log("we are done!");
});
```

All events can return a promise.

The `Worflow.Step` object emits an `exec` event when it has complted running.

```javascript
step.on("exec", function (wf) {
    console.log(step.name + " just ran for the wf: " + wf.name);
}
```

## You can of course extend, swap `Workflow` and `Workflow.Step`.

```typescript
interface Workflow {
    addStep(step: WorkflowStep);
    run(): Promise;
}

interface WorkflowStep { // Yup just a command.
    exec();
}

```
