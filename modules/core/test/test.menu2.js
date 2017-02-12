/*
	example3.js - An example module for JOBAD. 
	Test the menu and adds several items. 
	
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
(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'test.menu2',
			'title':	'Menu Testing module',
			'author':	'Tom Wiesing',
			'description':	'Test the menu and adds several items. '
		},
		globalinit: function(){
			//icon: http://openiconlibrary.sourceforge.net/gallery2/?./Icons/categories/applications-graphics-2.png (license: GPLv2)
			JOBAD.resources.provide("icon", "test.color", "data:image/png;base64,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")
		},
		contextMenuEntries: function(target, JOBADInstance){
			if(target.is('#nomenu,#nomenu *')){
				return false;
			}
			return [
				["Colors",  
					{
						"Make me orange": function(element){element.css("color", "orange");}, 
						"Highlight my background": function(element){
							element
							.stop().css("background-color", "#FFFF9C")
							.animate({ backgroundColor: "#FFFFFF"}, 1500);
						},
						"Revert": function(element){element.stop().css('color', '');}
					}, 
				"test.color"
				]
			];
		}
	});
})(JOBAD.refs.$);
