/*
	JOBAD Configuration
	JOBAD.config.js
	
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

// load JOBAD
var JOBAD = module.exports = require('../core/index.js');

// load console and configuration
module.exports.console = require('../core/console');
module.exports.config = require('../core/config');

// load external references -- for backward compatibility
module.exports.refs = {
    '$': require('jquery')
};
module.exports.utils = require('./utils');



// interfaces and config
// JOBAD.ifaces = require('../core/ifaces');



module.exports = JOBAD;