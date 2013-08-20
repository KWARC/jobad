/*
	JOBAD 3 Core Instances
	
	Copyright (C) 2013 KWARC Group <kwarc.info>
	
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

JOBAD.Instances = function(i){
	return JOBAD.Instances.get(i); 
}; 

JOBAD.Instances.all = {}; 

var focused = undefined; 
var waiting = undefined; 

JOBAD.ifaces.push(function(me){
	//store a reference so it is kept
	JOBAD.Instances.all[me.ID] = this;

	var i_am_focused = false; 
	var i_am_waiting = false; 

	var prev_focus = undefined; //previous focus


	me.focus = function(){
		if(i_am_focused){
			return false; 
		}

		if(i_am_waiting){
			return false; 
		}

		if(typeof focused != "undefined"){
			//someone else is focused => throw him out. 
			prev_focus = focused; 
			focused.unfocus(); 

		}

		if(typeof waiting != "undefined"){
			//someone else is waiting => throw him out. 
			waiting.unfocus(); 
		}

		i_am_waiting = true; 
		waiting = me; 

		me.Event.trigger("instance.focus_query"); 

		me.Setup.enabled(function(){ //(IF ENABLED)
			if(i_am_waiting){
				i_am_waiting = false; 
				waiting = undefined; 
				i_am_focused = true; 
				focused = me; 

				me.Event.trigger("instance.focus", [prev_focus]); 

				me.Event.focus.trigger(prev_focus);

				prev_focus = undefined; 
			}
		});

		return true; 
	};

	me.unfocus = function(){
		if(i_am_focused){
			//we are fully focused, we can just unfocus

			focused = undefined; 
			i_am_focused = false; 

			me.Event.trigger("instance.unfocus"); 

			me.Event.unfocus.trigger(); 

			return true; 
		} else {
			if(i_am_waiting){
				i_am_waiting = false; //I am no longer waiting
				waiting = undefined; 

				me.Event.trigger("instance.focus_query_lost"); 

				return true; 
			} else {
				JOBAD.console.warn("Can't unfocus JOBADInstance: Instance neither focused nor queried. ");
				return false; 
			}
		}
	};

	me.isFocused = function(){
		return i_am_focused; 
	}

	me.Event.on("instance.beforeDisable", function(){
		if(i_am_focused){ //we are focused and are not waiting
			me.unfocus(); //unfocus me

			me.Event.once("instance.disable", function(){
				prev_focus = me; //I was the last one as well
				me.focus(); //requery me for enabling once I am disabled
			})
		}
	})
}); 

JOBAD.Instances.get = function(i){
	return (i instanceof JOBAD)?i:JOBAD.Instances.all[i]; 
}

JOBAD.Instances.focus = function(Instance){
	return JOBAD.Instances.get(Instance).focus(); 
}

JOBAD.Instances.unfocus = function(Instance){
	return JOBAD.Instances.get(Instance).unfocus();
}

JOBAD.Instances.focused = function(){
	return focused; 
}

/* focus Event */
JOBAD.events.focus = 
{
	'default': function(JOBADInstance, prevFocus){},
	'Setup': {
		'enable': function(root){
			return; //nothing to do
		},
		'disable': function(root){
			return; //nothing to do
		}
	},
	'namespace': 
	{
		
		'getResult': function(prevFocus){
			return this.modules.iterateAnd(function(module){
				module.focus.call(module, module.getJOBAD(), prevFocus);
				return true;
			});
		},
		'trigger': function(prevFocus){
			return this.Event.focus.getResult(prevFocus); 
		}
	}
};

/* focus Event */
JOBAD.events.unfocus = 
{
	'default': function(JOBADInstance){},
	'Setup': {
		'enable': function(root){
			return; //nothing to do
		},
		'disable': function(root){
			return; //nothing to do
		}
	},
	'namespace': 
	{
		
		'getResult': function(){
			return this.modules.iterateAnd(function(module){
				module.unfocus.call(module, module.getJOBAD());
				return true;
			});
		},
		'trigger': function(){
			return this.Event.unfocus.getResult(); 
		}
	}
};