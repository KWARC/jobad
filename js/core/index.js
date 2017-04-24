/*
	JOBAD 3 Core
	
	Copyright (C) 2013-17 KWARC Group <kwarc.info>
	
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

/*
	JOBAD 3 Main Function
	Creates a new JOBAD instance on a specefied DOM element.
	@param element Element to link this element to. May be a DOM Element or a jQuery Object.
	@param config Configuration for this JOBAD Instance.

*/
var JOBAD = module.exports = function(element){

	//make sure that we are actually creating a new instance. 
	if(!(this instanceof JOBAD)){
		return new JOBAD(element);
	}

	var me = this;

	this.ID = JOBAD.util.UID(); //assign an id to this JOBAD

	//Add init arguments
	this.args = [];
	for(var i=0;i<arguments.length;i++){
		this.args.push(arguments[i]);
	}

	//The element the current JOBAD instance works on.
	this.element = JOBAD.refs.$(element);

	if(this.element.length == 0){
		JOBAD.error("Can't create JOBADInstance: Element Collection seems to be empty. ");
		return;
	}

	if(this.element.length > 1){
		JOBAD.console.warn("Warning: More than one element specefied for JOBADInstance. This may cause problems with some modules. ");
	}

	if(JOBAD.util.isMarkedHidden(element)){
		JOBAD.error("Can't create JOBADInstance: Element marked as hidden. ");
		return;
	}

	/*
		Checks if this JOBAD Instance contains an element.
		@param	el	Element to check.
	*/
	this.contains = function(el){
		return JOBAD.util.containsAll(me.element, el, true);
	}

	//IFace extensions
	for(var i=0; i < JOBAD.ifaces.length; i++){
		var mod = JOBAD.ifaces[i];
		if(typeof mod == 'function'){
			mod.call(this, this, this.args);
		}
	}
};

/** The current version of JOBAD */
JOBAD.version = "3.2.3";

/*
	JOBAD.toString
*/
JOBAD.toString = function(){
	return "function(/* JOBAD "+JOBAD.version+" */){ [non-native non-trivial code] }";
};

JOBAD.toString.toString = JOBAD.toString; //self-reference!


/*
	JOBAD.error: Produces an error message
*/
JOBAD.error = function(msg){
	JOBAD.console.error(msg);
	throw new Error(msg);
}

/*
	JOBAD Dependencies namespace.
*/
JOBAD.refs = {};
JOBAD.refs.$ = require('jquery');

JOBAD.noConflict = function(){
	JOBAD.refs.$ = JOBAD.refs.$.noConflict();
	return JOBAD.refs.$;
}; //No conflict mode