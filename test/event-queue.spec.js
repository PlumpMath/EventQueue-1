/* globals EventQueue, assert*/

// CustomEvent polyfill
(function () {
    'use strict';
  function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

describe('EventQueue', function () {
    'use strict';

    describe('#constructor()', function () {
        it('should return a new instance of EventQueue', function () {
            var eq = new EventQueue();
            assert.deepEqual(eq._queue, []);
            assert.deepEqual(eq._events, []);
            assert.deepEqual(eq._completedEvents, []);
            assert.deepEqual(eq._hasBuilt, false);
            assert.deepEqual(typeof eq._callback, 'function');
            assert.deepEqual(eq._targetCount, 0);
        });
    });

    describe('#queueEvent()', function () {
        it('should add an event to the queue', function () {
            var eq = new EventQueue();
            eq.queueEvent('testEvent');
            assert(eq._queue.length === 1);
        });
        it('should add multiple events to the queue', function () {
            var eq = new EventQueue();
            eq.queueEvent('testEvent', 3);
            assert(eq._queue.length === 3);
        });
    });

    describe('#addCallback()', function () {
        it('should add a callback to the event queue', function () {
            var eq = new EventQueue();
            eq.addCallback(function () {
                return true;
            });
            assert(eq._callback());
        });
    });

    describe('#isComplete()', function () {
        it('should default to false', function () {
            var eq = new EventQueue();
            assert.equal(eq.isComplete(), false);
        });
    });

    describe('#reset()', function () {
        it('should reset all values to default', function () {
            var eq = new EventQueue();
            var eq2 = new EventQueue()
                .queueEvent('test', 3)
                .addCallback(function () {
                    return 'this is a test';
                })
                .build()
                .reset();
            assert.deepEqual(eq._queue, eq2._queue);
            assert.deepEqual(eq._events, eq2._events);
            assert.deepEqual(eq._completedEvents, eq2._completedEvents);
            assert.deepEqual(eq._hasBuilt, eq2._hasBuilt);
            assert.deepEqual(eq._targetCount, eq2._targetCount);
        });
    });

    describe('#triggerEvent()', function () {
        it('should add the event to the completed queue', function () {
            var eq = new EventQueue()
                .queueEvent('name', 2)
                .build();
            eq.triggerEvent('name');
            assert(eq._completedEvents.length === 1);
        });
    });

    describe('#build()', function () {
        it('should build the queue and create the listeners', function () {
            var eq = new EventQueue()
                .queueEvent('name', 4)
                .build();
            assert(eq._targetCount === 4);
            assert(eq._events.length === 4);
            assert(eq._queue.length === 0);
            assert(eq._hasBuilt);
        });
    });

    describe('#_buildListeners()', function () {
        it('should add a listener to the body with the randomly generated id', function () {
            var eq = new EventQueue()
                .queueEvent('name', 4)
                .build();
        });
    });

    describe('#_pollProgress()', function () {
        it('should move an event to the completed events', function () {
            
        });
        it('should move to the success method on queue completion', function () {
        
        });
    });

    describe('#_destroyListeners()', function () {
        it('should remove listeners from the document', function () {
        
        });
    });

    describe('#_success()', function () {
        it('should run the callback function', function () {
        
        });
        it('should reset the event queue', function () {
        
        });
    });

    describe('#_failure()', function () {
        it('should throw an error with the supplied message', function () {
        
        });
    });

});
