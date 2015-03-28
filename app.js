/*
 * The Allmighty ATLauncher Tool - https://github.com/RyanTheAllmighty/The-Allmighty-ATLauncher-Tool
 * Copyright (C) 2015 RyanTheAllmighty
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var functions = require('./functions.js'),
    args = require("nomnom")
        .option('action', {
            position: 0,
            required: true,
            choices: ['download', 'packs', 'upload'],
            help: 'The action to perform (download, packs, upload)'
        })
        .option('version', {
            flag: true,
            help: 'print version and exit',
            callback: function () {
                return "The Allmighty ATLauncher Tool v1.0.0\nUsing ATLauncher-API v1.0.3";
            }
        })
        .parse();

switch (args.action) {
    case 'download':
        return functions.download();
    case 'packs':
        return functions.packs();
    case 'upload':
        return functions.upload();
    default:
        return console.error('Invalid action provided!');
}
