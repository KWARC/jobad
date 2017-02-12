/*
	example1.js - An example module for JOBAD. 
	A Testing module, colors <p>s in the color given as first parameter. 
	
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
			'identifier':	'test.config',
			'title':	'Config testing module',
			'author':	'Tom Wiesing',
			'description':	'Testing module, used to test config. '
		},
		"config": {
			"a": ["list", [1, 2, 3], 1, ["Test Setting", "1", "2", "3"]]
		}
	});
})(JOBAD.refs.$);
