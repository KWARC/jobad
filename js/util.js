/*
	JOBAD utility functions
	
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

var
	_ = require('underscore'),
	$ = require('jquery');

/*
	Binds every function within an object recursively. 
	@param obj Object to bind. 
	@param thisObj 'this' inside functions. 
*/
module.exports.bindEverything = function bindEverything(obj, thisObj){
	if(isObject(obj) && typeof obj != 'function' ){
		var ret = {};
		for(var key in obj){
			ret[key] = bindEverything(obj[key], thisObj);
		}
		return ret;
	} else if(typeof obj == 'function'){
		return bind(obj, thisObj);
	} else {
		return clone(obj);
	}
};

/*
	Creates a unique ID
	@param	prefix	Optional. A prefix to use for the UID. 
*/
module.exports.UID = function UID(prefix){
	var prefix = (typeof prefix == "string")?prefix+"_":"";
	var time = (new Date()).getTime();
	var id1 = Math.floor(Math.random()*1000);
	var id2 = Math.floor(Math.random()*1000);
	return ""+prefix+time+"_"+id1+"_"+id2;
};

/*
	Creates a dropdown (<select>) control. 
	@param values	Values to use. 
	@param texts	Texts to use. 
	@param start	Initially selected id. 
*/
module.exports.createDropDown = function createDropDown(values, texts, start){
	var select = $("<select>"); 

	for(var i=0;i<texts.length;i++){
		select.append(
			$("<option>")
			.attr("value", values[i])
			.text(texts[i])
		);
	}

	select.find("option").eq((typeof start == "number")?start:0).prop('selected', true); 

	return select; 
}

/*
	Creates a radio button for use with Bootsrap
	@param texts	Texts to use. 
	@param start	Initial selection
*/
module.exports.createRadio = function createRadio(texts, start){
	var id = UID(); //Id for the radio buttons
	var selfChange = false; 

	if(typeof start !== 'number'){
		start = 0;
	}

	var Div = $('<div>').addClass("btn-group");
	var Div2 = $('<div>').hide(); 
					
	for(var i=0;i<texts.length;i++){
		Div.append(
			$("<button>").addClass("btn").text(texts[i])
		);
		Div2.append(
			$("<input type='radio' name='"+id+"' value='"+UID()+"'>")
		);
	}


	var Buttons = Div.find("button"); 
	var Inputs = Div2.find("input"); 

	Buttons.on("click", function(){
		var radio = Inputs.eq(Buttons.index(this)); 
		radio[0].checked = true; 
		Inputs.change(); 
	})

	Inputs
	.change(function(e){
		Buttons.removeClass("active"); 

		Inputs.each(function(i){
			var me = $(this); 
			if(me.is(":checked")){
				Buttons.eq(i).addClass("active"); 
			}
		})
		e.stopPropagation(); 
	});
	
	Inputs.eq(start)[0].checked = true;
	Inputs.change(); 

	
	return $("<div>").append(Div, Div2); 
};

/*
	Creates tab data compatible with Bootstrap. 
	@param names	Texts to use. 
	@param divs	Divs to use as content. 
	@param config Configuration. Optional. 
		@param config.tabParams	Params for Tab creation. 
		@param config.type Type of tabs to use. CSS class. 
		@param config.select Select Hook. function(tabName, tabDiv) To be called on selection of a div. 
		@param config.unselect Deselect Hook. function(tabName, tabDiv) Top be called on the deselection of a div. 
*/
module.exports.createTabs = function createTabs(names, divs, config){
	var config = defined(config); 

	var options = .defined(config.tabParams); 
	var tabtype = (typeof config.type == "string")?config.type:"";
	var enableHook = (typeof config.select == "function")?config.select:function(){}; 
	var disableHook = (typeof config.unselect == "function")?config.unselect:function(){}; 

	var ids = []; 

	var div = $("<div>").addClass("tabbable "+tabtype);
	var ul = $("<ul>").appendTo(div).addClass("nav nav-tabs");
	var cdiv = $("<div>").addClass("tab-content").appendTo(div);
	for(var i=0;i<names.length;i++){
		var id = UID();
		ids.push("#"+id); 
		ul.append(
			$("<li>").append($("<a>").attr("data-toggle", "tab").attr("href", "#"+id).text(names[i]))
		);
		
		$("<div>").append(divs[i]).attr("id", id).addClass("tab-pane").appendTo(cdiv);
	}
	cdiv.children().eq(0).addClass("active"); 

	$('a[data-toggle="tab"]', ul).on("shown", function(e){
		if(typeof e.relatedTarget != "undefined"){
			var relatedTarget = $(e.relatedTarget); 
			var tabId = ids.indexOf(relatedTarget.attr("href")); 

			disableHook(relatedTarget.text(), $(divs[tabId])); 
		}

		var Target = $(e.target); 
		var tabId = ids.indexOf(Target.attr("href")); 
		enableHook(Target.text(), $(divs[tabId]));
	}); 

	$('a[data-toggle="tab"]', ul).eq(0).tab("show"); 

	return div; 
};

/*
	Applies a function to the arguments of a function every time it is called. 
	@param func Function to wrap
	@param wrap Wrapper function. 
*/

module.exports.argWrap = function argWrap(func, wrapper){
	return function(){
		var new_args = [];
		for(var i=0;i<arguments.length;i++){
			new_args.push(arguments[i]);
		}
		
		return func.apply(this, wrapper(new_args));
	};
};


/*
	Applies Array.slice to the arguments of a function every time it is called. 
	@param func Function to wrap
	@param to First parameter for args
	@param from Second Parameter for slice
*/

module.exports.argSlice = function argSlice(func, from, to){
	return argWrap(func, function(args){
		return args.slice(from, to);
	});
};

/*
	Checks if 2 objects are equal. Does not accept functions. 
	@param a Object A
	@param b Object B
	@returns boolean
*/
module.exports.objectEquals = function objectEquals(a, b){
	try{
		return JSON.stringify(a) == JSON.stringify(b);
	} catch(e){
		return a==b;
	}
};

/*
	Similary to jQuery's .closest() but also accepts functions. 
*/
module.exports.closest = function closest(element, selector){
	var element = $(element);
	if(typeof selector == "function"){
		while(element.length > 0){
			if(selector.call(element[0], element)){
				break; //we are matching
			}
			element = element.parent(); //go up
		}
		return element;
	} else {
		return element.closest(selector);
	}
};

/* Element marking */
/*
	Marks an element as hidden. 
	@param	element	Element to mark as hidden. 
*/
module.exports.markHidden = function markHidden(element){
	return markDefault(element).addClass("JOBAD_Ignore");
};

/*
	Marks an element as visible.
	@param	element	Element to mark as visible. 
*/
module.exports.markVisible = function markVisible(element){
	return markDefault(element).addClass("JOBAD_Notice");
};

/*
	Removes a marking from an element. Everything is treated as normal. 
	@param	element	Element to remove Marking from. 
*/
module.exports.markDefault = function markDefault(element){
	return $(element).removeClass("JOBAD_Ignore").removeClass("JOBAD_Notice");
};

/*
	Checks if an element is marked as hidden. 
	@param	element	Element to check. 
*/
module.exports.isMarkedHidden = function isMarkedHidden(element){
	return (closest(element, function(e){
		//find the closest hidden one. 
		return e.hasClass("JOBAD_Ignore");
	}).length > 0);
};

/*
	Checks if an element is marked as visible. 
	@param	element	Element to check. 
*/
module.exports.isMarkedVisible = function isMarkedVisible(element){
	return $(element).hasClass("JOBAD_Notice");;
};

/*
	Checks if an element is hidden (either in reality or marked) . 
	@param	element	Element to check. 
*/
module.exports.isHidden = function isHidden(element){
	var element = $(element);
	if(isMarkedVisible(element)){
		return false;
	} else if(isMarkedHidden(element)){
		return true;
	} else if(element.is("map") || element.is("area")){//in response to issue #14 
		return false; 
	} else {
		return element.is(":hidden");
	}
};

/* Other utility functions */

/*
	Checks if object is defined and return obj, otherwise an empty Object. 
	@param	obj	Object to check. 
*/
module.exports.defined = function defined(obj){
	return (typeof obj == "undefined")?{}:obj;
};

/*
	Forces obj to be a boolean. 
	@param obj	Object to check. 
	@param def	Optional. Default to use instead. 
*/
module.exports.forceBool = function forceBool(obj, def){
	if(typeof def == "undefined"){
		def = obj; 
	}
	return (typeof obj == "boolean"?obj:(def?true:false));
};

/*
	Forces an object to be an array. 
*/
module.exports.forceArray = function forceArray(obj, def){
	var def = def; 
	if(typeof def == "undefined"){
		if(typeof obj == "undefined"){
			def =  []; 
		} else {
			def = [obj];
		}
	}
	if(!isArray(def)){
		def = [def]; 
	}
	return isArray(obj)?obj:def; 
}

/*
	Forces obj to be a function. 
	@param func	Function to check. 
	@param def	Optional. Default to use instead. 
*/
module.exports.forceFunction = function forceFunction(func, def){
	//local References
	var def = def;
	var func = func;
	if(typeof func == "function"){
		return func;
	} else if(typeof def == "undefined"){
		return function(){return func; }
	} else if(typeof def == "function"){
		return def;
	} else {
		return function(){return def; }
	}
}

/*
	If obj is of type type, return obj else def. 
*/
module.exports.ifType = function ifType(obj, type, def){
	return (obj instanceof type)?obj:def;
}

/*
	Checks if two strings are equal, ignoring upper and lower case. 
*/
module.exports..equalsIgnoreCase = function equalsIgnoreCase(a, b){
	var a = String(a);
	var b = String(b);

	return (a.toLowerCase() == b.toLowerCase())
};

/*
	Orders a jQuery collection by their tree depth. 
	@param element Collection to sort. 
*/
module.exports.orderTree = function orderTree(element){
	var element = $(element);
	return $(element.get().sort(function(a, b){
		var a = $(a).parents().filter(element).length;
		var b = $(b).parents().filter(element).length;

		if(a<b){
			return -1;
		} else if(a > b){
			return 1;
		} else {
			return 0;
		}
	}));
};

/*
	Checks if a string is a URL. 
	@param str	String to check. 
	@returns boolean. 
*/
module.exports.isUrl = function isUrl(str){
	var str = String(str);
	var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
	var matches = str.match(new RegExp(expression));
	if(isArray(matches)){
		return matches.length > 0;
	} else {
		return startsWith(str, "data:"); 
	}
};

/*
	Checks if the string str starts with the string start. 
*/
module.exports.startsWith = function startsWith(str, start){
	var str = String(str);
	var start = String(start);
	return (str.substring(0, start.length) == start); 
}

/*
	logical or
*/
module.exports.lOr = function lOr(){
	var args = [];
	for(var i=0;i<arguments.length;i++){
		args.push(arguments[i]);
	}
	args = map(flatten(args), forceBool);
	return (indexOf(args, true)!= -1);

};

/*
	logical and
*/
module.exports.lAnd = function lAnd(){
	var args = [];
	for(var i=0;i<arguments.length;i++){
		args.push(arguments[i]);
	}
	args = map(flatten(args), forceBool);
	return (indexOf(args, false)== -1);
};

/*
	Checks if a jQuery element container contains all of contained. 
	Similar to jQuery.contains
	@param	container	Container element. 
	@param	contained	Contained elements. 
	@param	includeSelf	Should container itself be included in the search
*/
module.exports.containsAll = function containsAll(container, contained, includeSelf){
	var container = $(container); 
	var includeSelf = forceBool(includeSelf, false); 
	return lAnd(
		$(contained).map(function(){
			return container.is(contained) || (includeSelf && container.find(contained).length > 0); 
		}).get()
	);
};

/*
	Loads an external javascript file. 
	@param url	Url(s) of script(s) to load. 
	@param	callback	Callback of script to load. 
	@param	scope	Scope of callback. 
	@param preLoadHack. Function to call before laoding a specific file. 
*/
module.exports.loadExternalJS = function loadExternalJS(url, callback, scope, preLoadHack){
	var TIMEOUT_CONST = 15000; //timeout for bad links
	var has_called = false; 
	var preLoadHack = forceFunction(preLoadHack, function(){}); 

	var do_call = function(suc){
		if(has_called){
			return;
		}
		has_called = true;

		var func = forceFunction(callback, function(){});
		var scope = (typeof scope == "undefined")?window:scope;

		func.call(scope, url, suc);
		
	}

	
	if(isArray(url)){
		var i=0;
		var next = function(urls, suc){
			if(i>=url.length || !suc){
				window.setTimeout(function(){
					do_call(suc);
				}, 0);
			} else {
				loadExternalJS(url[i], function(urls, suc){
					i++;
					next(urls, suc);
				}, scope, preLoadHack);
			}
		}

		window.setTimeout(function(){
			next("", true);
		}, 0);

		return url.length;
	} else {
		//adapted from: http://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
		var script = document.createElement("script")
	    script.type = "text/javascript";

	    if (script.readyState){  //IE
	        script.onreadystatechange = function(){
	            if (script.readyState == "loaded" ||
	                    script.readyState == "complete"){
	                script.onreadystatechange = null;
	                window.setTimeout(function(){
						do_call(true);
					}, 0);
	            }
	        };
	    } else {  //Others
	        script.onload = function(){
	            window.setTimeout(function(){
					do_call(true);
				}, 0);
	        };
	    }

	    script.src = resolve(url);
	    preLoadHack(url); 
	    document.getElementsByTagName("head")[0].appendChild(script);

	    window.setTimeout(function(){
	    	do_call(false);
	    }, TIMEOUT_CONST);
	    return 1;
	}
    
}

/*
	Loads an external css file. 
	@param url	Url(s) of css to load. 
	@param	callback	Callback of css to load. 
	@param	scope	Scope of callback. 
	@param preLoadHack. Function to call before laoding a specific file. 
*/
module.exports.loadExternalCSS = function loadExternalCSS(url, callback, scope, preLoadHack){
	var TIMEOUT_CONST = 15000; //timeout for bad links
	var has_called = false; 
	var interval_id, timeout_id; 
	var preLoadHack = forceFunction(preLoadHack, function(){}); 

	var do_call = function(suc){
		if(has_called){
			return;
		}
		has_called = true;
		try{

		} catch(e){
			clearInterval(interval_id); 
			clearTimeout(timeout_id);
		}

		var func = forceFunction(callback, function(){});
		var scope = (typeof scope == "undefined")?window:scope;

		func.call(scope, url, suc);
		
	}

	
	if(isArray(url)){
		var i=0;
		var next = function(urls, suc){
			if(i>=url.length || !suc){
				window.setTimeout(function(){
					do_call(suc);
				}, 0);
			} else {
				loadExternalCSS(url[i], function(urls, suc){
					i++;
					next(urls, suc);
				}, scope, preLoadHack);
			}
		}

		window.setTimeout(function(){
			next("", true);
		}, 0);

		return url.length;
	} else {
		//adapted from: http://stackoverflow.com/questions/5537622/dynamically-loading-css-file-using-javascript-with-callback-without-jquery
		var head = document.getElementsByTagName('head')[0]; 
		var link = document.createElement('link');
		link.setAttribute( 'href', url );
		link.setAttribute( 'rel', 'stylesheet' );
		link.setAttribute( 'type', 'text/css' ); 
		var sheet, cssRules;

		interval_id = setInterval(function(){
			try{
				if("sheet" in link){
					if(link.sheet && link.sheet.cssRules.length){
						clearInterval(interval_id); 
						clearTimeout(timeout_id); 
						do_call(true); 
					}
				} else {
					if(link.styleSheet && link.styleSheet.rules.length > 0){
						clearInterval(interval_id); 
						clearTimeout(timeout_id); 
						do_call(true); 
					}
				}

				if(link[sheet] && link[sheet][cssRules].length > 0){
					clearInterval(interval_id); 
					clearTimeout(timeout_id); 

					do_call(true); 
				}
			}catch(e){}
		}, 1000);

		timeout_id = setTimeout(function(){
			clearInterval(interval_id); 
			do_call(false);
		}, TIMEOUT_CONST);


		link.onload = function () {
			do_call(true); 
		}
		if (link.addEventListener) {
			link.addEventListener('load', function() {
			do_call(true); 
			}, false);
		}

	  link.onreadystatechange = function() {
	    var state = link.readyState;
	    if (state === 'loaded' || state === 'complete') {
	      link.onreadystatechange = null;
	      do_call(true); 
	    }
	  };

	  	preLoadHack(url);
		head.appendChild(link); 
		return 1;
	}
    
}

/*
	escapes a string for HTML
	@param	str	String to escape
*/
module.exports.escapeHTML = function escapeHTML(s){
	return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
}

/*
	Resolves a relative url
	@param url	Url to resolve
	@param base	Optional. Base url to use. 
	@param isDir	Optional. If set to true, will return a directory name ending with a slash
*/
module.exports.resolve = function(url, base, isDir){

	var resolveWithBase = false; 
	var baseUrl, oldBase, newBase; 

	if(typeof base == "string"){
		resolveWithBase = true; 
		baseUrl = resolve(base, true); 
		oldBase = $("base").detach(); 
		newBase = $("<base>").attr("href", baseUrl).appendTo("head"); 
	}
	
    var el= document.createElement('div');
    el.innerHTML= '<a href="'+escapeHTML(url)+'">x</a>';
    var url = el.firstChild.href;
   
    if(resolveWithBase){
    	newBase.remove(); 
    	oldBase.appendTo("head"); 
	}

	if( (base === true || isDir === true ) && url[url.length - 1] != "/"){url = url + "/"; }
    return url; 
}


/*
	Adds an event listener to a query. 
	@param	query A jQuery element to use as as query. 
	@param	event Event to register trigger for. 
	@param	handler	Handler to add
	@returns an id for the added handler. 
*/
on = function on(query, event, handler){
	var query = $(query);
	var id = UID(); 
	var handler = forceFunction(handler, function(){});
	handler = argSlice(handler, 1); 

	query.on(event+".core."+id, function(ev){
		var result = forceArray(ev.result);

		result.push(handler.apply(this, arguments));

		return result; 
	});
	return event+".core."+id;
}

/*
	Adds a one-time event listener to a query. 
	@param	query A jQuery element to use as as query. 
	@param	event Event to register trigger for. 
	@param	handler	Handler to add
	@returns an id for the added handler. 
*/
module.exports.once = function(query, event, handler){
	var id;

	id = on(query, event, function(){
		var result = handler.apply(this, arguments); 
		off(query, id); 
	});
}

/*
	Removes an event handler from a query. 
	@param	query A jQuery element to use as as query. 
	@param	id	Id of handler to remove. 
*/
module.exports.off = function off(query, id){
	var query = $(query);
	query.off(id); 
}

/*
	Turns a keyup event into a string. 
*/
module.exports.toKeyString = function toKeyString(e){
	var res = ((e.ctrlKey || e.keyCode == 17 )? 'ctrl+' : '') +
        ((e.altKey || e.keyCode == 18 ) ? 'alt+' : '') +
        ((e.shiftKey || e.keyCode == 16 ) ? 'shift+' : ''); 

      var specialKeys = {
			8: "backspace", 9: "tab", 10: "return", 13: "return", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 191: "/",
			220: "\\", 222: "'", 224: "meta"
		}

    if(!e.charCode && specialKeys[e.keyCode]){
    	res += specialKeys[e.keyCode]; 
    } else {
    	if(res == "" && event.type == "keypress"){
    		return false; 
    	} else {
    		res +=String.fromCharCode(e.charCode || e.keyCode).toLowerCase();
    	}
    }

    if(res[res.length-1] == "+"){
    	return res.substring(0, res.length - 1); 
    } else {
    	return res; 
    }
};

module.exports.onKey = function(cb){
	var uuid = UID(); 
	$(document).on("keydown."+uuid+" keypress."+uuid, function(evt){
		var key = toKeyString(evt); 
		if(!key){
			return; 
		}
		var res = cb.call(undefined, key, evt);

		if(res === false){
			//stop propagnation etc
			evt.preventDefault();
			evt.stopPropagation(); 
			return false; 
		}
	}); 

	return "keydown."+uuid+" keypress."+uuid; 
}

/*
	Triggers an event on a query. 
	@param	query A jQuery element to use as as query. 
	@param	event Event to trigger. 
	@param	params	Parameters to give to the event. 
*/
module.exports.trigger = function trigger(query, event, params){

	var query = $(query);

	var result; 

	var params = forceArray(params).slice(0);
	params.unshift(event); 

	var id = UID(); 

	query.on(event+"."+id, function(ev){
		result = ev.result; 
	})

	query.trigger.apply(query, params);

	query.off(event+"."+id);

	return result; 

}

/*
	Creates a new Event Handler
*/
module.exports.EventHandler = function EventHandler(me){
	var handler = {}; 
	var EventHandler = $("<div>"); 

	handler.on = function(event, handler){
		return on(EventHandler, event, handler.bind(me));
	};

	handler.once = function(event, handler){
		return once(EventHandler, event, handler.bind(me));
	};

	handler.off = function(handler){
		return off(EventHandler, handler);
	};

	handler.trigger = function(event, params){
		return trigger(EventHandler, event, params);
	}

	return handler;
}

/*
	Gets the current script origin. 
*/
module.exports.getCurrentOrigin = function getCurrentOrigin(){

	var scripts = $('script'); 
	var src = scripts[scripts.length-1].src;

	//if we have an empty src or jQuery is ready, return the location.href
	return (src == "" || jQuery.isReady || !src)?location.href:src; 
}

/*
	Permute to members of an array. 
	@param arr	Array to permute. 
	@param a	Index of first element. 
	@param b	Index of second element. 
*/
module.exports.permuteArray = function permuteArray(arr, a, b){

	var arr = $.makeArray(arr); 
	
	if(!isArray(arr)){
		return arr; 
	}

	var a = limit(a, 0, arr.length); 
	var b = limit(b, 0, arr.length); 

	var arr = arr.slice(0); 

	var old = arr[a];
	arr[a] = arr[b]; 
	arr[b] = old; 

	return arr; 
}

/*
	Limit the number x to be between a and b. 

*/
module.exports.limit = function limit(x, a, b){
	if(a >= b){
		return (x<b)?b:((x>a)?a:x); 
	} else {
		// b > a
		return limit(x, b, a); 
	}
}

// TODO: Think about removing this hack
// as it might break things horribly
// TODO: import underscore into the current namespace
_.mixin(module.exports);
module.exports = _.noConflict();