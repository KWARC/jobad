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

/**
	* Checks if 2 objects are equal.
	* @function JOBAD.util.objectEquals
	* @static
	* @param {object} a Object A
	* @param {object} b Object B
	*	@returns boolean
	*/
JOBAD.util.objectEquals = function(a, b){
	try{
    //use JSON.stringify.
		return JSON.stringify(a) === JSON.stringify(b);
	} catch(e){
    //fallback to old checking.
    //this only happens if we have something non-jsonable in the object.
		return a===b;
	}
}

/**
  * Checks if object is defined and return obj, otherwise an empty Object.
  * @function JOBAD.util.defined
  * @static
  * @param {object} obj - Object to check.
  * @returns {object}
  */
JOBAD.util.defined = function(obj){
  //one-liner
	return (typeof obj == "undefined")?{}:obj;
};

/**
	* Forces obj to be a boolean.
	* @function JOBAD.util.forceBool
	* @static
	* @param {object} obj - Object to check.
	* @param {boolean} [def] - Default to use when object is not a boolean.
	* @returns {boolean}
	*/
JOBAD.util.forceBool = function(obj, def){

	//the default is the object itself if undefined.
	if(typeof def == "undefined"){
		def = obj;
	}

	//and make the implict typecast if needed
	return (typeof obj == "boolean"?obj:(def?true:false));
};

/**
	* Forces an object to be an array.
	* @function JOBAD.util.forceArray
	* @static
	* @param {object} obj - Object to check.
	* @param {object[]} [def] - Default to use when object is not an array.
	* @returns object[]
	*/
JOBAD.util.forceArray = function(obj, def){
	var def = def;

	//set the default correctly.
	if(typeof def == "undefined"){
		if(typeof obj == "undefined"){
			def = [];
		} else {
			def = [obj];
		}
	}

	//if default is not an array,
	//we make it a new one-member array.
	if(!JOBAD.util.isArray(def)){
		def = [def];
	}


	//return the default if not an array.
	return JOBAD.util.isArray(obj)?obj:def;
}

/**
	* Forces obj to be a function.
	* @function JOBAD.util.forceFunction
	* @static
	* @param {object} func - Object to check.
	* @param {function} [def] - Optional. Default to use instead.
	*/
JOBAD.util.forceFunction = function(func, def){
	//reference the variables locally.
	var def = def;
	var func = func;

	if(typeof func == "function"){
		//if its a function, return it.
		return func;
	} else if(typeof def == "undefined"){
		//if the default is undefined, return the value (via a lambda construct)
		return function(){return func; }
	} else if(typeof def == "function"){
		//if the default is a function, return that
		return def;
	} else {
		//if the default is not a function, return the default always
		return function(){return def; }
	}
}

/**
	* If obj is of type type, return obj else def.
	* @function JOBAD.util.ifType
	* @static
	* @param {object} obj - Object to check.
	* @param {class} type - Type to check.
	* @param {object} def - Default to use.
	*/
JOBAD.util.ifType = function(obj, type, def){
	//one-liner
	return (obj instanceof type)?obj:def;
}
