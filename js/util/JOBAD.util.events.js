/*
	JOBAD utility functions

	Copyright (C) 2013-15 KWARC Group <kwarc.info>

	This file is part of JOBAD.

	JOBAD is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	JOBAD is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/

/** Creates a new Event handler.
  * @function JOBAD.util.EventHandler
  * @param {object} me - Object to use as this inside callbacks.
  *
  * @returns an Event Handler supporting methods 'on', 'once', 'off' and 'trigger'.
  */
JOBAD.util.EventHandler = function(me){

  //Create Object to return
  //and the event handler
	var handler = {};
	var EventHandler = JOBAD.refs.$("<div>");

  //Register all the other functions

	handler.on = function(event, handler){
		return JOBAD.util.on(EventHandler, event, handler.bind(me));
	};

	handler.once = function(event, handler){
		return JOBAD.util.once(EventHandler, event, handler.bind(me));
	};

	handler.off = function(handler){
		return JOBAD.util.off(EventHandler, handler);
	};

	handler.trigger = function(event, params){
		return JOBAD.util.trigger(EventHandler, event, params);
	}

	return handler;
}


/**
  * Triggers an element on a query.
  * @function JOBAD.util.trigger
  * @static
  * @param {jQuery}   query - An element to use as a query.
  * @param {string}   event - Event to trigger.
  * @param {object[]} params - Parameters to pass to event.
  * @returns {object} - result of the event.
  */
JOBAD.util.trigger = function(query, event, params){

  //parse the query.
	var query = JOBAD.refs.$(query);


	var result;

  //make a copy of the parameter array.
	var params = JOBAD.util.forceArray(params).slice(0);

  //and add the event in front of it.
	params.unshift(event);

  //give the id so we can capture the result.
	var id = JOBAD.util.UID();

  //save the result of the event.
	query.on(event+"."+id, function(ev){
		result = ev.result;
	})

  //Trigger the event.
	query.trigger.apply(query, params);

  //And remove our specific catcher.
	query.off(event+"."+id);

  //return the result.
	return result;
}

/**
  * Adds an event listener to a query.
  * @function JOBAD.util.on
  * @static
	* @param {jQuery}    query - A jQuery element to use as as query.
	* @param {string}    event - Event to register trigger for.
	* @param {function}  handler - Handler to add
  * @returns {string}  an id for the added handler.
  */
JOBAD.util.on = function(query, event, handler){

  //wrap the query.
  var query = JOBAD.refs.$(query);

  //make an id.
	var id = JOBAD.util.UID();
  //make sure the handler is a function.
	var handler = JOBAD.util.forceFunction(handler, function(){});

  //and wrap it to remove some arguments.
	handler = JOBAD.util.argSlice(handler, 1);

  //register the handler.
	query.on(event+".core."+id, function(ev){
		var result = JOBAD.util.forceArray(ev.result);

		result.push(handler.apply(this, arguments));

		return result;
	});

  //return the id.
	return event+".core."+id;
}

/**
  * Removes an event handler from a query.
  * @function JOBAD.util.off
  * @static
	* @param {jQuery}  query - A jQuery element to use as as query.
	* @param {string}  id - Id of handler to remove.
  */
JOBAD.util.off = function(query, id){
  //simply remove the handler.
	var query = JOBAD.refs.$(query);
	query.off(id);
}



/**
  * Adds a one-time event listener to a query.
  * @function JOBAD.util.once
  * @static
	* @param {jQuery}    query - A jQuery element to use as as query.
	* @param {string}    event - Event to register trigger for.
	* @param {function}  handler - Handler to add
	* @returns {string} an id for the added handler.
  */
JOBAD.util.once = function(query, event, handler){
	var id;

  //use the on function to do the work
	id = JOBAD.util.on(query, event, function(){
    //call the handler
		var result = handler.apply(this, arguments);

    //and remove it.
		JOBAD.util.off(query, id);
	});

  return id;
}
