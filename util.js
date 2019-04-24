const formidable = require('formidable');
const fs = require('fs')
const rimraf = require('rimraf');

exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.bundle.path;
      var newpath = __dirname + '/public/' + files.bundle.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
}

exports.uploadSplitBundle = function (req, res) {
    var dirPath = __dirname + '/static/js2';
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.bundle.path;
      var newpath = dirPath + '/' + files.bundle.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
}

exports.completedBundleUpload = function (req, res) {
    var tempPath = __dirname + '/static/js2';
    if (!fs.existsSync(tempPath)){
        res.write('Invalid Operation. Upload the bundle files first!');
        res.end();
        return ;
    }
    var newPath = __dirname + '/static/js';
    rimraf(newPath, function () { 
        console.log('done deleted of js folder');
        fs.rename(tempPath, newPath, function (err) {
            if (err) throw err;
            res.write('Acknowledged! Bundle Update Complete');
            res.end();
          });
    });
}
