"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yauzl_1 = __importDefault(require("yauzl"));
var YauzlUnzipEntry = (function () {
    function YauzlUnzipEntry(entry, zipfile) {
        this.entry = entry;
        this.zipfile = zipfile;
        this.path = entry.fileName;
    }
    YauzlUnzipEntry.prototype.pipe = function (piper) {
        var _this = this;
        this.zipfile.openReadStream(this.entry, function (err, readStream) {
            if (err) {
                throw err;
            }
            if (!readStream) {
                throw new Error('No data for zip file entry');
            }
            readStream.on('end', function () {
                _this.zipfile.readEntry();
            });
            readStream.pipe(piper);
        });
    };
    YauzlUnzipEntry.prototype.ignore = function () {
        this.zipfile.readEntry();
    };
    return YauzlUnzipEntry;
}());
exports.YauzlUnzipEntry = YauzlUnzipEntry;
var YauzlUnzip = (function () {
    function YauzlUnzip() {
    }
    YauzlUnzip.prototype.read = function (filename, onEntry, onError, onClose) {
        yauzl_1.default.open(filename, { lazyEntries: true, autoClose: true }, function (err, zipfile) {
            if (err) {
                return onError(err);
            }
            if (!zipfile) {
                return onError(new Error('No zip data found in file'));
            }
            zipfile.on('error', function (err2) {
                onError(err2);
            });
            zipfile.on('entry', function (entry) {
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                }
                else {
                    var wrapper = new YauzlUnzipEntry(entry, zipfile);
                    onEntry(wrapper);
                }
            });
            zipfile.once('end', function () {
                onClose();
            });
            zipfile.readEntry();
        });
    };
    return YauzlUnzip;
}());
exports.YauzlUnzip = YauzlUnzip;
//# sourceMappingURL=unzip.js.map