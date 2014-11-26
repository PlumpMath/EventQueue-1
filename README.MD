##EventQueue##

Simple event queueing system to help out with event driven applications.

I ran into an issue where we had no existing solution handling promises from async requests, also other arbitrary things that, on completion of the whole lot, needed to then execute something (I'm looking at you, multiple nested ng-repeats), so I through together this little class to add a queue, driven by events, that would execute a callback when the required number of requests had concluded.

The following is an example, which can also be seen within the demo folder.

```
var eq = new EventQueue();          // Instantiate!
eq.queueEvent('name_of_event', 4);  // Event name and amount to queue (can be ommitted if only one required)
eq.addCallback(function () {        // Add a callback to be called when all events have been completed
    doSomethingFancy('NOW');
});
eq.build();                         // Build the queue, which will prevent further events being added.
```

After the queue is built, you can call the reset method to revert it to a clean state, or whatever, yeah?

Then, at any part of your code, simply trigger an event on the event queue to check it off the list

```
eq.triggerEvent('name_of_event');
```

This will check off one of the events of that name from the queue. When all events have been completed, the callback function will be executed and the queue will reset to a clean state.

###TODO###

* At present all events are applied to the document for simplicity's sake, but the option to apply a queue to any DOM node would be preferable.
* Add a flag to determine that when the queue completes it should revert to a clean state, or just revert to the state it was after build.
* Do some proper QA because reasons
