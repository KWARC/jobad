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
  * Creates a dropdown (<select>) control.
  * @function JOBAD.util.createDropDown
  * @static
  * @param {string[]} values - Values to use.
  * @param {string[]} texts - Texts to use.
  * @param {number} start - Initial index to select.
  * @returns {jQuery} - The jQuery element containing the select.
  */
JOBAD.util.createDropDown = function(values, texts, start){

  //create the select object.
	var select = JOBAD.refs.$("<select>");

  //append all the <option>s
	for(var i=0;i<texts.length;i++){
		select.append(
			JOBAD.refs.$("<option>")
			.attr("value", values[i])
			.text(texts[i])
		);
	}

  //select the start index
	select.find("option").eq((typeof start == "number")?start:0).prop('selected', true);

  //and append it all.
	return select;
}

/**
	* Creates a radio button for use with Bootstrap
	* @function JOBAD.util.createRadio
	* @static
	* @param {string[]} texts - Texts to use.
	* @param {number} start - Initial index to select.
	* @returns {jQuery} - The jQuery element containing the radio buttons.
	*/
JOBAD.util.createRadio = function(texts, start){

	//create an id
	var id = JOBAD.util.UID();

	//have we changed by ourselfes?
	var selfChange = false;

	//make sure start is a number.
	if(typeof start !== 'number'){
		start = 0;
	}

	//create button groups.
	var Div = JOBAD.refs.$('<div>').addClass("btn-group");
	var Div2 = JOBAD.refs.$('<div>').hide();

	//and append the elements.
	for(var i=0;i<texts.length;i++){
		Div.append(
			JOBAD.refs.$("<button>").addClass("btn").text(texts[i])
		);
		Div2.append(
			JOBAD.refs.$("<input type='radio' name='"+id+"' value='"+JOBAD.util.UID()+"'>")
		);
	}

	//find the inputs and buttons.
	var Buttons = Div.find("button");
	var Inputs = Div2.find("input");

	//register button events.
	Buttons.on("click", function(){
		var radio = Inputs.eq(Buttons.index(this));
		radio[0].checked = true;
		Inputs.change();
	})


	//register inputs events.
	Inputs
	.change(function(e){
		Buttons.removeClass("active");

		Inputs.each(function(i){
			var me = JOBAD.refs.$(this);
			if(me.is(":checked")){
				Buttons.eq(i).addClass("active");
			}
		})
		e.stopPropagation();
	});

	//call the change event to update
	//the rendering.
	Inputs.eq(start)[0].checked = true;
	Inputs.change();

	//and wrap the elements.
	return JOBAD.refs.$("<div>").append(Div, Div2);
};

/**
 * Configuration for
 * @typedef {Object} JOBAD.util~tabConfig
 * @property {string[]} type - Params for Tab creation. 
 * @property {boolean} hasPower - Indicates whether the Power component is present.
 * @property {boolean} hasWisdom - Indicates whether the Wisdom component is present.
 */


/**
	* Creates tab data compatible with Bootstrap.
	* @function JOBAD.util.createTabs
	* @static
	* @param {string[]} names - Texts to use.
	* @param {jQuery} divs - Divs to use as content.
	* @param {JOBAD.utiltabConfig} - Configuration to use.
	* @returns {jQuery} - div containing the tabs.

	@param names
	@param divs	Divs to use as content.
	@param config Configuration. Optional.
		@param config.tabParams	Params for Tab creation.
		@param config.type Type of tabs to use. CSS class.
		@param config.select Select Hook. function(tabName, tabDiv) To be called on selection of a div.
		@param config.unselect Deselect Hook. function(tabName, tabDiv) Top be called on the deselection of a div.
*/
JOBAD.util.createTabs = function(names, divs, config){
	var config = JOBAD.util.defined(config);

	//parse all the options.
	var tabtype = (typeof config.type == "string")?config.type:"";
	var enableHook = (typeof config.select == "function")?config.select:function(){};
	var disableHook = (typeof config.unselect == "function")?config.unselect:function(){};

	var ids = [];

	var div = JOBAD.refs.$("<div>").addClass("tabbable "+tabtype);
	var ul = JOBAD.refs.$("<ul>").appendTo(div).addClass("nav nav-tabs");
	var cdiv = JOBAD.refs.$("<div>").addClass("tab-content").appendTo(div);
	for(var i=0;i<names.length;i++){
		var id = JOBAD.util.UID();
		ids.push("#"+id);
		ul.append(
			JOBAD.refs.$("<li>").append(JOBAD.refs.$("<a>").attr("data-toggle", "tab").attr("href", "#"+id).text(names[i]))
		);

		JOBAD.refs.$("<div>").append(divs[i]).attr("id", id).addClass("tab-pane").appendTo(cdiv);
	}
	cdiv.children().eq(0).addClass("active");

	JOBAD.refs.$('a[data-toggle="tab"]', ul).on("shown", function(e){
		if(typeof e.relatedTarget != "undefined"){
			var relatedTarget = JOBAD.refs.$(e.relatedTarget);
			var tabId = ids.indexOf(relatedTarget.attr("href"));

			disableHook(relatedTarget.text(), JOBAD.refs.$(divs[tabId]));
		}

		var Target = JOBAD.refs.$(e.target);
		var tabId = ids.indexOf(Target.attr("href"));
		enableHook(Target.text(), JOBAD.refs.$(divs[tabId]));
	});

	JOBAD.refs.$('a[data-toggle="tab"]', ul).eq(0).tab("show");

	return div;
};
