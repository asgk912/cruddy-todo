const fs = require('fs');
const path = require('path');
const _ = require('underscore');
// const Promise = require('bluebird');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var fileName = path.join(exports.dataDir, `${id}.txt`);

    fs.writeFile(fileName, text, (err) => {
      if (err) {
        throw ('error writing a new file of new todo');
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {

  var promiseReadFile = (fileName) => {
    return new Promise((resolve, reject) => {
      var filePath = path.join(exports.dataDir, fileName);
      fs.readFile(filePath, (err, fileData) =>{
        if (err) {
          reject(err);
        } else {
          var id = fileName.substring(0, fileName.length - 4);
          var text = fileData.toString();

          resolve({id, text});
        }
      });
    });
  };

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error in readAll files');
    } else {
      Promise.all(
        files.map((fileName) => {
          return promiseReadFile(fileName);
        })
      )
        .then((data) => {
          callback(null, data);
        })
        .catch((error)=>{
          console.log('error reading all files');
        });

      // callback(null, data);
    }
  });

};

exports.readOne = (id, callback) => {
  // create a variable that holds directory for file
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  // read the file
  fs.readFile(fileName, (err, fileData) => {
    // if file is not present, throw an error
    if (err) {
      callback(new Error(`No file with id: ${id}`));
    // if file is present, invoke callback function with object of id and txt
    } else {
      // change buffer to string
      let text = fileData.toString();

      callback(null, {id, text});
    }
  });
};

exports.update = (id, text, callback) => {
  // create a variable that holds directory for file
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  // read the file
  fs.readFile(fileName, (err, fileData) => {
    // if file is not present, throw an error
    if (err) {
      callback(new Error(`No file with id: ${id}`));
    // if file is present, update the file with text
    } else {
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          throw ('error writing file while in update');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // create a variable that holds directory for file
  var fileName = path.join(exports.dataDir, `${id}.txt`);
  // remove the file
  fs.unlink(fileName, (err) => {
    if (err) {
      callback(new Error(`No file with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};