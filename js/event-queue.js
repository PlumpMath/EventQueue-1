/**
 * EventQueue
 *
 * Simple, plain JavaScript event queue for to take a bit
 * of the busywork out that surrounds event / observer
 * driven applications.
 *
 * @author a-ghost-fart
 * {@link http://github.com/a-ghost-fart}
 */


/**
 * EventQueue
 * Constructor for the event queue. Just creates an instance
 * but doesn't actually do anything until you queue some events
 * and then build it.
 *
 * Generates a random id for itself as to distinguish itself from
 * other event queues that may be made.
 *
 * @constructor
 * @public
 * @this {EventQueue}
 */
function EventQueue() {
    'use strict';
    this.id = (new Date().getTime() * (Math.random() * 0x10)).toString(16);
    this._queue = [];
    this._events = [];
    this._completedEvents = [];
    this._hasBuilt = false;
    this._callback = function () {};
    this._targetCount = 0;
}


/**
 * Public methods
 */


/**
 * queueEvent
 * Queues a number of events with the given name.
 *
 * This is specific to this instance of the EventQueue.
 *
 * @public
 * @func
 * @this {EventQueue}
 * @param {String}  name    - Name of the event
 * @param {Integer} [count]   - Number of similar events to queue.
 * @return {EventQueue}
 */
EventQueue.prototype.queueEvent = function (name, count) {
    'use strict';
    if (count !== undefined) {
        for (var i = 0; i < count; i++) {
            this._queue.push(name);
        }
    } else {
        this._queue.push(name);
    }
    return this;
};


/**
 * addCallback
 * Adds a callback to the event queue.
 * When the callback is executed, as part of the success
 * condition, the callback will be destroyed and reset to
 * an empty function.
 *
 * @public
 * @func
 * @this {EventQueue}
 * @param   {Function}  callback    - Callback to be called when all events in queue are resolved
 * @return  {EventQueue}
 */
EventQueue.prototype.addCallback = function (callback) {
    'use strict';
    this._callback = callback;
    return this;
};


/**
 * isComplete
 * Simple check to see if the event queue has completed.
 *
 * @public
 * @func
 * @this {EventQueue}
 * @return {Boolean} boolean - Is the current queue complete?
 */
EventQueue.prototype.isComplete = function () {
    'use strict';
    return this._queue.length === 0 && this._events === 0 && this._completedEvents.length === this._targetCount;
};


/**
 * reset
 * Destroy the current queue, events and state of the
 * instance of the event queue. Allowing the same instance
 * and id to be reused.
 *
 * Also called on success of the queue.
 *
 * @public
 * @func
 * @this {EventQueue}
 * @return {EventQueue}
 */
EventQueue.prototype.reset = function () {
    'use strict';
    this._queue = [];
    this._events = [];
    this._completedEvents = [];
    this._hasBuilt = false;
    this._targetCount = 0;
    this._destroyListeners();
    this._callback = function () {};
    return this;
};


/**
 * triggerEvent
 * Trigger an event on the event queue which will be fired
 * off against the randomly generated id with the given name.
 *
 * Event names are checked against the queue and the queue
 * will fail if a bad event name is given.
 *
 * @public
 * @func
 * @this {EventQueue}
 * @param   {String}    name - Event name to trigger.
 * @return  {EventQueue}
 */
EventQueue.prototype.triggerEvent = function (name) {
    'use strict';
    if (this._hasBuilt) {
        if (this._events.indexOf(name) !== -1) {
            var event = new CustomEvent(this.id, { 'detail': { 'name': name }});
            document.dispatchEvent(event);
        } else {
            this._failure('No events found with name "' + name + '"');
        }
    } else {
        this._failure('No event listeners created. Execute build() first.');
    }
    return this;
};


/**
 * build
 * Takes the existing queue and sets up the event listeners
 * and makes sure that everything is ready to go.
 *
 * TODO: Check for callback present
 *
 * @public
 * @func
 * @this {EventQueue}
 * @return {EventQueue}
 */
EventQueue.prototype.build = function () {
    'use strict';
    if (!this._hasBuilt && this._queue.length > 0) {
        this._targetCount = this._queue.length;
        for (var i = 0; i < this._targetCount; i++) {
            this._events.push(this._queue[i]);
        }
        this._queue = [];
        this._buildListeners();
        this._hasBuilt = true;
    } else if (!this._hasBuilt && this._queue.length === 0) {
        this._failure('You need to queue events first, use queueEvent(name, count) to add events to the queue first.');
    } else {
        this._failure('Queue already built, cannot build again. Use reset() to start over with the same instance.');
    }
    return this;
};


/**
 * Private methods
 */


/**
 * _buildListeners
 * Creates the listeners on the document and, upon the event
 * being triggered, send it over to the _pollProgress method.
 *
 * TODO: Allow events to be targetted at a specific element
 *
 * @private
 * @func
 * @this {EventQueue}
 * @return {EventQueue}
 */
EventQueue.prototype._buildListeners = function () {
    'use strict';
    var _this = this;
    document.addEventListener(this.id.toString(), function (event) {
        _this._pollProgress(event);
    });
    return this;
};


/**
 * pollProgress
 * Fired when an event hits the listener. Removes the
 * event from the queue and, if all events are completed,
 * fires off the callback function.
 *
 * TODO: More checking on events existing.
 *
 * @private
 * @func
 * @this {EventQueue}
 * @param {Event} event - Event triggered
 * @return {undefined}
 */
EventQueue.prototype._pollProgress = function (event) {
    'use strict';
    var index = this._events.indexOf(event.detail.name);
    this._events.splice(index, 1);
    this._completedEvents.push(event.detail.name);
    if (this._completedEvents.length === this._targetCount) {
        this._callback();
        this.reset();
    }
};


/**
 * _destroyListeners
 * Remove the listener from the document upon success or
 * the public reset function being called.
 *
 * TODO: Change document to specified element
 *
 * @private
 * @func
 * @this {EventQueue}
 * @return {EventQueue}
 */
EventQueue.prototype._destroyListeners = function () {
    'use strict';
    document.removeEventListener(this.id);
    return this;
};


/**
 * _success
 * If the _pollProgress method decides that the queue has
 * resolved, destroy the listeners, fire off the callback;
 *
 * @private
 * @func
 * @this {eventqueue}
 * @return {EventQueue}
 */
EventQueue.prototype._success = function () {
    'use strict';
    this._destroyListeners();
    this._callback();
    return this;
};


/**
 * _failure
 * Called upon screwing something up on configuration
 * because of my horrible way of structuring applications.
 *
 * Kills the event listeners and throws an error which will
 * either make you angry at me or something.
 *
 * @private
 * @func
 * @this {eventqueue}
 * @param   {String} msg - Message to be displayed
 * @return  {Error}
 */
EventQueue.prototype._failure = function (msg) {
    'use strict';
    this._destroyListeners();
    throw new Error('[EventQueue FAILURE]: ' + msg);
};


/**
 * Check if module object exists for use with commonjs
 * module loading.
 */
if (typeof module === 'object') {
    module.exports = EventQueue;
}
