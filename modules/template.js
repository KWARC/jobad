/*
	A template module. 
*/

var template = {
	/* Module Info / Meta Data */
	info:{
		'identifier':	'template',  //(Unique) identifier for this module, preferably human readable. 
		'title':	'Template Module', //Human Readable title of the module. 
		'author':	'Template Author', //Author
		'description':	'A template you may use as a starting point for writing other modules. ', //A human readable description of the module. 
		'version':	'1.0', //string containing the version number. May be omitted. 
		'dependencies':	[], //Array of module dependencies. If ommited, assumed to have no dependencies. 
		'hasCleanNamespace': true // Does this module contain only standard functions?
	},
	/* Init handlers */
    globalinit: function(){
	/* 
		Called exactly once GLOBALLY. Can be used to initialise global module ids, etc. May be ommitted. Will be called once a module is loaded. 
		@this undefined. 
		@returns nothing
	*/
	},
	init: function(JOBADInstance, param1, param2, param3 /*, ... */){
		/* 	
			Called to intialise a new instance of this module. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@param *param Initial parameters passed to this.modules.load
			@return nothing. 
		*/
	},
	/* Event Handlers */
	leftClick: function(target, JOBADInstance){
		/*
			called when a left click is performed.  Every left click action is performed. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param target The element that has been left clicked on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on.  
			@returns Returns true iff it performed some action. 
		*/
	},
	contextMenuEntries: function(target, JOBADInstance){
		/*
			called when a context menu is requested. Context Menu entries will be merged. May be ommitted.  
			@this An instance of JOBAD.modules.loadedModule
			@param target The element the menu has been requested on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns returns context menu entries as array [[entry_1, function_1], ..., [entry_n, function_1]] or as a map {entry_1: function_1, entry_2: function_2, ...}
				All entry names must be non-empty. (Empty ones will be ignored). 
		*/
	},
	hoverText: function(target, JOBADInstance){
		/*
			called when a hover text is requested. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param target The element the hover has been requested on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns a text, a jqueryish ($(...), Domnode, etc) object to use as hover or a boolean indicating either the text or if something was done. 
				
		*/
	},
	onEvent: function(event, element, JOBADInstance){
		/*
			called whenever another event is raised. Does not trigger for onEvent events and onSideBarUpdate events. 
			@this An instance of JOBAD.modules.loadedModule
			@param event The event that was raised. 
			@param element The element the event was triggered on. 
			@param JOBADInstance The instance of JOBAD the module is initiated on. 				
		*/
	},
	onSideBarUpdate: function(JOBADInstance){
		/*
			called every time the sidebar is updated. May be ommitted. 
			@this An instance of JOBAD.modules.loadedModule
			@param JOBADInstance The instance of JOBAD the module is initiated on. 
			@returns nothing. 
				
		*/
	}
};

JOBAD.modules.register(template); //register the module. 
