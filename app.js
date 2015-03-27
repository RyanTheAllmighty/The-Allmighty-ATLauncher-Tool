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

var env = require('node-env-file'),
    fs = require('fs');

env(__dirname + '/.env');

var api = require('atlauncher-api')(process.env.ATLAUNCHER_API_KEY, false, process.env.ATLAUNCHER_API_BASE_URL);

var blank = function () {

};

var downloadFiles = function (path) {
    var path = path || '';

    api.admin.pack.files(process.env.PACK_SAFE_NAME, path, function (err, res) {
        if (err) {
            return console.error(err);
        }

        var files = res.data;

        files.forEach(function (item) {
            var file = process.env.PACK_DIR + 'files/' + (path == '' ? '' : path + '/') + item.filename;

            if (!item.file) {
                fs.mkdir(file + '/', function () {
                    downloadFiles((path == '' ? item.filename : path + '/' + item.filename));
                });
            } else {
                if (item.size && !fs.existsSync(file)) {
                    api.admin.pack.file.download(process.env.PACK_SAFE_NAME, path, item.filename, file, blank);
                }
            }
        });
    });
};

downloadFiles();