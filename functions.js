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
    fs = require('fs'),
    colours = require('colors/safe'),
    Table = require('cli-table');

env(__dirname + '/.env');

var api = require('atlauncher-api')(process.env.ATLAUNCHER_API_KEY, false, process.env.ATLAUNCHER_API_BASE_URL);

var blank = function () {

};

exports.download = function () {
    downloadFiles();
    downloadVersions();
};

exports.packs = function () {
    api.admin.packs(function (err, res) {
        if (err) {
            return console.error(err);
        }

        var table = new Table({
            chars: {
                'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
                'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
                'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
                'right': '', 'right-mid': '', 'middle': '  '
            },
            head: ['ID', 'Name', 'Type', 'Safe Name']
        });

        res.data.forEach(function (pack) {
            var type = pack.type.charAt(0).toUpperCase() + pack.type.substr(1);

            if (type.charAt(0) == 'S') {
                // Why not just set the type directly to a string? Not as much fun I guess :\
                type = type.substr(0, 4) + ' ' + type.charAt(4).toUpperCase() + type.substr(5);
            }

            table.push([pack.id, pack.name, type, pack.safeName]);
        });

        console.log(table.toString());
    });
};

exports.upload = function () {
    console.log('Nothing here!');
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

var downloadVersions = function () {
    api.admin.pack.info(process.env.PACK_SAFE_NAME, function (err, res) {
        if (err) {
            return console.error(err);
        }

        var versions = res.data.versions,
            devVersions = res.data.devVersions;

        versions.forEach(function (item) {
            var versionPath = process.env.PACK_DIR + 'versions/' + item.version + '/';

            fs.mkdir(versionPath, function () {
                api.admin.pack.version.configs.get(res.data.safeName, item.version, versionPath + 'configs.zip', function (err, res) {
                });

                api.admin.pack.version.xml.get(res.data.safeName, item.version, versionPath + 'configs.xml', function (err, res) {
                });

                api.admin.pack.version.json.get(res.data.safeName, item.version, versionPath + 'configs.json', function (err, res) {
                });
            });
        });

        devVersions.forEach(function (item) {
            var versionPath = process.env.PACK_DIR + 'versions/' + item.name + '/';

            fs.mkdir(versionPath, function () {
                api.admin.pack.version.configs.get(res.data.safeName, item.name, versionPath + 'configs.zip', function (err, res) {
                });

                api.admin.pack.version.xml.get(res.data.safeName, item.name, versionPath + 'configs.xml', function (err, res) {
                });

                api.admin.pack.version.json.get(res.data.safeName, item.name, versionPath + 'configs.json', function (err, res) {
                });
            });
        });
    });
};